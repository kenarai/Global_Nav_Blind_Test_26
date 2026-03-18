import type { CSSProperties } from 'react';

interface Props {
  style?: CSSProperties;
  className?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
}

export default function AtlasIcon({ style, className, 'aria-hidden': ariaHidden }: Props) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 25 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      className={className}
      aria-hidden={ariaHidden}
    >
      <path d="M1 7.5V20.5L12.4997 27L23.9994 20.5V7.5L12.4997 1L1 7.5Z" fill="url(#atlas-paint0)"/>
      <g style={{ mixBlendMode: 'overlay' }}>
        <path d="M1 20.5L5.90795 17.7254L1 14V20.5Z" fill="url(#atlas-paint1)"/>
        <path d="M23.9993 7.5L19.0913 10.2746L23.9993 14V7.5Z" fill="url(#atlas-paint2)"/>
        <path d="M12.4994 26.9996V21.4512L6.74951 23.75L12.4994 26.9996Z" fill="url(#atlas-paint3)"/>
        <path d="M12.499 1V6.54848L18.2489 4.24961L12.499 1Z" fill="url(#atlas-paint4)"/>
        <path d="M23.9999 20.4992L19.0919 17.7246L18.25 23.7496L23.9999 20.4992Z" fill="url(#atlas-paint5)"/>
        <path d="M1 7.50039L5.90795 10.275L6.74986 4.25L1 7.50039Z" fill="url(#atlas-paint6)"/>
      </g>
      <g style={{ mixBlendMode: 'overlay' }}>
        <path d="M1 7.5L5.90795 10.2746L1 14V7.5Z" fill="url(#atlas-paint7)"/>
        <path d="M23.9993 20.5L19.0913 17.7254L23.9993 14V20.5Z" fill="url(#atlas-paint8)"/>
        <path d="M1 20.5002L5.90795 17.7256L6.74986 23.7506L1 20.5002Z" fill="url(#atlas-paint9)"/>
        <path d="M23.9999 7.50039L19.0919 10.275L18.25 4.25L23.9999 7.50039Z" fill="url(#atlas-paint10)"/>
        <path d="M12.499 26.9996V21.4512L18.2489 23.75L12.499 26.9996Z" fill="url(#atlas-paint11)"/>
        <path d="M12.4994 1V6.54848L6.74951 4.24961L12.4994 1Z" fill="url(#atlas-paint12)"/>
      </g>
      <path opacity="0.66" d="M16.8937 6.54883H8.10518L3.71094 14.0003L8.10518 21.4519H16.8937L21.2879 14.0003L16.8937 6.54883Z" fill="white"/>
      <path d="M5.90771 10.275V17.7257L12.4995 21.4519L19.0912 17.7257V10.275L12.4995 6.54883L5.90771 10.275Z" fill="white"/>
      <path d="M12.5003 8.23828L14.0613 12.472L18.3858 13.9994L14.0613 15.5276L12.5003 19.7613L10.9402 15.5276L6.61572 13.9994L10.9402 12.472L12.5003 8.23828Z" fill="url(#atlas-paint13)"/>
      <path d="M6.61572 13.999H12.5003V19.7602L10.9402 15.5264L6.61572 13.999Z" fill="url(#atlas-paint14)"/>
      <path d="M18.3851 13.9994H12.5005V8.23828L14.0606 12.472L18.3851 13.9994Z" fill="url(#atlas-paint15)"/>
      <defs>
        <linearGradient id="atlas-paint0" x1="1" y1="14" x2="23.9994" y2="14" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2F6CDB"/>
          <stop offset="1" stopColor="#55AAE7"/>
        </linearGradient>
        <linearGradient id="atlas-paint1" x1="15.0516" y1="-2.26979" x2="-12.1887" y2="42.1659" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4357B5"/>
          <stop offset="1" stopColor="#2E6BD3"/>
        </linearGradient>
        <linearGradient id="atlas-paint2" x1="26.3355" y1="4.64776" x2="-0.905534" y2="49.0827" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4357B5"/>
          <stop offset="1" stopColor="#2E6BD3"/>
        </linearGradient>
        <linearGradient id="atlas-paint3" x1="23.8548" y1="3.12622" x2="-3.38622" y2="47.5619" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4357B5"/>
          <stop offset="1" stopColor="#2E6BD3"/>
        </linearGradient>
        <linearGradient id="atlas-paint4" x1="17.5322" y1="-0.749373" x2="-9.7088" y2="43.6864" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4357B5"/>
          <stop offset="1" stopColor="#2E6BD3"/>
        </linearGradient>
        <linearGradient id="atlas-paint5" x1="29.5412" y1="6.61136" x2="2.30019" y2="51.0471" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4357B5"/>
          <stop offset="1" stopColor="#2E6BD3"/>
        </linearGradient>
        <linearGradient id="atlas-paint6" x1="11.8465" y1="-4.23454" x2="-15.3938" y2="40.2012" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4357B5"/>
          <stop offset="1" stopColor="#2E6BD3"/>
        </linearGradient>
        <linearGradient id="atlas-paint7" x1="4.84645" y1="12.7349" x2="-0.340045" y2="9.9425" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2E6BD3"/>
          <stop offset="1" stopColor="#2F044D"/>
        </linearGradient>
        <linearGradient id="atlas-paint8" x1="20.8917" y1="15.6081" x2="25.3054" y2="18.0411" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2E6BD3"/>
          <stop offset="1" stopColor="#2F044D"/>
        </linearGradient>
        <linearGradient id="atlas-paint9" x1="8.07693" y1="19.8824" x2="2.32459" y2="22.8198" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2E6BD3"/>
          <stop offset="1" stopColor="#2F044D"/>
        </linearGradient>
        <linearGradient id="atlas-paint10" x1="17.8314" y1="7.70839" x2="22.7354" y2="4.98935" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2E6BD3"/>
          <stop offset="1" stopColor="#2F044D"/>
        </linearGradient>
        <linearGradient id="atlas-paint11" x1="15.3736" y1="20.9234" x2="15.3736" y2="26.9104" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2E6BD3"/>
          <stop offset="1" stopColor="#2F044D"/>
        </linearGradient>
        <linearGradient id="atlas-paint12" x1="9.62404" y1="7.39367" x2="9.62404" y2="1.34227" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2E6BD3"/>
          <stop offset="1" stopColor="#2F044D"/>
        </linearGradient>
        <linearGradient id="atlas-paint13" x1="12.5003" y1="8.37022" x2="12.5003" y2="19.5564" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2E6BD3"/>
          <stop offset="1" stopColor="#2F044D"/>
        </linearGradient>
        <linearGradient id="atlas-paint14" x1="9.10022" y1="17.5164" x2="11.6364" y2="13.8328" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2E6BD3"/>
          <stop offset="1" stopColor="#2F044D"/>
        </linearGradient>
        <linearGradient id="atlas-paint15" x1="15.4432" y1="13.9117" x2="15.4432" y2="10.7079" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2E6BD3"/>
          <stop offset="1" stopColor="#2F044D"/>
        </linearGradient>
      </defs>
    </svg>
  );
}
