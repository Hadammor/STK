import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useDragControls, type PanInfo } from 'framer-motion';
import { X, Plus, Camera, Mic, ArrowUp, MapPin } from 'lucide-react';
import type { Event } from '../types/Event';
import type { Message } from '../types/Message';
import { buildThread, quickReplies } from '../data/mockMessages';
import { eventIcon, eventTypeLabel } from '../utils/eventVisuals';
import { severityTokens, STATIC_MAP_STYLE } from '../styles/tokens';
import { formatClock, formatWhen } from '../utils/time';
import { useApp } from '../context/AppContext';

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;
const hasToken = !!TOKEN && TOKEN.startsWith('pk.');

const SPRING = { type: 'spring' as const, stiffness: 400, damping: 38 };

// Mini map preview used inside the rich first card.
function MiniMap({ event }: { event: Event }) {
  const t = severityTokens[event.severity];
  if (hasToken) {
    const pin = t.pin.replace('#', '');
    const src = `https://api.mapbox.com/styles/v1/mapbox/${STATIC_MAP_STYLE}/static/pin-s+${pin}(${event.lng},${event.lat})/${event.lng},${event.lat},13.5/600x240@2x?access_token=${TOKEN}`;
    return (
      <img
        src={src}
        alt={`Map of ${event.area}`}
        className="h-[120px] w-full rounded-md border border-hair object-cover"
      />
    );
  }
  return (
    <div
      className="flex h-[120px] w-full items-center justify-center rounded-md border border-hair"
      style={{ background: 'linear-gradient(180deg,#EDEFF2,#E4E7EB)' }}
    >
      <span className="flex items-center gap-1.5 text-caption text-ink2">
        <MapPin size={16} color={t.text} /> {event.area}
      </span>
    </div>
  );
}

function RichCard({
  event,
  onShowOnMap,
}: {
  event: Event;
  onShowOnMap: () => void;
}) {
  const t = severityTokens[event.severity];
  const Icon = eventIcon[event.type];
  return (
    <div className="shrink-0 overflow-hidden rounded-xl border border-hair bg-white">
      <div className="p-4">
        {/* event type */}
        <span className="flex items-center gap-1.5 text-micro font-semibold uppercase text-ink2">
          <Icon size={14} strokeWidth={2} color="#000" />
          {eventTypeLabel[event.type]}
        </span>

        <h3 className="mt-1.5 text-title font-bold tracking-title text-ink">
          {event.title}
        </h3>
        <p className="mt-1 text-caption text-ink2">
          {formatWhen(event.firstReportTime)} · {event.area}
        </p>

        <div className="mt-3">
          <MiniMap event={event} />
        </div>

        <button
          type="button"
          onClick={onShowOnMap}
          className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-md border border-hair bg-white py-2.5 text-body font-semibold text-ink transition-transform active:scale-[0.99] active:bg-surface"
        >
          <MapPin size={16} /> Show on map
        </button>

        <p className="mt-3 text-body text-ink">{event.description}</p>

        {/* recommended action */}
        <div className="mt-3 rounded-md bg-surface p-3">
          <p className="text-micro font-semibold uppercase text-ink2">
            Recommended action
          </p>
          <div className="mt-1.5 flex gap-2">
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: t.text }}
            />
            <p className="text-body text-ink">{event.recommendedAction}</p>
          </div>
        </div>

        {/* source */}
        <p className="mt-3 text-micro font-semibold uppercase text-ink3">
          Source: {event.source} · Updated {formatClock(event.latestUpdateTime)}
        </p>
      </div>
    </div>
  );
}

function UpdateBubble({ message }: { message: Message }) {
  return (
    <div className="max-w-[85%] shrink-0 self-start rounded-lg rounded-tl-sm border border-hair bg-white px-3.5 py-2.5">
      <p className="text-body text-ink">{message.text}</p>
      <p className="mt-1 text-micro font-medium text-ink3">
        {formatClock(message.timestamp)}
      </p>
    </div>
  );
}

function UserBubble({ message }: { message: Message }) {
  return (
    <div className="max-w-[85%] shrink-0 self-end rounded-lg rounded-tr-sm bg-ink px-3.5 py-2.5">
      <p className="text-body text-white">{message.text}</p>
      <p className="mt-1 text-right text-micro font-medium text-white/60">
        {formatClock(message.timestamp)}
      </p>
    </div>
  );
}

function SystemNotice({ message }: { message: Message }) {
  return (
    <p className="shrink-0 px-6 py-1 text-center text-caption text-ink3">
      {message.text}
    </p>
  );
}

const cannedReply: Record<string, string> = {
  'I’m safe':
    'Thanks for letting us know, Adi. We’ll keep monitoring and ping you if anything changes.',
  'I need help':
    'Connecting you to the duty team now. If this is a life-threatening emergency, use the call buttons in the Help sheet.',
  'Share live location':
    'Live location shared with the duty team for the next 60 minutes. You can stop sharing anytime.',
};

export function EventThreadView({
  event,
  onClose,
}: {
  event: Event;
  onClose: () => void;
}) {
  const { selectPin } = useApp();
  const initial = useMemo(() => buildThread(event), [event]);
  const [messages, setMessages] = useState<Message[]>(initial);
  const [draft, setDraft] = useState('');
  const controls = useDragControls();

  // Close the thread and surface this event on the map (centers + bumps to top).
  function showOnMap() {
    onClose();
    selectPin(event.id);
  }
  const scrollRef = useRef<HTMLDivElement>(null);
  const seq = useRef(0);
  const initialLen = useRef(initial.length);

  // Open at the top (rich card first); only scroll to the bottom when the
  // traveler appends a new message (quick reply / typed).
  useEffect(() => {
    if (messages.length > initialLen.current) {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  function pushUser(text: string) {
    const id = `local_${seq.current++}`;
    setMessages((prev) => [
      ...prev,
      { id, eventId: event.id, kind: 'user', text, timestamp: new Date() },
    ]);
  }

  function pushSystem(text: string) {
    const id = `local_${seq.current++}`;
    setMessages((prev) => [
      ...prev,
      { id, eventId: event.id, kind: 'update', text, timestamp: new Date() },
    ]);
  }

  function handleQuickReply(reply: string) {
    pushUser(reply);
    const ack = cannedReply[reply];
    if (ack) window.setTimeout(() => pushSystem(ack), 600);
  }

  function handleSend() {
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    pushUser(text);
    window.setTimeout(
      () => pushSystem('Got it — passing this to the duty team.'),
      700,
    );
  }

  function handleDragEnd(_e: unknown, info: PanInfo) {
    if (info.offset.y > 120 || info.velocity.y > 600) onClose();
  }

  return (
    <motion.div
      className="absolute inset-0 z-40 flex flex-col bg-white"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={SPRING}
      drag="y"
      dragListener={false}
      dragControls={controls}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.5 }}
      onDragEnd={handleDragEnd}
    >
      {/* Header (drag region) — pushed down from the very top */}
      <div
        className="shrink-0 cursor-grab border-b border-hair pt-3 active:cursor-grabbing"
        onPointerDown={(e) => controls.start(e)}
      >
        <div className="mx-auto mt-1 h-1 w-10 rounded-pill bg-hair" />
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="text-bodylg font-semibold tracking-title text-ink">
              Guy
            </p>
            <p className="flex items-center gap-1.5 text-micro font-medium text-ink2">
              <span className="h-1.5 w-1.5 rounded-full bg-ink3" />
              Monitoring · replies in ~2 min
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink2 active:bg-surface"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="no-scrollbar flex flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-4 py-4"
        style={{ backgroundColor: '#FBFBFC' }}
      >
        {messages.map((m) => {
          if (m.kind === 'event-card')
            return <RichCard key={m.id} event={event} onShowOnMap={showOnMap} />;
          if (m.kind === 'system') return <SystemNotice key={m.id} message={m} />;
          if (m.kind === 'user') return <UserBubble key={m.id} message={m} />;
          return <UpdateBubble key={m.id} message={m} />;
        })}
      </div>

      {/* Quick replies */}
      <div className="no-scrollbar flex shrink-0 gap-2 overflow-x-auto px-4 pb-2 pt-1">
        {quickReplies.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => handleQuickReply(q)}
            className="shrink-0 whitespace-nowrap rounded-pill border border-hair bg-white px-4 py-2 text-caption font-medium text-ink transition-transform active:scale-95 active:bg-surface"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="flex shrink-0 items-center gap-2 border-t border-hair px-3 py-2.5">
        <button
          type="button"
          aria-label="Add"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink2 active:bg-surface"
        >
          <Plus size={22} />
        </button>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder="Message"
          className="h-9 min-w-0 flex-1 select-text rounded-pill border border-hair bg-surface px-4 text-body text-ink outline-none placeholder:text-ink3"
        />
        {draft.trim() ? (
          <button
            type="button"
            onClick={handleSend}
            aria-label="Send"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-white active:opacity-90"
          >
            <ArrowUp size={20} />
          </button>
        ) : (
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              aria-label="Camera"
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink2 active:bg-surface"
            >
              <Camera size={20} />
            </button>
            <button
              type="button"
              aria-label="Microphone"
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink2 active:bg-surface"
            >
              <Mic size={20} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
