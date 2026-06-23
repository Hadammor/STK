import { useState } from 'react';
import { Search, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

// Top search field. For the demo, tapping it opens a "jump to city" picker
// (this is also how you switch between Tel Aviv / London / Bangkok).
export function SearchBar() {
  const { cities, cityId, setCity } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <div className="pointer-events-auto relative flex-1">
      <button
        type="button"
        aria-label="Search address or city"
        onClick={() => setOpen((o) => !o)}
        className="flex h-11 w-full items-center gap-2.5 rounded-pill border border-hair bg-white px-4 text-left transition-transform active:scale-[0.99]"
      >
        <Search size={18} className="text-ink3" />
        <span className="truncate text-body text-ink3">
          Search address or city…
        </span>
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-0 cursor-default"
          />
          <div className="absolute left-0 right-0 z-10 mt-2 overflow-hidden rounded-xl border border-hair bg-white">
            <p className="px-4 pb-1 pt-3 text-micro font-semibold uppercase text-ink3">
              Jump to city
            </p>
            {cities.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-label={`Switch to ${c.label}`}
                onClick={() => {
                  setCity(c.id);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between border-t border-hair px-4 py-3 text-left text-body text-ink active:bg-surface"
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
