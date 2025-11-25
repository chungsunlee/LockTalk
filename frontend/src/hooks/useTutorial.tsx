// src/hooks/useTutorial.ts
import { useContext, createContext, useState, ReactNode } from 'react';
import { useAppStore } from '@/services/state';

/**
 * # Interactive Tutorial Hook
 * 
 * Manages the state for the interactive tutorial overlay.
 * - `isTutorialActive`: controlled by a global Zustand store for persistence.
 * - `currentStep`: tracks the user's progress through the tutorial steps.
 * 
 * The `TutorialProvider` should wrap the main App component to make this
 * context available everywhere.
 * 
 * Example:
 * ```tsx
 * const { isTutorialActive, start, stop, nextStep, currentStep } = useTutorial();
 * ```
 */

interface TutorialContextType {
  isTutorialActive: boolean;
  currentStep: number;
  start: () => void;
  stop: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const TutorialProvider = ({ children }: { children: ReactNode }) => {
  const { isTutorialActive, startTutorial, stopTutorial } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);

  const start = () => {
    setCurrentStep(0);
    startTutorial();
  };

  const stop = () => {
    stopTutorial();
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };
  
  const prevStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const goToStep = (index: number) => {
    setCurrentStep(index);
  }

  const value = { isTutorialActive, currentStep, start, stop, nextStep, prevStep, goToStep };

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
};
