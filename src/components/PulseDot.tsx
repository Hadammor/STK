import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import pulse from '../assets/pulse-white.json';

// Looping white "pulse" Lottie used as the live indicator in the Active pill.
export function PulseDot({ size = 20 }: { size?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const anim = lottie.loadAnimation({
      container: ref.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: pulse,
    });
    return () => anim.destroy();
  }, []);

  return (
    <div
      ref={ref}
      style={{ width: size, height: size }}
      className="shrink-0"
      aria-hidden
    />
  );
}
