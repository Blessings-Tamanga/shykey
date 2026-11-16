import type { KeyboardEvent } from 'react';
import type { Mode } from '../types';

interface ModeCardProps {
  mode: Mode;
  done?: boolean;
  onSelect(): void;
}

export function ModeCard({ mode, done = false, onSelect }: ModeCardProps) {
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect();
    }
  }

  return (
    <div
      className="mode-card"
      role="button"
      tabIndex={0}
      style={{ background: mode.color }}
      onClick={onSelect}
      onKeyDown={onKeyDown}
    >
      <span className="tag">{done ? 'Done ✓' : 'Daily'}</span>
      <div className="stack-illustration" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <b>{mode.title}</b>
      <p>{mode.description}</p>
    </div>
  );
}
