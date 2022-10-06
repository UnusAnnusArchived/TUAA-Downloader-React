import { ThemeProvider } from '@mui/material/styles';
import { createRoot } from 'react-dom/client';
import App from './App';
import theme from './components/layout/theme';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
  <>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </>
);
