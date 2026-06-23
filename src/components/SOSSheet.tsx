import { useState } from 'react';
import {
  Shield,
  Ambulance,
  Flame,
  MapPin,
  Phone,
  Clock,
  Check,
  type LucideIcon,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BottomSheet } from './BottomSheet';
import { SlideToConfirm } from './SlideToConfirm';
import { colors, accent } from '../styles/tokens';
import type { EmergencyService } from '../data/cities';

// Icon per service label — the numbers themselves come from the active city.
const serviceIcon: Record<string, LucideIcon> = {
  Police: Shield,
  Ambulance: Ambulance,
  Fire: Flame,
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 mt-6 text-micro font-semibold uppercase text-ink2">
      {children}
    </p>
  );
}

export function SOSSheet() {
  const { sosOpen, closeSOS, requestConfirm, city } = useApp();
  const [helpRequested, setHelpRequested] = useState(false);

  // Reset the hero state on every close path (X, backdrop, drag-down).
  function handleClose() {
    setHelpRequested(false);
    closeSOS();
  }

  function handleCall(service: EmergencyService) {
    requestConfirm({
      title: `Call ${service.number} (${service.label})?`,
      body: 'This is a demo — no call will be placed.',
      confirmLabel: 'Call',
      onConfirm: () => {
        /* demo: just close the modal */
      },
    });
  }

  return (
    <BottomSheet open={sosOpen} onClose={handleClose} heightPct={0.72} title="Emergency">
      {/* Hero — slide to call (deliberate; avoids accidental taps) */}
      {helpRequested ? (
        <div className="flex h-[60px] w-full items-center justify-center gap-2 rounded-2xl border border-hair bg-surface px-4 text-center">
          <Check size={20} className="text-ink" />
          <span className="text-body font-semibold text-ink">
            Calling… help is aware. Stay where you are if safe.
          </span>
        </div>
      ) : (
        <>
          <SlideToConfirm
            label="Call for help"
            color={accent.sos}
            onConfirm={() => setHelpRequested(true)}
          />
          <p className="mt-2 text-caption text-ink2">
            Slide to call. Shares your location with GardaWorld Security.
          </p>
        </>
      )}

      {/* Call now */}
      <SectionLabel>Call now</SectionLabel>
      <div className="grid grid-cols-3 gap-2">
        {city.services.map((s) => {
          const Icon = serviceIcon[s.label] ?? Shield;
          return (
            <button
              key={s.label}
              type="button"
              aria-label={`Call ${s.label}`}
              onClick={() => handleCall(s)}
              className="flex flex-col items-center gap-1.5 rounded-lg border border-hair bg-white py-3 transition-transform active:scale-95 active:bg-surface"
            >
              <span className="relative">
                <Icon size={22} strokeWidth={2} color="#000" />
                <span
                  className="absolute -right-1.5 -top-0.5 h-2 w-2 rounded-full"
                  style={{ backgroundColor: colors.pillHigh.pin }}
                />
              </span>
              <span className="text-caption font-medium text-ink">
                {s.label}
              </span>
              <span className="font-mono text-[22px] font-semibold leading-none text-ink">
                {s.number}
              </span>
            </button>
          );
        })}
      </div>

      {/* Consular / embassy contact for the active city */}
      <SectionLabel>{city.consular.label}</SectionLabel>
      <div className="divide-y divide-hair rounded-lg border border-hair bg-white">
        <div className="flex items-center gap-3 px-4 py-3">
          <MapPin size={18} className="shrink-0 text-ink2" />
          <span className="text-body text-ink">{city.consular.address}</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-3">
          <Phone size={18} className="shrink-0 text-ink2" />
          <span className="text-body text-ink">{city.consular.phone}</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-3">
          <Clock size={18} className="shrink-0 text-ink2" />
          <span className="text-body text-ink">{city.consular.hours}</span>
        </div>
      </div>
    </BottomSheet>
  );
}
