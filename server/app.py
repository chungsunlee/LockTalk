from flask import Flask, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
CORS(app) # Allow React to talk to Flask

# cors_allowed_origins="*"  used for local testing
socketio = SocketIO(app, cors_allowed_origins="*")

# Store chat history in memory (for now) 
# In the real version, Will have database + server (havent done yet)
encrypted_history = []

@socketio.on('connect')
def handle_connect():
    print(f"Client connected: {request.sid}")
    # When a user joins, send them the past messages
    emit('load_history', encrypted_history)

@socketio.on('send_message')
def handle_message(encrypted_data):
    print(f"Received encrypted blob: {encrypted_data}")
    
    # Save to history
    encrypted_history.append(encrypted_data)
    
    # Broadcast to everyone else
    emit('receive_message', encrypted_data, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)