import { ShieldPlus } from 'lucide-react';
import { accent } from '../styles/tokens';
import { useApp } from '../context/AppContext';

// Red "SOS" pill, bottom-right above the peeked drawer. Opens the SOS sheet.
export function SOSButton({ bottomOffset }: { bottomOffset: number }) {
  const { openSOS } = useApp();
  return (
    <button
      type="button"
      onClick={openSOS}
      aria-label="Emergency SOS"
      className="pointer-events-auto absolute right-4 flex items-center gap-1.5 rounded-pill px-4 py-3 text-bodylg font-bold tracking-title text-white transition-transform active:scale-95"
      style={{
        bottom: bottomOffset,
        backgroundColor: accent.sos,
        boxShadow: `0 0 22px 2px ${accent.sos}66`,
      }}
    >
      <ShieldPlus size={20} strokeWidth={2.2} />
      SOS
    </button>
  );
}
