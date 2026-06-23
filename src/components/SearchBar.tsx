import { useState } from 'react';
import { Search, X, MapPin, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

// Search field. Tapping it opens an input with city suggestions; free text is
// supported but only ever resolves to cities (demonstrative — it doesn't move
// the map for arbitrary text).
export function SearchBar() {
  const { cities, cityId, setCity, showToast } = useApp();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const matches = q
    ? cities.filter((c) => c.label.toLowerCase().includes(q))
    : cities;
  const showFreeText =
    q.length > 0 && !cities.some((c) => c.label.toLowerCase() === q);

  function close() {
    setOpen(false);
    setQuery('');
  }

  return (
    <div className="pointer-events-auto relative flex-1">
      {open ? (
        <div className="flex h-11 w-full items-center gap-2.5 rounded-pill border border-hair bg-white px-4">
          <Search size={18} className="shrink-0 text-ink3" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search address or city…"
            className="h-full min-w-0 flex-1 select-text bg-transparent text-body text-ink outline-none placeholder:text-ink3"
          />
          <button
            type="button"
            aria-label="Close search"
            onClick={close}
            className="shrink-0 text-ink3 active:text-ink"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          aria-label="Search address or city"
          onClick={() => setOpen(true)}
          className="flex h-11 w-full items-center gap-2.5 rounded-pill border border-hair bg-white px-4 text-left transition-transform active:scale-[0.99]"
        >
          <Search size={18} className="text-ink3" />
          <span className="truncate text-body text-ink3">
            Search address or city…
          </span>
        </button>
      )}

      {open && (
        <>
          <button
            type="button"
            aria-label="Dismiss search"
            onClick={close}
            className="fixed inset-0 z-0 cursor-default"
          />
          <div className="absolute left-0 right-0 z-10 mt-2 overflow-hidden rounded-xl border border-hair bg-white">
            <p className="px-4 pb-1 pt-3 text-micro font-semibold uppercase text-ink3">
              {q ? 'Results' : 'Suggested cities'}
            </p>

            {matches.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-label={`Switch to ${c.label}`}
                onClick={() => {
                  setCity(c.id);
                  close();
                }}
                className="flex w-full items-center justify-between border-t border-hair px-4 py-3 text-left active:bg-surface"
              >
                <span className="flex items-center gap-3">
                  <MapPin size={18} className="text-ink3" />
                  <span className="text-body text-ink">{c.label}</span>
                </span>
                {c.id === cityId && <Check size={16} className="text-ink2" />}
              </button>
            ))}

            {showFreeText && (
              <button
                type="button"
                onClick={() => showToast('Demo — search shows cities only')}
                className="flex w-full items-center gap-3 border-t border-hair px-4 py-3 text-left active:bg-surface"
              >
                <MapPin size={18} className="text-ink3" />
                <span className="min-w-0">
                  <span className="block truncate text-body text-ink">
                    “{query.trim()}”
                  </span>
                  <span className="block text-caption text-ink3">
                    City · search demo
                  </span>
                </span>
              </button>
            )}

            {matches.length === 0 && !showFreeText && (
              <p className="border-t border-hair px-4 py-3 text-body text-ink3">
                No matching city
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
