import React, { useState } from 'react';
import { SidebarTrigger } from './ui/sidebar';
import { HomeSection } from './sections/HomeSection';
import { NewsSection } from './sections/NewsSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { PapersSection } from './sections/PapersSection';
import { SettingsSection } from './sections/SettingsSection';

interface MainContentProps {
  activeSection: 'home' | 'news' | 'projects' | 'papers' | 'settings';
}

export function MainContent({ activeSection }: MainContentProps) {
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

  return (
    <main className="flex flex-col w-full min-h-[100dvh] overflow-hidden">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
      </header>
      <div className="flex-1 overflow-auto w-full">
        {renderSection()}
      </div>
    </main>
  );
}