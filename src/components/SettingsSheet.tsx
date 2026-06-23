import { useState } from 'react';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BottomSheet } from './BottomSheet';
import { mockUser } from '../data/mockUser';

// Threat categories the traveler can opt in/out of.
const THREAT_TYPES = [
  'Protests & demonstrations',
  'Pro-Palestine',
  'Strikes & labor action',
  'Severe weather',
  'Transit disruption',
  'Crime & theft',
  'Terrorism & security',
  'Civil unrest',
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 mt-6 text-micro font-semibold uppercase text-ink2">
      {children}
    </p>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="relative h-[30px] w-[50px] rounded-pill transition-colors"
      style={{ backgroundColor: on ? '#000000' : '#D8D8DC' }}
    >
      <span
        className="absolute top-[3px] h-6 w-6 rounded-full bg-white transition-all"
        style={{ left: on ? 23 : 3 }}
      />
    </button>
  );
}

function Row({
  label,
  value,
  control,
  onClick,
  last,
}: {
  label: string;
  value?: string;
  control?: React.ReactNode;
  onClick?: () => void;
  last?: boolean;
}) {
  const content = (
    <>
      <span className="text-body text-ink">{label}</span>
      <span className="flex items-center gap-2">
        {value && <span className="text-body text-ink2">{value}</span>}
        {control}
        {!control && <ChevronRight size={18} className="text-ink3" />}
      </span>
    </>
  );

  const cls = `flex items-center justify-between px-4 py-3 ${
    last ? '' : 'border-b border-hair'
  }`;

  if (control) {
    return <div className={cls}>{content}</div>;
  }
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`w-full text-left active:bg-surface ${cls}`}
    >
      {content}
    </button>
  );
}

// Checkbox row for the threat-type list.
function CheckRow({
  label,
  checked,
  onToggle,
  last,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
  last?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex w-full items-center justify-between px-4 py-3 text-left active:bg-surface ${
        last ? '' : 'border-b border-hair'
      }`}
    >
      <span className="text-body text-ink">{label}</span>
      <span
        className="flex h-[22px] w-[22px] items-center justify-center rounded-md border transition-colors"
        style={{
          backgroundColor: checked ? '#000000' : 'transparent',
          borderColor: checked ? '#000000' : '#C9C9CE',
        }}
      >
        {checked && <Check size={15} className="text-white" strokeWidth={3} />}
      </span>
    </button>
  );
}

export function SettingsSheet() {
  const { settingsOpen, closeSettings, showToast } = useApp();
  const [proximity, setProximity] = useState(true);
  const [view, setView] = useState<'main' | 'threats'>('main');
  const [threats, setThreats] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(THREAT_TYPES.map((t) => [t, true])),
  );
  const demo = () => showToast('Demo mode');

  const enabledCount = Object.values(threats).filter(Boolean).length;

  // Reset to the main view on every close path.
  function handleClose() {
    setView('main');
    closeSettings();
  }

  return (
    <BottomSheet
      open={settingsOpen}
      onClose={handleClose}
      heightPct={0.8}
      title="Settings"
    >
      {view === 'threats' ? (
        <>
          <button
            type="button"
            onClick={() => setView('main')}
            className="-ml-1 flex items-center gap-0.5 text-body font-medium text-ink active:opacity-60"
          >
            <ChevronLeft size={20} /> Settings
          </button>
          <h3 className="mt-2 text-title font-bold tracking-title text-ink">
            Threat type
          </h3>
          <p className="mb-3 mt-1 text-caption text-ink2">
            Choose which threats you want to be alerted about.
          </p>
          <div className="rounded-lg border border-hair bg-white">
            {THREAT_TYPES.map((t, i) => (
              <CheckRow
                key={t}
                label={t}
                checked={threats[t]}
                onToggle={() =>
                  setThreats((prev) => ({ ...prev, [t]: !prev[t] }))
                }
                last={i === THREAT_TYPES.length - 1}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Profile card */}
          <div className="flex items-center gap-3 rounded-lg border border-hair bg-white p-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-body font-semibold text-white">
              {mockUser.initials}
            </span>
            <div className="min-w-0">
              <p className="text-bodylg font-semibold tracking-title text-ink">
                {mockUser.name}
              </p>
              <p className="truncate text-caption text-ink2">{mockUser.email}</p>
              <p className="truncate text-caption text-ink3">
                {mockUser.organization}
              </p>
            </div>
          </div>

          <SectionLabel>Notifications</SectionLabel>
          <div className="rounded-lg border border-hair bg-white">
            <Row
              label="Proximity alerts"
              control={<Toggle on={proximity} onChange={setProximity} />}
            />
            <Row
              label="Threat type"
              value={enabledCount === THREAT_TYPES.length ? 'All' : `${enabledCount} of ${THREAT_TYPES.length}`}
              onClick={() => setView('threats')}
              last
            />
          </div>

          <SectionLabel>Location &amp; data</SectionLabel>
          <div className="rounded-lg border border-hair bg-white">
            <Row label="Location access" value="While using" onClick={demo} />
            <Row label="Language" value="English" onClick={demo} last />
          </div>

          <SectionLabel>Account</SectionLabel>
          <div className="rounded-lg border border-hair bg-white">
            <Row label="Saved destinations" value="4" onClick={demo} />
            <Row label="Sign out" onClick={demo} last />
          </div>

          <SectionLabel>About</SectionLabel>
          <div className="rounded-lg border border-hair bg-white">
            <Row label="Share this app" onClick={demo} />
            <Row label="Privacy policy" onClick={demo} />
            <Row label="Terms of service" onClick={demo} last />
          </div>
        </>
      )}
    </BottomSheet>
  );
}
