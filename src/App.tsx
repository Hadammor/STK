import { AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import { MapView } from './components/MapView';
import { Drawer } from './components/Drawer';
import { EventThreadView } from './components/EventThreadView';
import { SOSSheet } from './components/SOSSheet';
import { SettingsSheet } from './components/SettingsSheet';
import { ConfirmModal } from './components/ConfirmModal';
import { Toast } from './components/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';

// Full-screen app frame: fills the browser viewport height (so nothing gets
// cut off), mobile-capped width, centered.
function Shell() {
  const { openThreadEventId, getEvent, closeThread, confirm, closeConfirm } =
    useApp();
  const threadEvent = openThreadEventId ? getEvent(openThreadEventId) : undefined;

  return (
    <div className="relative mx-auto h-[100dvh] w-full max-w-[440px] select-none overflow-hidden bg-bg">
      <MapView />
      <Drawer />

      {/* Event Thread View slides over the map */}
      <AnimatePresence>
        {threadEvent && (
          <EventThreadView
            key={threadEvent.id}
            event={threadEvent}
            onClose={closeThread}
          />
        )}
      </AnimatePresence>

      <SOSSheet />
      <SettingsSheet />

      {/* Frame-level confirm modal (overlays sheets) */}
      <ConfirmModal
        open={!!confirm}
        title={confirm?.title ?? ''}
        body={confirm?.body}
        confirmLabel={confirm?.confirmLabel}
        cancelLabel={confirm?.cancelLabel}
        onConfirm={() => {
          confirm?.onConfirm();
          closeConfirm();
        }}
        onCancel={closeConfirm}
      />

      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Shell />
      </AppProvider>
    </ErrorBoundary>
  );
}
