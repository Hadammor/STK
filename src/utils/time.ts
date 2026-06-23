// Small date helpers for building relative mock timestamps and rendering them.

const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

export const minsAgo = (n: number): Date => new Date(Date.now() - n * MIN);
export const hoursAgo = (n: number): Date => new Date(Date.now() - n * HOUR);
export const daysFromNow = (n: number): Date => new Date(Date.now() + n * DAY);

// "14 min ago", "3h ago", "in 2 days", "just now"
export function formatRelative(date: Date): string {
  const diff = date.getTime() - Date.now();
  const abs = Math.abs(diff);
  const future = diff > 0;

  if (abs < MIN) return 'just now';

  let value: number;
  let unit: string;
  if (abs < HOUR) {
    value = Math.round(abs / MIN);
    unit = 'min';
  } else if (abs < DAY) {
    value = Math.round(abs / HOUR);
    unit = 'h';
  } else {
    value = Math.round(abs / DAY);
    unit = value === 1 ? 'day' : 'days';
  }

  if (future) {
    return unit === 'min' || unit === 'h'
      ? `in ${value}${unit === 'min' ? ' min' : 'h'}`
      : `in ${value} ${unit}`;
  }
  return unit === 'day' || unit === 'days'
    ? `${value} ${unit} ago`
    : `${value}${unit === 'min' ? ' min' : 'h'} ago`;
}

// "14:32" — 24h clock, used inside the thread.
export function formatClock(date: Date): string {
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// "Today · 14:32" — used in the rich card when/where row.
export function formatWhen(date: Date): string {
  return `Today · ${formatClock(date)}`;
}
