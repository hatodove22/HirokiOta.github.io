import React, { useState } from 'react';
import { SidebarProvider, SidebarInset } from './components/ui/sidebar';
import { AppSidebar } from './components/AppSidebar';
import { MainContent } from './components/MainContent';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [activeSection, setActiveSection] = useState<'home' | 'news' | 'projects' | 'papers' | 'settings'>('home');

  return (
    <SidebarProvider>
      <div className="w-screen min-h-[100dvh] overflow-hidden bg-background">
        {/* Sidebar + content should be siblings inside a horizontal flex container. */}
        <div className="flex w-full min-h-[100dvh]">
          <AppSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
          <SidebarInset>
            <MainContent activeSection={activeSection} />
          </SidebarInset>
        </div>
        <Toaster />
      </div>
    </SidebarProvider>
  );
}
