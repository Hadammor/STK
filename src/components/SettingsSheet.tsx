import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BottomSheet } from './BottomSheet';
import { mockUser } from '../data/mockUser';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 mt-6 text-micro font-semibold uppercase text-ink2">
      {children}
    </p>
  );
}

function Toggle({
  on,
  onChange,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
}) {
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

// A settings row. With `value` it reads as an info/disclosure row; with `control`
// it hosts a toggle. Tapping a disclosure row is a no-op (demo) → toast.
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
    <button type="button" onClick={onClick} className={`w-full text-left active:bg-surface ${cls}`}>
      {content}
    </button>
  );
}

export function SettingsSheet() {
  const { settingsOpen, closeSettings, showToast } = useApp();
  const [proximity, setProximity] = useState(true);
  const demo = () => showToast('Demo mode');

  return (
    <BottomSheet
      open={settingsOpen}
      onClose={closeSettings}
      heightPct={0.8}
      title="Settings"
    >
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
    </BottomSheet>
  );
}
