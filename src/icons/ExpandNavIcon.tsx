import type { CSSProperties } from 'react';

interface Props {
  style?: CSSProperties;
  className?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
}

export default function ExpandNavIcon({ style, className, 'aria-hidden': ariaHidden }: Props) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      className={className}
      aria-hidden={ariaHidden}
    >
      <path
        d="M5 21C4.45 21 3.98 20.8 3.59 20.41C3.2 20.02 3 19.55 3 19V5C3 4.45 3.2 3.98 3.59 3.59C3.98 3.2 4.45 3 5 3H19C19.55 3 20.02 3.2 20.41 3.59C20.8 3.98 21 4.45 21 5V19C21 19.55 20.8 20.02 20.41 20.41C20.02 20.8 19.55 21 19 21H5ZM8 19V5H5V19H8ZM10 19H19V5H10V19Z"
        fill="currentColor"
      />
      <path
        d="M16.54 12.3298L13.75 15.4598C13.65 15.5598 13.52 15.6198 13.38 15.6198C13.23 15.6198 13.1 15.5598 13 15.4598L12.46 14.8498C12.29 14.6598 12.29 14.3798 12.46 14.1898L14.41 11.9998L12.46 9.80982C12.29 9.61982 12.29 9.33982 12.46 9.14982L13 8.53982C13.19 8.32982 13.56 8.32982 13.75 8.53982L16.54 11.6698C16.71 11.8598 16.71 12.1398 16.54 12.3298Z"
        fill="currentColor"
      />
    </svg>
  );
}
