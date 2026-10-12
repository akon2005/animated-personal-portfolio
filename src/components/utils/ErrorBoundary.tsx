import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Rendered instead of the children when they fail. Defaults to nothing. */
  fallback?: ReactNode;
  label?: string;
}

interface State {
  hasError: boolean;
}

/**
 * Keeps a failing 3D subtree from taking the whole page down. If WebGL is
 * unavailable or a canvas/context error is thrown while rendering, the
 * portfolio still works - it is simply shown without that visual.
 */
class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(
      `${this.props.label ?? "Component"} failed to render:`,
      error,
      info.componentStack
    );
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}

export default ErrorBoundary;
