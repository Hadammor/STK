import type { Event } from '../types/Event';
import { minsAgo, hoursAgo } from '../utils/time';

// 5 events around central London with varied severity. Each has a parent record + 1–4
// updates. Order here is the "default" drawer order (most recently updated first).
export const mockEvents: Event[] = [
  {
    id: 'evt_parliament',
    type: 'protest',
    severity: 'high',
    title: 'Demonstration at Parliament Square',
    description:
      'A large demonstration has gathered at Parliament Square. Police are managing road closures around the square and Whitehall. Heavy pedestrian congestion and noise in the area.',
    recommendedAction:
      'Avoid Parliament Square and Whitehall on foot. Allow extra time and expect bus diversions nearby.',
    source: 'GardaWorld',
    lat: 51.5007,
    lng: -0.1283,
    area: 'Parliament Square',
    status: 'active',
    firstReportTime: minsAgo(40),
    latestUpdateTime: minsAgo(4),
    unread: true,
    updates: [
      {
        id: 'u_par_1',
        content:
          'Demonstration forming at Parliament Square — a few hundred people, peaceful so far.',
        source: 'GardaWorld',
        timestamp: minsAgo(30),
        reportedBy: 'system',
      },
      {
        id: 'u_par_2',
        content:
          'Crowd has grown into the low thousands. Police are closing Parliament Street to traffic.',
        source: 'GardaWorld',
        timestamp: minsAgo(18),
        reportedBy: 'system',
      },
      {
        id: 'u_par_3',
        content:
          'Whitehall and Bridge Street are now closed to vehicles. Westminster station exits are busy.',
        source: 'Met Police feed',
        timestamp: minsAgo(9),
        reportedBy: 'operator',
      },
      {
        id: 'u_par_4',
        content:
          'Situation stable but loud. Best to avoid the area on foot; several bus routes on diversion.',
        source: 'GardaWorld',
        timestamp: minsAgo(4),
        reportedBy: 'system',
      },
    ],
  },
  {
    id: 'evt_rain',
    type: 'weather',
    severity: 'moderate',
    title: 'Heavy rain warning',
    description:
      'A band of heavy rain is moving across Greater London this evening. Surface-water flooding is possible on some roads and at underpasses.',
    recommendedAction:
      'Plan for slower journeys tonight and tomorrow morning. Avoid low underpasses during peak rainfall.',
    source: 'Met Office',
    lat: 51.5074,
    lng: -0.1278,
    area: 'London (citywide)',
    status: 'planned',
    firstReportTime: hoursAgo(2),
    latestUpdateTime: hoursAgo(1),
    unread: true,
    updates: [
      {
        id: 'u_rain_1',
        content:
          'Heavy rain expected this evening. Localized surface-water flooding possible.',
        source: 'Met Office',
        timestamp: hoursAgo(2),
        reportedBy: 'system',
      },
      {
        id: 'u_rain_2',
        content:
          'Yellow weather warning for rain now in force across London until tomorrow midday.',
        source: 'Met Office',
        timestamp: hoursAgo(1),
        reportedBy: 'system',
      },
    ],
  },
  {
    id: 'evt_central',
    type: 'transit',
    severity: 'low',
    title: 'Central line — minor delays',
    description:
      'Minor delays on the Central line after an earlier signalling fault near Bank. Trains are running but less frequently than usual.',
    recommendedAction:
      'Allow a little extra time, or use the Elizabeth line / buses as an alternative.',
    source: 'TfL',
    lat: 51.5154,
    lng: -0.141,
    area: 'Oxford Circus',
    status: 'ongoing',
    firstReportTime: hoursAgo(3),
    latestUpdateTime: hoursAgo(3),
    unread: false,
    updates: [
      {
        id: 'u_central_1',
        content:
          'Minor delays on the Central line after an earlier signalling fault near Bank. Use the Elizabeth line or buses as an alternative.',
        source: 'TfL',
        timestamp: hoursAgo(3),
        reportedBy: 'system',
      },
    ],
  },
  {
    id: 'evt_strike',
    type: 'strike',
    severity: 'moderate',
    title: 'Tube strike planned',
    description:
      'The RMT union has announced a 24-hour Tube strike later this week. Most Underground lines are expected to run a reduced service or none at all during the strike.',
    recommendedAction:
      'If you are travelling on the strike day, plan alternative transport and expect crowded buses and mainline trains.',
    source: 'GardaWorld',
    lat: 51.5304,
    lng: -0.123,
    area: "King's Cross",
    status: 'planned',
    firstReportTime: hoursAgo(26),
    latestUpdateTime: hoursAgo(20),
    unread: false,
    updates: [
      {
        id: 'u_strike_1',
        content:
          'RMT announced a 24-hour Tube strike later this week. Expect severe disruption across the Underground that day.',
        source: 'GardaWorld',
        timestamp: hoursAgo(20),
        reportedBy: 'system',
      },
    ],
  },
  {
    id: 'evt_windclear',
    type: 'weather',
    severity: 'allClear',
    title: 'Weather alert resolved',
    description:
      'The earlier strong-wind advisory for central London has been lifted. Conditions along the river and in the parks are back to normal.',
    recommendedAction: 'No action needed. Normal conditions have resumed.',
    source: 'Met Office',
    lat: 51.5033,
    lng: -0.1195,
    area: 'South Bank',
    status: 'resolved',
    firstReportTime: hoursAgo(6),
    latestUpdateTime: hoursAgo(5),
    unread: false,
    updates: [],
  },
];

// Referenced by mockMessages (the curated showcase thread).
export const featuredEvent = mockEvents[0];
