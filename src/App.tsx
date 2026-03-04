import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Nav, Sidebar } from '@nav/Nav';
import GenericPage from './pages/GenericPage';
import styles from './App.module.css';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import { NavCollapseContext } from '@/navCollapseContext';

// __ACTIVE_OPTION__ is injected at build time by vite.config.ts
// '1' → top nav (column layout), '2' or '3' → side nav (row layout)
const isSideNav = __ACTIVE_OPTION__ !== '1';
const isOption3 = __ACTIVE_OPTION__ === '3';

export default function App() {
  const [navCollapsed, setNavCollapsed] = useState(false);

  const globalBar = (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '40px',
      backgroundColor: '#d14233',
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0,
    }}>
      {/* Left side: hamburger (Option 3 only) + app name */}
      <div style={{ position: 'absolute', left: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        {isOption3 && (
          <button
            onClick={() => setNavCollapsed(p => !p)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
            aria-label={navCollapsed ? 'Expand navigation' : 'Collapse navigation'}
            aria-expanded={!navCollapsed}
          >
            <MenuIcon style={{ fontSize: 20, color: '#ffffff' }} aria-hidden="true" />
          </button>
        )}
        <span style={{ color: '#ffffff', fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap' }}>
          Lorem App
        </span>
      </div>

      {/* Search bar — center */}
      <div style={{
        margin: '0 auto',
        width: '25vw',
        height: '24px',
        backgroundColor: 'rgba(255,255,255,0.25)',
        borderRadius: '4px',
        position: 'relative',
      }}>
        <SearchIcon style={{
          fontSize: 16,
          color: '#ffffff',
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
        }} />
      </div>

      {/* Icon group — right */}
      <div style={{
        position: 'absolute',
        right: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <NotificationsOutlinedIcon style={{ fontSize: 20, color: '#ffffff' }} />
        <HelpOutlineIcon style={{ fontSize: 20, color: '#ffffff' }} />
        <SettingsOutlinedIcon style={{ fontSize: 20, color: '#ffffff' }} />
        <AccountCircleOutlinedIcon style={{ fontSize: 20, color: '#ffffff' }} />
      </div>
    </div>
  );

  const collapseCtxValue = {
    isCollapsed: navCollapsed,
    onToggleCollapse: () => setNavCollapsed(p => !p),
  };

  if (isSideNav) {
    return (
      <NavCollapseContext.Provider value={collapseCtxValue}>
        {globalBar}
        <div className={styles.layoutSide}>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <Nav />
          <main id="main-content" className={styles.mainSide}>
            <Routes>
              <Route path="*" element={<GenericPage />} />
            </Routes>
          </main>
        </div>
      </NavCollapseContext.Provider>
    );
  }

  return (
    <NavCollapseContext.Provider value={collapseCtxValue}>
      {globalBar}
      <div className={styles.layout}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Nav />
        <div className={styles.layoutBody}>
          <Sidebar />
          <main id="main-content" className={styles.main}>
            <Routes>
              <Route path="*" element={<GenericPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </NavCollapseContext.Provider>
  );
}
