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
import ExpandNavIcon from '@/icons/ExpandNavIcon';
import CollapseNavIcon from '@/icons/CollapseNavIcon';
import type { SvgIconComponent } from '@mui/icons-material';
import styles from './nav.module.css';

interface NavItemDef {
  icon: SvgIconComponent;
  label: string;
  pages: string[] | null;
}

const navItems: NavItemDef[] = [
  { icon: DashboardIcon,        label: 'Dashboard',    pages: null },
  { icon: PeopleAltIcon,        label: 'Accounts',     pages: ['All Accounts', 'Organizations', 'Contacts'] },
  { icon: TrendingUpIcon,       label: 'Sales',        pages: ['Pipeline', 'Opportunities', 'Quotes', 'Contracts'] },
  { icon: AccountTreeIcon,      label: 'Projects',     pages: ['Active Projects', 'Portfolios', 'Resource Planning', 'Timesheets'] },
  { icon: PaymentIcon,          label: 'Billing',      pages: null },
  { icon: FolderOpenIcon,       label: 'Documents',    pages: ['All Files', 'Templates', 'Shared with Me'] },
  { icon: BarChartIcon,         label: 'Reports',      pages: null },
  { icon: CorporateFareIcon,    label: 'Organization', pages: ['Departments', 'Business Units', 'Facilities', 'Directory'] },
  { icon: PlaylistAddCheckIcon, label: 'Actions',      pages: ['Approvals', 'Task Queue', 'Pending Reviews', 'Audit Logs'] },
  { icon: AppsIcon,             label: 'Applications', pages: ['App Catalog', 'Installed Apps', 'Custom Builds', 'API Management'] },
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
}

function HoverCard({ children, width }: HoverCardProps) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setPos({ top: rect.top, left: rect.right + 8 });
    }
    setVisible(true);
  };

  return (
    <div
      ref={wrapperRef}
      className={styles.hoverCardWrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setVisible(false)}
    >
      <div className={styles.hoverCardTrigger}>{children.trigger}</div>
      {visible && width !== '0px' && pos && createPortal(
        <div
          className={styles.hoverCard}
          style={{ position: 'fixed', top: pos.top, left: pos.left, width }}
          onMouseEnter={() => setVisible(true)}
          onMouseLeave={() => setVisible(false)}
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
}

function NavItem({ icon: Icon, label, pages, isPrimaryExpanded }: NavItemProps) {
  const [showPages, setShowPages] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const itemPath = label === 'Dashboard' ? '/' : `/${slugify(label)}`;
  const isActive = label === 'Dashboard'
    ? pathname === '/'
    : pathname.startsWith(`/${slugify(label)}`);

  const handleNavItemClick = () => {
    setShowPages(prev => !prev);
    navigate(itemPath);
  };

  const handlePageClick = (page: string) => {
    navigate(`${itemPath}/${slugify(page)}`);
  };

  const hoverWidth = isPrimaryExpanded ? '0px' : '280px';

  return (
    <div className={styles.navItemWrapper}>
      <HoverCard
        width={hoverWidth}
      >
        {{
          trigger: (
            <li
              className={`${styles.navItem} ${isPrimaryExpanded ? styles.widthExpanded : ''} ${isActive ? styles.navItemActive : ''}`}
              onClick={handleNavItemClick}
            >
              <span className={styles.icon}>
                <Icon style={{ fontSize: 20, color: '#000000' }} aria-hidden="true" />
              </span>
              <span className={isPrimaryExpanded ? styles.label : styles.el}>
                {label}
              </span>
              {pages && (
                <span
                  className={styles.rightIcon}
                  style={{
                    opacity: isPrimaryExpanded ? 1 : 0,
                    transform: showPages ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                  }}
                >
                  <ExpandMoreIcon style={{ fontSize: 16, color: '#000000' }} />
                </span>
              )}
            </li>
          ),
          content: (
            <div>
              {!isPrimaryExpanded && (
                <p className={styles.hoverLabel} onClick={handleNavItemClick}>
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
                    >
                      {page}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ),
        }}
      </HoverCard>

      {isPrimaryExpanded && showPages && pages && (
        <ul className={styles.subPages}>
          {pages.map(page => (
            <li
              key={page}
              className={styles.subPageItem}
              onClick={() => handlePageClick(page)}
            >
              {page}
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

  return (
    <aside
      className={`${styles.primaryContainer} ${isPrimaryExpanded ? styles.expanded : styles.collapsed}`}
      aria-label="Global navigation"
    >
      <ul className={styles.primaryNav} role="list">
        {navItems.map(item => (
          <NavItem key={item.label} {...item} isPrimaryExpanded={isPrimaryExpanded} />
        ))}
      </ul>

      <div
        className={styles.toggleAffordance}
        onClick={() => setPrimaryExpanded(prev => !prev)}
        title={isPrimaryExpanded ? 'Collapse' : 'Expand'}
        role="button"
        aria-expanded={isPrimaryExpanded}
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && setPrimaryExpanded(prev => !prev)}
      >
        {isPrimaryExpanded
          ? <CollapseNavIcon style={{ color: '#000000' }} aria-hidden="true" />
          : <ExpandNavIcon   style={{ color: '#000000' }} aria-hidden="true" />
        }
      </div>
    </aside>
  );
}
