import { Crosshair } from 'lucide-react';

// White circular "recenter / locate me" button (positioned by its parent).
export function RecenterButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Recenter map"
      className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-hair bg-white text-ink shadow-[0_4px_14px_rgba(0,0,0,0.10)] transition-transform active:scale-95 active:bg-surface"
    >
      <Crosshair size={22} strokeWidth={2} />
    </button>
  );
}
