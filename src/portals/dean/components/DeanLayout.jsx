import {
  ChartBarIcon,
  UsersIcon,
  ClockIcon,
  CalendarDaysIcon,
  DocumentChartBarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import PortalLayout from '../../../app/PortalLayout';

const navItems = [
  { path: '/dean', label: 'Dashboard', icon: ChartBarIcon, end: true },
  { path: '/dean/employees', label: 'Faculty Staff', icon: UsersIcon },
  { path: '/dean/attendance', label: 'Attendance', icon: ClockIcon },
  { path: '/dean/leaves', label: 'Leave Requests', icon: CalendarDaysIcon },
  { path: '/dean/reports', label: 'Reports', icon: DocumentChartBarIcon },
  { path: '/dean/settings', label: 'Settings', icon: Cog6ToothIcon },
];

export default function DeanLayout() {
  return <PortalLayout portalKey="dean" portalName="Dean Portal" navItems={navItems} />;
}
