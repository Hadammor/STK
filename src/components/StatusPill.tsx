import { Navigation } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { accent } from '../styles/tokens';

// Top-center trust signal: solid-green "Active" pill with a location arrow + live dot.
// Tappable but a no-op for the demo.
export function StatusPill() {
  const { showToast } = useApp();
  return (
    <button
      type="button"
      onClick={() => showToast('Status: Active — demo')}
      className="pointer-events-auto flex items-center gap-2 rounded-pill px-3.5 py-2 text-caption font-semibold text-white transition-transform active:scale-95"
      style={{ backgroundColor: accent.active }}
    >
      <Navigation size={14} fill="currentColor" strokeWidth={0} />
      Active
      <span className="h-1.5 w-1.5 rounded-full bg-white" />
    </button>
  );
}
