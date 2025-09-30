import React, { createContext, useContext } from 'react';

interface MainContentHeaderContextValue {
  setHeaderLeft: (content: React.ReactNode) => void;
  setHeaderRight: (content: React.ReactNode) => void;
}

const MainContentHeaderContext = createContext<MainContentHeaderContextValue | null>(null);

export function MainContentHeaderProvider({
  value,
  children,
}: {
  value: MainContentHeaderContextValue;
  children: React.ReactNode;
}) {
  return (
    <MainContentHeaderContext.Provider value={value}>
      {children}
    </MainContentHeaderContext.Provider>
  );
}

export function useMainContentHeader() {
  const context = useContext(MainContentHeaderContext);
  if (!context) {
    throw new Error('useMainContentHeader must be used within MainContentHeaderProvider');
  }
  return context;
}
