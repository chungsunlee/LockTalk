// src/hooks/usePeers.ts
import { useState, useEffect, useCallback } from 'react';
import { discoverPeers, startHandshake } from '@/services/api';
import type { Peer, HandshakeRequest } from '@/types';

/**
 * # Peer Management Hook
 * 
 * This hook is responsible for managing the state of peers:
 * - Fetching the list of discoverable peers.
 * - Handling loading and error states.
 * - Providing a function to initiate a handshake.
 * 
 * Example usage in a component:
 * ```tsx
 * const { peers, isLoading, error, refreshPeers } = usePeers();
 * ```
 */
export const usePeers = () => {
  const [peers, setPeers] = useState<Peer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPeers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const discoveredPeers = await discoverPeers();
      setPeers(discoveredPeers);
    } catch (err) {
      setError('Could not fetch peers. Is the backend server running?');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPeers();
    // Optional: Poll for new peers every so often
    const interval = setInterval(fetchPeers, 15000); // every 15 seconds
    return () => clearInterval(interval);
  }, [fetchPeers]);

  const handleHandshake = useCallback(async (peerId: string) => {
    console.log(`Attempting to shake hands with ${peerId}. No weird handshakes, please.`);
    try {
      const request: HandshakeRequest = { peerId };
      const response = await startHandshake(request);
      if (response.success) {
        // Update peer status optimistically
        setPeers(prevPeers => 
          prevPeers.map(p => p.id === peerId ? { ...p, status: 'connecting' } : p)
        );
        console.log(`Handshake with ${peerId} initiated successfully!`);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Handshake initiation failed:', err);
      return false;
    }
  }, []);

  return {
    peers,
    isLoading,
    error,
    refreshPeers: fetchPeers,
    initiateHandshake: handleHandshake,
  };
};
