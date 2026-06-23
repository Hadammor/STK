import { useCallback, useState } from 'react';

// Generic open/close state for a bottom sheet (SOS, Settings).
export function useSheet(initial = false) {
  const [isOpen, setIsOpen] = useState(initial);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  return { isOpen, open, close };
}
