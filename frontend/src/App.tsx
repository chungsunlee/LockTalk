import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import Header from '@/components/core/Header';
import { TutorialProvider } from '@/hooks/useTutorial';

// Lazy load the pages for better code splitting and performance
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// A simple loading fallback for suspense
const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary">Loading LockTalk...</p>
  </div>
);

function App() {
  return (
    <TutorialProvider>
      <div className="min-h-screen font-sans">
        <Header />
        <main>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/app" element={<DashboardPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </TutorialProvider>
  );
}

export default App;
