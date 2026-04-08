import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import BarChartIcon from '@mui/icons-material/BarChart';
import CampaignIcon from '@mui/icons-material/Campaign';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandNavIcon from './ExpandNavIcon';
import CollapseNavIcon from './CollapseNavIcon';
import Tooltip from '@/components/Tooltip';
import type { SvgIconComponent } from '@mui/icons-material';
import styles from './nav.module.css';

// ─── Data types ───────────────────────────────────────────────────────────────

interface NavSection {
  section: string;
  items: string[];
}

type PageEntry = string | NavSection;

function isSection(entry: PageEntry): entry is NavSection {
  return typeof entry === 'object';
}

/** Flatten all page strings out of a mixed pages/sections array. */
function flatPages(pages: PageEntry[]): string[] {
  return pages.flatMap(p => (isSection(p) ? p.items : [p]));
}

interface NavItemDef {
  icon: SvgIconComponent;
  label: string;
  pages: PageEntry[] | null;
  pageBadges?: Record<string, number>;
}

const navItems: NavItemDef[] = [
  { icon: DashboardIcon,       label: 'Dashboard',  pages: null },
  { icon: PhoneIcon,           label: 'Calls',       pages: ['Calls', 'Bookings', 'Chat'] },
  { icon: CalendarMonthIcon,   label: 'Schedule',    pages: null },
  { icon: LocalShippingIcon,   label: 'Dispatch',    pages: [
    { section: 'Boards', items: ['Weekly Dispatch Board', 'Classic Dispatch Board'] },
    { section: 'Tools',  items: ['Crew Scheduling', 'Map'] },
  ]},
  { icon: AccountBalanceIcon,  label: 'Accounting',  pages: [
    { section: 'Accounts Receivable', items: ['Batch/Export Transactions', 'AR Management', 'Invoices', 'Customer Payments', 'Bank Deposits'] },
    { section: 'Accounts Payable',    items: ['Bills'] },
    { section: 'Others',              items: ['Accounting Audit Trail'] },
  ]},
  { icon: ShoppingCartIcon,    label: 'Purchasing',  pages: [
    { section: 'Purchase', items: ['Replenishment', 'Purchase Orders', 'Receipts', 'Returns'] },
  ]},
  { icon: AssignmentLateIcon,  label: 'Follow Up',   pages: [
    'Unsold Estimates',
    'Sold Estimates',
    'Surveys',
    'Recurring Service Events',
    'Expiring Memberships',
  ]},
  { icon: BarChartIcon,        label: 'Reports',     pages: [
    { section: 'General',      items: ['All Reports', 'Scheduled Reports', 'Benchmark Reports'] },
    { section: 'Personalized', items: ['Bookmarks', 'Recommended'] },
    { section: 'Information',  items: ['Templates Dictionary', 'Legacy Reports'] },
  ]},
  { icon: CampaignIcon,        label: 'Marketing',   pages: null },
  { icon: LocalOfferIcon,      label: 'Pricebook',   pages: [
    'Services',
    'Materials',
    'Equipment',
    'Categories',
    'History',
    'Pricing Builder',
    'Templates',
    'Import/Export',
    'Bundles',
    'Discounts',
    'Flat-Rate Books',
    'Vendor Catalog',
    'Price Adjustments',
    'Markup Rules',
    'Cost Codes',
    'Rate Sheets',
    'Tax Profiles',
    'Unit Conversions',
    'Approval Workflows',
    'Price Sync',
  ]},
  { icon: PlaylistAddCheckIcon, label: 'Tasks',      pages: [
    'All Tasks',
    'My Tasks',
    'Team Tasks',
    'Overdue',
    'Due Today',
    'Due This Week',
    'Completed',
    'Archived',
    'Task Templates',
    'Recurring Tasks',
    'Priority Queue',
    'Activity Log',
  ]},
];

const slugify = (str: string) =>
  str.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/\//g, '-')           // treat slash as word separator
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')           // collapse consecutive hyphens
    .replace(/^-|-$/g, '');

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
  // rawPos: position captured at mouse-enter time (top = trigger's rect.top)
  const [rawPos, setRawPos] = useState<{ top: number; left: number } | null>(null);
  // displayTop: adjusted top so the submenu list aligns with the trigger top
  const [displayTop, setDisplayTop] = useState<number | null>(null);
  const [maxHeight, setMaxHeight] = useState<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const visible = activeHoverLabel === label;

  // After the portal mounts, find the first actual page item and measure how far it sits
  // below the card top. Shift the card up by that exact distance so the first page item
  // aligns with the trigger top — works correctly whether or not section headers are present.
  // useLayoutEffect runs synchronously before paint — no visible flicker.
  useLayoutEffect(() => {
    if (!visible || !cardRef.current || !rawPos) return;
    const firstItem = cardRef.current.querySelector<HTMLElement>('[data-role="page-item"]');
    if (!firstItem) return;
    const offsetFromCardTop =
      firstItem.getBoundingClientRect().top - cardRef.current.getBoundingClientRect().top;
    const computedTop = rawPos.top - offsetFromCardTop;

    const BOTTOM_MARGIN = 8;
    const vh = window.innerHeight;
    const naturalHeight = cardRef.current.getBoundingClientRect().height;
    const available = vh - computedTop - BOTTOM_MARGIN;

    let finalTop = computedTop;
    let finalMaxHeight: number | null = null;

    if (naturalHeight > available) {
      const idealTop = vh - naturalHeight - 16;
      finalTop = Math.max(BOTTOM_MARGIN, idealTop);
      const expanded = vh - finalTop - 16;
      finalMaxHeight = naturalHeight > expanded ? expanded : null;
    }

    setDisplayTop(finalTop);
    setMaxHeight(finalMaxHeight);
  }, [visible, rawPos]);

  const handleMouseEnter = () => {
    if (!hasContent) {
      // No submenu — close any currently open hover card immediately
      onHideNow();
      return;
    }
    onCancelHide();
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setRawPos({ top: rect.top, left: rect.right + 4 });
      setDisplayTop(null);   // reset until measured
      setMaxHeight(null);    // reset until measured
    }
    onActivate(label);
  };

  const effectiveTop = displayTop ?? rawPos?.top;

  return (
    <div
      ref={wrapperRef}
      className={styles.hoverCardWrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onScheduleHide}
    >
      <div className={styles.hoverCardTrigger}>{children.trigger}</div>
      {visible && width !== '0px' && rawPos != null && effectiveTop != null && createPortal(
        <div
          ref={cardRef}
          className={styles.hoverCard}
          style={{ position: 'fixed', top: effectiveTop, left: rawPos.left, width, ...(maxHeight != null ? { maxHeight } : {}) }}
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

// ─── Helpers to render page entries (shared by expanded rail + hover card) ────

function renderSubPageList(
  pages: PageEntry[],
  renderItem: (page: string) => React.ReactNode,
) {
  return pages.map((entry, i) => {
    if (isSection(entry)) {
      return (
        <li key={entry.section + i} style={{ listStyle: 'none' }}>
          <div className={styles.sectionHeader}>{entry.section}</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {entry.items.map(page => renderItem(page))}
          </ul>
        </li>
      );
    }
    return renderItem(entry);
  });
}

// ─── NavItem ──────────────────────────────────────────────────────────────────

interface NavItemProps extends NavItemDef {
  isPrimaryExpanded: boolean;
  expandedLabels: Set<string>;
  collapsedLabels: Set<string>;
  setSubmenuOpen: (label: string, open: boolean) => void;
  collapseAllLabels: () => void;
  onExpand: () => void;
  activeHoverLabel: string | null;
  onHoverActivate: (label: string) => void;
  onHoverScheduleHide: () => void;
  onHoverCancelHide: () => void;
  onHoverHideNow: () => void;
}

function NavItem({ icon: Icon, label, pages, pageBadges, isPrimaryExpanded, expandedLabels, collapsedLabels, setSubmenuOpen, collapseAllLabels, onExpand, activeHoverLabel, onHoverActivate, onHoverScheduleHide, onHoverCancelHide, onHoverHideNow }: NavItemProps) {
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

  const flat = pages ? flatPages(pages) : [];

  const handleNavItemClick = () => {
    onHoverHideNow();
    if (!isPrimaryExpanded && label === 'Calls') onExpand();
    if (isPrimaryExpanded) collapseAllLabels();
    navigate(flat.length > 0 ? `${itemPath}/${slugify(flat[0])}` : itemPath);
  };

  const handleCaretClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSubmenuOpen(label, !showSubPages);
  };

  const handlePageClick = (page: string) => {
    onHoverHideNow();
    if (!isPrimaryExpanded && label === 'Calls') {
      onExpand();
      setSubmenuOpen(label, true);
    }
    navigate(`${itemPath}/${slugify(page)}`);
  };

  const hoverWidth = isPrimaryExpanded ? '0px' : '240px';

  // Render a single page row (used in both expanded rail and hover card)
  const renderPageItem = (page: string, inHoverCard = false) => (
    <li
      key={page}
      className={inHoverCard ? styles.pageItem : [
        styles.subPageItem,
        pathname === `${itemPath}/${slugify(page)}` ? styles.subPageItemActive : '',
      ].filter(Boolean).join(' ')}
      onClick={() => handlePageClick(page)}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      {...(inHoverCard ? { 'data-role': 'page-item' } : {})}
    >
      <span>{page}</span>
      {pageBadges?.[page] !== undefined && (
        <span className={styles.notifBadge}>{pageBadges[page]}</span>
      )}
    </li>
  );

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
            <div className={styles.hoverContent}>
              {!isPrimaryExpanded && (
                <p className={styles.hoverLabel}>
                  {label}
                </p>
              )}
              {!isPrimaryExpanded && pages && (
                <ul className={styles.pagesList} data-role="pages-list">
                  {renderSubPageList(pages, page => renderPageItem(page, true))}
                </ul>
              )}
            </div>
          ),
        }}
      </HoverCard>

      {showSubPages && (
        <ul className={styles.subPages}>
          {renderSubPageList(pages!, page => renderPageItem(page, false))}
        </ul>
      )}
    </div>
  );
}

// ─── Nav (exported) ───────────────────────────────────────────────────────────

// Dummy export — Sidebar is only used by Option 1
export function Sidebar() { return null; }

export function Nav() {
  const navigate = useNavigate();
  const [isPrimaryExpanded, setPrimaryExpanded] = useState(true);

  useEffect(() => { navigate('/', { replace: true }); }, []);
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
            onExpand={() => setPrimaryExpanded(true)}
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
            <Tooltip label="Expand Menu" placement="right">
              <ExpandNavIcon style={{ color: '#ffffff' }} aria-hidden="true" />
            </Tooltip>
          )
        }
        {isPrimaryExpanded && (
          <span className={styles.toggleLabel}>Collapse Menu</span>
        )}
      </div>
    </aside>
  );
}
