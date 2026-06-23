import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

// Tiny transient toast for "demo mode" no-op feedback. Bottom-center, dark pill.
export function Toast() {
  const { toast } = useApp();
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-24 z-[60] flex justify-center"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.18 }}
        >
          <div className="rounded-pill bg-ink/90 px-4 py-2 text-caption font-medium text-white">
            {toast}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
