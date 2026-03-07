import type { CSSProperties } from 'react';

interface Props {
  style?: CSSProperties;
  className?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
}

export default function CollapseNavIcon({ style, className, 'aria-hidden': ariaHidden }: Props) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      className={className}
      aria-hidden={ariaHidden}
    >
      <g clipPath="url(#fullmode-clip)">
        <path
          d="M3.33333 14C2.96667 14 2.65333 13.8667 2.39333 13.6067C2.13333 13.3467 2 13.0333 2 12.6667V3.33333C2 2.96667 2.13333 2.65333 2.39333 2.39333C2.65333 2.13333 2.96667 2 3.33333 2H12.6667C13.0333 2 13.3467 2.13333 13.6067 2.39333C13.8667 2.65333 14 2.96667 14 3.33333V12.6667C14 13.0333 13.8667 13.3467 13.6067 13.6067C13.3467 13.8667 13.0333 14 12.6667 14H3.33333ZM6.66667 12.6667H12.6667V3.33333H6.66667V12.6667Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="fullmode-clip">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
