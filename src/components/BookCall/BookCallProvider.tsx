import React, { useCallback, useMemo, useState } from 'react';
import BookCallModal from './BookCallModal';
import { BookCallContext } from './useBookCall';

export function BookCallProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close]);

  return (
    <BookCallContext.Provider value={value}>
      {children}
      <BookCallModal isOpen={isOpen} onClose={close} />
    </BookCallContext.Provider>
  );
}
