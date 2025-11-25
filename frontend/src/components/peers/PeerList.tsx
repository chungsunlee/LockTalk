// src/components/peers/PeerList.tsx
import { usePeers } from '@/hooks/usePeers';
import PeerCard from './PeerCard';
import { AnimatePresence } from 'framer-motion';

interface PeerListProps {
  selectedPeerId: string | null;
  onPeerSelect: (id: string) => void;
}

const PeerList = ({ selectedPeerId, onPeerSelect }: PeerListProps) => {
  const { peers, isLoading, error, initiateHandshake } = usePeers();

  const handleConnect = async (peerId: string) => {
    const success = await initiateHandshake(peerId);
    if (success) {
      onPeerSelect(peerId);
    } else {
      // Maybe show a toast notification here
      alert("Uh oh. Handshake failed. Maybe they're not in a shaking mood?");
    }
  };

  return (
    <div id="peer-list" className="h-full bg-light-bg dark:bg-dark-bg p-2 rounded-lg shadow-inner">
      <h2 className="text-lg font-bold p-2 text-light-text-primary dark:text-dark-text-primary">Discoverable Peers</h2>
      {isLoading && peers.length === 0 && (
        <div className="p-4 text-center text-light-text-secondary dark:text-dark-text-secondary">
          Scouting for friends...
        </div>
      )}
      {error && (
        <div className="p-4 text-center text-red-500">
          <p>{error}</p>
          <p className="text-sm">Is the backend running? Maybe give it some coffee.</p>
        </div>
      )}
      {!isLoading && peers.length === 0 && !error && (
        <div className="p-4 text-center text-light-text-secondary dark:text-dark-text-secondary">
          <p>It's quiet... too quiet.</p>
          <p className="text-sm">No peers found on your network.</p>
        </div>
      )}
      <div className="space-y-1">
        <AnimatePresence>
          {peers.map((peer) => (
            <PeerCard
              key={peer.id}
              peer={peer}
              isSelected={selectedPeerId === peer.id}
              onSelect={onPeerSelect}
              onConnect={handleConnect}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PeerList;
