import React, { useState } from 'react';
import { SidebarProvider, SidebarInset } from './components/ui/sidebar';
import { AppSidebar } from './components/AppSidebar';
import { MainContent } from './components/MainContent';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from './components/ui/theme-provider';

export default function App() {
  const [activeSection, setActiveSection] = useState<'home' | 'news' | 'projects' | 'papers' | 'settings'>('home');

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <SidebarProvider>
        <div className="w-screen h-[100dvh] overflow-hidden bg-background">
          {/* Sidebar + content should be siblings inside a horizontal flex container. */}
          <div className="flex w-full h-[100dvh]">
            <AppSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
            <SidebarInset>
              <MainContent activeSection={activeSection} />
            </SidebarInset>
          </div>
          <Toaster />
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
