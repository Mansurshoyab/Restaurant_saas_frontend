'use client';

// No dark mode is implemented yet — this exists as the seam for it.
// Left intentionally minimal rather than wiring a theme toggle nobody
// asked for; swap the child render for a real context provider if/when
// dark mode becomes a requirement.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}


