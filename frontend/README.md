# LockTalk Frontend

This directory contains a production-ready, high-quality frontend for the LockTalk project, built with React, TypeScript, Vite, and Tailwind CSS.

## Features

-   **Apple-Inspired Design**: Clean, geometric, with plenty of whitespace and subtle depth.
-   **Fast & Accessible**: Built with Vite for speed and accessible UI primitives.
-   **Playful Tone**: Features fun microcopy and easter-egg-like details.
-   **Interactive Tutorial**: An in-page visual tutorial teaches users how to use the app.
-   **Backend Integration**: Connects to the existing Python backend for REST and WebSocket communication.

---

## How to Run the Frontend

### 1. Prerequisites

-   [Node.js](https://nodejs.org/) (version 18 or higher)
-   [npm](https://www.npmjs.com/) (usually comes with Node.js)

### 2. Installation

Navigate to this `frontend` directory in your terminal and install the dependencies:

```bash
npm install
```

### 3. Configuration

The frontend needs to know where the Python backend is running. A `.env` file is used for this. A default is provided, but you can create a `.env.local` to override it without committing it to Git.

**File: `.env`**

```
# The base URL for the Python backend's REST API.
VITE_API_BASE_URL=http://127.0.0.1:8000

# The URL for the WebSocket server.
VITE_WS_URL=ws://127.0.0.1:8000/ws/messages
```

During development (`npm run dev`), Vite's proxy will be used. For production builds, ensure these URLs are correct for your deployed environment.

### 4. Running the Development Server

To start the frontend development server, run:

```bash
npm run dev
```

This will start the frontend on `http://localhost:5173` (or another port if 5173 is busy). The server will automatically reload when you make changes to the code.

### 5. Running the Python Backend

For the frontend to work, the Python backend must also be running. Assuming your backend is a FastAPI application in a file named `main.py`, you can run it with:

```bash
# Example using uvicorn for a FastAPI backend
uvicorn main:app --reload
```

Or, if your project has a different entry point:

```bash
python -m src.main
```

Ensure the backend is running on the host and port specified in your `.env` file (e.g., `http://127.0.0.1:8000`).

---

## Project Structure

The project is structured to be clean, modular, and scalable.

```
/frontend
├── src/
│   ├── assets/       # SVGs, icons, and other static assets.
│   ├── components/   # Reusable React components (TSX).
│   ├── hooks/        # Custom React hooks for logic and state.
│   ├── pages/        # Top-level page components for routing.
│   ├── services/     # API calls (REST, WebSocket) and state management.
│   ├── types/        # TypeScript type definitions.
│   └── App.tsx       # Main app component with routing.
├── vite.config.ts    # Vite configuration (including proxy).
├── tailwind.config.ts # Tailwind CSS theme and configuration.
└── package.json      # Project dependencies and scripts.
```

## Backend API Mapping

The frontend is built assuming the following backend endpoints exist. If your Python backend uses different routes, you can update them in `src/services/api.ts`.

| Frontend Call          | Assumed Backend Endpoint    | Purpose                         |
| ---------------------- | --------------------------- | ------------------------------- |
| `discoverPeers()`      | `GET /api/discover`         | Fetch list of available peers.  |
| `startHandshake(req)`  | `POST /api/handshake`       | Initiate a secure connection.   |
| `sendMessage(req)`     | `POST /api/messages/send`   | Send an encrypted message.      |
| `getMessageHistory()`  | `GET /api/messages/history` | Get message history for a peer. |
| `useWebSocket()` hook  | `WS /ws/messages`           | Real-time message channel.      |

---

## Build for Production

To create an optimized production build of the frontend, run:

```bash
npm run build
```

This will create a `dist` directory with static HTML, CSS, and JavaScript files. These files can be served by any static file server or CDN.

### Deployment Notes

-   **CORS**: In production, your backend server must be configured with the correct CORS (Cross-Origin Resource Sharing) policies to allow requests from the domain where your frontend is hosted.
-   **HTTPS & WSS**: For security, always serve your production frontend over HTTPS and connect to your WebSocket server using a secure `wss://` connection.

---

## Testing (Suggestions)

While tests are not implemented, here is a suggested approach:

-   **Unit Tests (Vitest)**:
    -   Test individual hooks (e.g., `usePeers`) by mocking the `api.ts` module.
    -   Test utility functions and simple components.
-   **Component Tests (React Testing Library)**:
    -   Render components like `PeerCard` and `ChatMessage` with mock data and assert that they display correctly.
    -   Simulate user interactions (e.g., clicking a "Connect" button).
-   **E2E Tests (Playwright or Cypress)**:
    -   Create tests that simulate a full user flow: launching the app, seeing a peer, connecting, and sending a message.

---
That's it! Enjoy your new secure and stylish frontend.
