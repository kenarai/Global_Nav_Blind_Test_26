import type { CSSProperties } from 'react';

interface Props {
  style?: CSSProperties;
  className?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
}

export default function CollapseNavIcon({ style, className, 'aria-hidden': ariaHidden }: Props) {
  return (
    <svg
      width="24"
      height="24"
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
        d="M16.54 14.1901C16.71 14.3801 16.71 14.6601 16.54 14.8501L16 15.4601C15.9 15.5601 15.77 15.6201 15.62 15.6201C15.48 15.6201 15.35 15.5601 15.25 15.4601L12.46 12.3301C12.29 12.1401 12.29 11.8601 12.46 11.6701L15.25 8.54007C15.44 8.33007 15.81 8.33007 16 8.54007L16.54 9.15007C16.71 9.34007 16.71 9.62007 16.54 9.81007L14.58 12.0001L16.54 14.1901Z"
        fill="currentColor"
      />
    </svg>
  );
}
