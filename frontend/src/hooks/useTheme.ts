import { useState } from 'react';

export function useTheme() {
  const [dark, setDark] = useState(
    document.documentElement.dataset.theme
      ? document.documentElement.dataset.theme === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches,
  );

  function toggleTheme() {
    const next = !dark;
    document.documentElement.dataset.theme = next ? 'dark' : 'light';
    setDark(next);
  }

  return { dark, toggleTheme };
}
