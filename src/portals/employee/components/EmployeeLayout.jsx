import {
  HomeIcon,
  ClockIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import PortalLayout from '../../../app/PortalLayout';

const navItems = [
  { path: '/employee', label: 'Dashboard', icon: HomeIcon, end: true },
  { path: '/employee/attendance', label: 'Attendance', icon: ClockIcon },
  { path: '/employee/leave', label: 'Leave', icon: CalendarDaysIcon },
  { path: '/employee/salary', label: 'Salary', icon: BanknotesIcon },
  { path: '/employee/profile', label: 'Profile', icon: UserCircleIcon },
];

export default function EmployeeLayout() {
  return <PortalLayout portalKey="employee" portalName="Employee Portal" navItems={navItems} />;
}
