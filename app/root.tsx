import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { ToastProvider } from "~/hooks/use-toast";
import { ToastContainer } from "~/components/ui/Toast";
import { BottomNav, BugReportButton, DesktopWarningDialog } from "~/components/ui/folio";

export const links: Route.LinksFunction = () => [
  { rel: "manifest", href: "/manifest.json" },
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  { rel: "icon", href: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
  { rel: "icon", href: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Nunito:wght@600;700;800&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('folio_theme') || 'system';
                const effective = theme === 'system'
                  ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
                  : theme;
                if (effective === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <Outlet />
      <ToastContainer />
      <BottomNav />
      <DesktopWarningDialog />
    </ToastProvider>
  );
}

export function HydrateFallback() {
  return (
    <div className="min-h-screen bg-paper-base flex flex-col items-center justify-center">
      <img
        src="/logo.svg"
        alt="Folio"
        className="w-16 h-16 rounded-xl mb-4 animate-pulse"
      />
      <p className="font-mono text-xs text-ink-utility tracking-widest">
        CARREGANDO…
      </p>
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "Ocorreu um erro inesperado.";
  let stack: string | undefined;
  let is404 = false;

  if (isRouteErrorResponse(error)) {
    is404 = error.status === 404;
    message = is404 ? "404" : "Erro";
    details = is404
      ? "A página solicitada não foi encontrada."
      : error.statusText || details;
  } else if (error && error instanceof Error) {
    details = error.message;
    if (import.meta.env.DEV) {
      stack = error.stack;
    }
  }

  const errorDetails = stack || (error instanceof Error ? error.message : details);

  return (
    <main className="min-h-screen bg-paper-base flex flex-col items-center justify-center p-6 text-center">
      <img
        src="/logo.svg"
        alt="Folio"
        className="w-16 h-16 rounded-xl mb-6 opacity-50"
      />
      <h1 className="font-sans font-bold text-4xl text-ink-primary mb-2">{message}</h1>
      <p className="text-ink-secondary font-body mb-6">{details}</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href="/"
          className="px-4 py-2 bg-action-blue text-white rounded-lg font-body font-medium hover:bg-action-hover btn-press focus-ring"
        >
          Voltar ao início
        </a>
        {!is404 && (
          <BugReportButton variant="full" errorDetails={errorDetails} />
        )}
      </div>
      {stack && (
        <pre className="mt-8 p-4 bg-paper-card border border-paper-line rounded-lg text-left overflow-x-auto text-xs font-mono text-ink-utility max-w-full">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
