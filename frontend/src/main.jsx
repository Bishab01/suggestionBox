import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import Approutes from './routes/appRoutes';

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
          <Approutes />
      </BrowserRouter>
  </StrictMode>
);
