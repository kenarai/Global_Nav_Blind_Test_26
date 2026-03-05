import { useState, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styles from './Tooltip.module.css';

interface TooltipProps {
  label: string;
  placement?: 'right' | 'bottom';
  children: ReactNode;
}

export default function Tooltip({ label, placement = 'right', children }: TooltipProps) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const wrapperRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = () => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    if (placement === 'right') {
      setPos({ top: rect.top + rect.height / 2, left: rect.right + 8 });
    } else {
      setPos({ top: rect.bottom + 8, left: rect.left });
    }
  };

  return (
    <span
      ref={wrapperRef}
      className={styles.wrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setPos(null)}
    >
      {children}
      {pos && createPortal(
        <span
          className={`${styles.tip} ${styles[placement]}`}
          style={{ top: pos.top, left: pos.left }}
          role="tooltip"
        >
          {label}
        </span>,
        document.body
      )}
    </span>
  );
}
