// src/components/chat/ChatPane.tsx
import { useEffect, useRef } from 'react';
import { useMessages } from '@/hooks/useMessages';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { AnimatePresence } from 'framer-motion';

interface ChatPaneProps {
  selectedPeerId: string | null;
}

const ChatPane = ({ selectedPeerId }: ChatPaneProps) => {
  const { messages, wsStatus, isHistoryLoading, send } = useMessages(selectedPeerId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const WelcomeMessage = () => (
    <div className="text-center p-8">
      <h2 className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary">Welcome to LockTalk!</h2>
      <p className="text-light-text-secondary dark:text-dark-text-secondary mt-2">
        Select a peer from the left to start a secure chat.
      </p>
      <p className="text-sm mt-1 text-light-text-secondary dark:text-dark-text-secondary">
        (If you're feeling lonely, you can always talk to yourself. We don't judge.)
      </p>
    </div>
  );

  return (
    <div id="chat-pane" className="flex flex-col h-full bg-light-surface dark:bg-dark-surface rounded-lg shadow-apple-light dark:shadow-apple-dark">
      {/* Optional: Header for the chat pane */}
      <div className="flex-shrink-0 p-4 border-b border-light-border dark:border-dark-border">
          <h3 className="font-bold text-lg">{selectedPeerId ? `Chat with ${selectedPeerId}` : "No Chat Selected"}</h3>
          <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">WebSocket Status: <span className="font-semibold">{wsStatus}</span></p>
      </div>
      
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {isHistoryLoading && <div className="text-center">Loading message history...</div>}
        {!selectedPeerId && !isHistoryLoading && <WelcomeMessage />}
        
        <AnimatePresence initial={false}>
          {selectedPeerId && messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSend={send} disabled={!selectedPeerId || wsStatus !== 'open'} />
    </div>
  );
};

export default ChatPane;
