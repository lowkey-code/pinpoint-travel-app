import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Container from '@/components/Container';
import { designTokens } from '@/lib/design-tokens';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      {/* Header with Gradient */}
      <header
        className="sticky top-0 z-30 w-full text-white shadow-lg"
        style={{ background: designTokens.gradients.primary }}
        role="banner"
      >
        <Container className="flex items-center justify-between py-4">
          {/* Logo and Title */}
          <Link
            to="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white rounded-lg"
            aria-label="Pinpoint - Voltar para home"
          >
            <h1 className="text-2xl font-bold font-heading">
              Pinpoint 🇨🇳
            </h1>
          </Link>

          {/* Navigation Buttons */}
          <nav className="flex items-center gap-2" aria-label="Navegação secundária">
            <button
              className="p-2 rounded-lg transition-colors hover:bg-white hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Buscar atrações"
              type="button"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            <Link
              to="/menu"
              className="p-2 rounded-lg transition-colors hover:bg-white hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-white rounded-lg"
              aria-label="Menu de navegação"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Link>
          </nav>
        </Container>
      </header>

      {/* Main Content */}
      <main className="w-full flex-1" id="main-content">
        <Container className="py-6">
          {children}
        </Container>
      </main>

      {/* Skip to main content link (for accessibility) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-blue-600 focus:text-white focus:rounded-lg"
      >
        Pular para conteúdo principal
      </a>
    </div>
  );
}
