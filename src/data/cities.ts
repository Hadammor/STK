import type { Event } from '../types/Event';
import { minsAgo, hoursAgo } from '../utils/time';

// A demo "city": where the map sits, what events surround the traveler, and the
// local emergency / consular contacts. The city switcher flips between these.
export interface EmergencyService {
  label: string;
  number: string;
}
export interface ConsularContact {
  label: string; // section header (e.g. "Israeli embassy")
  address: string;
  phone: string;
  hours: string;
}
export interface City {
  id: string;
  label: string;
  center: [number, number]; // [lng, lat]
  zoom: number;
  bbox: { lngMin: number; lngMax: number; latMin: number; latMax: number };
  events: Event[];
  services: EmergencyService[];
  consular: ConsularContact;
}

// ---------------------------------------------------------------- Tel Aviv ---
const telAviv: City = {
  id: 'telAviv',
  label: 'Tel Aviv',
  center: [34.7818, 32.0853],
  zoom: 13,
  bbox: { lngMin: 34.76, lngMax: 34.798, latMin: 32.068, latMax: 32.098 },
  services: [
    { label: 'Police', number: '100' },
    { label: 'Ambulance', number: '101' },
    { label: 'Fire', number: '102' },
  ],
  consular: {
    label: 'Consular hotline',
    address: 'MFA Situation Room, Jerusalem',
    phone: '+972 2 530 3155',
    hours: '24/7',
  },
  events: [
    {
      id: 'ta_habima',
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
        { id: 'ta_hab_1', content: 'Counter-demonstration forming on the south side of Habima Square — roughly 150 people, peaceful so far.', source: 'GardaWorld', timestamp: minsAgo(30), reportedBy: 'system' },
        { id: 'ta_hab_2', content: 'Crowd has grown to several hundred. Police are directing vehicle traffic away from Tarsat Ave.', source: 'GardaWorld', timestamp: minsAgo(18), reportedBy: 'system' },
        { id: 'ta_hab_3', content: 'Tarsat Ave and the Rothschild–Habima junction are now closed to vehicles. Pedestrian access still open.', source: 'Municipal feed', timestamp: minsAgo(9), reportedBy: 'operator' },
        { id: 'ta_hab_4', content: 'Situation stable but loud. Best to avoid the square on foot for now; expect transit detours nearby.', source: 'GardaWorld', timestamp: minsAgo(4), reportedBy: 'system' },
      ],
    },
    {
      id: 'ta_rain',
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
        { id: 'ta_rain_1', content: 'Storm front expected overnight. Localized flooding possible on low-lying streets.', source: 'IMS · Israel Meteorological', timestamp: hoursAgo(2), reportedBy: 'system' },
        { id: 'ta_rain_2', content: 'Yellow weather warning now issued for the Tel Aviv District through tomorrow noon.', source: 'IMS · Israel Meteorological', timestamp: hoursAgo(1), reportedBy: 'system' },
      ],
    },
    {
      id: 'ta_metro',
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
        { id: 'ta_metro_1', content: 'Reduced frequency on Line A (every ~12 min). Use Line C or surface buses as an alternative.', source: 'NTA · Transit', timestamp: hoursAgo(3), reportedBy: 'system' },
      ],
    },
    {
      id: 'ta_strike',
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
        { id: 'ta_strike_1', content: 'Histadrut announced a partial transport strike in two days, 06:00–10:00. Expect bus and light-rail gaps.', source: 'GardaWorld', timestamp: hoursAgo(20), reportedBy: 'system' },
      ],
    },
    {
      id: 'ta_windclear',
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
  ],
};

// ------------------------------------------------------------------ London ---
const london: City = {
  id: 'london',
  label: 'London',
  center: [-0.128, 51.513],
  zoom: 12.5,
  bbox: { lngMin: -0.16, lngMax: -0.1, latMin: 51.49, latMax: 51.535 },
  services: [
    { label: 'Police', number: '999' },
    { label: 'Ambulance', number: '999' },
    { label: 'Fire', number: '999' },
  ],
  consular: {
    label: 'Israeli embassy',
    address: '2 Palace Green, Kensington, London W8 4QB',
    phone: '+44 20 7957 9500',
    hours: 'Mon–Thu · 09:00–16:00',
  },
  events: [
    {
      id: 'ldn_parliament',
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
        { id: 'ldn_par_1', content: 'Demonstration forming at Parliament Square — a few hundred people, peaceful so far.', source: 'GardaWorld', timestamp: minsAgo(30), reportedBy: 'system' },
        { id: 'ldn_par_2', content: 'Crowd has grown into the low thousands. Police are closing Parliament Street to traffic.', source: 'GardaWorld', timestamp: minsAgo(18), reportedBy: 'system' },
        { id: 'ldn_par_3', content: 'Whitehall and Bridge Street are now closed to vehicles. Westminster station exits are busy.', source: 'Met Police feed', timestamp: minsAgo(9), reportedBy: 'operator' },
        { id: 'ldn_par_4', content: 'Situation stable but loud. Best to avoid the area on foot; several bus routes on diversion.', source: 'GardaWorld', timestamp: minsAgo(4), reportedBy: 'system' },
      ],
    },
    {
      id: 'ldn_rain',
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
        { id: 'ldn_rain_1', content: 'Heavy rain expected this evening. Localized surface-water flooding possible.', source: 'Met Office', timestamp: hoursAgo(2), reportedBy: 'system' },
        { id: 'ldn_rain_2', content: 'Yellow weather warning for rain now in force across London until tomorrow midday.', source: 'Met Office', timestamp: hoursAgo(1), reportedBy: 'system' },
      ],
    },
    {
      id: 'ldn_central',
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
        { id: 'ldn_central_1', content: 'Minor delays on the Central line after an earlier signalling fault near Bank. Use the Elizabeth line or buses as an alternative.', source: 'TfL', timestamp: hoursAgo(3), reportedBy: 'system' },
      ],
    },
    {
      id: 'ldn_strike',
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
        { id: 'ldn_strike_1', content: 'RMT announced a 24-hour Tube strike later this week. Expect severe disruption across the Underground that day.', source: 'GardaWorld', timestamp: hoursAgo(20), reportedBy: 'system' },
      ],
    },
    {
      id: 'ldn_windclear',
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
  ],
};

// ----------------------------------------------------------------- Bangkok ---
const bangkok: City = {
  id: 'bangkok',
  label: 'Bangkok',
  center: [100.515, 13.745],
  zoom: 12.5,
  bbox: { lngMin: 100.485, lngMax: 100.545, latMin: 13.72, latMax: 13.77 },
  services: [
    { label: 'Police', number: '191' },
    { label: 'Ambulance', number: '1669' },
    { label: 'Fire', number: '199' },
  ],
  consular: {
    label: 'Israeli embassy',
    address: 'Ocean Tower 2, 75 Sukhumvit Soi 19, Bangkok',
    phone: '+66 2 204 9200',
    hours: 'Mon–Fri · 08:00–16:00',
  },
  events: [
    {
      id: 'bkk_democracy',
      type: 'protest',
      severity: 'high',
      title: 'Rally at Democracy Monument',
      description:
        'A rally has gathered at Democracy Monument on Ratchadamnoen Ave and is drawing a growing crowd. Police are managing road closures in the area. Heavy congestion around Khao San.',
      recommendedAction:
        'Avoid the Ratchadamnoen / Khao San area on foot this evening. Allow extra time and expect taxi and bus diversions.',
      source: 'GardaWorld',
      lat: 13.7568,
      lng: 100.5012,
      area: 'Democracy Monument',
      status: 'active',
      firstReportTime: minsAgo(40),
      latestUpdateTime: minsAgo(4),
      unread: true,
      updates: [
        { id: 'bkk_dem_1', content: 'Rally gathering at Democracy Monument on Ratchadamnoen Ave — a few hundred people, peaceful so far.', source: 'GardaWorld', timestamp: minsAgo(30), reportedBy: 'system' },
        { id: 'bkk_dem_2', content: 'Crowd growing into the thousands. Police directing traffic off Ratchadamnoen Klang.', source: 'GardaWorld', timestamp: minsAgo(18), reportedBy: 'system' },
        { id: 'bkk_dem_3', content: 'Ratchadamnoen Ave now closed to vehicles between Khao San and the monument.', source: 'Local feed', timestamp: minsAgo(9), reportedBy: 'operator' },
        { id: 'bkk_dem_4', content: 'Situation stable but crowded. Avoid the Khao San / Ratchadamnoen area on foot tonight.', source: 'GardaWorld', timestamp: minsAgo(4), reportedBy: 'system' },
      ],
    },
    {
      id: 'bkk_monsoon',
      type: 'weather',
      severity: 'moderate',
      title: 'Monsoon flooding warning',
      description:
        'Heavy monsoon downpours are forecast across Bangkok this evening. Flash flooding is likely on low-lying sois and underpasses.',
      recommendedAction:
        'Plan for slow traffic tonight. Avoid low sois and underpasses during peak rainfall.',
      source: 'Thai Meteorological Dept',
      lat: 13.74,
      lng: 100.512,
      area: 'Bangkok (citywide)',
      status: 'planned',
      firstReportTime: hoursAgo(2),
      latestUpdateTime: hoursAgo(1),
      unread: true,
      updates: [
        { id: 'bkk_mon_1', content: 'Monsoon downpours forecast across Bangkok this evening; flash flooding likely on low sois.', source: 'Thai Meteorological Dept', timestamp: hoursAgo(2), reportedBy: 'system' },
        { id: 'bkk_mon_2', content: 'Flood warning issued for low-lying areas of central Bangkok overnight.', source: 'Thai Meteorological Dept', timestamp: hoursAgo(1), reportedBy: 'system' },
      ],
    },
    {
      id: 'bkk_bts',
      type: 'transit',
      severity: 'low',
      title: 'BTS Skytrain — minor delays',
      description:
        'Minor delays on the BTS Sukhumvit line after a signalling issue at Siam. Trains are running but less frequently than usual.',
      recommendedAction:
        'Allow a little extra time, or use the MRT / a taxi as an alternative.',
      source: 'BTS',
      lat: 13.7457,
      lng: 100.5331,
      area: 'Siam',
      status: 'ongoing',
      firstReportTime: hoursAgo(3),
      latestUpdateTime: hoursAgo(3),
      unread: false,
      updates: [
        { id: 'bkk_bts_1', content: 'Minor delays on the BTS Sukhumvit line after a signalling issue at Siam. Allow extra time or use the MRT.', source: 'BTS', timestamp: hoursAgo(3), reportedBy: 'system' },
      ],
    },
    {
      id: 'bkk_palace',
      type: 'security',
      severity: 'moderate',
      title: 'Heightened security — Grand Palace',
      description:
        'Increased security and bag checks are in place around the Grand Palace and Sanam Luang today. Expect queues and some footpath closures.',
      recommendedAction:
        'Allow extra time near the Grand Palace and carry ID. Follow officers’ directions at checkpoints.',
      source: 'GardaWorld',
      lat: 13.75,
      lng: 100.4915,
      area: 'Grand Palace',
      status: 'ongoing',
      firstReportTime: hoursAgo(6),
      latestUpdateTime: hoursAgo(5),
      unread: false,
      updates: [
        { id: 'bkk_pal_1', content: 'Increased security and bag checks around the Grand Palace and Sanam Luang today. Expect queues and some footpath closures.', source: 'GardaWorld', timestamp: hoursAgo(5), reportedBy: 'system' },
      ],
    },
    {
      id: 'bkk_floodclear',
      type: 'weather',
      severity: 'allClear',
      title: 'Flood warning lifted',
      description:
        'The earlier flood advisory for the Chao Phraya riverside has been lifted. Water levels are back to normal along the promenade.',
      recommendedAction: 'No action needed. Normal conditions have resumed.',
      source: 'Thai Meteorological Dept',
      lat: 13.728,
      lng: 100.516,
      area: 'Chao Phraya riverside',
      status: 'resolved',
      firstReportTime: hoursAgo(8),
      latestUpdateTime: hoursAgo(7),
      unread: false,
      updates: [],
    },
  ],
};

export const cities: City[] = [telAviv, london, bangkok];

export const defaultCityId = 'london';

export const cityById = (id: string): City =>
  cities.find((c) => c.id === id) ?? cities[0];
