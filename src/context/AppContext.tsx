import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Event } from '../types/Event';
import { mockEvents } from '../data/mockEvents';
import { useDrawer, type DrawerState } from '../hooks/useDrawer';
import { useSheet } from '../hooks/useSheet';

export interface ConfirmConfig {
  title: string;
  body?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
}

interface AppContextValue {
  // Data
  events: Event[]; // ordered for the drawer (bumped event first)
  topEventId: string | null; // event bumped to the top of the list
  highlightedEventId: string | null; // transient highlight (pin tap)

  // Drawer
  drawerState: DrawerState;
  setDrawerState: (s: DrawerState) => void;

  // Thread view
  openThreadEventId: string | null;
  getEvent: (id: string) => Event | undefined;
  openThread: (id: string) => void;
  closeThread: () => void;

  // Sheets
  sosOpen: boolean;
  openSOS: () => void;
  closeSOS: () => void;
  settingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;

  // Map → drawer
  selectPin: (id: string) => void;
  clearHighlight: () => void;

  // Confirm modal (frame-level so it overlays sheets)
  confirm: ConfirmConfig | null;
  requestConfirm: (cfg: ConfirmConfig) => void;
  closeConfirm: () => void;

  // Misc
  toast: string | null;
  showToast: (message: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [topEventId, setTopEventId] = useState<string | null>(null);
  const [highlightedEventId, setHighlightedEventId] = useState<string | null>(
    null,
  );
  const [openThreadEventId, setOpenThreadEventId] = useState<string | null>(
    null,
  );
  const [toast, setToast] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<ConfirmConfig | null>(null);

  const drawer = useDrawer('peek');
  const sos = useSheet(false);
  const settings = useSheet(false);

  // Order: the bumped event first, everything else in default order.
  const orderedEvents = useMemo(() => {
    if (!topEventId) return events;
    const top = events.find((e) => e.id === topEventId);
    if (!top) return events;
    return [top, ...events.filter((e) => e.id !== topEventId)];
  }, [events, topEventId]);

  const getEvent = useCallback(
    (id: string) => events.find((e) => e.id === id),
    [events],
  );

  const markRead = useCallback((id: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, unread: false } : e)),
    );
  }, []);

  const clearHighlight = useCallback(() => setHighlightedEventId(null), []);

  // Pin tap: bump the matching row to the top, highlight it, and make sure the
  // drawer is at least expanded so the row is visible to scroll to.
  const selectPin = useCallback(
    (id: string) => {
      setTopEventId(id);
      setHighlightedEventId(id);
      drawer.expand();
      window.setTimeout(() => setHighlightedEventId(null), 2200);
    },
    [drawer],
  );

  const openThread = useCallback(
    (id: string) => {
      setTopEventId(id);
      markRead(id);
      setOpenThreadEventId(id);
    },
    [markRead],
  );
  const closeThread = useCallback(() => setOpenThreadEventId(null), []);

  const requestConfirm = useCallback((cfg: ConfirmConfig) => setConfirm(cfg), []);
  const closeConfirm = useCallback(() => setConfirm(null), []);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 1800);
  }, []);

  const value: AppContextValue = {
    events: orderedEvents,
    topEventId,
    highlightedEventId,
    drawerState: drawer.state,
    setDrawerState: drawer.setState,
    openThreadEventId,
    getEvent,
    openThread,
    closeThread,
    sosOpen: sos.isOpen,
    openSOS: sos.open,
    closeSOS: sos.close,
    settingsOpen: settings.isOpen,
    openSettings: settings.open,
    closeSettings: settings.close,
    selectPin,
    clearHighlight,
    confirm,
    requestConfirm,
    closeConfirm,
    toast,
    showToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
