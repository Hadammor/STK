// Design system tokens — mirrors tailwind.config.js. Keep the two in sync.
// Source of truth for colors used outside Tailwind (e.g. Mapbox markers, inline styles).

export const colors = {
  bg: '#FFFFFF',
  surface: '#F7F7F8',
  border: '#EAEAEB',
  textPrimary: '#000000',
  textSecondary: '#6B6B70',
  textTertiary: '#9A9AA0',

  // Pastel severity (pill backgrounds + map pin fills)
  pillAllClear: { bg: '#E8F2EC', text: '#2D6A4F', pin: '#5FB97D' },
  pillLow: { bg: '#EAF1F8', text: '#3F6B96', pin: '#9EC1E4' },
  pillModerate: { bg: '#FBF1DC', text: '#8A6B2A', pin: '#F4D78F' },
  pillHigh: { bg: '#FBE3D9', text: '#A14A2E', pin: '#F2A593' },
  pillCritical: { bg: '#F4D5D2', text: '#8B2F2F', pin: '#D88A87' },

  // Reserved
  emergency: '#D85A4A', // ONLY the "I need help" hero button
} as const;

export const radii = { sm: 8, md: 12, lg: 14, xl: 16, pill: 999 } as const;

import type { Severity } from '../types/Event';

// Per-severity token bundle, keyed by the domain Severity value.
export const severityTokens: Record<
  Severity,
  { bg: string; text: string; pin: string; label: string }
> = {
  allClear: { ...colors.pillAllClear, label: 'All clear' },
  low: { ...colors.pillLow, label: 'Low' },
  moderate: { ...colors.pillModerate, label: 'Moderate' },
  high: { ...colors.pillHigh, label: 'High' },
  critical: { ...colors.pillCritical, label: 'Critical' },
};

// Tel Aviv — demo map center + default zoom.
export const MAP_CENTER: [number, number] = [34.7818, 32.0853];
export const MAP_ZOOM = 13;

// Single source of truth for the map style so swapping light <-> dark is trivial.
// Production design calls for an always-dark map; this demo uses light. (See brief §Map.)
export const MAP_STYLE = 'mapbox://styles/mapbox/light-v11';
// Swap to dark for comparison:
// export const MAP_STYLE = 'mapbox://styles/mapbox/dark-v11';

// Style id used by the Mapbox Static Images API for mini-map previews.
export const STATIC_MAP_STYLE = 'light-v11';

// Phone frame — mobile-sized in a desktop browser (iPhone 14 Pro: 393×852).
export const FRAME_W = 393;
export const FRAME_H = 852;

// Drawer snap points as a fraction of frame height (visible portion of the drawer).
export const DRAWER_SNAP = {
  peek: 0.28,
  expanded: 0.7,
  fullscreen: 0.95,
} as const;
