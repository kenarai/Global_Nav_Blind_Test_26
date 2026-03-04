import { useState, useRef, useId } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HandymanIcon from '@mui/icons-material/Handyman';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import GroupIcon from '@mui/icons-material/Group';
import ContactsIcon from '@mui/icons-material/Contacts';
import DescriptionIcon from '@mui/icons-material/Description';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import type { SvgIconComponent } from '@mui/icons-material';
import styles from './nav.module.css';

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
      { icon: DashboardIcon, label: 'Dashboard', to: '/', badge: 4 },
    ],
  },
  {
    title: 'Work',
    items: [
      { icon: HandymanIcon,      label: 'Jobs',       to: '/jobs',       badge: 12,
        pages: ['All Jobs', 'Active', 'Scheduled', 'Completed', 'Cancelled'] },
      { icon: CalendarMonthIcon, label: 'Scheduling', to: '/scheduling',
        pages: ['Calendar', 'Open Capacity', 'Technician Shifts'] },
      { icon: LocalShippingIcon, label: 'Dispatch',   to: '/dispatch' },
    ],
  },
  {
    title: 'People',
    items: [
      { icon: GroupIcon,    label: 'Customers', to: '/customers',
        pages: ['All Customers', 'Companies', 'Leads'] },
      { icon: ContactsIcon, label: 'Contacts',  to: '/contacts' },
    ],
  },
  {
    title: 'Finance',
    items: [
      { icon: DescriptionIcon, label: 'Estimates', to: '/estimates' },
      { icon: ReceiptIcon,     label: 'Invoices',  to: '/invoices', badge: 3,
        pages: ['All Invoices', 'Overdue', 'Draft'] },
      { icon: CreditCardIcon,  label: 'Payments',  to: '/payments' },
    ],
  },
  {
    title: 'Admin',
    items: [
      { icon: BarChartIcon,  label: 'Reports',  to: '/reports',
        pages: ['All Reports', 'Scheduled', 'Bookmarks'] },
      { icon: SettingsIcon,  label: 'Settings', to: '/settings' },
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
}

function NavItem({ item, isCollapsed }: NavItemProps) {
  const { icon: Icon, label, to, badge } = item;

  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hoverPos, setHoverPos] = useState<{ top: number; left: number } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const wrapperRef = useRef<HTMLLIElement>(null);
  const tooltipId = useId();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Auto-expand sub-pages when this module is the active route
  const isModuleActive = to === '/'
    ? pathname === '/'
    : pathname.startsWith(to);

  const handleMouseEnter = () => {
    clearTimeout(leaveTimerRef.current);
    setIsHovered(true);
    if (isCollapsed) {
      if (item.pages && wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        setHoverPos({ top: rect.top, left: rect.right + 8 });
      } else {
        timerRef.current = setTimeout(() => setShowTooltip(true), 350);
      }
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
            isCollapsed ? styles.navItemCollapsed : '',
          ]
            .filter(Boolean)
            .join(' ')
        }
      >
        {/* Icon + optional dot badge (dot only in collapsed) */}
        <span className={styles.iconWrap}>
          <Icon style={{ fontSize: 20 }} aria-hidden="true" />
          {badge !== undefined && (
            <span
              className={`${styles.badgeDot} ${isCollapsed ? styles.badgeDotVisible : ''}`}
              aria-hidden="true"
            />
          )}
        </span>

        {/* Label + pill badge — in expanded: below icon; in collapsed: hidden (iconLabel replaces it) */}
        <span className={`${styles.labelRow} ${isCollapsed ? styles.labelRowHidden : ''}`}>
          <span className={styles.itemLabel}>{label}</span>
          {badge !== undefined && (
            <span className={styles.badge} aria-label={`${badge} unread`}>
              {badge > 99 ? '99+' : badge}
            </span>
          )}
        </span>

        {/* Small label below icon — collapsed state only */}
        {isCollapsed && (
          <span className={styles.iconLabel}>{label}</span>
        )}
      </NavLink>

      {/* Sub-page list — expanded state, active module with sub-pages only */}
      {!isCollapsed && isModuleActive && item.pages && (
        <ul className={styles.subPageList} role="list">
          {item.pages.map(page => (
            <li key={page}>
              <NavLink
                to={`${to}/${slugify(page)}`}
                className={({ isActive }) =>
                  `${styles.subPageItem} ${isActive ? styles.subPageItemActive : ''}`
                }
              >
                {page}
              </NavLink>
            </li>
          ))}
        </ul>
      )}

      {/* More options button — expanded + hovered only */}
      {isHovered && !isCollapsed && (
        <button
          className={styles.moreBtn}
          aria-label={`More options for ${label}`}
          onClick={e => e.preventDefault()}
        >
          <MoreVertIcon style={{ fontSize: 16 }} aria-hidden="true" />
        </button>
      )}

      {/* Hover card — collapsed + hovered + has sub-pages (portal) */}
      {isCollapsed && isHovered && item.pages && hoverPos && (
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

// ─── SectionGroup ─────────────────────────────────────────────────────────────

interface SectionGroupProps {
  section: Section;
  isCollapsed: boolean;
}

function SectionGroup({ section, isCollapsed }: SectionGroupProps) {
  return (
    <div className={styles.section}>
      {section.title && (
        <div className={`${styles.sectionHeader} ${isCollapsed ? styles.sectionHeaderHidden : ''}`}>
          <span className={styles.sectionTitle}>{section.title}</span>
        </div>
      )}
      <ul role="list" className={styles.sectionItems}>
        {section.items.map(item => (
          <NavItem key={item.to} item={item} isCollapsed={isCollapsed} />
        ))}
      </ul>
    </div>
  );
}

// ─── Nav (exported) ───────────────────────────────────────────────────────────

export function Nav() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`${styles.sidebar} ${isCollapsed ? styles.sidebarCollapsed : ''}`}
      aria-label="Global navigation"
    >
      {/* Hamburger */}
      <div className={styles.sidebarHeader}>
        <button
          className={styles.hamburger}
          onClick={() => setIsCollapsed(prev => !prev)}
          aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
          aria-expanded={!isCollapsed}
        >
          <MenuIcon style={{ fontSize: 20 }} aria-hidden="true" />
        </button>
      </div>

      {/* New Job CTA */}
      <div className={styles.composeArea}>
        <button className={styles.composeBtn} aria-label="New Job">
          <span className={styles.composeIcon}>
            <EditIcon style={{ fontSize: 18 }} aria-hidden="true" />
          </span>
          <span className={`${styles.composeLabel} ${isCollapsed ? styles.composeLabelHidden : ''}`}>
            New Job
          </span>
        </button>
      </div>

      {/* Sectioned nav */}
      <nav aria-label="Primary navigation" className={styles.navBody}>
        {sections.map((section, i) => (
          <SectionGroup key={i} section={section} isCollapsed={isCollapsed} />
        ))}
      </nav>
    </aside>
  );
}
