import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Wrench,
  Users,
  CalendarDays,
  FileText,
  Receipt,
  BarChart2,
  Settings,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import styles from './nav.module.css';

interface NavItem {
  icon: LucideIcon;
  label: string;
  to: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
  { icon: Wrench,          label: 'Jobs',       to: '/jobs' },
  { icon: Users,           label: 'Customers',  to: '/customers' },
  { icon: CalendarDays,    label: 'Scheduling', to: '/scheduling' },
  { icon: FileText,        label: 'Estimates',  to: '/estimates' },
  { icon: Receipt,         label: 'Invoices',   to: '/invoices' },
  { icon: BarChart2,       label: 'Reports',    to: '/reports' },
  { icon: Settings,        label: 'Settings',   to: '/settings' },
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
                  <Icon size={16} aria-hidden="true" />
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
