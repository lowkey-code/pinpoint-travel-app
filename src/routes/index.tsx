import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import AttractionDetail from '../pages/AttractionDetail';
import CreateAttraction from '../pages/CreateAttraction';
import Menu from '../pages/Menu';

export const router = createBrowserRouter([
  {
    element: <Layout><Home /></Layout>,
    path: '/',
  },
  {
    element: <Layout><AttractionDetail /></Layout>,
    path: '/atração/:id',
  },
  {
    element: <Layout><CreateAttraction /></Layout>,
    path: '/nova',
  },
  {
    element: <Layout><Menu /></Layout>,
    path: '/menu',
  },
]);
