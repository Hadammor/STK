import type { Severity } from '../types/Event';
import { severityTokens } from '../styles/tokens';

const copy: Record<Severity, string> = {
  allClear: 'All clear',
  low: 'Low',
  moderate: 'Moderate',
  high: 'High',
  critical: 'Critical',
};

// Pastel severity badge: pastel bg + darker readable text from the token table.
export function SeverityPill({
  severity,
  label,
}: {
  severity: Severity;
  label?: string;
}) {
  const t = severityTokens[severity];
  return (
    <span
      className="inline-flex items-center rounded-pill px-3 py-1 text-micro font-semibold uppercase"
      style={{ backgroundColor: t.bg, color: t.text }}
    >
      {label ?? copy[severity]}
    </span>
  );
}
