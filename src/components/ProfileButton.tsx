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
      className="pointer-events-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-caption font-semibold text-white shadow-[0_4px_14px_rgba(0,0,0,0.18)] transition-transform active:scale-95 active:opacity-90"
      style={{ backgroundColor: '#3A3A3C' }}
    >
      {mockUser.initials}
    </button>
  );
}
