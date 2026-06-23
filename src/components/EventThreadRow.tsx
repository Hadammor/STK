import type { Event } from '../types/Event';
import { severityTokens } from '../styles/tokens';
import { eventIcon } from '../utils/eventVisuals';
import { formatRelative } from '../utils/time';

interface Props {
  event: Event;
  highlighted: boolean;
  onClick: () => void;
}

// A single event-thread row inside the drawer.
export function EventThreadRow({ event, highlighted, onClick }: Props) {
  const t = severityTokens[event.severity];
  const Icon = eventIcon[event.type];
  const preview =
    event.updates.length > 0
      ? event.updates[event.updates.length - 1].content
      : event.description;

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex w-full items-center gap-3 rounded-md px-3 py-3 text-left transition-colors active:bg-surface"
      style={{ backgroundColor: highlighted ? t.bg : 'transparent' }}
    >
      {/* 3px severity stripe */}
      <span
        className="absolute left-0 top-2 bottom-2 w-[3px] rounded-pill"
        style={{ backgroundColor: t.pin }}
      />

      {/* Severity circle with event-type icon */}
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: t.pin }}
      >
        <Icon size={16} strokeWidth={2} color="#000" />
      </span>

      {/* Title + preview */}
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-body font-semibold tracking-title text-ink">
            {event.title}
          </span>
          {event.unread && (
            <span className="h-2 w-2 shrink-0 rounded-full bg-emergency" />
          )}
        </span>
        <span className="mt-0.5 block truncate text-caption italic text-ink2">
          {preview}
        </span>
      </span>

      {/* Relative time */}
      <span className="shrink-0 self-start pt-0.5 text-micro font-medium text-ink3">
        {formatRelative(event.latestUpdateTime)}
      </span>
    </button>
  );
}
