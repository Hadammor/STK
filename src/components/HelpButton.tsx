import { FRAME_H, DRAWER_SNAP } from '../styles/tokens';
import { useApp } from '../context/AppContext';

// Floating "?" button, bottom-right, hovering just above the peeked drawer.
// 56px circle, white bg, hairline border, solid black glyph. Opens the SOS sheet.
export function HelpButton() {
  const { openSOS } = useApp();
  return (
    <button
      type="button"
      onClick={openSOS}
      aria-label="Help and emergency"
      className="pointer-events-auto absolute right-4 flex h-14 w-14 items-center justify-center rounded-full border border-hair bg-white text-2xl font-semibold text-ink transition-transform active:scale-95 active:bg-surface"
      style={{ bottom: FRAME_H * DRAWER_SNAP.peek + 16 }}
    >
      ?
    </button>
  );
}
