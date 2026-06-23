import { useEffect, useRef, useState } from 'react';
import {
  animate,
  motion,
  useDragControls,
  useMotionValue,
  type PanInfo,
} from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { useApp, SORT_LABELS, type SortMode } from '../context/AppContext';
import { EventThreadRow } from './EventThreadRow';
import { DRAWER_PEEK_PX as PEEK_PX } from '../styles/tokens';
import type { DrawerState } from '../hooks/useDrawer';

const SPRING = { type: 'spring' as const, stiffness: 400, damping: 38 };

export function Drawer() {
  const {
    events,
    drawerState,
    setDrawerState,
    openThread,
    highlightedEventId,
    clearHighlight,
    frameH,
    sortMode,
    setSortMode,
  } = useApp();

  // Snap geometry derived from the live viewport height.
  const FULL_PX = frameH * 0.95;
  const snapY: Record<DrawerState, number> = {
    fullscreen: 0,
    expanded: FULL_PX - frameH * 0.62,
    peek: FULL_PX - PEEK_PX,
  };

  const y = useMotionValue(snapY.peek);
  const controls = useDragControls();
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [sortOpen, setSortOpen] = useState(false);

  const cycle = () => {
    setDrawerState(
      drawerState === 'peek'
        ? 'expanded'
        : drawerState === 'expanded'
          ? 'fullscreen'
          : 'peek',
    );
  };

  // Animate to the active snap when the state (or viewport height) changes.
  useEffect(() => {
    if (draggingRef.current) return;
    const anim = animate(y, snapY[drawerState], SPRING);
    return () => anim.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerState, frameH]);

  // When a pin bumps a row to the top, scroll the list up to reveal it.
  useEffect(() => {
    if (highlightedEventId && scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [highlightedEventId]);

  function handleDragEnd(_e: unknown, info: PanInfo) {
    draggingRef.current = false;
    const projected = y.get() + info.velocity.y * 0.2;
    const candidates: DrawerState[] = ['fullscreen', 'expanded', 'peek'];
    let best: DrawerState = 'peek';
    for (const c of candidates) {
      if (Math.abs(snapY[c] - projected) < Math.abs(snapY[best] - projected)) {
        best = c;
      }
    }
    animate(y, snapY[best], SPRING);
    setDrawerState(best);
  }

  return (
    <motion.div
      className="absolute inset-x-0 bottom-0 z-30 flex touch-none flex-col rounded-t-2xl bg-white"
      style={{
        y,
        height: FULL_PX,
        boxShadow: '0 -10px 30px rgba(0,0,0,0.16)',
      }}
      drag="y"
      dragListener={false}
      dragControls={controls}
      dragConstraints={{ top: snapY.fullscreen, bottom: snapY.peek }}
      dragElastic={0.04}
      onDragStart={() => {
        draggingRef.current = true;
        movedRef.current = true;
      }}
      onDragEnd={handleDragEnd}
    >
      {/* Drag region: grabber + sort row. Drag/tap here to expand; the sort
          control stops propagation so it doesn't trigger a drag/expand. */}
      <div
        className="shrink-0 cursor-grab px-5 pt-2.5 active:cursor-grabbing"
        onPointerDown={(e) => {
          movedRef.current = false;
          controls.start(e);
        }}
        onClick={() => {
          if (movedRef.current) {
            movedRef.current = false;
            return;
          }
          cycle();
        }}
      >
        <div className="mx-auto h-1 w-10 rounded-pill bg-hair" />

        <div className="relative mt-2.5 flex items-center">
          <button
            type="button"
            aria-label="Sort events"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              setSortOpen((o) => !o);
            }}
            className="flex items-center gap-1 text-bodylg font-semibold tracking-title text-ink active:opacity-60"
          >
            {SORT_LABELS[sortMode]}
            <ChevronDown size={18} className="text-ink3" />
          </button>

          {sortOpen && (
            <>
              <button
                type="button"
                aria-label="Dismiss sort"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  setSortOpen(false);
                }}
                className="fixed inset-0 z-0 cursor-default"
              />
              <div className="absolute left-0 top-8 z-10 w-52 overflow-hidden rounded-xl border border-hair bg-white">
                {(Object.keys(SORT_LABELS) as SortMode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    aria-label={SORT_LABELS[m]}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSortMode(m);
                      setSortOpen(false);
                    }}
                    className="flex w-full items-center justify-between border-b border-hair px-4 py-3 text-left text-body text-ink last:border-b-0 active:bg-surface"
                  >
                    {SORT_LABELS[m]}
                    {m === sortMode && <Check size={16} />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Scrollable list */}
      <div
        ref={scrollRef}
        className="no-scrollbar mt-1 flex-1 overflow-y-auto overscroll-contain px-5 pb-6"
      >
        <div className="flex flex-col divide-y divide-hair">
          {events.map((event) => (
            <EventThreadRow
              key={event.id}
              event={event}
              highlighted={highlightedEventId === event.id}
              onClick={() => {
                clearHighlight();
                openThread(event.id);
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
