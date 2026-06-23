import {
  Megaphone,
  CloudRain,
  TrainFront,
  HardHat,
  ShieldAlert,
  type LucideIcon,
} from 'lucide-react';
import type { EventType, EventStatus } from '../types/Event';

// Event-type → line icon (icons sit solid-black inside pastel pins).
export const eventIcon: Record<EventType, LucideIcon> = {
  protest: Megaphone,
  weather: CloudRain,
  transit: TrainFront,
  strike: HardHat,
  security: ShieldAlert,
};

export const eventTypeLabel: Record<EventType, string> = {
  protest: 'Protest',
  weather: 'Weather',
  transit: 'Transit',
  strike: 'Strike',
  security: 'Security',
};

export const statusLabel: Record<EventStatus, string> = {
  planned: 'Planned',
  active: 'Active',
  ongoing: 'Ongoing',
  resolved: 'Resolved',
  cancelled: 'Cancelled',
};
