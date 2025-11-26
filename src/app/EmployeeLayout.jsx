import { Outlet } from 'react-router-dom';
import {
  UserCircleIcon,
  CalendarIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuthStore } from '../state/auth';
import CECOSLogo from '../components/CECOSLogo';

const navItems = [
  { path: '/employee', label: 'Dashboard', icon: UserCircleIcon },
  { path: '/employee/attendance', label: 'Attendance', icon: CalendarIcon },
  { path: '/employee/leave', label: 'Leave', icon: DocumentTextIcon },
  { path: '/employee/salary', label: 'Salary', icon: CurrencyDollarIcon },
];

export default function EmployeeLayout() {
  const navigate = useNavigate();
  const switchRole = useAuthStore((s) => s.switchRole);

  const handleLogout = () => {
    navigate('/employee/login');
  };

  const handleSwitchToHR = () => {
    switchRole('hr');
    navigate('/hr');
  };

  return (
    <div data-portal="employee" className="min-h-screen bg-gray-50">
      {/* Top Nav */}
      <header className="bg-linear-to-r from-[#001F3F] to-[#001530] border-b border-gray-900 sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CECOSLogo variant="icon" size="md" />
            <div>
              <h1 className="text-lg font-bold text-white">Employee Portal</h1>
              <p className="text-xs text-amber-300">CECOS University HRMS • Peshawar</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSwitchToHR}
              className="text-sm text-blue-100 hover:text-white transition"
            >
              Switch to HR
            </button>
            <button
              onClick={handleLogout}
              className="text-sm text-blue-100 hover:text-white transition flex items-center gap-1"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar and Main Content */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar - Always visible on desktop */}
        <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <nav className="p-4 space-y-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/employee'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${isActive ? 'bg-linear-to-r from-[#001F3F]/15 to-[#800020]/10 text-[#001F3F] border-l-4 border-[#800020]' : 'text-gray-700 hover:bg-gray-50'}`
                }
              >
                <Icon className="w-5 h-5" />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex justify-around z-20">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/employee'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-xs ${isActive ? 'text-[#0066CC]' : 'text-gray-600'}`
            }
          >
            <Icon className="w-6 h-6" />
            <span className="text-[10px]">{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
