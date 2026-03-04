import { Nav } from '@nav/Nav';
import styles from './App.module.css';

// The active option is injected at build time via vite.config.ts
// @nav always resolves to the correct Option_X folder — no runtime branching needed.

export default function App() {
  return (
    <div className={styles.layout}>
      <Nav />
      <main className={styles.main}>
        <h1>Global Nav Blind Test</h1>
        <p>
          You are viewing a navigation prototype. Use the nav above to explore the interface.
        </p>
      </main>
    </div>
  );
}
