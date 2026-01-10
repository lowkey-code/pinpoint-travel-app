import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { ToastProvider } from '@/components/ui';
import { AttractionsProvider } from '@/context/AttractionsContext';

function App() {
  return (
    <ToastProvider>
      <AttractionsProvider>
        <RouterProvider router={router} />
      </AttractionsProvider>
    </ToastProvider>
  );
}

export default App;
