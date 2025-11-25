// src/components/core/Header.tsx

import { useAppStore } from '@/services/state';
import { useTutorial } from '@/hooks/useTutorial';
import { IconMoon, IconSun, IconInfo } from '@/assets/icons';

const Header = () => {
  const { isDarkMode, toggleDarkMode } = useAppStore();
  const { start: startTutorial } = useTutorial();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-lg border-b border-light-border/80 dark:border-dark-border/80">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={startTutorial}
              className="p-2 rounded-full text-light-text-secondary hover:text-light-accent dark:text-dark-text-secondary dark:hover:text-dark-accent transition-colors"
              aria-label="Start interactive tutorial"
            >
              <IconInfo className="h-6 w-6" />
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-light-text-secondary hover:text-light-accent dark:text-dark-text-secondary dark:hover:text-dark-accent transition-colors"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <IconSun className="h-6 w-6" /> : <IconMoon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
