// src/hooks/useMessages.ts
import { useState, useCallback, useEffect } from 'react';
import { useWebSocket } from '@/services/ws';
import { getMessageHistory, sendMessage } from '@/services/api';
import type { ChatMessage, SendMessageRequest } from '@/types';


/**
 * # Chat and Message Hook
 * 
 * Manages the messages for a specific chat session (with a peer).
 * It combines WebSocket for real-time messages and REST API calls
 * for sending messages and fetching history.
 * 
 * It also demonstrates how to show a fun UI effect (confetti!) on
 * the first successful connection message.
 * 
 * Example usage:
 * ```tsx
 * const { messages, status, send } = useMessages('peer-123');
 * ```
 */
export const useMessages = (peerId: string | null) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activePeerId, setActivePeerId] = useState<string | null>(peerId);
  const [isHistoryLoading, setHistoryLoading] = useState(false);
  
  // A little fun: track if we've shown confetti for this session
  const [hasShownConfetti, setHasShownConfetti] = useState(false);

  const handleIncomingMessage = useCallback((message: ChatMessage) => {
    // Only add messages for the currently active chat
    if (message.peerId === activePeerId) {
      setMessages((prev) => [...prev, message]);
      
      // Fun Part: If this is the first "connected" message, let's celebrate!
      if(message.content.includes("secure channel established") && !hasShownConfetti) {
        // This is a fake event to be picked up by a component
        window.dispatchEvent(new CustomEvent('show-confetti'));
        setHasShownConfetti(true);
      }
    }
  }, [activePeerId, hasShownConfetti]);
  
  const { status: wsStatus } = useWebSocket(handleIncomingMessage);

  useEffect(() => {
    setActivePeerId(peerId);
    if (peerId) {
      setHistoryLoading(true);
      setMessages([]); // Clear previous messages
      setHasShownConfetti(false); // Reset confetti for new peer
      
      getMessageHistory(peerId)
        .then(history => setMessages(history))
        .finally(() => setHistoryLoading(false));
    } else {
      setMessages([]);
    }
  }, [peerId]);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!activePeerId) {
      console.error("Can't send message without an active peer.");
      return;
    }

    const request: SendMessageRequest = { peerId: activePeerId, content };
    
    // Optimistic UI update: show the message as "sent" immediately.
    const optimisticMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      peerId: activePeerId,
      content, // Note: This is plaintext until backend confirms encryption
      timestamp: new Date().toISOString(),
      sender: 'me',
      status: 'sent',
    };
    setMessages(prev => [...prev, optimisticMessage]);

    try {
      await sendMessage(request);
      // Once confirmed, we could update the message status from 'sent' to 'delivered'
      // For this example, we'll assume the WebSocket will echo the final message back.
    } catch (error) {
      // If sending fails, update the optimistic message to show an error.
      setMessages(prev => prev.map(m => 
        m.id === optimisticMessage.id ? { ...m, status: 'failed' } : m
      ));
    }
  }, [activePeerId]);

  return {
    messages,
    wsStatus,
    isHistoryLoading,
    send: handleSendMessage,
  };
};
