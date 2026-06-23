import { Crosshair } from 'lucide-react';
import { FRAME_H, DRAWER_SNAP } from '../styles/tokens';

// White circular "recenter / locate me" button, bottom-left above the drawer.
export function RecenterButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Recenter map"
      className="pointer-events-auto absolute left-4 flex h-12 w-12 items-center justify-center rounded-full border border-hair bg-white text-ink transition-transform active:scale-95 active:bg-surface"
      style={{ bottom: FRAME_H * DRAWER_SNAP.peek + 16 }}
    >
      <Crosshair size={22} strokeWidth={2} />
    </button>
  );
}
