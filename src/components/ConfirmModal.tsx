import { AnimatePresence, motion } from 'framer-motion';

export interface ConfirmModalProps {
  open: boolean;
  title: string;
  body?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// Reusable confirm modal for sensitive actions. Centered card, dimmed backdrop.
// Confirm = solid black; Cancel = text-only. No drop shadow (border + surface only).
export function ConfirmModal({
  open,
  title,
  body,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-50 flex items-center justify-center px-7"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Dismiss"
            onClick={onCancel}
            className="absolute inset-0 bg-black/40"
          />
          {/* Card */}
          <motion.div
            className="relative w-full max-w-[300px] rounded-xl border border-hair bg-white p-5"
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          >
            <h3 className="text-bodylg font-semibold tracking-title text-ink">
              {title}
            </h3>
            {body && (
              <p className="mt-2 text-body text-ink2">{body}</p>
            )}
            <div className="mt-5 flex flex-col gap-2.5">
              <button
                type="button"
                aria-label={confirmLabel}
                onClick={onConfirm}
                className="h-12 w-full rounded-lg bg-ink text-body font-semibold text-white active:opacity-90"
              >
                {confirmLabel}
              </button>
              <button
                type="button"
                aria-label={cancelLabel}
                onClick={onCancel}
                className="h-11 w-full text-body font-medium text-ink2 active:text-ink"
              >
                {cancelLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
