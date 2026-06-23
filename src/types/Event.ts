// Event domain type. Field names follow product-modules.md (§1 Event, §2 Update).

export type Severity = 'allClear' | 'low' | 'moderate' | 'high' | 'critical';

export type EventType =
  | 'protest'
  | 'weather'
  | 'transit'
  | 'strike'
  | 'security';

export type EventStatus =
  | 'planned'
  | 'active'
  | 'ongoing'
  | 'resolved'
  | 'cancelled';

// A new piece of information about an existing Event (product-modules.md §2).
export interface Update {
  id: string;
  content: string;
  source: string;
  timestamp: Date;
  reportedBy: 'system' | 'operator' | 'user';
}

export interface Event {
  id: string;
  type: EventType;
  severity: Severity;
  title: string;
  description: string;
  recommendedAction: string;
  source: string;

  // Location — lat/lng + a human area name.
  lat: number;
  lng: number;
  area: string;

  status: EventStatus;
  firstReportTime: Date;
  latestUpdateTime: Date;
  unread: boolean;

  updates: Update[];
}
