import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Container from './Container';
import { tokens } from '../theme/tokens';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      {/* Header with Gradient */}
      <header
        className="sticky top-0 z-30 text-white shadow-lg"
        style={{ background: tokens.colors.gradient.blue }}
      >
        <Container className="py-4 flex items-center justify-between">
          {/* Logo and Title */}
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <h1 className="text-2xl font-bold" style={tokens.typography.h1}>
              Pinpoint 🇨🇳
            </h1>
          </Link>

          {/* Navigation Buttons */}
          <nav className="flex items-center gap-2">
            <button
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              aria-label="Search"
              title="Search attractions"
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
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
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
      <main className="flex-1 w-full">
        <Container className="py-6">
          {children}
        </Container>
      </main>
    </div>
  );
}
