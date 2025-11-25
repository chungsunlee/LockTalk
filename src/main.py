import os
import sys
from pathlib import Path
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import uuid

# Function to get the correct path for bundled resources
def resource_path(relative_path):
    """ Get absolute path to resource, works for dev and for PyInstaller """
    try:
        # PyInstaller creates a temp folder and stores path in _MEIPASS
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

app = FastAPI(
    title="LockTalk Backend API",
    description="Backend for the LockTalk secure messaging application.",
    version="0.1.0",
)

# CORS configuration to allow frontend to access the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your frontend's URL
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
# In a real application, this would be a proper database
MOCK_PEERS: List[Peer] = []

MOCK_MESSAGES: List[ChatMessage] = []

# --- API Endpoints ---
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
    
    # Simulate handshake logic
    peer.status = "connecting" # This won't persist in mock data
    return MutationResponse(success=True, message=f"Handshake initiated with {request.peerId}")

@app.post("/api/messages/send", response_model=MutationResponse)
async def send_message(request: SendMessageRequest):
    """
    Sends a message to a peer. The backend is responsible for encryption.
    """
    peer = next((p for p in MOCK_PEERS if p.id == request.peerId), None)
    if not peer:
        raise HTTPException(status_code=404, detail="Peer not found")

    new_message = ChatMessage(
        id=str(uuid.uuid4()),
        peerId=request.peerId,
        content=f"[Encrypted] {request.content}", # Simulate encryption
        timestamp=datetime.now().isoformat(),
        sender="me", # Assuming sender is always 'me' for now
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

# WebSocket endpoint (placeholder - actual implementation would be more complex)
@app.websocket("/ws/messages")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # For now, just echo received text. In a real app, you'd handle messages
            data = await websocket.receive_text()
            print(f"Received WebSocket message: {data}")
            await websocket.send_text(f"Echo: {data}") # Echo back for now
    except WebSocketDisconnect:
        print("WebSocket client disconnected")
    except Exception as e:
        print(f"WebSocket error: {e}")

# Serve static files for the frontend
FRONTEND_BUILD_DIR = resource_path("frontend/dist")

# Ensure the directory exists. In a PyInstaller bundle, this path is assumed to be correct.
if not Path(FRONTEND_BUILD_DIR).is_dir():
    print(f"Warning: Frontend build directory not found at {FRONTEND_BUILD_DIR}")
    print("Please ensure you have run 'npm run build' in the frontend directory.")
else:
    app.mount("/", StaticFiles(directory=FRONTEND_BUILD_DIR, html=True), name="frontend")
