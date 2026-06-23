import { ChevronRight } from 'lucide-react';
import type { Event } from '../types/Event';
import { severityVivid } from '../styles/tokens';
import { eventIcon } from '../utils/eventVisuals';
import { formatRelative } from '../utils/time';

interface Props {
  event: Event;
  highlighted: boolean;
  onClick: () => void;
}

// iOS-style list row: solid vivid icon circle (white glyph), title, "place · time", chevron.
export function EventThreadRow({ event, highlighted, onClick }: Props) {
  const color = severityVivid[event.severity];
  const Icon = eventIcon[event.type];

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg py-3 text-left transition-colors active:bg-surface"
      style={{ backgroundColor: highlighted ? '#F7F7F8' : 'transparent' }}
    >
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: color }}
      >
        <Icon size={20} strokeWidth={2.2} color="#fff" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-bodylg font-semibold tracking-title text-ink">
          {event.title}
        </span>
        <span className="mt-0.5 block truncate text-caption text-ink2">
          {event.area} · {formatRelative(event.latestUpdateTime)}
        </span>
      </span>

      {event.unread && (
        <span className="h-2 w-2 shrink-0 rounded-full bg-emergency" />
      )}
      <ChevronRight size={18} className="shrink-0 text-ink3" />
    </button>
  );
}
