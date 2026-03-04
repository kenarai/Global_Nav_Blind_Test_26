import { useState, useRef, useId } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Menu,
  LayoutDashboard,
  Wrench,
  CalendarDays,
  Truck,
  Users,
  ContactRound,
  FileText,
  Receipt,
  CreditCard,
  BarChart2,
  Settings,
  ChevronDown,
  Plus,
  Pencil,
  MoreVertical,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import styles from './nav.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItemDef {
  icon: LucideIcon;
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
  defaultOpen: boolean;
}

// ─── Nav data ─────────────────────────────────────────────────────────────────

const sections: Section[] = [
  {
    title: null,
    defaultOpen: true,
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', to: '/', badge: 4 },
    ],
  },
  {
    title: 'Work',
    defaultOpen: true,
    items: [
      { icon: Wrench,       label: 'Jobs',       to: '/jobs',       badge: 12,
        pages: ['All Jobs', 'Active', 'Scheduled', 'Completed', 'Cancelled'] },
      { icon: CalendarDays, label: 'Scheduling', to: '/scheduling',
        pages: ['Calendar', 'Open Capacity', 'Technician Shifts'] },
      { icon: Truck,        label: 'Dispatch',   to: '/dispatch' },
    ],
  },
  {
    title: 'People',
    defaultOpen: true,
    items: [
      { icon: Users,        label: 'Customers', to: '/customers',
        pages: ['All Customers', 'Companies', 'Leads'] },
      { icon: ContactRound, label: 'Contacts',  to: '/contacts' },
    ],
  },
  {
    title: 'Finance',
    defaultOpen: false,
    items: [
      { icon: FileText,   label: 'Estimates', to: '/estimates' },
      { icon: Receipt,    label: 'Invoices',  to: '/invoices', badge: 3,
        pages: ['All Invoices', 'Overdue', 'Draft'] },
      { icon: CreditCard, label: 'Payments',  to: '/payments' },
    ],
  },
  {
    title: 'Admin',
    defaultOpen: false,
    items: [
      { icon: BarChart2, label: 'Reports',  to: '/reports',
        pages: ['All Reports', 'Scheduled', 'Bookmarks'] },
      { icon: Settings,  label: 'Settings', to: '/settings' },
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
        aria-label={isCollapsed ? label : undefined}
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
        {/* Icon + optional dot badge when collapsed */}
        <span className={styles.iconWrap}>
          <Icon size={20} aria-hidden="true" />
          {badge !== undefined && (
            <span
              className={`${styles.badgeDot} ${isCollapsed ? styles.badgeDotVisible : ''}`}
              aria-hidden="true"
            />
          )}
        </span>

        {/* Label + pill badge — fades out when collapsing */}
        <span className={`${styles.labelRow} ${isCollapsed ? styles.labelRowHidden : ''}`}>
          <span className={styles.itemLabel}>{label}</span>
          {badge !== undefined && (
            <span className={styles.badge} aria-label={`${badge} unread`}>
              {badge > 99 ? '99+' : badge}
            </span>
          )}
        </span>
      </NavLink>

      {/* More options button — only in expanded + hovered */}
      {isHovered && !isCollapsed && (
        <button
          className={styles.moreBtn}
          aria-label={`More options for ${label}`}
          onClick={e => e.preventDefault()}
        >
          <MoreVertical size={16} aria-hidden="true" />
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
  const [isOpen, setIsOpen] = useState(section.defaultOpen);
  const sectionId = useId();

  return (
    <div className={styles.section}>
      {section.title && (
        <button
          className={`${styles.sectionHeader} ${isCollapsed ? styles.sectionHeaderHidden : ''}`}
          onClick={() => setIsOpen(prev => !prev)}
          aria-expanded={isOpen}
          aria-controls={sectionId}
        >
          <span className={styles.sectionTitle}>{section.title}</span>
          <ChevronDown
            size={16}
            aria-hidden="true"
            className={`${styles.sectionChevron} ${isOpen ? styles.chevronOpen : ''}`}
          />
        </button>
      )}

      {/* Always rendered — visibility controlled by max-height CSS transition */}
      <ul
        id={sectionId}
        role="list"
        className={`${styles.accordionBody} ${
          isOpen || isCollapsed || !section.title ? styles.accordionBodyOpen : ''
        }`}
        aria-hidden={!isOpen && !isCollapsed && !!section.title}
      >
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
          <Menu size={20} aria-hidden="true" />
        </button>
      </div>

      {/* New Job / Compose-style CTA */}
      <div className={styles.composeArea}>
        <button
          className={`${styles.composeBtn} ${isCollapsed ? styles.composeBtnCollapsed : ''}`}
          aria-label="New Job"
        >
          <span className={styles.composeIcon}>
            {isCollapsed ? <Plus size={22} aria-hidden="true" /> : <Pencil size={18} aria-hidden="true" />}
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
