import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './context/authContext';
import Approutes from './routes/appRoutes';

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <AuthProvider>
          <BrowserRouter>
              <Approutes />
          </BrowserRouter>
      </AuthProvider>
  </StrictMode>
);
