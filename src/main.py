import os
import sys
import asyncio
from pathlib import Path
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import uuid

# Project-specific imports
from .discovery import MDNSAdvertiser, get_local_ip

# --- Global State & Configuration ---
advertiser = MDNSAdvertiser()

# Function to get the correct path for bundled resources
def resource_path(relative_path):
    """ Get absolute path to resource, works for dev and for PyInstaller """
    try:
        # PyInstaller creates a temp folder and stores path in _MEIPASS
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    return os.path.join(base_path, relative_path)

FRONTEND_BUILD_DIR = resource_path("frontend/dist")

# --- Event Handlers for Application Lifecycle ---
async def startup_event():
    """Tasks to run when the application starts."""
    print("--- Starting LockTalk Server ---")
    # Start mDNS advertising in the background
    advertiser.start()

    # Get local IP and inject it into the frontend's index.html for fallback
    app.state.ip_address = get_local_ip()
    print(f"Server IP determined to be: {app.state.ip_address}")
    
    # Inject the IP into the frontend's HTML
    try:
        index_html_path = Path(FRONTEND_BUILD_DIR) / "index.html"
        if index_html_path.exists():
            print(f"Injecting IP address into {index_html_path}")
            content = index_html_path.read_text()
            # In the next step, we will ensure the frontend has this placeholder
            content = content.replace('__BACKEND_IP_PLACEHOLDER__', app.state.ip_address)
            index_html_path.write_text(content)
        else:
            print(f"Warning: {index_html_path} not found. Cannot inject IP. This is expected in dev mode.")
    except Exception as e:
        print(f"Error injecting IP into index.html: {e}")


async def shutdown_event():
    """Tasks to run when the application is shutting down."""
    print("--- Shutting Down LockTalk Server ---")
    advertiser.stop()
    # Give it a moment to unregister
    await asyncio.sleep(1)


# --- FastAPI Application Setup ---
app = FastAPI(
    title="LockTalk Backend API",
    description="Backend for the LockTalk secure messaging application.",
    version="0.1.0",
    on_startup=[startup_event],
    on_shutdown=[shutdown_event],
)

# CORS configuration to allow frontend to access the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Pydantic Models (matching frontend types) ---
class Peer(BaseModel):
    id: str
    name: str
    address: str
    status: str # 'online' | 'offline' | 'connecting' | 'connected'
    publicKey: Optional[str] = None

class ChatMessage(BaseModel):
    id: str
    peerId: str
    content: str
    timestamp: str
    sender: str # 'me' | 'them'
    status: str # 'sent' | 'delivered' | 'failed'

class SendMessageRequest(BaseModel):
    peerId: str
    content: str

class HandshakeRequest(BaseModel):
    peerId: str

class MutationResponse(BaseModel):
    success: bool
    message: str

# --- In-memory "Database" (for demonstration) ---
MOCK_PEERS: List[Peer] = []
MOCK_MESSAGES: List[ChatMessage] = []


# --- API Endpoints ---
@app.get("/api/health")
async def health_check():
    """A quick endpoint for the frontend to check if the server is up."""
    return {"status": "ok"}

@app.get("/api/discover", response_model=List[Peer])
async def discover_peers():
    """
    Fetches the list of discoverable peers from the backend.
    """
    return MOCK_PEERS

@app.post("/api/handshake", response_model=MutationResponse)
async def start_handshake(request: HandshakeRequest):
    """
    Initiates a handshake with a selected peer.
    """
    peer = next((p for p in MOCK_PEERS if p.id == request.peerId), None)
    if not peer:
        raise HTTPException(status_code=404, detail="Peer not found")
    
    peer.status = "connecting"
    return MutationResponse(success=True, message=f"Handshake initiated with {request.peerId}")

@app.post("/api/messages/send", response_model=MutationResponse)
async def send_message(request: SendMessageRequest):
    """
    Sends a message to a peer.
    """
    peer = next((p for p in MOCK_PEERS if p.id == request.peerId), None)
    if not peer:
        raise HTTPException(status_code=404, detail="Peer not found")

    new_message = ChatMessage(
        id=str(uuid.uuid4()),
        peerId=request.peerId,
        content=f"[Encrypted] {request.content}",
        timestamp=datetime.now().isoformat(),
        sender="me",
        status="sent"
    )
    MOCK_MESSAGES.append(new_message)
    return MutationResponse(success=True, message=f"Message sent to {request.peerId}")

@app.get("/api/messages/history", response_model=List[ChatMessage])
async def get_message_history(peerId: str):
    """
    Fetches the message history for a specific peer.
    """
    return [msg for msg in MOCK_MESSAGES if msg.peerId == peerId]

# WebSocket endpoint
@app.websocket("/ws/messages")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            print(f"Received WebSocket message: {data}")
            await websocket.send_text(f"Echo: {data}")
    except WebSocketDisconnect:
        print("WebSocket client disconnected")
    except Exception as e:
        print(f"WebSocket error: {e}")

# Serve static files for the frontend
# This must be mounted AFTER all other API routes
if not Path(FRONTEND_BUILD_DIR).is_dir():
    print(f"Fatal: Frontend build directory not found at {FRONTEND_BUILD_DIR}")
    print("Please run 'npm run build' in the 'frontend' directory before starting the server.")
else:
    app.mount("/", StaticFiles(directory=FRONTEND_BUILD_DIR, html=True), name="static")

