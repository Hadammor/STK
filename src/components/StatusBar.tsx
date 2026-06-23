// Faux iOS status bar — time + signal/wifi/battery — so the frame reads as a
// real iOS app. Purely cosmetic; sits over the top of the map.
export function StatusBar() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex h-9 items-center justify-between px-6 text-ink">
      <span className="text-[15px] font-semibold tracking-tight">9:41</span>

      <div className="flex items-center gap-1.5">
        {/* signal bars */}
        <div className="flex items-end gap-[2px]">
          {[5, 7, 9, 11].map((h, i) => (
            <span
              key={i}
              className="w-[3px] rounded-[1px] bg-ink"
              style={{ height: h }}
            />
          ))}
        </div>

        {/* wifi */}
        <svg viewBox="0 0 16 16" width="15" height="15" fill="#000" aria-hidden>
          <path d="M8 12.6a1.15 1.15 0 100-2.3 1.15 1.15 0 000 2.3z" />
          <path d="M8 8.9c1.04 0 1.99.42 2.69 1.1l-.92.95A2.55 2.55 0 008 10.2c-.7 0-1.34.29-1.77.75l-.92-.95A3.9 3.9 0 018 8.9z" />
          <path d="M8 6c1.9 0 3.62.77 4.86 2.01l-.9.93A5.6 5.6 0 008 7.3a5.6 5.6 0 00-3.96 1.64l-.9-.93A6.86 6.86 0 018 6z" />
        </svg>

        {/* battery */}
        <div className="flex items-center gap-[2px]">
          <div className="relative h-[12px] w-[24px] rounded-[3px] border border-ink/40">
            <div className="absolute bottom-[2px] left-[2px] top-[2px] w-[15px] rounded-[1px] bg-ink" />
          </div>
          <div className="h-[4px] w-[2px] rounded-r-[1px] bg-ink/40" />
        </div>
      </div>
    </div>
  );
}
