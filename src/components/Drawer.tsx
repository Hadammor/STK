import { useEffect, useRef } from 'react';
import {
  animate,
  motion,
  useDragControls,
  useMotionValue,
  type PanInfo,
} from 'framer-motion';
import { useApp } from '../context/AppContext';
import { FRAME_H, DRAWER_SNAP } from '../styles/tokens';
import { EventThreadRow } from './EventThreadRow';
import { formatRelative } from '../utils/time';
import type { DrawerState } from '../hooks/useDrawer';

// Visible drawer height (px) for each snap state.
const FULL_PX = FRAME_H * DRAWER_SNAP.fullscreen; // total panel height
const snapY: Record<DrawerState, number> = {
  fullscreen: 0, // panel top at 5% from the top of the frame
  expanded: FRAME_H * (DRAWER_SNAP.fullscreen - DRAWER_SNAP.expanded),
  peek: FRAME_H * (DRAWER_SNAP.fullscreen - DRAWER_SNAP.peek),
};

// iOS-like sheet spring: snappy, settles cleanly without bounce.
const SPRING = { type: 'spring' as const, stiffness: 400, damping: 38 };

export function Drawer() {
  const {
    events,
    drawerState,
    setDrawerState,
    openThread,
    highlightedEventId,
    clearHighlight,
  } = useApp();

  const y = useMotionValue(snapY.peek);
  const controls = useDragControls();
  const draggingRef = useRef(false);
  const movedRef = useRef(false); // did the current gesture become a drag?
  const scrollRef = useRef<HTMLDivElement>(null);

  // Tapping the handle advances the snap state (complements dragging).
  const cycle = () => {
    setDrawerState(
      drawerState === 'peek'
        ? 'expanded'
        : drawerState === 'expanded'
          ? 'fullscreen'
          : 'peek',
    );
  };

  // Animate to the active snap whenever drawerState changes externally
  // (e.g. a pin tap expands the drawer). Skipped while the user is dragging.
  useEffect(() => {
    if (draggingRef.current) return;
    const anim = animate(y, snapY[drawerState], SPRING);
    return () => anim.stop();
  }, [drawerState, y]);

  // When a pin highlights a row, the row is bumped to the top — scroll there.
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

  const lastUpdated = events.reduce(
    (acc, e) => (e.latestUpdateTime > acc ? e.latestUpdateTime : acc),
    events[0].latestUpdateTime,
  );

  return (
    <motion.div
      className="absolute inset-x-0 bottom-0 z-30 flex touch-none flex-col rounded-t-2xl border-t border-hair bg-white"
      style={{ y, height: FULL_PX }}
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
      {/* Drag region: handle + header (pointer-down starts the drag) */}
      <div
        className="shrink-0 cursor-grab px-5 pt-2.5 active:cursor-grabbing"
        onPointerDown={(e) => {
          movedRef.current = false;
          controls.start(e);
        }}
        onClick={() => {
          // A click that wasn't part of a drag is a tap → advance the snap state.
          if (movedRef.current) {
            movedRef.current = false;
            return;
          }
          cycle();
        }}
      >
        <div className="mx-auto h-1 w-10 rounded-pill bg-hair" />
        <div className="mt-3 flex items-baseline justify-between">
          <h2 className="text-title font-bold tracking-title text-ink">
            Around you
          </h2>
        </div>
        <p className="mt-0.5 text-caption text-ink2">
          {events.length} events · updated {formatRelative(lastUpdated)}
        </p>
      </div>

      {/* Scrollable thread list */}
      <div
        ref={scrollRef}
        className="no-scrollbar mt-2 flex-1 overflow-y-auto overscroll-contain px-3 pb-6"
      >
        <div className="flex flex-col gap-1">
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
