import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Event, Severity } from '../types/Event';
import {
  cities,
  cityById,
  defaultCityId,
  type City,
} from '../data/cities';
import { useDrawer, type DrawerState } from '../hooks/useDrawer';
import { useSheet } from '../hooks/useSheet';

export interface ConfirmConfig {
  title: string;
  body?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
}

export type SortMode = 'proximity' | 'critical' | 'recent';

// eslint-disable-next-line react-refresh/only-export-components
export const SORT_LABELS: Record<SortMode, string> = {
  proximity: 'Around me',
  critical: 'Most critical',
  recent: 'Most recent',
};

const SEVERITY_RANK: Record<Severity, number> = {
  critical: 4,
  high: 3,
  moderate: 2,
  low: 1,
  allClear: 0,
};

interface AppContextValue {
  // City
  city: City; // active city (center/zoom/bbox/services/consular)
  cities: City[];
  cityId: string;
  setCity: (id: string) => void;

  // Layout
  frameH: number; // measured viewport height (drives drawer snaps)

  // Sorting
  sortMode: SortMode;
  setSortMode: (m: SortMode) => void;

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
  const [cityId, setCityId] = useState<string>(defaultCityId);
  const [events, setEvents] = useState<Event[]>(
    () => cityById(defaultCityId).events,
  );
  const [topEventId, setTopEventId] = useState<string | null>(null);
  const [highlightedEventId, setHighlightedEventId] = useState<string | null>(
    null,
  );
  const [openThreadEventId, setOpenThreadEventId] = useState<string | null>(
    null,
  );
  const [toast, setToast] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<ConfirmConfig | null>(null);
  const [sortMode, setSortModeState] = useState<SortMode>('proximity');
  const [frameH, setFrameH] = useState(() =>
    typeof window !== 'undefined' ? window.innerHeight : 852,
  );

  // Keep the measured height in sync with the browser window (full-screen app).
  useEffect(() => {
    const onResize = () => setFrameH(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const drawer = useDrawer('peek');
  const sos = useSheet(false);
  const settings = useSheet(false);

  const city = cityById(cityId);

  // Switch city: load its events and clear any in-flight selection / open thread.
  const setCity = useCallback((id: string) => {
    setCityId(id);
    setEvents(cityById(id).events);
    setTopEventId(null);
    setHighlightedEventId(null);
    setOpenThreadEventId(null);
  }, []);

  // Sort by the chosen mode, then float the bumped event (pin tap) to the top.
  const orderedEvents = useMemo(() => {
    const [cLng, cLat] = city.center;
    const sorted = [...events].sort((a, b) => {
      if (sortMode === 'critical')
        return SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity];
      if (sortMode === 'recent')
        return b.latestUpdateTime.getTime() - a.latestUpdateTime.getTime();
      // proximity (default): nearest to the user (city center) first
      const da = (a.lng - cLng) ** 2 + (a.lat - cLat) ** 2;
      const db = (b.lng - cLng) ** 2 + (b.lat - cLat) ** 2;
      return da - db;
    });
    if (topEventId) {
      const top = sorted.find((e) => e.id === topEventId);
      if (top) return [top, ...sorted.filter((e) => e.id !== topEventId)];
    }
    return sorted;
  }, [events, topEventId, sortMode, city]);

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

  // Pin tap: bump the matching row to the top + highlight it, and keep the drawer
  // in the smaller (peek) state. (MapView also re-centers the map on the event.)
  const selectPin = useCallback(
    (id: string) => {
      setTopEventId(id);
      setHighlightedEventId(id);
      drawer.collapse();
      window.setTimeout(() => setHighlightedEventId(null), 2200);
    },
    [drawer],
  );

  const openThread = useCallback(
    (id: string) => {
      markRead(id);
      setOpenThreadEventId(id);
    },
    [markRead],
  );
  const closeThread = useCallback(() => setOpenThreadEventId(null), []);

  // Changing the sort is an explicit reorder, so drop any pin-pinned top event.
  const setSortMode = useCallback((m: SortMode) => {
    setSortModeState(m);
    setTopEventId(null);
  }, []);

  const requestConfirm = useCallback((cfg: ConfirmConfig) => setConfirm(cfg), []);
  const closeConfirm = useCallback(() => setConfirm(null), []);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 1800);
  }, []);

  const value: AppContextValue = {
    city,
    cities,
    cityId,
    setCity,
    frameH,
    sortMode,
    setSortMode,
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
