// src/components/chat/ChatMessage.tsx
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { ChatMessage as MessageType } from '@/types';

interface ChatMessageProps {
  message: MessageType;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isMe = message.sender === 'me';

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3 }}
      className={twMerge('flex items-end space-x-2', isMe ? 'justify-end' : 'justify-start')}
    >
      <div className={twMerge('max-w-xs md:max-w-md p-3 rounded-2xl', 
        isMe 
          ? 'bg-light-accent text-white rounded-br-lg' 
          : 'bg-light-surface dark:bg-dark-surface text-light-text-primary dark:text-dark-text-primary rounded-bl-lg'
      )}>
        <p className="text-sm">{message.content}</p>
        <div className={twMerge("text-xs mt-1 opacity-70", isMe ? "text-right" : "text-left")}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            {isMe && message.status === 'failed' && <span className="text-red-300 ml-2">(Failed)</span>}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
