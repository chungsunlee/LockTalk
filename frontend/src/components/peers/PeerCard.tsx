// src/components/peers/PeerCard.tsx
import { motion } from 'framer-motion';
import { Peer } from '@/types';
import Button from '@/components/core/Button';
import { twMerge } from 'tailwind-merge';

interface PeerCardProps {
  peer: Peer;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onConnect: (id: string) => void;
}

const statusClasses = {
  online: 'bg-green-400',
  offline: 'bg-gray-400',
  connecting: 'bg-yellow-400 animate-pulse',
  connected: 'bg-blue-400',
};

const PeerCard = ({ peer, isSelected, onSelect, onConnect }: PeerCardProps) => {
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <motion.div
      layout
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      onClick={() => onSelect(peer.id)}
      className={twMerge(
        'group relative flex items-center p-3 space-x-3 rounded-lg cursor-pointer transition-all duration-200',
        isSelected
          ? 'bg-light-accent/10 dark:bg-dark-accent/20'
          : 'hover:bg-light-surface dark:hover:bg-dark-surface'
      )}
    >
      <div className="flex-shrink-0 relative">
        <div className="w-10 h-10 rounded-full bg-light-border dark:bg-dark-border flex items-center justify-center font-bold text-light-text-secondary dark:text-dark-text-secondary">
          {peer.name.charAt(0).toUpperCase()}
        </div>
        <span
          className={twMerge(
            'absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-light-bg dark:ring-dark-bg',
            statusClasses[peer.status]
          )}
          title={`Status: ${peer.status}`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-light-text-primary dark:text-dark-text-primary truncate">{peer.name}</p>
        <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary truncate">{peer.address}</p>
      </div>
      
      {peer.status === 'online' && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" onClick={(e) => {
            e.stopPropagation(); // prevent onSelect from firing
            onConnect(peer.id);
          }}>
            Connect
          </Button>
        </div>
      )}

      {peer.status === 'connected' && (
         <div className="text-xs font-semibold text-blue-500">
            Connected
         </div>
      )}
    </motion.div>
  );
};

export default PeerCard;
