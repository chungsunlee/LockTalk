// src/types/index.ts

/**
 * Represents a peer discovered on the network.
 * The backend should provide this information.
 */
export interface Peer {
  id: string; // A unique identifier for the peer
  name: string; // A user-friendly name, e.g., "Dave's MacBook"
  address: string; // IP address and port
  status: 'online' | 'offline' | 'connecting' | 'connected';
  publicKey?: string; // Optional public key, if known
}

/**
 * Represents a message in a chat session.
 */
export interface ChatMessage {
  id: string; // Unique message ID
  peerId: string; // ID of the peer this message is to/from
  content: string; // The encrypted message content
  timestamp: string; // ISO 8601 timestamp
  sender: 'me' | 'them'; // Who sent the message
  status: 'sent' | 'delivered' | 'failed'; // Delivery status
}

/**
 * The expected structure for a request to send a message.
 * The frontend sends this to POST /api/messages/send
 */
export interface SendMessageRequest {
  peerId: string;
  content: string; // Plaintext content, to be encrypted by the backend
}

/**
 * The expected structure for a handshake initiation request.
 * The frontend sends this to POST /api/handshake
 */
export interface HandshakeRequest {
  peerId: string;
}

/**
 * A generic API response structure for mutations (POST, PUT, DELETE).
 */
export interface MutationResponse {
  success: boolean;
  message: string;
}

/**
 * Defines a single step in the interactive tutorial.
 */
export interface TutorialStep {
  element: string; // A CSS selector for the element to highlight (e.g., '#peer-list')
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  showDemo?: boolean; // Whether to show a special animated demo for this step
}
