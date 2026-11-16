interface IconProps {
  path: string;
  size?: number;
}

export function Icon({ path, size = 22 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  );
}

export const ICONS = {
  chat: 'M4 5h16v11H9l-5 4z',
  read: 'M9 4h6v3H9zM7 5H5v16h14V5h-2M8 12h8M8 16h5',
  close: 'M6 6l12 12M18 6L6 18',
  back: 'M15 5l-7 7 7 7',
} as const;
