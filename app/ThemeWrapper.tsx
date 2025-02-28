// app/ThemeWrapper.tsx (Client Component)
'use client';

import { ThemeProvider, CssBaseline } from '@mui/material';
import { darkGreenTheme } from '@/lib/theme'; // Import directly

function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={darkGreenTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export default ThemeRegistry;