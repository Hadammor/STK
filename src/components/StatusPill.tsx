import { useApp } from '../context/AppContext';
import { severityTokens } from '../styles/tokens';

// Top-center trust signal: "● Active · You'll be notified".
// Pastel-green pill + readable dark-green text + green status dot (design-system pastel,
// not a saturated green). Tappable but a no-op for the demo.
export function StatusPill() {
  const { showToast } = useApp();
  const t = severityTokens.allClear;

  return (
    <button
      type="button"
      onClick={() => showToast('Status: Active — demo')}
      className="pointer-events-auto flex items-center gap-2 rounded-pill border px-3.5 py-2 text-caption font-semibold"
      style={{ backgroundColor: t.bg, color: t.text, borderColor: '#D6E6DC' }}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: t.pin }}
      />
      Active · You'll be notified
    </button>
  );
}
