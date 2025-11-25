// src/services/api.ts
import axios from 'axios';
import type { Peer, ChatMessage, SendMessageRequest, HandshakeRequest, MutationResponse } from '@/types';

// Create an axios instance with a base URL.
// The VITE_API_BASE_URL is set in the .env file.
// The Vite dev server proxies /api to the target specified in vite.config.ts
const apiClient = axios.create({
  baseURL: import.meta.env.PROD ? import.meta.env.VITE_API_BASE_URL : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * # API Integration Layer
 * 
 * This file centralizes all HTTP communication with the Python backend.
 * It uses Axios for making requests. The functions are typed according
 * to the interfaces defined in `src/types/index.ts`.
 * 
 * ---
 * ### Backend Endpoint Mapping
 * This is where you would adjust the frontend to match your Python backend's endpoints if they differ.
 * 
 * | Frontend Call            | Assumed Backend Endpoint      | Purpose                                 |
 * |--------------------------|-------------------------------|-----------------------------------------|
 * | `discoverPeers()`        | `GET /api/discover`           | Fetch list of available peers.          |
 * | `startHandshake(req)`    | `POST /api/handshake`         | Initiate a secure connection.           |
 * | `sendMessage(req)`       | `POST /api/messages/send`     | Send a message (backend encrypts).      |
 * | `getMessageHistory(pId)` | `GET /api/messages/history`   | Get historical messages for a peer.     |
 * ---
 */


/**
 * Fetches the list of discoverable peers from the backend.
 * @returns A promise that resolves to an array of Peer objects.
 */
export const discoverPeers = async (): Promise<Peer[]> => {
  try {
    const response = await apiClient.get<Peer[]>('/discover');
    // Here's a fun little easter egg for the console.
    console.log("Peers spotted in the wild! Don't worry, they don't bite. Usually.");
    return response.data;
  } catch (error) {
    console.error('Failed to discover peers:', error);
    // In a real app, you might want to return a mock list for UI development
    // return MOCK_PEERS;
    return [];
  }
};

/**
 * Initiates a handshake with a selected peer.
 * This is the first step to establishing a secure channel.
 * @param request - The handshake request containing the peer ID.
 * @returns A promise that resolves to a standard mutation response.
 */
export const startHandshake = async (request: HandshakeRequest): Promise<MutationResponse> => {
  try {
    const response = await apiClient.post<MutationResponse>('/handshake', request);
    return response.data;
  } catch (error) {
    console.error(`Handshake with ${request.peerId} failed to shake out:`, error);
    throw new Error('Handshake failed');
  }
};

/**
 * Sends a message to a peer. The backend is responsible for encryption.
 * @param request - The message request containing peer ID and plaintext content.
 * @returns A promise that resolves to a standard mutation response.
 */
export const sendMessage = async (request: SendMessageRequest): Promise<MutationResponse> => {
  try {
    const response = await apiClient.post<MutationResponse>('/messages/send', request);
    return response.data;
  } catch (error) {
    console.error(`Failed to send message to ${request.peerId}:`, error);
    throw new Error('Message sending failed');
  }
};

/**
 * Fetches the message history for a specific peer.
 * @param peerId - The ID of the peer to get history for.
 * @returns A promise that resolves to an array of ChatMessage objects.
 */
export const getMessageHistory = async (peerId: string): Promise<ChatMessage[]> => {
  try {
    const response = await apiClient.get<ChatMessage[]>(`/messages/history?peerId=${peerId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to get message history for ${peerId}:`, error);
    return [];
  }
};
