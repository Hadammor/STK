import { useApp } from '../context/AppContext';
import { mockUser } from '../data/mockUser';

// Floating profile circle, top-right. 36px, user initials. Opens the Settings sheet.
export function ProfileButton() {
  const { openSettings } = useApp();
  return (
    <button
      type="button"
      onClick={openSettings}
      aria-label="Settings"
      className="pointer-events-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-hair bg-white text-caption font-semibold text-ink transition-transform active:scale-95 active:bg-surface"
    >
      {mockUser.initials}
    </button>
  );
}
