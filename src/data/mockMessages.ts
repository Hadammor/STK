import type { Event } from '../types/Event';
import type { Message } from '../types/Message';

// Build a conversation thread for any event:
//   1. a rich "event-card" first message
//   2. one plain "update" bubble per Update on the event
//   3. a closing "system" notice
// The featured thread (below) is the curated showcase, but every event gets a
// coherent thread so any drawer row opens into a real conversation.
export function buildThread(event: Event): Message[] {
  const messages: Message[] = [
    {
      id: `${event.id}_card`,
      eventId: event.id,
      kind: 'event-card',
      timestamp: event.firstReportTime,
    },
  ];

  for (const update of event.updates) {
    messages.push({
      id: `${event.id}_${update.id}`,
      eventId: event.id,
      kind: 'update',
      text: update.content,
      timestamp: update.timestamp,
    });
  }

  messages.push({
    id: `${event.id}_system`,
    eventId: event.id,
    kind: 'system',
    text: "You're getting this because it's within 1 km of you. Reply here — our duty team is monitoring this thread.",
    timestamp: event.latestUpdateTime,
  });

  return messages;
}

// Canned quick replies shown at the bottom of every thread.
export const quickReplies = ['I’m safe', 'I need help', 'Share live location'] as const;
export type QuickReply = (typeof quickReplies)[number];
