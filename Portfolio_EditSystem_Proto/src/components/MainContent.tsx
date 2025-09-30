import React, { useEffect, useMemo, useState } from 'react';
import { SidebarTrigger } from './ui/sidebar';
import { HomeSection } from './sections/HomeSection';
import { NewsSection } from './sections/NewsSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { PapersSection } from './sections/PapersSection';
import { SettingsSection } from './sections/SettingsSection';
import { MainContentHeaderProvider } from './MainContentHeaderContext';

interface MainContentProps {
  activeSection: 'home' | 'news' | 'projects' | 'papers' | 'settings';
}

export function MainContent({ activeSection }: MainContentProps) {
  const [headerLeft, setHeaderLeft] = useState<React.ReactNode>(null);
  const [headerRight, setHeaderRight] = useState<React.ReactNode>(null);

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <HomeSection />;
      case 'news':
        return <NewsSection />;
      case 'projects':
        return <ProjectsSection />;
      case 'papers':
        return <PapersSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <HomeSection />;
    }
  };

  useEffect(() => {
    setHeaderLeft(null);
    setHeaderRight(null);
  }, [activeSection]);

  const headerContextValue = useMemo(
    () => ({ setHeaderLeft, setHeaderRight }),
    []
  );

  return (
    <main className="flex flex-col w-full h-[100dvh] overflow-auto">
      {/* Sticky header: keep visible while editor content scrolls */}
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-sm font-medium text-foreground">
            {headerLeft}
          </div>
          <div className="flex items-center gap-2">
            {headerRight}
          </div>
        </div>
      </header>
      <MainContentHeaderProvider value={headerContextValue}>
        <div className="flex-1 w-full">
          {renderSection()}
        </div>
      </MainContentHeaderProvider>
    </main>
  );
}
