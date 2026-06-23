import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
}

// Last-resort safety net: if anything below throws during render, show a calm
// message instead of a blank white screen. (The map has its own fallback above
// this; this catches everything else.)
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('App error boundary caught:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-8 text-center">
          <p className="text-bodylg font-semibold tracking-title text-ink">
            Something went wrong
          </p>
          <p className="text-caption text-ink2">
            Please reload the page to continue.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
