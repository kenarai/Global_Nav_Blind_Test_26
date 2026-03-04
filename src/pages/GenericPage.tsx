import { useLocation } from 'react-router-dom';
import styles from './Page.module.css';

const fmt = (slug: string) =>
  slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

export default function GenericPage() {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);

  const title = segments.length === 0 ? 'Dashboard' : segments.map(fmt).join(' › ');

  return (
    <div className={styles.page}>
      <p className={styles.breadcrumb}>
        {segments.length === 0
          ? 'Home'
          : segments.map((seg, i) => (
              <span key={i}>
                {i > 0 && <span className={styles.sep}> › </span>}
                {fmt(seg)}
              </span>
            ))}
      </p>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.body}>
        <p>This is the <strong>{title}</strong> section.</p>
        <p className={styles.hint}>
          Navigate using the {__ACTIVE_OPTION__ === '1' ? 'top bar' : 'sidebar'} to explore the interface.
        </p>
        <div className={styles.placeholder} aria-hidden="true">
          <div className={styles.card} />
          <div className={styles.card} />
          <div className={styles.card} />
        </div>
      </div>
    </div>
  );
}
