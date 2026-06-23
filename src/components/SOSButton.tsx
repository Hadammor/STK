import { ShieldPlus } from 'lucide-react';
import { FRAME_H, DRAWER_SNAP, accent } from '../styles/tokens';
import { useApp } from '../context/AppContext';

// Red "SOS" pill, bottom-right above the peeked drawer. Opens the SOS sheet.
// (The one deliberate red glow in the app — per the new design.)
export function SOSButton() {
  const { openSOS } = useApp();
  return (
    <button
      type="button"
      onClick={openSOS}
      aria-label="Emergency SOS"
      className="pointer-events-auto absolute right-4 flex items-center gap-1.5 rounded-pill px-4 py-3 text-bodylg font-bold tracking-title text-white transition-transform active:scale-95"
      style={{
        bottom: FRAME_H * DRAWER_SNAP.peek + 16,
        backgroundColor: accent.red,
        boxShadow: `0 0 22px 2px ${accent.red}66`,
      }}
    >
      <ShieldPlus size={20} strokeWidth={2.2} />
      SOS
    </button>
  );
}
