import { NavLink } from 'react-router-dom';
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
}

const navItems: NavItem[] = [
  { icon: DashboardIcon,      label: 'Dashboard',  to: '/' },
  { icon: HandymanIcon,       label: 'Jobs',        to: '/jobs' },
  { icon: GroupIcon,          label: 'Customers',   to: '/customers' },
  { icon: CalendarMonthIcon,  label: 'Scheduling',  to: '/scheduling' },
  { icon: DescriptionIcon,    label: 'Estimates',   to: '/estimates' },
  { icon: ReceiptIcon,        label: 'Invoices',    to: '/invoices' },
  { icon: BarChartIcon,       label: 'Reports',     to: '/reports' },
  { icon: SettingsIcon,       label: 'Settings',    to: '/settings' },
];

export function Nav() {
  return (
    <header className={styles.header} role="banner">
      <div className={styles.inner}>
        {/* Wordmark — no logo, no branding color */}
        <span className={styles.wordmark} aria-label="Application">App</span>

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

        {/* Neutral user avatar */}
        <div className={styles.avatar} aria-label="User account" role="img">
          U
        </div>
      </div>
    </header>
  );
}
