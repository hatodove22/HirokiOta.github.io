import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from './components/ui/sidebar';
import { AppSidebar } from './components/AppSidebar';
import { MainContent } from './components/MainContent';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from './components/ui/theme-provider';

export default function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <Router>
        <SidebarProvider>
          <div className="w-screen h-[100dvh] overflow-hidden bg-background">
            {/* Sidebar + content should be siblings inside a horizontal flex container. */}
            <div className="flex w-full h-[100dvh]">
              <AppSidebar />
              <SidebarInset>
                <Routes>
                  <Route path="/" element={<Navigate to="/home" replace />} />
                  <Route path="/home" element={<MainContent activeSection="home" />} />
                  <Route path="/news" element={<MainContent activeSection="news" />} />
                  <Route path="/news/new" element={<MainContent activeSection="news" />} />
                  <Route path="/news/edit/:id" element={<MainContent activeSection="news" />} />
                  <Route path="/projects" element={<MainContent activeSection="projects" />} />
                  <Route path="/projects/new" element={<MainContent activeSection="projects" />} />
                  <Route path="/projects/edit/:id" element={<MainContent activeSection="projects" />} />
                  <Route path="/papers" element={<MainContent activeSection="papers" />} />
                  <Route path="/papers/new" element={<MainContent activeSection="papers" />} />
                  <Route path="/papers/edit/:id" element={<MainContent activeSection="papers" />} />
                  <Route path="/settings" element={<MainContent activeSection="settings" />} />
                  <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
              </SidebarInset>
            </div>
            <Toaster />
          </div>
        </SidebarProvider>
      </Router>
    </ThemeProvider>
  );
}
