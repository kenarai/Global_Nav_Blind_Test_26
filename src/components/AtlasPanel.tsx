import { useEffect, useRef } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import AtlasIcon from '@/icons/AtlasIcon';
import styles from './AtlasPanel.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AtlasPanel({ open, onClose }: Props) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) closeBtnRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  return (
    <div className={styles.outer} data-open={String(open)} aria-hidden={!open}>
      <div
        className={styles.panel}
        role="dialog"
        aria-label="AI Assistant"
        aria-modal="false"
      >
        <div className={styles.header}>
          <span className={styles.title}>
            <AtlasIcon aria-hidden="true" />
            AI Assistant
          </span>
          <button
            ref={closeBtnRef}
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close AI Assistant panel"
          >
            <CloseIcon style={{ fontSize: 18 }} aria-hidden="true" />
          </button>
        </div>
        <div className={styles.body} />
      </div>
    </div>
  );
}
