import { useLocation } from 'react-router-dom';
import styles from './Page.module.css';

const fmt = (slug: string) =>
  slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

// Slugs whose display name can't be round-tripped from the URL alone
const DISPLAY_OVERRIDES: Record<string, string> = {
  'batch-export-transactions': 'Batch/Export Transactions',
  'import-export': 'Import/Export',
};

const display = (seg: string) => DISPLAY_OVERRIDES[seg] ?? fmt(seg);

export default function GenericPage() {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);

  const pageTitle = segments.length === 0 ? 'Dashboard' : display(segments[segments.length - 1]);

  return (
    <div className={styles.page}>
      <p className={styles.breadcrumb}>
        {segments.length === 0
          ? 'Home'
          : segments.map((seg, i) => (
              <span key={i}>
                {i > 0 && <span className={styles.sep}> › </span>}
                {display(seg)}
              </span>
            ))}
      </p>
      <h1 className={styles.title}>{pageTitle}</h1>
      <div className={styles.body}>
        <div className={styles.placeholder} aria-hidden="true">
          <div className={styles.card} />
          <div className={styles.card} />
          <div className={styles.card} />
        </div>
      </div>
    </div>
  );
}
