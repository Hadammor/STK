import { useCallback, useState } from 'react';

// The bottom drawer's three snap states (Google-Maps style).
export type DrawerState = 'peek' | 'expanded' | 'fullscreen';

// Discrete state machine for the drawer. The pixel/snap math lives in Drawer.tsx
// (it needs the measured frame height); this just owns the named state.
export function useDrawer(initial: DrawerState = 'peek') {
  const [state, setState] = useState<DrawerState>(initial);

  // Bump up one level toward expanded — used when a pin tap needs the list visible.
  const expand = useCallback(
    () => setState((s) => (s === 'peek' ? 'expanded' : s)),
    [],
  );
  const collapse = useCallback(() => setState('peek'), []);

  return { state, setState, expand, collapse };
}
