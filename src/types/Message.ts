// Message type for the Event Thread (chat) view. Follows product-modules.md §6.

// 'event-card'  — the rich first message (title + mini map + description + action + source)
// 'update'      — a plain system update bubble
// 'system'      — the "you're getting this because…" notice
// 'user'        — a message the traveler sent (canned quick-reply or typed text)
export type MessageKind = 'event-card' | 'update' | 'system' | 'user';

export interface Message {
  id: string;
  eventId: string;
  kind: MessageKind;
  text?: string;
  timestamp: Date;
}
