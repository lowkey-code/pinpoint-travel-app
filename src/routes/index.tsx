import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import LayoutRoute from '@/routes/LayoutRoute';
import { PageWithSuspense } from '@/routes/RouteComponents';

// Lazy load pages for better performance
const Attractions = lazy(() => import('@/pages/Attractions'));
const AttractionDetail = lazy(() => import('@/pages/AttractionDetail'));
const CreateAttraction = lazy(() => import('@/pages/CreateAttraction'));
const Menu = lazy(() => import('@/pages/Menu'));

export const router = createBrowserRouter([
  {
    element: <LayoutRoute />,
    children: [
      {
        path: '/',
        element: <PageWithSuspense Page={Attractions} />,
      },
      {
        path: '/attraction/:id',
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
