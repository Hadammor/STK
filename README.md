# Guy — Travel Safety (Demo)

**Guy** is a clickable web demo of a travel-safety app for business travelers. Single-screen
map app: a bottom drawer of nearby "event threads", a full-screen conversation view
per event, an SOS sheet, and a settings sheet. Everything is mocked — no backend,
no auth, no tests. The job of this build is to let you _feel_ the vision in a browser.

Built per `../claude-code-demo-brief.md`.

## Run it

```bash
cd travel-safety-demo
npm install        # already done
npm run dev        # http://localhost:5173
```

Open in a desktop browser and narrow it / use device emulation — the UI is a fixed
**393×852** phone frame (iPhone 14 Pro) centered on the page. It is meant to look
small on desktop; that's the point.

> Node was installed locally at `~/.local/node` and added to your `~/.zshrc`, so
> `npm`/`node` resolve in any new terminal.

## Mapbox token

The map uses Mapbox GL. Add a free **public** token to `.env.local`:

```
VITE_MAPBOX_TOKEN=pk.your_token_here
```

Get one at [mapbox.com](https://www.mapbox.com) → Account → Tokens.

**Without a token the demo still runs** against a styled fallback "map" so every
screen and interaction works — pins, drawer, threads, sheets. Add the token to see
the real light Mapbox map of London and the static mini-map previews in threads.

## Light vs dark map (flagged in the brief)

Production design calls for an **always-dark** map; this demo uses **light**. The
style is a single constant so swapping is trivial — see `src/styles/tokens.ts`:

```ts
export const MAP_STYLE = 'mapbox://styles/mapbox/light-v11';
// export const MAP_STYLE = 'mapbox://styles/mapbox/dark-v11';  // <- swap to compare
```

## What works (acceptance criteria)

1. Loads to a London map with 5 pastel, event-typed pins.
2. "Active · You'll be notified" status pill, top center.
3. Drawer peeks with 2 rows + a third peeking.
4. Drawer snaps between **peek / expanded / fullscreen** — drag the handle, or tap it
   to advance.
5. Tapping a map pin highlights its row, bumps it to the top, and expands the drawer.
6. Tapping a row opens the Event Thread View: rich first card (title, mini-map,
   description, recommended action, source) + update bubbles + system notice + quick
   replies + input bar.
7. Swipe the thread down or tap ✕ to close.
8. Help (?) → SOS sheet → "I need help" → confirm → "Help is aware" state.
9. Police / Ambulance / Fire → confirm → cancel returns to the sheet.
10. Profile circle → Settings sheet with all sections.

Quick replies and the message input append real bubbles with canned ops responses.

## Stack

React 18-style + TypeScript + Vite + Tailwind (custom tokens) + Mapbox GL JS +
Framer Motion + lucide-react. State is React Context (`src/context/AppContext.tsx`).
No router — one screen with overlays.

> Note: `npm create vite` scaffolded React 19 (newer than the brief's React 18). It's
> fully compatible for this demo; nothing here depends on a React-18-only behavior.

## Layout

```
src/
  App.tsx                  root: phone frame + MapView + overlays
  components/               MapView, Drawer, EventThreadRow, EventThreadView,
                            StatusPill, HelpButton, ProfileButton, SOSSheet,
                            SettingsSheet, BottomSheet, ConfirmModal, Toast, SeverityPill
  context/AppContext.tsx    shared state + cross-component actions
  hooks/                    useDrawer, useSheet
  data/                     mockEvents, mockMessages, mockUser
  types/                    Event, Message, User
  styles/tokens.ts          colors, radii, map config, frame + drawer snap constants
  utils/                    time formatting, event icons/labels
```
