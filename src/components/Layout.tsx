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
      >
        <Container className="flex items-center justify-between py-4">
          {/* Logo and Title */}
          <Link
            to="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-90"
          >
            <h1 className="text-2xl font-bold font-heading">
              Pinpoint 🇨🇳
            </h1>
          </Link>

          {/* Navigation Buttons */}
          <nav className="flex items-center gap-2">
            <button
              className="p-2 rounded-lg transition-colors hover:bg-white hover:bg-opacity-20"
              aria-label="Search"
              title="Search attractions"
              type="button"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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
              className="p-2 rounded-lg transition-colors hover:bg-white hover:bg-opacity-20"
              title="Menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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
      <main className="w-full flex-1">
        <Container className="py-6">
          {children}
        </Container>
      </main>
    </div>
  );
}
