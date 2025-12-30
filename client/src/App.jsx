import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import CryptoJS from 'crypto-js';
import './App.css';

// 1. Connect to your LOCAL Python Server
const socket = io.connect("http://localhost:5000");

function App() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [roomPassword, setRoomPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    // 2. Listen for "load_history" from server
    socket.on("load_history", (history) => {
      setChatHistory(history);
    });

    // 3. Listen for new messages
    socket.on("receive_message", (encryptedData) => {
      setChatHistory((prev) => [...prev, encryptedData]);
    });

    return () => {
      socket.off("load_history");
      socket.off("receive_message");
    };
  }, []);

  // Helper: Try to Decrypt a message
  const decryptMessage = (encryptedData) => {
    try {
      if (!roomPassword) return "🔒 Locked";
      
      const bytes = CryptoJS.AES.decrypt(encryptedData, roomPassword);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      
      // If decryption result is empty, password was wrong
      if (!originalText) return "⛔ Wrong Password";
      
      return originalText;
    } catch (e) {
      return "⚠️ Error";
    }
  };

  // 4. Send Message Function
  const sendMessage = async () => {
    if (message !== "" && roomPassword !== "") {
      // ENCRYPT HERE (Client Side) before sending!
      const encryptedData = CryptoJS.AES.encrypt(message, roomPassword).toString();
      
      await socket.emit("send_message", encryptedData);
      setMessage(""); // Clear input
    } else {
      alert("Please enter the Shared Secret Password first!");
    }
  };

  return (
    <div className="app-container" style={{ padding: '20px', fontFamily: 'Arial', textAlign: 'center' }}>
      <h1>Remote Chat App</h1>
      
      {/* PASSWORD INPUT */}
      <div style={{ marginBottom: '20px', padding: '15px', background: '#222', color: 'white', borderRadius: '8px' }}>
        <label>🔑 <b>Step 1:</b> Enter Secret Password: </label>
        <input 
          type="password" 
          placeholder="e.g. Pizza!"
          onChange={(e) => {
             setRoomPassword(e.target.value);
             setIsUnlocked(true);
          }}
          style={{ marginLeft: '10px', padding: '8px', fontSize: '16px' }}
        />
      </div>

      {/* CHAT WINDOW */}
      <div className="chat-window" style={{
          border: '2px solid #333', 
          height: '400px', 
          overflowY: 'scroll', 
          marginBottom: '20px', 
          padding: '20px',
          background: '#f4f4f4',
          borderRadius: '10px'
      }}>
        {chatHistory.length === 0 ? <p style={{color: '#888'}}>No messages yet...</p> : null}
        
        {chatHistory.map((encryptedBlob, index) => {
          // Decrypt on the fly
          const text = isUnlocked ? decryptMessage(encryptedBlob) : "🔒 Encrypted Message";
          const isError = text.includes("Wrong") || text.includes("Locked");

          return (
            <div key={index} style={{
                background: isError ? '#ffdddd' : '#dcf8c6',
                padding: '10px', 
                margin: '10px auto', 
                borderRadius: '10px',
                width: '80%',
                textAlign: 'left',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}>
              <div style={{fontWeight: 'bold', marginBottom: '5px'}}>
                {isError ? "🔒 System" : "👤 User"}
              </div>
              <div style={{fontSize: '18px'}}>
                {text}
              </div>
              {/* Show the "Real" encrypted data for demo purposes */}
              <div style={{fontSize: '10px', color: '#666', marginTop: '8px', borderTop: '1px solid #ccc', paddingTop: '4px'}}>
                 Real Network Data: {encryptedBlob.substring(0, 30)}...
              </div>
            </div>
          );
        })}
      </div>

      {/* MESSAGE INPUT */}
      <div className="input-area">
        <input 
          type="text" 
          placeholder="Type your secret message..." 
          value={message} 
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          style={{ width: '60%', padding: '12px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button 
          onClick={sendMessage} 
          style={{ 
            padding: '12px 25px', 
            marginLeft: '10px', 
            background: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer',
            fontSize: '16px'
          }}>
          Send 🚀
        </button>
      </div>
    </div>
  );
}

export default App;