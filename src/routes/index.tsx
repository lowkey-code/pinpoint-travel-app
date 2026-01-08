import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/components/Layout';

// Lazy load pages for better performance
const Home = lazy(() => import('@/pages/Home'));
const AttractionDetail = lazy(() => import('@/pages/AttractionDetail'));
const CreateAttraction = lazy(() => import('@/pages/CreateAttraction'));
const Menu = lazy(() => import('@/pages/Menu'));

// Loading fallback
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

export const router = createBrowserRouter([
  {
    element: (
      <Suspense fallback={<PageLoader />}>
        <Layout>
          <Home />
        </Layout>
      </Suspense>
    ),
    path: '/',
  },
  {
    element: (
      <Suspense fallback={<PageLoader />}>
        <Layout>
          <AttractionDetail />
        </Layout>
      </Suspense>
    ),
    path: '/atração/:id',
  },
  {
    element: (
      <Suspense fallback={<PageLoader />}>
        <Layout>
          <CreateAttraction />
        </Layout>
      </Suspense>
    ),
    path: '/nova',
  },
  {
    element: (
      <Suspense fallback={<PageLoader />}>
        <Layout>
          <Menu />
        </Layout>
      </Suspense>
    ),
    path: '/menu',
  },
]);
