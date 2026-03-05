import { Link, NavLink, useLocation } from 'react-router-dom';
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

interface NavItem {
  icon: SvgIconComponent;
  label: string;
  to: string;
  pages?: string[];
}

const slugify = (str: string) =>
  str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const navItems: NavItem[] = [
  { icon: DashboardIcon,       label: 'Dashboard',    to: '/' },
  { icon: PeopleAltIcon,       label: 'Accounts',     to: '/accounts',
    pages: ['All Accounts', 'Organizations', 'Contacts'] },
  { icon: TrendingUpIcon,      label: 'Sales',        to: '/sales',
    pages: ['Pipeline', 'Opportunities', 'Quotes', 'Contracts'] },
  { icon: AccountTreeIcon,     label: 'Projects',     to: '/projects',
    pages: ['Active Projects', 'Portfolios', 'Resource Planning', 'Timesheets'] },
  { icon: PaymentIcon,         label: 'Billing',      to: '/billing' },
  { icon: FolderOpenIcon,      label: 'Documents',    to: '/documents',
    pages: ['All Files', 'Templates', 'Shared with Me'] },
  { icon: BarChartIcon,        label: 'Reports',      to: '/reports' },
  { icon: CorporateFareIcon,   label: 'Organization', to: '/organization',
    pages: ['Departments', 'Business Units', 'Facilities', 'Directory'] },
  { icon: PlaylistAddCheckIcon,label: 'Actions',      to: '/actions',
    pages: ['Approvals', 'Task Queue', 'Pending Reviews', 'Audit Logs'] },
  { icon: AppsIcon,            label: 'Applications', to: '/applications',
    pages: ['App Catalog', 'Installed Apps', 'Custom Builds', 'API Management'] },
];

export function Nav() {
  const { pathname } = useLocation();

  return (
    <header className={styles.header} role="banner">
      <div className={styles.inner}>
        <nav className={styles.nav} aria-label="Global navigation">
          <ul className={styles.navList} role="list">
            {navItems.map(({ icon: Icon, label, to, pages }) => {
              const href = pages && pages.length > 0 ? `${to}/${slugify(pages[0])}` : to;
              const isActive = to === '/' ? pathname === '/' : pathname.startsWith(to);
              return (
                <li key={to}>
                  <Link
                    to={href}
                    className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                  >
                    <Icon style={{ fontSize: 18 }} aria-hidden="true" />
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
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
