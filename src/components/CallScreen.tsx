import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldPlus,
  MicOff,
  Grid3x3,
  Volume2,
  Plus,
  Video,
  User,
  Phone,
} from 'lucide-react';

const SPRING = { type: 'spring' as const, stiffness: 360, damping: 36 };

function fmt(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

const OPTIONS = [
  { Icon: MicOff, label: 'mute' },
  { Icon: Grid3x3, label: 'keypad' },
  { Icon: Volume2, label: 'speaker' },
  { Icon: Plus, label: 'add call' },
  { Icon: Video, label: 'FaceTime' },
  { Icon: User, label: 'contacts' },
];

// Simulated iOS calling screen. Tap the red end button to dismiss.
export function CallScreen({ onEnd }: { onEnd: () => void }) {
  const [connected, setConnected] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setConnected(true), 2500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!connected) return;
    const i = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(i);
  }, [connected]);

  return (
    <motion.div
      className="absolute inset-0 z-[60] flex flex-col items-center justify-between px-8 text-white"
      style={{
        background: 'linear-gradient(180deg,#4A4A4F 0%,#2A2A2E 55%,#1B1B1F 100%)',
      }}
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={SPRING}
    >
      {/* Caller */}
      <div
        className="flex flex-col items-center"
        style={{ marginTop: 'calc(env(safe-area-inset-top) + 64px)' }}
      >
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/15">
          <ShieldPlus size={46} strokeWidth={1.8} className="text-white" />
        </div>
        <p className="mt-5 text-[26px] font-semibold tracking-title">
          GardaWorld Security
        </p>
        <p className="mt-1 text-bodylg text-white/70">
          {connected ? fmt(seconds) : 'calling…'}
        </p>
      </div>

      {/* Controls */}
      <div
        className="w-full max-w-[300px]"
        style={{ marginBottom: 'calc(env(safe-area-inset-bottom) + 40px)' }}
      >
        <div className="grid grid-cols-3 gap-x-8 gap-y-6">
          {OPTIONS.map(({ Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                <Icon size={26} strokeWidth={1.8} className="text-white" />
              </span>
              <span className="text-micro lowercase text-white/80">{label}</span>
            </div>
          ))}
        </div>

        <div className="mt-9 flex justify-center">
          <button
            type="button"
            onClick={onEnd}
            aria-label="End call"
            className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#FF3B30] transition-transform active:scale-95"
          >
            <Phone
              size={30}
              className="text-white"
              fill="currentColor"
              strokeWidth={0}
              style={{ transform: 'rotate(135deg)' }}
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
