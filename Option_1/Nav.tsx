import { NavLink, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HandymanIcon from '@mui/icons-material/Handyman';
import GroupIcon from '@mui/icons-material/Group';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DescriptionIcon from '@mui/icons-material/Description';
import ReceiptIcon from '@mui/icons-material/Receipt';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import type { SvgIconComponent } from '@mui/icons-material';
import styles from './nav.module.css';

interface NavItem {
  icon: SvgIconComponent;
  label: string;
  to: string;
  pages?: string[];
}

const slugify = (str: string) =>
  str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const navItems: NavItem[] = [
  { icon: DashboardIcon,      label: 'Dashboard',  to: '/' },
  { icon: HandymanIcon,       label: 'Jobs',        to: '/jobs',
    pages: ['All Jobs', 'Active', 'Scheduled', 'Completed', 'Cancelled'] },
  { icon: GroupIcon,          label: 'Customers',   to: '/customers',
    pages: ['All Customers', 'Companies', 'Leads'] },
  { icon: CalendarMonthIcon,  label: 'Scheduling',  to: '/scheduling',
    pages: ['Calendar', 'Open Capacity', 'Technician Shifts'] },
  { icon: DescriptionIcon,    label: 'Estimates',   to: '/estimates' },
  { icon: ReceiptIcon,        label: 'Invoices',    to: '/invoices',
    pages: ['All Invoices', 'Overdue', 'Draft'] },
  { icon: BarChartIcon,       label: 'Reports',     to: '/reports',
    pages: ['All Reports', 'Scheduled', 'Bookmarks'] },
  { icon: SettingsIcon,       label: 'Settings',    to: '/settings' },
];

export function Nav() {
  return (
    <header className={styles.header} role="banner">
      <div className={styles.inner}>
        <nav className={styles.nav} aria-label="Global navigation">
          <ul className={styles.navList} role="list">
            {navItems.map(({ icon: Icon, label, to }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                  }
                >
                  <Icon style={{ fontSize: 18 }} aria-hidden="true" />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>


      </div>
    </header>
  );
}

export function Sidebar() {
  const { pathname } = useLocation();

  const activeItem = navItems.find(
    item =>
      item.pages &&
      (item.to === '/' ? pathname === '/' : pathname.startsWith(item.to))
  );

  if (!activeItem) return null;

  return (
    <aside
      className={styles.submenuSidebar}
      aria-label={`${activeItem.label} sub-pages`}
    >
      <div className={styles.submenuHeader}>{activeItem.label}</div>
      <ul className={styles.submenuList} role="list">
        {activeItem.pages!.map(page => (
          <li key={page}>
            <NavLink
              to={`${activeItem.to}/${slugify(page)}`}
              className={({ isActive }) =>
                `${styles.submenuItem} ${isActive ? styles.submenuItemActive : ''}`
              }
            >
              {page}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
