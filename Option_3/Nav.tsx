import { useState, useRef, useId, useEffect } from 'react';
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
  pageBadges?: Record<string, number>;
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
      { icon: TrendingUpIcon,       label: 'Sales',    to: '/sales',
        pages: ['Pipeline', 'Opportunities', 'Quotes', 'Contracts'] },
      { icon: PlaylistAddCheckIcon, label: 'Actions',  to: '/actions',
        pages: ['Approvals', 'Task Queue', 'Pending Reviews', 'Audit Logs'],
        pageBadges: { 'Task Queue': 3, 'Pending Reviews': 1 } },
      { icon: AccountTreeIcon,      label: 'Projects', to: '/projects',
        pages: ['Active Projects', 'Portfolios', 'Resource Planning', 'Timesheets'] },
      { icon: PaymentIcon,          label: 'Billing',  to: '/billing' },
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
      { icon: CorporateFareIcon, label: 'Organization', to: '/organization',
        pages: ['Departments', 'Business Units', 'Facilities', 'Directory'] },
      { icon: AppsIcon,          label: 'Apps',         to: '/applications',
        pages: ['App Catalog', 'Installed Apps', 'Custom Builds', 'API Management'] },
    ],
  },
];

// ─── HoverCard (collapsed submenu flyout — portal) ───────────────────────────

interface HoverCardProps {
  item: NavItemDef;
  pos: { top: number; left: number; height: number };
  onNavigate: (path: string) => void;
  onMouseEnter: () => void;
  onMouseLeave: (e: React.MouseEvent) => void;
}

function HoverCard({ item, pos, onNavigate, onMouseEnter, onMouseLeave }: HoverCardProps) {
  return createPortal(
    <>
      {/* Invisible bridge — fills the 8px gap between the nav rail and this card so
          the cursor can travel across without triggering a close */}
      <div
        data-hovercard="true"
        style={{
          position: 'fixed',
          top: pos.top,
          left: pos.left - 8,
          width: 8,
          height: pos.height,
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
      <div
        className={styles.hoverCard}
        data-hovercard="true"
        style={{ position: 'fixed', top: pos.top, left: pos.left }}
        role="menu"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
      <div className={styles.hoverCardTitle}>
        {item.label}
      </div>
      <ul className={styles.hoverCardList}>
        {item.pages!.map(page => (
          <li key={page}>
            <button
              className={styles.hoverCardItem}
              onClick={() => onNavigate(`${item.to}/${slugify(page)}`)}
              role="menuitem"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <span>{page}</span>
              {item.pageBadges?.[page] !== undefined && (
                <span className={styles.notifBadge}>{item.pageBadges[page]}</span>
              )}
            </button>
          </li>
        ))}
      </ul>
      </div>
    </>,
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
  onOpenPopover: (pos: { top: number; left: number; height: number }) => void;
  onClosePopover: () => void;
}

function NavItem({ item, isCollapsed, isActive, onOpenPopover, onClosePopover }: NavItemProps) {
  const { icon: Icon, label, to } = item;
  const totalBadge = item.pageBadges ? Object.values(item.pageBadges).reduce((a, b) => a + b, 0) : 0;

  const [showTooltip, setShowTooltip] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const wrapperRef = useRef<HTMLLIElement>(null);
  const tooltipId = useId();
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    if (item.pages && wrapperRef.current && (isCollapsed || !isActive)) {
      const rect = wrapperRef.current.getBoundingClientRect();
      onOpenPopover({ top: rect.top, left: rect.right + 8, height: rect.height });
    } else {
      // No submenu — close any open hover card immediately
      onClosePopover();
      if (isCollapsed && !item.pages) {
        timerRef.current = setTimeout(() => setShowTooltip(true), 350);
      }
    }
  };

  const handleMouseLeave = () => {
    clearTimeout(timerRef.current);
    setShowTooltip(false);
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
        onClick={item.pages?.length ? (e) => {
          e.preventDefault();
          navigate(`${to}/${slugify(item.pages![0])}`);
        } : undefined}
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
        {/* Icon + number badge */}
        <span className={styles.iconWrap}>
          <Icon style={{ fontSize: 20 }} aria-hidden="true" />
          {totalBadge > 0 && (
            <span className={styles.iconBadge} aria-hidden="true">{totalBadge}</span>
          )}
        </span>

        {/* Small label below icon — always shown */}
        <span className={styles.iconLabel}>{label}</span>
      </NavLink>

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
  const navigate = useNavigate();

  // Flatten sections into a single item list (no section headers rendered)
  const allItems = sections.flatMap(s => s.items);

  // Active item with sub-pages drives the right panel
  const activeItem = allItems.find(
    item =>
      item.pages &&
      (item.to === '/' ? pathname === '/' : pathname.startsWith(item.to))
  );

  // ── Popover state (lifted from NavItem) ──────────────────────────────────
  const navRef = useRef<HTMLElement>(null);
  const [popoverItem, setPopoverItem] = useState<NavItemDef | null>(null);
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number; height: number } | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const showTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const openPopover = (item: NavItemDef, pos: { top: number; left: number; height: number }) => {
    clearTimeout(closeTimerRef.current);
    const submenuSidebarVisible = !isCollapsed && !!activeItem;
    if (popoverItem !== null || submenuSidebarVisible) {
      // Card already visible, OR submenu sidebar shown — show instantly
      clearTimeout(showTimerRef.current);
      setPopoverItem(item);
      setPopoverPos(pos);
    } else {
      // Submenu sidebar not shown — delay show by 300ms
      clearTimeout(showTimerRef.current);
      showTimerRef.current = setTimeout(() => {
        setPopoverItem(item);
        setPopoverPos(pos);
      }, 300);
    }
  };

  const closePopover = () => {
    clearTimeout(closeTimerRef.current);
    clearTimeout(showTimerRef.current);
    setPopoverItem(null);
    setPopoverPos(null);
  };

  // Close hover card on any navigation (catches clicks on module name, sub-pages,
  // browser back/forward, and any other route change)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { closePopover(); }, [pathname]);

  // Clears any pending close — called when cursor enters the bridge or HoverCard
  const keepPopoverOpen = () => clearTimeout(closeTimerRef.current);

  // Close popover when cursor leaves <aside>, unless it moved into the bridge/HoverCard.
  // Uses a short debounce so the cursor has time to cross the 8px gap into the bridge.
  const handleNavAreaLeave = (e: React.MouseEvent<HTMLElement>) => {
    const related = e.relatedTarget as Element | null;
    if (related?.closest('[data-hovercard="true"]')) return;
    closeTimerRef.current = setTimeout(closePopover, 150);
  };

  // Close popover when cursor leaves the bridge or HoverCard, unless it went back
  // into the nav sidebar or into the other hovercard element (bridge ↔ card transitions).
  const handleHoverCardLeave = (e: React.MouseEvent) => {
    const related = e.relatedTarget as Element | null;
    if (navRef.current?.contains(related)) return;
    if (related?.closest('[data-hovercard="true"]')) return;
    closePopover();
  };

  return (
    <aside
      ref={navRef}
      className={`${styles.sidebar} ${isCollapsed ? styles.sidebarCollapsed : ''}`}
      aria-label="Global navigation"
      onMouseLeave={handleNavAreaLeave}
    >
      {/* Left Rail */}
      <div className={styles.leftRail}>
        {/* Flat nav list — no section headers */}
        <nav aria-label="Primary navigation" className={styles.navBody}>
          <ul role="list" className={styles.navList}>
            {allItems.map(item => (
              <NavItem
                key={item.to}
                item={item}
                isCollapsed={isCollapsed}
                isActive={item.to === activeItem?.to}
                onOpenPopover={(pos) => openPopover(item, pos)}
                onClosePopover={closePopover}
              />
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
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>{page}</span>
                    {activeItem.pageBadges?.[page] !== undefined && (
                      <span className={styles.notifBadge}>{activeItem.pageBadges[page]}</span>
                    )}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* HoverCard — rendered once at Nav level, driven by popoverItem/popoverPos */}
      {popoverItem && popoverPos && (
        <HoverCard
          item={popoverItem}
          pos={popoverPos}
          onNavigate={(path) => { closePopover(); navigate(path); }}
          onMouseEnter={keepPopoverOpen}
          onMouseLeave={handleHoverCardLeave}
        />
      )}
    </aside>
  );
}
