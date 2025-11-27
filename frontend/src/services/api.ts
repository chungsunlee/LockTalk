// src/services/api.ts
import axios, { AxiosInstance } from 'axios';
import type { Peer, ChatMessage, SendMessageRequest, HandshakeRequest, MutationResponse } from '@/types';
import { fetchBackendUrl } from './config';

/**
 * # Asynchronous API Client
 * 
 * To support automatic backend discovery, the Axios client can no longer be created
 * synchronously. Instead, we create a promise that resolves with the configured client
 * once the backend URL is determined.
 */
const apiClientPromise: Promise<AxiosInstance> = (async () => {
    const baseUrl = await fetchBackendUrl();
    return axios.create({
        baseURL: `${baseUrl}/api`, // Append /api to the discovered base URL
        headers: {
            'Content-Type': 'application/json',
        },
    });
})();


/**
 * Fetches the list of discoverable peers from the backend.
 * @returns A promise that resolves to an array of Peer objects.
 */
export const discoverPeers = async (): Promise<Peer[]> => {
  try {
    const apiClient = await apiClientPromise;
    const response = await apiClient.get<Peer[]>('/discover');
    console.log("Peers spotted in the wild! Don't worry, they don't bite. Usually.");
    return response.data;
  } catch (error) {
    console.error('Failed to discover peers:', error);
    return [];
  }
};

/**
 * Initiates a handshake with a selected peer.
 * @param request - The handshake request containing the peer ID.
 * @returns A promise that resolves to a standard mutation response.
 */
export const startHandshake = async (request: HandshakeRequest): Promise<MutationResponse> => {
  try {
    const apiClient = await apiClientPromise;
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
    const apiClient = await apiClientPromise;
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
    const apiClient = await apiClientPromise;
    const response = await apiClient.get<ChatMessage[]>(`/messages/history?peerId=${peerId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to get message history for ${peerId}:`, error);
    return [];
  }
};
