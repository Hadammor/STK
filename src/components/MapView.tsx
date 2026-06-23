import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useApp } from '../context/AppContext';
import { eventIcon } from '../utils/eventVisuals';
import {
  severityVivid,
  accent,
  MAP_STYLE,
  FRAME_W,
  FRAME_H,
  DRAWER_PEEK_PX,
} from '../styles/tokens';
import type { Event } from '../types/Event';
import type { City } from '../data/cities';
import { SearchBar } from './SearchBar';
import { StatusPill } from './StatusPill';
import { ProfileButton } from './ProfileButton';
import { RecenterButton } from './RecenterButton';
import { SOSButton } from './SOSButton';

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;
const hasToken = !!TOKEN && TOKEN.startsWith('pk.');

interface ScreenPin {
  event: Event;
  x: number;
  y: number;
}

// No-token fallback: linearly project lng/lat into the frame using the city's bbox.
function fallbackProject(
  lng: number,
  lat: number,
  w: number,
  h: number,
  bbox: City['bbox'],
): { x: number; y: number } {
  const x = ((lng - bbox.lngMin) / (bbox.lngMax - bbox.lngMin)) * w;
  const y = ((bbox.latMax - lat) / (bbox.latMax - bbox.latMin)) * h;
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
    setDrawerState,
    showToast,
    clearSelection,
    frameH,
  } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  // Captured once so the init effect can stay run-once.
  const initialView = useRef({ center: city.center, zoom: city.zoom });
  const [ready, setReady] = useState(!hasToken);
  // Bumped on every map move so we recompute projected pin positions.
  const [tick, setTick] = useState(0);
  const [pins, setPins] = useState<ScreenPin[]>([]);
  const [userPos, setUserPos] = useState<{ x: number; y: number } | null>(null);
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
    // Tapping the map (not a pin/control) collapses the drawer and deselects any
    // circled pin.
    map.on('click', () => {
      setDrawerState('peek');
      clearSelection();
    });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tapping a pin re-centers the map on that event.
  useEffect(() => {
    if (!highlightedEventId) return;
    const map = mapRef.current;
    const ev = events.find((e) => e.id === highlightedEventId);
    if (ev && hasToken && !mapBroke && map) {
      map.flyTo({ center: [ev.lng, ev.lat], duration: 700 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightedEventId]);

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
    const live = hasToken && !mapBroke && map && ready;
    const project = (lng: number, lat: number) =>
      live ? map!.project([lng, lat]) : fallbackProject(lng, lat, w, h, city.bbox);

    setPins(
      events.map((event) => {
        const p = project(event.lng, event.lat);
        return { event, x: p.x, y: p.y };
      }),
    );
    const c = project(city.center[0], city.center[1]);
    setUserPos({ x: c.x, y: c.y });
  }, [events, ready, tick, city, mapBroke]);

  // Recenter / locate-me → fly back to the city center (or a no-op toast on fallback).
  function recenter() {
    const map = mapRef.current;
    if (hasToken && !mapBroke && map) {
      map.flyTo({ center: city.center, zoom: city.zoom, duration: 800 });
    } else {
      showToast('Recenter — demo');
    }
  }

  const showTopControls = drawerState !== 'fullscreen';
  // Bottom controls show through peek + expanded (riding the drawer) and hide at
  // fullscreen. They sit just above the drawer's top edge for each snap state and
  // glide between them via a CSS transition as the drawer expands/collapses.
  const showBottomControls = drawerState !== 'fullscreen';
  const controlsBottom =
    drawerState === 'expanded' ? frameH * 0.62 + 16 : DRAWER_PEEK_PX + 16;

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
          onClick={() => {
            setDrawerState('peek');
            clearSelection();
          }}
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

      {/* Map markers (React overlay) */}
      {ready && (
        <>
          {/* user location — iOS blue dot + soft halo */}
          {userPos && (
            <div
              className="pointer-events-none absolute z-[9]"
              style={{ left: userPos.x, top: userPos.y, width: 16, height: 16, marginLeft: -8, marginTop: -8 }}
            >
              <span
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ width: 42, height: 42, backgroundColor: accent.location, opacity: 0.16 }}
              />
              <span
                className="relative block h-4 w-4 rounded-full border-2 border-white"
                style={{ backgroundColor: accent.location }}
              />
            </div>
          )}

          {/* event pins — vivid solid circle + white glyph + soft halo */}
          {pins.map(({ event, x, y }) => {
            const color = severityVivid[event.severity];
            const Icon = eventIcon[event.type];
            const selected =
              highlightedEventId === event.id || topEventId === event.id;
            return (
              <button
                key={event.id}
                type="button"
                onClick={() => selectPin(event.id)}
                aria-label={event.title}
                className="absolute z-10 transition-transform"
                style={{
                  left: x,
                  top: y,
                  width: 40,
                  height: 40,
                  marginLeft: -20,
                  marginTop: -20,
                  transform: `scale(${selected ? 1.12 : 1})`,
                }}
              >
                <span
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ width: 60, height: 60, backgroundColor: color, opacity: selected ? 0.28 : 0.2 }}
                />
                <span
                  className="relative flex h-10 w-10 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: color,
                    border: '2px solid #fff',
                    outline: selected ? '2px solid #000' : 'none',
                    outlineOffset: 1,
                  }}
                >
                  <Icon size={20} strokeWidth={2.4} color="#fff" />
                </span>
              </button>
            );
          })}
        </>
      )}

      {/* Floating chrome over the map */}
      <div className="pointer-events-none absolute inset-0 z-20">
        {showTopControls && (
          <>
            {/* search bar + profile — at the top, below the notch / browser chrome */}
            <div
              className="absolute inset-x-3 flex items-center gap-2.5"
              style={{ top: 'calc(env(safe-area-inset-top) + 12px)' }}
            >
              <SearchBar />
              <ProfileButton />
            </div>
            {/* status pill */}
            <div
              className="absolute left-0 right-0 flex justify-center"
              style={{ top: 'calc(env(safe-area-inset-top) + 68px)' }}
            >
              <StatusPill />
            </div>
          </>
        )}
        {showBottomControls && (
          <div
            className="pointer-events-none absolute inset-x-4 flex items-center justify-between transition-[bottom] duration-300 ease-out"
            style={{ bottom: controlsBottom }}
          >
            <RecenterButton onClick={recenter} />
            <SOSButton />
          </div>
        )}
      </div>
    </div>
  );
}
