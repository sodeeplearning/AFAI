import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import 'app/styles/index.scss'
import { ThemeProvider } from 'app/providers/ThemeProvider/index.ts';
import App from 'app/App';
import 'shared/config/i18n/i18n';
import { ErrorBoundary } from 'app/providers/ErrorBoundary';

const root = createRoot(document.getElementById('root')!);

root.render(
  <BrowserRouter>
      <ErrorBoundary>
      <ThemeProvider>
        <StrictMode>
          <App />
        </StrictMode>
      </ThemeProvider>
      </ErrorBoundary>
  </BrowserRouter>,
);

