import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { ToastProvider } from '@/components/ui';
import { AttractionsProvider } from '@/context/AttractionsContext';
import { ArkUIProvider } from '@/lib/ark-ui-setup';

function App() {
  return (
    <ArkUIProvider>
      <ToastProvider>
        <AttractionsProvider>
          <RouterProvider router={router} />
        </AttractionsProvider>
      </ToastProvider>
    </ArkUIProvider>
  );
}

export default App;
