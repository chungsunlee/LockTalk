// src/pages/DashboardPage.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PeerList from '@/components/peers/PeerList';
import ChatPane from '@/components/chat/ChatPane';
import KeyManager from '@/components/settings/KeyManager';
import TutorialOverlay from '@/components/tutorial/TutorialOverlay';

// Confetti Component for fun!
const Confetti = () => {
    const colors = ['#007AFF', '#5856D6', '#FF2D55', '#34C759', '#FF9500'];
    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-[200]">
            {Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ y: -100, x: Math.random() * window.innerWidth, opacity: 1 }}
                    animate={{ 
                        y: window.innerHeight + 100, 
                        rotate: Math.random() * 360,
                        transition: { duration: 2 + Math.random() * 2, ease: 'linear' }
                    }}
                    style={{
                        width: `${5 + Math.random() * 5}px`,
                        height: `${10 + Math.random() * 10}px`,
                        backgroundColor: colors[i % colors.length],
                        position: 'absolute',
                    }}
                    className="rounded-sm"
                />
            ))}
        </div>
    );
};


const DashboardPage = () => {
  const [selectedPeerId, setSelectedPeerId] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const handleConfetti = () => {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000); // Let it rain for 4 seconds
    };
    
    window.addEventListener('show-confetti', handleConfetti);
    return () => window.removeEventListener('show-confetti', handleConfetti);
  }, []);

  return (
    <>
      <div className="h-screen pt-16 flex flex-col lg:flex-row p-4 gap-4">
        {showConfetti && <Confetti />}
        
        {/* Left Column: Peer List and Key Manager */}
        <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-1/3 lg:max-w-sm flex-shrink-0 flex flex-col gap-4"
        >
          <div className="flex-1">
            <PeerList selectedPeerId={selectedPeerId} onPeerSelect={setSelectedPeerId} />
          </div>
          <div className="flex-shrink-0">
             <KeyManager />
          </div>
        </motion.div>

        {/* Right Column: Chat Pane */}
        <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 h-full min-w-0"
        >
          <ChatPane selectedPeerId={selectedPeerId} />
        </motion.div>
      </div>
      <TutorialOverlay />
    </>
  );
};

export default DashboardPage;
