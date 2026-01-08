import { Suspense } from 'react';

/**
 * Loading fallback component shown while lazy-loaded pages are loading
 */
export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4" />
        <p className="text-neutral-600">Carregando...</p>
      </div>
    </div>
  );
}

/**
 * Wrapper component for lazy-loaded pages with Suspense boundary
 */
interface PageWithSuspenseProps {
  Page: React.ComponentType;
}

export function PageWithSuspense({ Page }: PageWithSuspenseProps) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Page />
    </Suspense>
  );
}
