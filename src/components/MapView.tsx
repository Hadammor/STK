import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useApp } from '../context/AppContext';
import { eventIcon } from '../utils/eventVisuals';
import { severityTokens, MAP_STYLE, FRAME_W, FRAME_H } from '../styles/tokens';
import type { Event } from '../types/Event';
import type { City } from '../data/cities';
import { StatusPill } from './StatusPill';
import { ProfileButton } from './ProfileButton';
import { HelpButton } from './HelpButton';
import { CitySwitcher } from './CitySwitcher';

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;
const hasToken = !!TOKEN && TOKEN.startsWith('pk.');

interface ScreenPin {
  event: Event;
  x: number;
  y: number;
}

// No-token fallback: linearly project lng/lat into the frame using the city's bbox.
function fallbackProject(
  e: Event,
  w: number,
  h: number,
  bbox: City['bbox'],
): { x: number; y: number } {
  const x = ((e.lng - bbox.lngMin) / (bbox.lngMax - bbox.lngMin)) * w;
  const y = ((bbox.latMax - e.lat) / (bbox.latMax - bbox.latMin)) * h;
  return { x, y };
}

export function MapView() {
  const {
    city,
    cityId,
    events,
    selectPin,
    highlightedEventId,
    topEventId,
    drawerState,
  } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  // Captured once so the init effect can stay run-once.
  const initialView = useRef({ center: city.center, zoom: city.zoom });
  const [ready, setReady] = useState(!hasToken);
  // Bumped on every map move so we recompute projected pin positions.
  const [tick, setTick] = useState(0);
  const [pins, setPins] = useState<ScreenPin[]>([]);
  // If Mapbox can't initialise (e.g. WebGL unavailable on the device), we fall
  // back to the styled map instead of letting the whole app crash to a blank screen.
  const [mapBroke, setMapBroke] = useState(false);

  // --- Initialise the real Mapbox map (only when a token is present) ---
  useEffect(() => {
    if (!hasToken || !containerRef.current) return;

    let map: mapboxgl.Map;
    try {
      mapboxgl.accessToken = TOKEN as string;
      map = new mapboxgl.Map({
        container: containerRef.current,
        style: MAP_STYLE,
        center: initialView.current.center,
        zoom: initialView.current.zoom,
        attributionControl: false,
        // Keep the demo map calm — no rotation / pitch.
        pitchWithRotate: false,
        dragRotate: false,
      });
    } catch (err) {
      // WebGL unsupported / context creation failed — degrade gracefully.
      console.error('Mapbox failed to initialise; using fallback map.', err);
      /* eslint-disable react-hooks/set-state-in-effect */
      setMapBroke(true);
      setReady(true);
      /* eslint-enable react-hooks/set-state-in-effect */
      return;
    }
    mapRef.current = map;

    const bump = () => setTick((t) => t + 1);
    map.on('load', () => {
      setReady(true);
      bump();
    });
    map.on('move', bump);
    map.on('resize', bump);
    // A fatal map error (e.g. WebGL context lost) also falls back.
    map.on('error', (e) => {
      const msg = String(e?.error?.message ?? '');
      if (/webgl|context/i.test(msg)) {
        console.error('Mapbox runtime error; using fallback map.', e.error);
        setMapBroke(true);
        setReady(true);
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Fly to the active city when it changes (real map only).
  useEffect(() => {
    const map = mapRef.current;
    if (hasToken && !mapBroke && map) {
      map.flyTo({ center: city.center, zoom: city.zoom, duration: 1100 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityId]);

  // Project event coords → screen positions. Reads the map/container refs, so it
  // lives in an effect (re-runs on map move via `tick`, on reorder via `events`,
  // and once the map is `ready`). Cheap for 5 pins.
  useEffect(() => {
    const el = containerRef.current;
    const w = el?.clientWidth ?? FRAME_W;
    const h = el?.clientHeight ?? FRAME_H;
    const map = mapRef.current;
    setPins(
      events.map((event) => {
        if (hasToken && !mapBroke && map && ready) {
          const p = map.project([event.lng, event.lat]);
          return { event, x: p.x, y: p.y };
        }
        const { x, y } = fallbackProject(event, w, h, city.bbox);
        return { event, x, y };
      }),
    );
  }, [events, ready, tick, city, mapBroke]);

  const showTopControls = drawerState !== 'fullscreen';
  const showHelp = drawerState === 'peek';

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Map background — real Mapbox or styled fallback.
          NB: use h-full/w-full (not inset-0). Mapbox's own CSS forces
          .mapboxgl-map to position:relative, which cancels inset-0 stretching
          and collapses the container to 0 height → blank map. */}
      {hasToken && !mapBroke ? (
        <div ref={containerRef} className="h-full w-full" />
      ) : (
        <div
          ref={containerRef}
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg,#EDEFF2 0%,#E9ECEF 100%)',
            backgroundImage:
              'linear-gradient(180deg,#EDEFF2,#E7EAEE), repeating-linear-gradient(90deg, transparent 0 46px, #DEE2E7 46px 47px), repeating-linear-gradient(0deg, transparent 0 46px, #DEE2E7 46px 47px)',
          }}
        >
          {/* a couple of faux "roads" to read as a map */}
          <div className="absolute left-0 right-0 top-1/3 h-3 -rotate-3 bg-white/70" />
          <div className="absolute bottom-1/4 left-0 right-0 h-2 rotate-2 bg-white/60" />
          <div className="absolute inset-y-0 left-1/2 w-3 rotate-2 bg-white/60" />
          <div className="absolute left-3 bottom-[262px] rounded-md border border-hair bg-white/80 px-2 py-1 text-micro font-semibold uppercase text-ink2">
            {mapBroke ? 'Map unavailable on this device' : 'Map preview · add Mapbox token'}
          </div>
        </div>
      )}

      {/* Pins (React overlay so they keep real icons + a clean selected ring) */}
      {ready &&
        pins.map(({ event, x, y }) => {
          const t = severityTokens[event.severity];
          const Icon = eventIcon[event.type];
          const selected =
            highlightedEventId === event.id || topEventId === event.id;
          return (
            <button
              key={event.id}
              type="button"
              onClick={() => selectPin(event.id)}
              aria-label={event.title}
              className="absolute z-10 flex items-center justify-center rounded-full transition-transform"
              style={{
                left: x,
                top: y,
                width: 40,
                height: 40,
                marginLeft: -20,
                marginTop: -20,
                backgroundColor: t.pin,
                border: `1px solid rgba(0,0,0,0.18)`,
                transform: selected ? 'scale(1.15)' : 'scale(1)',
                outline: selected ? '2px solid #000' : 'none',
                outlineOffset: 2,
              }}
            >
              <Icon size={18} strokeWidth={2} color="#000" />
            </button>
          );
        })}

      {/* Floating chrome over the map */}
      <div className="pointer-events-none absolute inset-0 z-20">
        {showTopControls && (
          <>
            <div className="absolute left-0 right-0 top-3 flex justify-center">
              <StatusPill />
            </div>
            <div className="absolute right-4 top-3">
              <ProfileButton />
            </div>
            <div className="absolute left-3 top-[54px]">
              <CitySwitcher />
            </div>
          </>
        )}
        {showHelp && <HelpButton />}
      </div>
    </div>
  );
}
