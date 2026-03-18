import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PaymentIcon from '@mui/icons-material/Payment';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import BarChartIcon from '@mui/icons-material/BarChart';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import AppsIcon from '@mui/icons-material/Apps';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandNavIcon from './ExpandNavIcon';
import CollapseNavIcon from './CollapseNavIcon';
import Tooltip from '@/components/Tooltip';
import type { SvgIconComponent } from '@mui/icons-material';
import styles from './nav.module.css';

interface NavItemDef {
  icon: SvgIconComponent;
  label: string;
  pages: string[] | null;
  pageBadges?: Record<string, number>;
}

const navItems: NavItemDef[] = [
  { icon: DashboardIcon,        label: 'Dashboard',    pages: null },
  { icon: PeopleAltIcon,        label: 'Accounts',     pages: ['All Accounts', 'Organizations', 'Contacts'] },
  { icon: TrendingUpIcon,       label: 'Sales',        pages: ['Pipeline', 'Opportunities', 'Quotes', 'Contracts'] },
  { icon: PlaylistAddCheckIcon, label: 'Actions',      pages: ['Approvals', 'Task Queue', 'Pending Reviews', 'Audit Logs'],
    pageBadges: { 'Task Queue': 3, 'Pending Reviews': 1 } },
  { icon: AccountTreeIcon,      label: 'Projects',     pages: ['Active Projects', 'Portfolios', 'Resource Planning', 'Timesheets'] },
  { icon: PaymentIcon,          label: 'Billing',      pages: null },
  { icon: FolderOpenIcon,       label: 'Documents',    pages: ['All Files', 'Templates', 'Shared with Me'] },
  { icon: BarChartIcon,         label: 'Reports',      pages: null },
  { icon: CorporateFareIcon,    label: 'Organization', pages: ['Departments', 'Business Units', 'Facilities', 'Directory'] },
  { icon: AppsIcon,             label: 'Apps',         pages: ['App Catalog', 'Installed Apps', 'Custom Builds', 'API Management'] },
];

const slugify = (str: string) =>
  str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

// ─── HoverCard ────────────────────────────────────────────────────────────────

interface HoverCardChildren {
  trigger: React.ReactNode;
  content: React.ReactNode;
}

interface HoverCardProps {
  children: HoverCardChildren;
  width: string;
  label: string;
  hasContent: boolean;
  activeHoverLabel: string | null;
  onActivate: (label: string) => void;
  onScheduleHide: () => void;
  onCancelHide: () => void;
  onHideNow: () => void;
}

function HoverCard({ children, width, label, hasContent, activeHoverLabel, onActivate, onScheduleHide, onCancelHide, onHideNow }: HoverCardProps) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const visible = activeHoverLabel === label;

  const handleMouseEnter = () => {
    if (!hasContent) {
      // No submenu — close any currently open hover card immediately
      onHideNow();
      return;
    }
    onCancelHide();
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setPos({ top: rect.top, left: rect.right + 4 });
    }
    onActivate(label);
  };

  return (
    <div
      ref={wrapperRef}
      className={styles.hoverCardWrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onScheduleHide}
    >
      <div className={styles.hoverCardTrigger}>{children.trigger}</div>
      {visible && width !== '0px' && pos && createPortal(
        <div
          className={styles.hoverCard}
          style={{ position: 'fixed', top: pos.top, left: pos.left, width }}
          onMouseEnter={onCancelHide}
          onMouseLeave={onScheduleHide}
        >
          {children.content}
        </div>,
        document.body
      )}
    </div>
  );
}

// ─── NavItem ──────────────────────────────────────────────────────────────────

interface NavItemProps extends NavItemDef {
  isPrimaryExpanded: boolean;
  expandedLabels: Set<string>;
  collapsedLabels: Set<string>;
  setSubmenuOpen: (label: string, open: boolean) => void;
  collapseAllLabels: () => void;
  activeHoverLabel: string | null;
  onHoverActivate: (label: string) => void;
  onHoverScheduleHide: () => void;
  onHoverCancelHide: () => void;
  onHoverHideNow: () => void;
}

function NavItem({ icon: Icon, label, pages, pageBadges, isPrimaryExpanded, expandedLabels, collapsedLabels, setSubmenuOpen, collapseAllLabels, activeHoverLabel, onHoverActivate, onHoverScheduleHide, onHoverCancelHide, onHoverHideNow }: NavItemProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const totalBadge = pageBadges ? Object.values(pageBadges).reduce((a, b) => a + b, 0) : 0;

  const itemPath = label === 'Dashboard' ? '/' : `/${slugify(label)}`;
  const isActiveModule = label === 'Dashboard'
    ? pathname === '/'
    : pathname.startsWith(`/${slugify(label)}`);

  // Show sub-pages if manually expanded, OR active module that hasn't been explicitly collapsed
  const showSubPages = isPrimaryExpanded && pages != null &&
    (expandedLabels.has(label) || (isActiveModule && !collapsedLabels.has(label)));

  // Always highlight the parent module when it (or any of its sub-pages) is active
  const isActive = isActiveModule;

  const handleNavItemClick = () => {
    collapseAllLabels(); // collapse all manual expansions on navigate
    navigate(pages && pages.length > 0 ? `${itemPath}/${slugify(pages[0])}` : itemPath);
  };

  const handleCaretClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSubmenuOpen(label, !showSubPages);
  };

  const handlePageClick = (page: string) => {
    collapseAllLabels(); // collapse all manual expansions on navigate
    navigate(`${itemPath}/${slugify(page)}`);
  };

  const hoverWidth = isPrimaryExpanded ? '0px' : '240px';

  return (
    <div className={styles.navItemWrapper}>
      <HoverCard
        width={hoverWidth}
        label={label}
        hasContent={pages != null}
        activeHoverLabel={activeHoverLabel}
        onActivate={onHoverActivate}
        onScheduleHide={onHoverScheduleHide}
        onCancelHide={onHoverCancelHide}
        onHideNow={onHoverHideNow}
      >
        {{
          trigger: (
            <li
              className={`${styles.navItem} ${isPrimaryExpanded ? styles.widthExpanded : ''} ${isActive ? styles.navItemActive : ''}`}
              onClick={handleNavItemClick}
            >
              <span className={styles.icon}>
                <Icon style={{ fontSize: 20, color: isActive ? '#78BBFA' : '#ffffff' }} aria-hidden="true" />
                {totalBadge > 0 && !isPrimaryExpanded && (
                  <span className={styles.iconBadge}>{totalBadge}</span>
                )}
              </span>
              <span className={isPrimaryExpanded ? styles.label : styles.el}>
                {label}
              </span>
              {totalBadge > 0 && isPrimaryExpanded && (
                <span className={styles.notifBadge} style={{ marginLeft: 'auto', marginRight: pages ? 44 : 8 }}>{totalBadge}</span>
              )}
              {pages && isPrimaryExpanded && (
                <button
                  className={styles.caretBtn}
                  onClick={handleCaretClick}
                  aria-label={showSubPages ? 'Collapse sub-pages' : 'Expand sub-pages'}
                  aria-expanded={showSubPages}
                  style={{
                    transform: showSubPages ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                >
                  <ExpandMoreIcon style={{ fontSize: 16, color: '#ffffff' }} />
                </button>
              )}
            </li>
          ),
          content: (
            <div>
              {!isPrimaryExpanded && (
                <p className={styles.hoverLabel}>
                  {label}
                </p>
              )}
              {!isPrimaryExpanded && pages && (
                <ul className={styles.pagesList}>
                  {pages.map(page => (
                    <li
                      key={page}
                      className={styles.pageItem}
                      onClick={() => handlePageClick(page)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                    >
                      <span>{page}</span>
                      {pageBadges?.[page] !== undefined && (
                        <span className={styles.notifBadge}>{pageBadges[page]}</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ),
        }}
      </HoverCard>

      {showSubPages && (
        <ul className={styles.subPages}>
          {pages!.map(page => (
            <li
              key={page}
              className={[
                styles.subPageItem,
                pathname === `${itemPath}/${slugify(page)}` ? styles.subPageItemActive : '',
              ].filter(Boolean).join(' ')}
              onClick={() => handlePageClick(page)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <span>{page}</span>
              {pageBadges?.[page] !== undefined && (
                <span className={styles.notifBadge}>{pageBadges[page]}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Nav (exported) ───────────────────────────────────────────────────────────

// Dummy export — Sidebar is only used by Option 1
export function Sidebar() { return null; }

export function Nav() {
  const [isPrimaryExpanded, setPrimaryExpanded] = useState(true);
  const [expandedLabels, setExpandedLabels] = useState<Set<string>>(new Set());
  const [collapsedLabels, setCollapsedLabels] = useState<Set<string>>(new Set());
  const [activeHoverLabel, setActiveHoverLabel] = useState<string | null>(null);
  const hoverHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverShowTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setSubmenuOpen = (label: string, open: boolean) => {
    if (open) {
      setExpandedLabels(prev => { const n = new Set(prev); n.add(label); return n; });
      setCollapsedLabels(prev => { const n = new Set(prev); n.delete(label); return n; });
    } else {
      setExpandedLabels(prev => { const n = new Set(prev); n.delete(label); return n; });
      setCollapsedLabels(prev => { const n = new Set(prev); n.add(label); return n; });
    }
  };

  // On navigate: clear both sets so the new active module auto-expands cleanly
  const collapseAllLabels = () => {
    setExpandedLabels(new Set());
    setCollapsedLabels(new Set());
  };

  const onHoverCancelHide = () => {
    if (hoverHideTimer.current) {
      clearTimeout(hoverHideTimer.current);
      hoverHideTimer.current = null;
    }
  };

  const onHoverHideNow = () => {
    if (hoverShowTimer.current) {
      clearTimeout(hoverShowTimer.current);
      hoverShowTimer.current = null;
    }
    onHoverCancelHide();
    setActiveHoverLabel(null);
  };

  const onHoverScheduleHide = () => {
    if (hoverShowTimer.current) {
      clearTimeout(hoverShowTimer.current);
      hoverShowTimer.current = null;
    }
    onHoverCancelHide();
    hoverHideTimer.current = setTimeout(() => setActiveHoverLabel(null), 120);
  };

  const onHoverActivate = (label: string) => {
    onHoverCancelHide();
    if (activeHoverLabel !== null) {
      // Card already visible — switch instantly
      if (hoverShowTimer.current) {
        clearTimeout(hoverShowTimer.current);
        hoverShowTimer.current = null;
      }
      setActiveHoverLabel(label);
    } else {
      // No card visible — delay show by 300ms
      if (hoverShowTimer.current) clearTimeout(hoverShowTimer.current);
      hoverShowTimer.current = setTimeout(() => {
        setActiveHoverLabel(label);
        hoverShowTimer.current = null;
      }, 300);
    }
  };

  return (
    <aside
      className={`${styles.primaryContainer} ${isPrimaryExpanded ? styles.expanded : styles.collapsed}`}
      aria-label="Global navigation"
    >
      <ul className={styles.primaryNav} role="list">
        {navItems.map(item => (
          <NavItem
            key={item.label}
            {...item}
            isPrimaryExpanded={isPrimaryExpanded}
            expandedLabels={expandedLabels}
            collapsedLabels={collapsedLabels}
            setSubmenuOpen={setSubmenuOpen}
            collapseAllLabels={collapseAllLabels}
            activeHoverLabel={activeHoverLabel}
            onHoverActivate={onHoverActivate}
            onHoverScheduleHide={onHoverScheduleHide}
            onHoverCancelHide={onHoverCancelHide}
            onHoverHideNow={onHoverHideNow}
          />
        ))}
      </ul>

      <div
        className={styles.toggleAffordance}
        onClick={() => setPrimaryExpanded(prev => !prev)}
        role="button"
        aria-expanded={isPrimaryExpanded}
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && setPrimaryExpanded(prev => !prev)}
      >
        {isPrimaryExpanded
          ? <CollapseNavIcon style={{ color: '#ffffff' }} aria-hidden="true" />
          : (
            <Tooltip label="Expand the menu" placement="right">
              <ExpandNavIcon style={{ color: '#ffffff' }} aria-hidden="true" />
            </Tooltip>
          )
        }
        {isPrimaryExpanded && (
          <span className={styles.toggleLabel}>Collapse the menu</span>
        )}
      </div>
    </aside>
  );
}
