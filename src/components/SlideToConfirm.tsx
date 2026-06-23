import { useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

// Slide-to-unlock style confirm: drag the knob to the end to fire onConfirm.
// Prevents accidental taps for a high-stakes action.
export function SlideToConfirm({
  label,
  color,
  onConfirm,
}: {
  label: string;
  color: string;
  onConfirm: () => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const firedRef = useRef(false);
  const labelOpacity = useTransform(x, [0, 130], [1, 0]);

  function handleDragEnd() {
    const track = trackRef.current;
    if (!track) return;
    const maxX = track.clientWidth - 52 - 8; // knob width + padding
    if (x.get() >= maxX * 0.9) {
      animate(x, maxX, { duration: 0.12 });
      if (!firedRef.current) {
        firedRef.current = true;
        onConfirm();
      }
    } else {
      animate(x, 0, { type: 'spring', stiffness: 600, damping: 42 });
    }
  }

  return (
    <div
      ref={trackRef}
      className="relative h-[60px] w-full overflow-hidden rounded-2xl"
      style={{ backgroundColor: color }}
    >
      <motion.span
        style={{ opacity: labelOpacity }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center pl-10 text-bodylg font-semibold text-white"
      >
        {label}
      </motion.span>

      <motion.div
        drag="x"
        dragConstraints={trackRef}
        dragElastic={0}
        dragMomentum={false}
        style={{ x }}
        onDragEnd={handleDragEnd}
        className="absolute left-1 top-1 flex h-[52px] w-[52px] cursor-grab items-center justify-center rounded-xl bg-white active:cursor-grabbing"
      >
        <ChevronRight size={26} strokeWidth={2.4} style={{ color }} />
      </motion.div>
    </div>
  );
}
