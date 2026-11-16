import type { PropsWithChildren } from 'react';

export function Screen({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <main className={`screen ${className}`.trim()}>{children}</main>;
}
