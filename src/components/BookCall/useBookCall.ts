import { createContext, useContext } from 'react';

export type BookCallContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const BookCallContext = createContext<BookCallContextValue | null>(null);

export function useBookCall() {
  const context = useContext(BookCallContext);
  if (!context) {
    throw new Error('useBookCall must be used within BookCallProvider');
  }
  return context;
}
