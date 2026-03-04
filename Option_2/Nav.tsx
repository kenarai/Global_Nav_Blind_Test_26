import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Gauge,
  Phone,
  CalendarDays,
  Truck,
  ClipboardList,
  Layers,
  Flag,
  BarChart2,
  Megaphone,
  BookOpen,
  FolderOpen,
  ChevronDown,
  Menu,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import styles from './nav.module.css';

interface NavItemDef {
  icon: LucideIcon;
  label: string;
  pages: string[] | null;
}

const navItems: NavItemDef[] = [
  { icon: Gauge,        label: 'Dashboard',  pages: null },
  { icon: Phone,        label: 'Calls',      pages: ['Calls', 'Bookings', 'Second Chance Leads'] },
  { icon: CalendarDays, label: 'Schedule',   pages: ['Calendar', 'Open Capacity', 'Technician Shifts', 'Capacity Planning', 'Capacity Reporting'] },
  { icon: Truck,        label: 'Dispatch',   pages: null },
  { icon: ClipboardList,label: 'Accounting', pages: ['Batch Export Transactions', 'AR Management', 'Invoices', 'Customer Payments', 'Bank Deposits', 'Bills', 'Accounting Audit Trail'] },
  { icon: Layers,       label: 'Inventory',  pages: ['Install', 'Replenishment', 'Purchase Orders', 'Receipts', 'Returns'] },
  { icon: Flag,         label: 'Follow Up',  pages: ['Unsold Estimates', 'Sold Estimates', 'Surveys', 'Recurring Service Events', 'Expiring Memberships', 'Expiring Credit Cards', 'Leads'] },
  { icon: BarChart2,    label: 'Reports',    pages: ['All Reports', 'Scheduled', 'Bookmarks', 'Recommended'] },
  { icon: Megaphone,    label: 'Marketing',  pages: ['Marketing Overview', 'SMS', 'Ads', 'Attributed Leads', 'Email', 'Direct Mail', 'Ads Optimizer', 'Pro Campaigns', 'Email Templates', 'Audience', 'Reputation'] },
  { icon: BookOpen,     label: 'Pricebook',  pages: ['Services', 'Products'] },
  { icon: FolderOpen,   label: 'Projects',   pages: ['Active Projects', 'Archived Projects'] },
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
  position: { top: string; left: string };
  width: string;
}

function HoverCard({ children, position, width }: HoverCardProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className={styles.hoverCardWrapper}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <div className={styles.hoverCardTrigger}>{children.trigger}</div>
      {visible && width !== '0px' && (
        <div
          className={styles.hoverCard}
          style={{ top: position.top, left: position.left, width }}
        >
          {children.content}
        </div>
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

  const hoverLeft = isPrimaryExpanded ? '196px' : '60px';
  const hoverWidth = isPrimaryExpanded ? '0px' : '280px';

  return (
    <div className={styles.navItemWrapper}>
      <HoverCard
        position={{ top: '0px', left: hoverLeft }}
        width={hoverWidth}
      >
        {{
          trigger: (
            <li
              className={`${styles.navItem} ${isPrimaryExpanded ? styles.widthExpanded : ''} ${isActive ? styles.navItemActive : ''}`}
              onClick={handleNavItemClick}
            >
              <span className={styles.icon}>
                <Icon size={20} color="#ffffff" aria-hidden="true" />
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
                  <ChevronDown size={16} color="#ffffff" />
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

export function Nav() {
  const [isPrimaryExpanded, setPrimaryExpanded] = useState(false);

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
        <Menu
          size={24}
          color="#ffffff"
          style={{
            transform: isPrimaryExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
            transition: 'transform 0.3s ease',
          }}
        />
      </div>
    </aside>
  );
}
