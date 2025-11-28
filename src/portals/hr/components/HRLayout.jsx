import PortalLayout from '../../../app/PortalLayout';
import {
  HomeIcon,
  UsersIcon,
  ClockIcon,
  DocumentTextIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  BellIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  { path: '/hr', label: 'Dashboard', icon: HomeIcon, end: true },
  { path: '/hr/employees', label: 'Employees', icon: UsersIcon },
  { path: '/hr/attendance', label: 'Attendance', icon: ClockIcon },
  { path: '/hr/leaves', label: 'Leave Requests', icon: DocumentTextIcon },
  { path: '/hr/reports', label: 'Reports', icon: ChartBarIcon },
  { path: '/hr/announcements', label: 'Announcements', icon: BellIcon },
  { path: '/hr/settings', label: 'Settings', icon: Cog6ToothIcon },
];

export default function HRLayout() {
  return <PortalLayout portalKey="hr" portalName="HR Portal" navItems={navItems} />;
}
