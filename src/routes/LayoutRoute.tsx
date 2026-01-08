import { Outlet } from 'react-router-dom';
import Layout from '@/components/Layout';

/**
 * LayoutRoute Component
 * Renders the main layout wrapper with child routes via Outlet.
 * This follows React Router v7 best practice for layout routes.
 */
export default function LayoutRoute() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
