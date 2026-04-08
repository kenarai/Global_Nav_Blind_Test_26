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
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Tooltip from '@/components/Tooltip';
import AtlasIcon from '@/icons/AtlasIcon';
import AtlasPanel from '@/components/AtlasPanel';
import AtlasModeLayout from '@/components/AtlasModeLayout';
import { NavCollapseContext } from '@/navCollapseContext';

// __ACTIVE_OPTION__ is injected at build time by vite.config.ts
// '1' → top nav (column layout), '2' or '3' → side nav (row layout)
const isSideNav = __ACTIVE_OPTION__ !== '1';
const isOption3 = __ACTIVE_OPTION__ === '3';
const isOption4 = __ACTIVE_OPTION__ === '4' || __ACTIVE_OPTION__ === '5';
const isOption5 = __ACTIVE_OPTION__ === '5';

export default function App() {
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [atlasOpen, setAtlasOpen] = useState(false);
  const [aiMode, setAiMode] = useState(false);

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
          {isOption5 ? 'ServiceTitan' : 'Example App'}
        </span>
        {isOption5 && (
          <label onClick={() => setAiMode(p => !p)} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '28px', cursor: 'pointer', userSelect: 'none' }}>
            <div
              style={{
                width: '36px',
                height: '20px',
                borderRadius: '10px',
                background: aiMode ? 'linear-gradient(135deg, #0265DC, #00C2FF)' : '#D1D5DB',
                position: 'relative',
                transition: 'background 0.2s',
                flexShrink: 0,
              }}
            >
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                position: 'absolute',
                top: '2px',
                left: aiMode ? '18px' : '2px',
                transition: 'left 0.2s',
                boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
              }} />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 500, color: '#000000', whiteSpace: 'nowrap' }}>Atlas Mode</span>
            <svg width="0" height="0" style={{ position: 'absolute' }}>
              <defs>
                <linearGradient id="sparkle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0265DC" />
                  <stop offset="100%" stopColor="#00C2FF" />
                </linearGradient>
              </defs>
            </svg>
            <AutoAwesomeIcon style={{ fontSize: 16, fill: 'url(#sparkle-gradient)', marginLeft: '-2px' }} />
          </label>
        )}
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
        {!isOption5 && (
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
        )}
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
              <div style={{
                marginLeft: isOption5 && aiMode ? '-220px' : '0',
                transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                flexShrink: 0,
              }}>
                <Nav />
              </div>
              {isOption5 && aiMode ? (
                <AtlasModeLayout />
              ) : (
                <main id="main-content" className={styles.mainSide}>
                  <Routes>
                    <Route path="*" element={<GenericPage />} />
                  </Routes>
                </main>
              )}
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
