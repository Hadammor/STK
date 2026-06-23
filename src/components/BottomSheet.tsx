import { AnimatePresence, motion, useDragControls, type PanInfo } from 'framer-motion';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { FRAME_H } from '../styles/tokens';

const SPRING = { type: 'spring' as const, stiffness: 320, damping: 32 };

// Reusable slide-up bottom sheet with dimmed backdrop + drag-to-close.
// Drag is started from the header so the body scrolls independently.
export function BottomSheet({
  open,
  onClose,
  heightPct,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  heightPct: number;
  title: string;
  children: ReactNode;
}) {
  const controls = useDragControls();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <button
            type="button"
            aria-label="Dismiss"
            onClick={onClose}
            className="absolute inset-0 bg-black/40"
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 flex flex-col rounded-t-2xl border-t border-hair bg-white"
            style={{ height: FRAME_H * heightPct }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={SPRING}
            drag="y"
            dragListener={false}
            dragControls={controls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(_e: unknown, info: PanInfo) => {
              if (info.offset.y > 110 || info.velocity.y > 600) onClose();
            }}
          >
            <div
              className="shrink-0 cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => controls.start(e)}
            >
              <div className="mx-auto mt-2 h-1 w-10 rounded-pill bg-hair" />
              <div className="flex items-center justify-between px-5 pb-1 pt-3">
                <h2 className="text-title font-bold tracking-title text-ink">
                  {title}
                </h2>
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
            <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-7 pt-1">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
