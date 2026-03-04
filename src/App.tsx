import { Route, Routes } from 'react-router-dom';
import { Nav } from '@nav/Nav';
import GenericPage from './pages/GenericPage';
import styles from './App.module.css';

// __ACTIVE_OPTION__ is injected at build time by vite.config.ts
// '1' → top nav (column layout), '2' or '3' → side nav (row layout)
const isSideNav = __ACTIVE_OPTION__ !== '1';

export default function App() {
  return (
    <div className={isSideNav ? styles.layoutSide : styles.layout}>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Nav />
      <main
        id="main-content"
        className={isSideNav ? styles.mainSide : styles.main}
      >
        <Routes>
          <Route path="*" element={<GenericPage />} />
        </Routes>
      </main>
    </div>
  );
}
