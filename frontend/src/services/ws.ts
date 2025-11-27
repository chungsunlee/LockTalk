// src/services/ws.ts
import { useEffect, useRef, useState } from 'react';
import type { ChatMessage } from '@/types';
import { fetchBackendUrl } from './config';


/**
 * # Real-Time Messaging Service (with Auto-Discovery)
 * 
 * This hook now asynchronously discovers the backend before connecting.
 */

type WebSocketStatus = 'connecting' | 'open' | 'closing' | 'closed' | 'reconnecting';

export const useWebSocket = (onMessage: (message: ChatMessage) => void) => {
  const ws = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<WebSocketStatus>('closed');
  const reconnectAttempts = useRef(0);

  // The connect function is now async to wait for backend discovery
  const connect = async () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) return;

    setStatus(reconnectAttempts.current > 0 ? 'reconnecting' : 'connecting');

    try {
      // 1. Discover the backend URL
      const baseUrl = await fetchBackendUrl();
      
      // 2. Construct the WebSocket URL
      const wsUrl = baseUrl.replace(/^http/, 'ws') + '/ws/messages';
      console.log(`Connecting WebSocket to ${wsUrl}`);

      // 3. Establish the connection
      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log('WebSocket connected! Ready for secret messages.');
        setStatus('open');
        reconnectAttempts.current = 0; // Reset on successful connection
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as ChatMessage;
          console.log('Incoming transmission:', message);
          onMessage(message);
        } catch (error) {
          console.error('Failed to parse incoming WebSocket message:', error);
        }
      };

      socket.onclose = () => {
        console.log('WebSocket disconnected. Attempting to reconnect...');
        setStatus('closed');
        // Exponential backoff for reconnection
        const timeout = Math.min(30000, (2 ** reconnectAttempts.current) * 1000);
        setTimeout(() => {
          reconnectAttempts.current++;
          connect(); // This will re-run the discovery and connection logic
        }, timeout);
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        socket.close(); // This will trigger the onclose handler for reconnection
      };

      ws.current = socket;

    } catch (error) {
      console.error("Failed to establish WebSocket connection due to backend discovery failure:", error);
      // The error alert is already handled in config.ts, so we can just log here.
      // We can also implement a more specific UI state for this case if needed.
    }
  };

  const disconnect = () => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
  };

  // Effect to connect on mount and disconnect on unmount
  useEffect(() => {
    // We need a wrapper since the effect function itself cannot be async.
    const initializeConnection = async () => {
      await connect();
    };

    initializeConnection();

    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onMessage]);

  return { status };
};
