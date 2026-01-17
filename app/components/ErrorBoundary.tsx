import React from "react";

type ErrorBoundaryState = {
  error: Error | null;
  componentStack: string;
  url: string;
  userAgent: string;
};

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type WindowOnErrorHandler =
  | ((
      event: string | Event,
      source?: string,
      lineno?: number,
      colno?: number,
      error?: Error,
    ) => void | boolean)
  | null;

type WindowOnUnhandledRejectionHandler =
  | ((event: PromiseRejectionEvent) => void)
  | null;

const getSafeNavigator = () =>
  typeof window === "undefined" ? "" : window.navigator.userAgent;

const getSafeUrl = () =>
  typeof window === "undefined" ? "" : window.location.href;

const normalizeError = (value: unknown): Error => {
  if (value instanceof Error) {
    return value;
  }

  if (typeof value === "string") {
    return new Error(value);
  }

  try {
    return new Error(JSON.stringify(value));
  } catch {
    return new Error("Unknown error");
  }
};

const ErrorOverlay = ({
  error,
  componentStack,
  url,
  userAgent,
}: {
  error: Error;
  componentStack: string;
  url: string;
  userAgent: string;
}) => {
  return (
    <div
      role="alert"
      style={{
        position: "fixed",
        inset: 0,
        background: "#0b0b0b",
        color: "#f8f8f2",
        zIndex: 2147483647,
        padding: "16px",
        overflow: "auto",
        fontFamily:
          "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
        fontSize: "14px",
        lineHeight: 1.5,
      }}
    >
      <h1 style={{ fontSize: "18px", marginBottom: "12px" }}>
        Runtime error
      </h1>
      <section style={{ marginBottom: "16px" }}>
        <strong>Message</strong>
        <pre style={{ whiteSpace: "pre-wrap", marginTop: "6px" }}>
          {error.message}
        </pre>
      </section>
      <section style={{ marginBottom: "16px" }}>
        <strong>Stack</strong>
        <pre style={{ whiteSpace: "pre-wrap", marginTop: "6px" }}>
          {error.stack}
        </pre>
      </section>
      <section style={{ marginBottom: "16px" }}>
        <strong>Component stack</strong>
        <pre style={{ whiteSpace: "pre-wrap", marginTop: "6px" }}>
          {componentStack}
        </pre>
      </section>
      <section style={{ marginBottom: "16px" }}>
        <strong>URL</strong>
        <pre style={{ whiteSpace: "pre-wrap", marginTop: "6px" }}>
          {url}
        </pre>
      </section>
      <section>
        <strong>User agent</strong>
        <pre style={{ whiteSpace: "pre-wrap", marginTop: "6px" }}>
          {userAgent}
        </pre>
      </section>
    </div>
  );
};

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    error: null,
    componentStack: "",
    url: getSafeUrl(),
    userAgent: getSafeNavigator(),
  };

  private previousOnError: WindowOnErrorHandler = null;

  private previousOnUnhandledRejection: WindowOnUnhandledRejectionHandler = null;

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      error,
      url: getSafeUrl(),
      userAgent: getSafeNavigator(),
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.setState({
      error,
      componentStack: info.componentStack ?? "",
      url: getSafeUrl(),
      userAgent: getSafeNavigator(),
    });
  }

  componentDidMount() {
    if (typeof window === "undefined") {
      return;
    }

    this.previousOnError = window.onerror;
    this.previousOnUnhandledRejection = window.onunhandledrejection;

    window.onerror = (event, source, lineno, colno, error) => {
      const normalizedError = normalizeError(error ?? event);
      this.setState({
        error: normalizedError,
        componentStack: this.state.componentStack,
        url: getSafeUrl(),
        userAgent: getSafeNavigator(),
      });

      if (this.previousOnError) {
        return this.previousOnError(event, source, lineno, colno, error);
      }

      return false;
    };

    window.onunhandledrejection = (event) => {
      const normalizedError = normalizeError(event.reason);
      this.setState({
        error: normalizedError,
        componentStack: this.state.componentStack,
        url: getSafeUrl(),
        userAgent: getSafeNavigator(),
      });

      if (this.previousOnUnhandledRejection) {
        return this.previousOnUnhandledRejection(event);
      }

      return undefined;
    };
  }

  componentWillUnmount() {
    if (typeof window === "undefined") {
      return;
    }

    window.onerror = this.previousOnError;
    window.onunhandledrejection = this.previousOnUnhandledRejection;
  }

  render() {
    const { error, componentStack, url, userAgent } = this.state;

    if (error) {
      return (
        <ErrorOverlay
          error={error}
          componentStack={componentStack}
          url={url}
          userAgent={userAgent}
        />
      );
    }

    return this.props.children;
  }
}
