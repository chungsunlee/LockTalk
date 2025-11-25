import uvicorn
import webbrowser
import time
from pathlib import Path
import os
import sys

# Ensure the parent directory is in the path for module import
sys.path.insert(0, str(Path(__file__).parent))

# Import the FastAPI application from src.main
from src.main import app, FRONTEND_BUILD_DIR

if __name__ == "__main__":
    host = "0.0.0.0"
    port = 8001
    
    # URL for the application
    app_url = f"http://127.0.0.1:{port}"

    # Open browser after a short delay
    print(f"Opening browser to {app_url}...")
    webbrowser.open_new_tab(app_url)

    # Run Uvicorn server
    # Note: reload=True should not be used in PyInstaller bundles
    uvicorn.run(app, host=host, port=port, reload=False)
