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
import Tooltip from '@/components/Tooltip';
import AtlasIcon from '@/icons/AtlasIcon';
import AtlasPanel from '@/components/AtlasPanel';
import { NavCollapseContext } from '@/navCollapseContext';

// __ACTIVE_OPTION__ is injected at build time by vite.config.ts
// '1' → top nav (column layout), '2' or '3' → side nav (row layout)
const isSideNav = __ACTIVE_OPTION__ !== '1';
const isOption3 = __ACTIVE_OPTION__ === '3' || __ACTIVE_OPTION__ === '5';
const isOption4 = __ACTIVE_OPTION__ === '4';

export default function App() {
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [atlasOpen, setAtlasOpen] = useState(false);

  const globalBar = (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '48px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #DFE0E1',
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0,
    }}>
      {/* Left side: hamburger (Option 3 only) + app name */}
      <div style={{ position: 'absolute', left: 0, display: 'flex', alignItems: 'center' }}>
        {isOption3 && (
          <div style={{ width: '64px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
            <Tooltip label={navCollapsed ? 'Show Submenu' : 'Hide Submenu'} placement="bottom">
              <button
                onClick={() => setNavCollapsed(p => !p)}
                className={`${styles.hamburgerBtn} ${navCollapsed ? styles.hamburgerBtnCollapsed : ''}`}
                aria-label={navCollapsed ? 'Show Submenu' : 'Hide Submenu'}
                aria-expanded={!navCollapsed}
              >
                <MenuIcon style={{ fontSize: 20, color: '#000000', opacity: 0.75 }} aria-hidden="true" />
              </button>
            </Tooltip>
          </div>
        )}
        <span style={{ color: '#000000', fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap', paddingLeft: isOption3 ? '12px' : '16px' }}>
          ServiceTitan
        </span>
      </div>

      {/* Search bar — center */}
      <div style={{
        margin: '0 auto',
        width: '25vw',
        height: '32px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #949596',
        position: 'relative',
      }}>
        <SearchIcon style={{
          fontSize: 16,
          color: '#000000',
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
        gap: '12px',
      }}>
        <Tooltip label="AI Assistant" placement="bottom">
          <button
            aria-label="AI Assistant"
            aria-expanded={isOption4 ? atlasOpen : undefined}
            aria-controls={isOption4 ? 'atlas-panel' : undefined}
            onClick={isOption4 ? () => setAtlasOpen(p => !p) : undefined}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', borderRadius: '4px' }}
          >
            <AtlasIcon aria-hidden="true" />
          </button>
        </Tooltip>
        <NotificationsOutlinedIcon style={{ fontSize: 20, color: '#000000' }} />
        <HelpOutlineIcon style={{ fontSize: 20, color: '#000000' }} />
        <SettingsOutlinedIcon style={{ fontSize: 20, color: '#000000' }} />
        <AccountCircleOutlinedIcon style={{ fontSize: 20, color: '#000000' }} />
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
        <div style={{ display: 'flex', flexDirection: 'row', height: '100vh', overflow: 'hidden' }}>
          {/* Left column: global bar + app */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {globalBar}
            <div className={styles.layoutSide} style={{ flex: 1, height: 'auto' }}>
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
          </div>
          {isOption4 && <AtlasPanel open={atlasOpen} onClose={() => setAtlasOpen(false)} />}
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
