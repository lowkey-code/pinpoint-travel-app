import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import LayoutRoute from '@/routes/LayoutRoute';

// Lazy load pages for better performance
const Home = lazy(() => import('@/pages/Home'));
const AttractionDetail = lazy(() => import('@/pages/AttractionDetail'));
const CreateAttraction = lazy(() => import('@/pages/CreateAttraction'));
const Menu = lazy(() => import('@/pages/Menu'));

// Loading fallback component
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4" />
        <p className="text-neutral-600">Carregando...</p>
      </div>
    </div>
  );
}

// Wrapper component for lazy-loaded pages with Suspense
function PageWithSuspense({ Page }: { Page: React.ComponentType }) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Page />
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    element: <LayoutRoute />,
    children: [
      {
        path: '/',
        element: <PageWithSuspense Page={Home} />,
      },
      {
        path: '/atração/:id',
        element: <PageWithSuspense Page={AttractionDetail} />,
      },
      {
        path: '/nova',
        element: <PageWithSuspense Page={CreateAttraction} />,
      },
      {
        path: '/menu',
        element: <PageWithSuspense Page={Menu} />,
      },
    ],
  },
]);
