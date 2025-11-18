import React, { createContext, useContext, useState, useCallback } from 'react';

interface DashboardContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const DashboardContext = createContext<DashboardContextType>({
  isDarkMode: true,
  toggleDarkMode: () => {},
});

/**
 * DashboardProvider wraps the application and provides dark mode state.
 */
export const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  return (
    <DashboardContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DashboardContext.Provider>
  );
};

/**
 * Custom hook for consuming the DashboardContext.
 */
export const useDashboard = () => useContext(DashboardContext);
