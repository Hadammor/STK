import { useState } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

// Demo control: flip the whole app between cities (map, events, emergency info).
export function CitySwitcher() {
  const { cities, cityId, setCity } = useApp();
  const [open, setOpen] = useState(false);
  const active = cities.find((c) => c.id === cityId) ?? cities[0];

  return (
    <div className="pointer-events-auto relative">
      <button
        type="button"
        aria-label="Change city"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-pill border border-hair bg-white px-3 py-2 text-caption font-semibold text-ink transition-transform active:scale-95 active:bg-surface"
      >
        <Globe size={14} className="text-ink2" />
        {active.label}
        <ChevronDown size={14} className="text-ink3" />
      </button>

      {open && (
        <>
          {/* tap-away catcher */}
          <button
            type="button"
            aria-label="Dismiss city menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-0 cursor-default"
          />
          <div className="absolute left-0 z-10 mt-1.5 w-44 overflow-hidden rounded-lg border border-hair bg-white">
            {cities.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-label={`Switch to ${c.label}`}
                onClick={() => {
                  setCity(c.id);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between border-b border-hair px-3 py-2.5 text-left text-body text-ink last:border-b-0 active:bg-surface"
              >
                {c.label}
                {c.id === cityId && <Check size={16} />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
