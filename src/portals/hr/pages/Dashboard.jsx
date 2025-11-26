import { UsersIcon, CalendarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useDataStore } from '../../../state/data';
import Card from '../../../components/Card';

export default function HRDashboard() {
  const { employees, attendance, leaves } = useDataStore();

  const pendingLeaves = leaves.filter((l) => l.status === 'Pending').length;
  const todayPresent = attendance.filter((a) => a.status === 'Present').length;
  const todayLate = attendance.filter((a) => a.status === 'Late').length;

  const stats = [
    {
      label: 'Total Employees',
      value: employees.length,
      icon: UsersIcon,
      bgColor: 'bg-[#800020]',
      textColor: 'text-white',
      path: '/hr/employees',
    },
    {
      label: 'Present Today',
      value: todayPresent,
      icon: CalendarIcon,
      bgColor: 'bg-green-600',
      textColor: 'text-white',
      path: '/hr/attendance',
    },
    {
      label: 'Late Today',
      value: todayLate,
      icon: CalendarIcon,
      bgColor: 'bg-[#D4AF37]',
      textColor: 'text-gray-900',
      path: '/hr/attendance',
    },
    {
      label: 'Pending Leaves',
      value: pendingLeaves,
      icon: DocumentTextIcon,
      bgColor: 'bg-[#001F3F]',
      textColor: 'text-white',
      path: '/hr/leaves',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">HR Dashboard</h2>
        <p className="text-gray-600">Overview of employee management</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.path}>
            <Card className="hover:shadow-md transition cursor-pointer">
              <div className="flex items-center gap-4">
                <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                  <stat.icon className={`w-8 h-8 ${stat.textColor}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
