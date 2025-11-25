// src/services/ws.ts
import { useEffect, useRef, useState } from 'react';
import type { ChatMessage } from '@/types';

// The WebSocket URL is read from environment variables.
// In dev, it's proxied by Vite. In prod, it should be a direct wss:// URL.
const WS_URL = import.meta.env.VITE_WS_URL;

/**
 * # Real-Time Messaging Service
 * 
 * This file contains the logic for managing the WebSocket connection
 * for real-time messages. It's encapsulated in a custom hook, `useWebSocket`,
 * for easy use within React components.
 * 
 * It handles:
 * - Connection and disconnection.
 * - Automatic reconnection with exponential backoff.
 * - Receiving and parsing incoming messages.
 */

type WebSocketStatus = 'connecting' | 'open' | 'closing' | 'closed' | 'reconnecting';

// Hook to manage the WebSocket lifecycle
export const useWebSocket = (onMessage: (message: ChatMessage) => void) => {
  const ws = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<WebSocketStatus>('closed');
  const reconnectAttempts = useRef(0);

  const connect = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) return;

    setStatus(reconnectAttempts.current > 0 ? 'reconnecting' : 'connecting');

    const socket = new WebSocket(WS_URL);

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
      console.log('WebSocket disconnected. Trying to reconnect...');
      setStatus('closed');
      // Exponential backoff for reconnection
      const timeout = Math.min(30000, (2 ** reconnectAttempts.current) * 1000);
      setTimeout(() => {
        reconnectAttempts.current++;
        connect();
      }, timeout);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      socket.close(); // This will trigger the onclose handler for reconnection
    };

    ws.current = socket;
  };

  const disconnect = () => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
  };

  // Effect to connect on mount and disconnect on unmount
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onMessage]);

  return { status };
};
