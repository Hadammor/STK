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
import { colors } from '../styles/tokens';
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

  function handleNeedHelp() {
    requestConfirm({
      title: 'Send your location?',
      body: 'This will share your location with GardaWorld Security.',
      confirmLabel: 'Send',
      onConfirm: () => setHelpRequested(true),
    });
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
    <BottomSheet open={sosOpen} onClose={handleClose} heightPct={0.85} title="Emergency">
      {/* Hero — the only red in the app */}
      {helpRequested ? (
        <div
          className="flex h-[72px] w-full items-center justify-center gap-2 rounded-xl px-4 text-center"
          style={{ backgroundColor: colors.pillAllClear.bg, color: colors.pillAllClear.text }}
        >
          <Check size={20} />
          <span className="text-body font-semibold">
            Help is aware. Stay where you are if safe.
          </span>
        </div>
      ) : (
        <>
          <button
            type="button"
            aria-label="I need help"
            onClick={handleNeedHelp}
            className="h-[72px] w-full rounded-xl text-[18px] font-semibold text-white active:opacity-90"
            style={{ backgroundColor: colors.emergency }}
          >
            I need help
          </button>
          <p className="mt-2 text-caption text-ink2">
            Sends your location to GardaWorld Security.
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
              className="flex flex-col items-center gap-1.5 rounded-lg border border-hair bg-white py-3 active:bg-surface"
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
