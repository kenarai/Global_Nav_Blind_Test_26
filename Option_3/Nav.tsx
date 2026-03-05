import { useState, useRef, useId } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
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
import type { SvgIconComponent } from '@mui/icons-material';
import styles from './nav.module.css';
import { useNavCollapse } from '@/navCollapseContext';

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItemDef {
  icon: SvgIconComponent;
  label: string;
  to: string;
  badge?: number;
  pages?: string[];
}

const slugify = (str: string) =>
  str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

interface Section {
  title: string | null;
  items: NavItemDef[];
}

// ─── Nav data ─────────────────────────────────────────────────────────────────

const sections: Section[] = [
  {
    title: null,
    items: [
      { icon: DashboardIcon, label: 'Dashboard', to: '/' },
    ],
  },
  {
    title: 'Business',
    items: [
      { icon: PeopleAltIcon,   label: 'Accounts', to: '/accounts',
        pages: ['All Accounts', 'Organizations', 'Contacts'] },
      { icon: TrendingUpIcon,  label: 'Sales',    to: '/sales',
        pages: ['Pipeline', 'Opportunities', 'Quotes', 'Contracts'] },
      { icon: AccountTreeIcon, label: 'Projects', to: '/projects',
        pages: ['Active Projects', 'Portfolios', 'Resource Planning', 'Timesheets'] },
      { icon: PaymentIcon,     label: 'Billing',  to: '/billing' },
    ],
  },
  {
    title: 'Content',
    items: [
      { icon: FolderOpenIcon, label: 'Documents', to: '/documents',
        pages: ['All Files', 'Templates', 'Shared with Me'] },
      { icon: BarChartIcon,   label: 'Reports',   to: '/reports' },
    ],
  },
  {
    title: 'Admin',
    items: [
      { icon: CorporateFareIcon,    label: 'Organization', to: '/organization',
        pages: ['Departments', 'Business Units', 'Facilities', 'Directory'] },
      { icon: PlaylistAddCheckIcon, label: 'Actions',      to: '/actions',
        pages: ['Approvals', 'Task Queue', 'Pending Reviews', 'Audit Logs'] },
      { icon: AppsIcon,             label: 'Applications', to: '/applications',
        pages: ['App Catalog', 'Installed Apps', 'Custom Builds', 'API Management'] },
    ],
  },
];

// ─── HoverCard (collapsed submenu flyout — portal) ───────────────────────────

interface HoverCardProps {
  item: NavItemDef;
  pos: { top: number; left: number };
  onNavigate: (path: string) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function HoverCard({ item, pos, onNavigate, onMouseEnter, onMouseLeave }: HoverCardProps) {
  return createPortal(
    <div
      className={styles.hoverCard}
      style={{ position: 'fixed', top: pos.top, left: pos.left }}
      role="menu"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button
        className={styles.hoverCardTitle}
        onClick={() => onNavigate(item.to)}
        role="menuitem"
      >
        {item.label}
      </button>
      <ul className={styles.hoverCardList}>
        {item.pages!.map(page => (
          <li key={page}>
            <button
              className={styles.hoverCardItem}
              onClick={() => onNavigate(`${item.to}/${slugify(page)}`)}
              role="menuitem"
            >
              {page}
            </button>
          </li>
        ))}
      </ul>
    </div>,
    document.body
  );
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────

interface TooltipProps {
  id: string;
  label: string;
  visible: boolean;
}

function Tooltip({ id, label, visible }: TooltipProps) {
  return (
    <span
      id={id}
      role="tooltip"
      className={`${styles.tooltip} ${visible ? styles.tooltipVisible : ''}`}
      aria-hidden={!visible}
    >
      {label}
    </span>
  );
}

// ─── NavItem ──────────────────────────────────────────────────────────────────

interface NavItemProps {
  item: NavItemDef;
  isCollapsed: boolean;
  isActive: boolean;
}

function NavItem({ item, isCollapsed, isActive }: NavItemProps) {
  const { icon: Icon, label, to, badge } = item;

  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hoverPos, setHoverPos] = useState<{ top: number; left: number } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const wrapperRef = useRef<HTMLLIElement>(null);
  const tooltipId = useId();
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    clearTimeout(leaveTimerRef.current);
    setIsHovered(true);
    if (item.pages && wrapperRef.current && (isCollapsed || !isActive)) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setHoverPos({ top: rect.top, left: rect.right + 8 });
    } else if (isCollapsed && !item.pages) {
      timerRef.current = setTimeout(() => setShowTooltip(true), 350);
    }
  };

  const handleMouseLeave = () => {
    leaveTimerRef.current = setTimeout(() => {
      setIsHovered(false);
      setHoverPos(null);
      clearTimeout(timerRef.current);
      setShowTooltip(false);
    }, 80);
  };

  const handleCardEnter = () => {
    clearTimeout(leaveTimerRef.current);
    setIsHovered(true);
  };

  return (
    <li
      ref={wrapperRef}
      className={styles.navItemWrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <NavLink
        to={to}
        end={to === '/'}
        aria-describedby={isCollapsed && !item.pages && showTooltip ? tooltipId : undefined}
        className={({ isActive }) =>
          [
            styles.navItem,
            isActive ? styles.navItemActive : '',
            styles.navItemCollapsed,
          ]
            .filter(Boolean)
            .join(' ')
        }
      >
        {/* Icon + dot badge */}
        <span className={styles.iconWrap}>
          <Icon style={{ fontSize: 20 }} aria-hidden="true" />
          {badge !== undefined && (
            <span
              className={`${styles.badgeDot} ${styles.badgeDotVisible}`}
              aria-hidden="true"
            />
          )}
        </span>

        {/* Small label below icon — always shown */}
        <span className={styles.iconLabel}>{label}</span>
      </NavLink>

{/* Hover card — hovered + has sub-pages + (collapsed OR not the active module) */}
      {(isCollapsed || !isActive) && isHovered && item.pages && hoverPos && (
        <HoverCard
          item={item}
          pos={hoverPos}
          onNavigate={navigate}
          onMouseEnter={handleCardEnter}
          onMouseLeave={handleMouseLeave}
        />
      )}

      {/* Tooltip — collapsed + hovered + no sub-pages (with delay) */}
      {isCollapsed && !item.pages && (
        <Tooltip id={tooltipId} label={label} visible={showTooltip} />
      )}
    </li>
  );
}

// ─── Nav (exported) ───────────────────────────────────────────────────────────

// Dummy export — Sidebar is only used by Option 1
export function Sidebar() { return null; }

export function Nav() {
  const { isCollapsed } = useNavCollapse();
  const { pathname } = useLocation();

  // Flatten sections into a single item list (no section headers rendered)
  const allItems = sections.flatMap(s => s.items);

  // Active item with sub-pages drives the right panel
  const activeItem = allItems.find(
    item =>
      item.pages &&
      (item.to === '/' ? pathname === '/' : pathname.startsWith(item.to))
  );

  return (
    <aside
      className={`${styles.sidebar} ${isCollapsed ? styles.sidebarCollapsed : ''}`}
      aria-label="Global navigation"
    >
      {/* Left Rail */}
      <div className={styles.leftRail}>
        {/* Flat nav list — no section headers */}
        <nav aria-label="Primary navigation" className={styles.navBody}>
          <ul role="list" className={styles.navList}>
            {allItems.map(item => (
              <NavItem key={item.to} item={item} isCollapsed={isCollapsed} isActive={item.to === activeItem?.to} />
            ))}
          </ul>
        </nav>
      </div>

      {/* Right Panel — sub-pages for active module (expanded state only) */}
      {!isCollapsed && activeItem?.pages && (
        <div
          className={styles.rightPanel}
          aria-label={`${activeItem.label} sub-pages`}
        >
          <div className={styles.rightPanelHeader}>{activeItem.label}</div>
          <ul className={styles.rightPanelList} role="list">
            {activeItem.pages.map(page => (
              <li key={page}>
                <NavLink
                  to={`${activeItem.to}/${slugify(page)}`}
                  className={({ isActive }) =>
                    `${styles.rightPanelItem} ${isActive ? styles.rightPanelItemActive : ''}`
                  }
                >
                  {page}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
