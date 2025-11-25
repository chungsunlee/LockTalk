// src/components/core/DeviceMockup.tsx
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface DeviceMockupProps {
  children: ReactNode;
}

/**
 * A pure CSS-in-JS component to render an Apple-inspired device mockup (like a generic laptop).
 * It uses nested divs to create the 3D effect with borders and shadows.
 * The `children` prop will be displayed on the screen of the mockup.
 */
const DeviceMockup = ({ children }: DeviceMockupProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[8px] rounded-2xl h-[172px] max-w-[301px] md:h-[294px] md:max-w-[512px]"
    >
      <div className="rounded-2xl overflow-hidden h-[156px] md:h-[278px] bg-white dark:bg-gray-800">
        {/* Screen Content */}
        {children}
      </div>

       {/* A little notch, just for fun */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-gray-800 rounded-b-lg md:w-32 md:h-6"></div>
    </motion.div>
  );
};

export default DeviceMockup;
