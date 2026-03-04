import styles from './nav.module.css';

/**
 * Option 3 — Nav variant stub.
 * Replace this implementation with the actual prototype design.
 * Do not change the export name: App.tsx imports { Nav } from '@nav/Nav'.
 */
export function Nav() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <header className={styles.header} role="banner">
        <nav className={styles.nav} aria-label="Global navigation">
          <ul className={styles.navList} role="list">
            <li><a href="/" className={styles.navLink}>Home</a></li>
            <li><a href="/about" className={styles.navLink}>About</a></li>
            <li><a href="/services" className={styles.navLink}>Services</a></li>
            <li><a href="/contact" className={styles.navLink}>Contact</a></li>
          </ul>
        </nav>
      </header>
    </>
  );
}
