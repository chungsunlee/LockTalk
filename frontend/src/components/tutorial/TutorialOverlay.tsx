// src/components/tutorial/TutorialOverlay.tsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTutorial } from '@/hooks/useTutorial';
import { tutorialSteps } from './TutorialSteps';
import Button from '@/components/core/Button';
import { IconX, IconChevronLeft, IconChevronRight } from '@/assets/icons';
import { twMerge } from 'tailwind-merge';

const TutorialOverlay = () => {
  const { isTutorialActive, currentStep, nextStep, prevStep, stop } = useTutorial();
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);

  const step = tutorialSteps[currentStep];

  useEffect(() => {
    if (isTutorialActive && step) {
      const element = document.querySelector(step.element) as HTMLElement;
      setHighlightedElement(element);
    } else {
      setHighlightedElement(null);
    }
  }, [isTutorialActive, step]);

  const getPopoverPosition = () => {
    if (!highlightedElement) return {};
    const rect = highlightedElement.getBoundingClientRect();
    const popoverOffset = 16; // 1rem
    
    switch (step.position) {
      case 'top':
        return { bottom: window.innerHeight - rect.top + popoverOffset, left: rect.left + rect.width / 2, x: '-50%' };
      case 'bottom':
        return { top: rect.bottom + popoverOffset, left: rect.left + rect.width / 2, x: '-50%' };
      case 'left':
        return { top: rect.top + rect.height / 2, right: window.innerWidth - rect.left + popoverOffset, y: '-50%' };
      case 'right':
      default:
        return { top: rect.top + rect.height / 2, left: rect.right + popoverOffset, y: '-50%' };
    }
  };

  const popoverStyle = getPopoverPosition();

  return (
    <AnimatePresence>
      {isTutorialActive && step && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[100]"
            onClick={stop}
          />
          
          {/* Highlight Box */}
          {highlightedElement && (
            <motion.div
              animate={{
                x: highlightedElement.getBoundingClientRect().left - 8,
                y: highlightedElement.getBoundingClientRect().top - 8,
                width: highlightedElement.getBoundingClientRect().width + 16,
                height: highlightedElement.getBoundingClientRect().height + 16,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] z-[101]"
            />
          )}

          {/* Popover */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1, ...popoverStyle }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={twMerge(
              "fixed z-[102] w-72 p-5 rounded-lg bg-light-surface dark:bg-dark-surface shadow-xl",
              "focus:outline-none"
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tutorial-title"
          >
            <h3 id="tutorial-title" className="text-lg font-bold text-light-text-primary dark:text-dark-text-primary">{step.title}</h3>
            <p className="mt-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">{step.content}</p>

            <div className="mt-6 flex justify-between items-center">
              <span className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary">
                {currentStep + 1} / {tutorialSteps.length}
              </span>
              <div className="flex space-x-2">
                {currentStep > 0 && 
                  <Button variant="secondary" size="sm" onClick={prevStep} aria-label="Previous step">
                    <IconChevronLeft className="h-4 w-4"/>
                  </Button>
                }
                {currentStep < tutorialSteps.length - 1 ? (
                  <Button size="sm" onClick={nextStep} aria-label="Next step">
                    <IconChevronRight className="h-4 w-4"/>
                  </Button>
                ) : (
                  <Button size="sm" onClick={stop}>Finish</Button>
                )}
              </div>
            </div>

            <button onClick={stop} className="absolute top-2 right-2 p-1 rounded-full text-light-text-secondary hover:bg-light-bg dark:text-dark-text-secondary dark:hover:bg-dark-bg" aria-label="Close tutorial">
                <IconX className="h-5 w-5" />
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TutorialOverlay;
