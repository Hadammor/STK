import { Navigation } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { accent } from '../styles/tokens';
import { PulseDot } from './PulseDot';

// Top-center trust signal: dark "Active" pill with a location arrow + live pulse.
// Tappable but a no-op for the demo.
export function StatusPill() {
  const { showToast } = useApp();
  return (
    <button
      type="button"
      onClick={() => showToast('Status: Active — demo')}
      className="pointer-events-auto flex items-center gap-1.5 rounded-pill py-2 pl-3.5 pr-2 text-caption font-semibold text-white transition-transform active:scale-95"
      style={{ backgroundColor: accent.active }}
    >
      <Navigation size={14} fill="currentColor" strokeWidth={0} />
      Active
      <PulseDot size={20} />
    </button>
  );
}
