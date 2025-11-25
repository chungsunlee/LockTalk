// src/services/state.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // Theme management
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Tutorial state
  isTutorialActive: boolean;
  startTutorial: () => void;
  stopTutorial: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // --- THEME ---
      isDarkMode: window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false,
      toggleDarkMode: () =>
        set((state) => {
          const newIsDarkMode = !state.isDarkMode;
          if (newIsDarkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { isDarkMode: newIsDarkMode };
        }),

      // --- TUTORIAL ---
      isTutorialActive: false,
      startTutorial: () => set({ isTutorialActive: true }),
      stopTutorial: () => set({ isTutorialActive: false }),
    }),
    {
      name: 'locktalk-app-storage', // name of the item in the storage (must be unique)
      onRehydrateStorage: () => (state) => {
        // On rehydration, apply the dark mode class to the document
        if (state?.isDarkMode) {
          document.documentElement.classList.add('dark');
        }
        // Explicitly set tutorial to inactive on rehydration, as the "Take the Tour" button is removed.
        // This prevents unintended persistent 'active' state.
        if (state) {
            state.isTutorialActive = false;
        }
      },
    }
  )
);
