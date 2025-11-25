// src/components/chat/ChatInput.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { IconSend } from '@/assets/icons';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSend(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-sm">
      <div className="flex items-center space-x-2">
        <input
          id="chat-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={disabled ? "Select a peer to start talking" : "Send a secure message..."}
          disabled={disabled}
          autoComplete="off"
          className="flex-1 w-full px-4 py-2 bg-light-surface dark:bg-dark-surface rounded-full border border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent transition-shadow"
        />
        <motion.button
          type="submit"
          disabled={disabled || !inputValue.trim()}
          className="flex-shrink-0 w-10 h-10 rounded-full bg-light-accent dark:bg-dark-accent text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          whileTap={{ scale: 0.9 }}
          aria-label="Send Message"
        >
          <IconSend className="w-5 h-5" />
        </motion.button>
      </div>
    </form>
  );
};

export default ChatInput;
