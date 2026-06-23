import type { Event } from '../types/Event';
import { minsAgo, hoursAgo } from '../utils/time';

// 5 events around Tel Aviv with varied severity. Each has a parent record + 1–4 updates.
// Order here is the "default" drawer order (most recently updated first).
export const mockEvents: Event[] = [
  {
    id: 'evt_habima',
    type: 'protest',
    severity: 'high',
    title: 'Counter-demonstration at Habima Square',
    description:
      'A counter-demonstration has formed at Habima Square and is drawing a growing crowd. Police are on scene managing traffic. Noise and pedestrian congestion in the immediate area.',
    recommendedAction:
      'Avoid Habima Square and Tarsat Ave on foot. If you have travel through the area, allow extra time and expect transit detours.',
    source: 'GardaWorld',
    lat: 32.0772,
    lng: 34.7806,
    area: 'Habima Square',
    status: 'active',
    firstReportTime: minsAgo(40),
    latestUpdateTime: minsAgo(4),
    unread: true,
    updates: [
      {
        id: 'u_hab_1',
        content:
          'Counter-demonstration forming on the south side of Habima Square — roughly 150 people, peaceful so far.',
        source: 'GardaWorld',
        timestamp: minsAgo(30),
        reportedBy: 'system',
      },
      {
        id: 'u_hab_2',
        content:
          'Crowd has grown to several hundred. Police are directing vehicle traffic away from Tarsat Ave.',
        source: 'GardaWorld',
        timestamp: minsAgo(18),
        reportedBy: 'system',
      },
      {
        id: 'u_hab_3',
        content:
          'Tarsat Ave and the Rothschild–Habima junction are now closed to vehicles. Pedestrian access still open.',
        source: 'Municipal feed',
        timestamp: minsAgo(9),
        reportedBy: 'operator',
      },
      {
        id: 'u_hab_4',
        content:
          'Situation stable but loud. Best to avoid the square on foot for now; expect transit detours nearby.',
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
      'A storm front is expected to move across the Tel Aviv area overnight. Localized flooding is possible on low-lying streets and underpasses.',
    recommendedAction:
      'Plan for delays tomorrow morning. Avoid underpasses and coastal roads during peak rainfall.',
    source: 'IMS · Israel Meteorological',
    lat: 32.0853,
    lng: 34.7818,
    area: 'Tel Aviv (citywide)',
    status: 'planned',
    firstReportTime: hoursAgo(2),
    latestUpdateTime: hoursAgo(1),
    unread: true,
    updates: [
      {
        id: 'u_rain_1',
        content:
          'Storm front expected overnight. Localized flooding possible on low-lying streets.',
        source: 'IMS · Israel Meteorological',
        timestamp: hoursAgo(2),
        reportedBy: 'system',
      },
      {
        id: 'u_rain_2',
        content:
          'Yellow weather warning now issued for the Tel Aviv District through tomorrow noon.',
        source: 'IMS · Israel Meteorological',
        timestamp: hoursAgo(1),
        reportedBy: 'system',
      },
    ],
  },
  {
    id: 'evt_metro',
    type: 'transit',
    severity: 'low',
    title: 'Metro Line A — partial service',
    description:
      'The light-rail Red Line (Line A) is running at reduced frequency due to a signalling fault near Allenby. Trains are arriving roughly every 12 minutes.',
    recommendedAction:
      'Allow extra time or use Line C / surface buses as an alternative for now.',
    source: 'NTA · Transit',
    lat: 32.0833,
    lng: 34.7868,
    area: 'Allenby / Red Line',
    status: 'ongoing',
    firstReportTime: hoursAgo(3),
    latestUpdateTime: hoursAgo(3),
    unread: false,
    updates: [
      {
        id: 'u_metro_1',
        content:
          'Reduced frequency on Line A (every ~12 min). Use Line C or surface buses as an alternative.',
        source: 'NTA · Transit',
        timestamp: hoursAgo(3),
        reportedBy: 'system',
      },
    ],
  },
  {
    id: 'evt_strike',
    type: 'strike',
    severity: 'moderate',
    title: 'Transport workers strike',
    description:
      'A partial transport strike has been announced for the coming days. Buses and light-rail service are expected to be limited during the strike window.',
    recommendedAction:
      'If you are travelling in two days, plan alternative transport for the 06:00–10:00 window.',
    source: 'GardaWorld',
    lat: 32.09,
    lng: 34.78,
    area: 'Central Tel Aviv',
    status: 'planned',
    firstReportTime: hoursAgo(26),
    latestUpdateTime: hoursAgo(20),
    unread: false,
    updates: [
      {
        id: 'u_strike_1',
        content:
          'Histadrut announced a partial transport strike in two days, 06:00–10:00. Expect bus and light-rail gaps.',
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
      'The earlier wind advisory for the Tel Aviv coastline has been lifted. Conditions are back to normal along the beachfront and promenade.',
    recommendedAction: 'No action needed. Normal conditions have resumed.',
    source: 'IMS · Israel Meteorological',
    lat: 32.079,
    lng: 34.772,
    area: 'Tel Aviv coastline',
    status: 'resolved',
    firstReportTime: hoursAgo(6),
    latestUpdateTime: hoursAgo(5),
    unread: false,
    updates: [],
  },
];

// Referenced by mockMessages (the curated Habima thread).
export const habimaEvent = mockEvents[0];
