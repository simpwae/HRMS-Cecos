import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import {
  UsersIcon,
  CalendarIcon,
  DocumentTextIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowRightIcon,
  ChartBarIcon,
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useDataStore } from '../../../state/data';
import { useAuthStore } from '../../../state/auth';
import Card from '../../../components/Card';
import Badge from '../../../components/Badge';
import StatCard from '../../../components/StatCard';

export default function HRDashboard() {
  const user = useAuthStore((s) => s.user);
  const { employees, attendance, leaves } = useDataStore();

  // Calculate stats
  const stats = useMemo(() => {
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);

    // Today's attendance
    const todayAttendance = attendance.filter((a) => a.date === todayStr);
    const presentToday = todayAttendance.filter((a) => a.status === 'Present').length;
    const lateToday = todayAttendance.filter((a) => a.status === 'Late').length;
    const absentToday = employees.length - presentToday - lateToday;

    // Leave stats
    const pendingLeaves = leaves.filter((l) => l.status === 'Pending');
    const approvedThisMonth = leaves.filter((l) => {
      if (l.status !== 'Approved') return false;
      const date = parseISO(l.appliedOn);
      return isWithinInterval(date, { start: monthStart, end: monthEnd });
    });

    // Employee stats
    const activeEmployees = employees.filter((e) => e.status === 'Active').length;
    const onLeave = employees.filter((e) => e.status === 'On Leave').length;

    // Total salary expense
    const totalPayroll = employees
      .filter((e) => e.status === 'Active')
      .reduce((sum, e) => sum + (e.salaryBase || 0), 0);

    return {
      totalEmployees: employees.length,
      activeEmployees,
      onLeave,
      presentToday,
      lateToday,
      absentToday,
      pendingLeaves: pendingLeaves.length,
      approvedThisMonth: approvedThisMonth.length,
      totalPayroll,
      attendanceRate:
        employees.length > 0
          ? Math.round(((presentToday + lateToday) / employees.length) * 100)
          : 0,
    };
  }, [employees, attendance, leaves]);

  // Recent leave requests
  const recentLeaveRequests = useMemo(
    () =>
      leaves
        .filter((l) => l.status === 'Pending')
        .sort((a, b) => parseISO(b.appliedOn) - parseISO(a.appliedOn))
        .slice(0, 5),
    [leaves],
  );

  // Recent attendance issues
  const attendanceIssues = useMemo(
    () =>
      attendance
        .filter((a) => a.status === 'Late' || a.status === 'Absent')
        .sort((a, b) => parseISO(b.date) - parseISO(a.date))
        .slice(0, 5)
        .map((a) => ({
          ...a,
          employee: employees.find((e) => e.id === a.employeeId),
        })),
    [attendance, employees],
  );

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-linear-to-r from-red-800 to-red-900 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">HR Dashboard</h1>
            <p className="text-red-100 mt-1">
              Welcome back, {user?.name?.split(' ')[0]}! Here's your overview for{' '}
              {format(new Date(), 'EEEE, MMMM d')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
              <p className="text-sm text-red-100">Attendance Rate</p>
              <p className="text-2xl font-bold">{stats.attendanceRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          subtitle={`${stats.activeEmployees} active, ${stats.onLeave} on leave`}
          icon={UsersIcon}
          trend="up"
          trendValue="+2 this month"
          color="primary"
        />
        <StatCard
          title="Present Today"
          value={stats.presentToday}
          subtitle={`${stats.lateToday} late, ${stats.absentToday} absent`}
          icon={CheckCircleIcon}
          color="success"
        />
        <StatCard
          title="Pending Leaves"
          value={stats.pendingLeaves}
          subtitle={`${stats.approvedThisMonth} approved this month`}
          icon={DocumentTextIcon}
          color={stats.pendingLeaves > 5 ? 'warning' : 'default'}
        />
        <StatCard
          title="Monthly Payroll"
          value={formatCurrency(stats.totalPayroll)}
          subtitle="Total base salary expense"
          icon={CurrencyDollarIcon}
          color="success"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/hr/employees"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors group"
          >
            <UsersIcon className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-blue-900">Manage Employees</span>
          </Link>
          <Link
            to="/hr/leaves"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors group"
          >
            <DocumentTextIcon className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-green-900">Approve Leaves</span>
          </Link>
          <Link
            to="/hr/attendance"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-amber-50 hover:bg-amber-100 transition-colors group"
          >
            <ClockIcon className="w-6 h-6 text-amber-600 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-amber-900">View Attendance</span>
          </Link>
          <Link
            to="/hr/reports"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors group"
          >
            <ChartBarIcon className="w-6 h-6 text-purple-600 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-purple-900">View Reports</span>
          </Link>
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Leave Requests */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Pending Leave Requests</h3>
            <Link
              to="/hr/leaves"
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              View All <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
          {recentLeaveRequests.length === 0 ? (
            <div className="text-center py-8">
              <DocumentTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No pending leave requests</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentLeaveRequests.map((leave) => (
                <div
                  key={leave.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {leave.employeeName
                          ?.split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{leave.employeeName}</p>
                      <p className="text-xs text-gray-500">
                        {leave.type} • {leave.days} day{leave.days > 1 ? 's' : ''} •{' '}
                        {leave.department}
                      </p>
                    </div>
                  </div>
                  <Badge variant="warning">Pending</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Attendance Issues */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Attendance Issues</h3>
            <Link
              to="/hr/attendance"
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              View All <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
          {attendanceIssues.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircleIcon className="w-12 h-12 text-green-300 mx-auto mb-2" />
              <p className="text-gray-500">No attendance issues</p>
            </div>
          ) : (
            <div className="space-y-3">
              {attendanceIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        issue.status === 'Late' ? 'bg-yellow-100' : 'bg-red-100'
                      }`}
                    >
                      <ExclamationTriangleIcon
                        className={`w-5 h-5 ${
                          issue.status === 'Late' ? 'text-yellow-600' : 'text-red-600'
                        }`}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {issue.employee?.name || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(parseISO(issue.date), 'MMM d, yyyy')} •{' '}
                        {issue.clockIn || 'No clock in'}
                      </p>
                    </div>
                  </div>
                  <Badge variant={issue.status === 'Late' ? 'warning' : 'error'}>
                    {issue.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Department Overview */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">Department Overview</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {['Computing', 'Engineering', 'Management', 'Sciences'].map((faculty) => {
            const facultyEmployees = employees.filter((e) => e.faculty === faculty);
            return (
              <div key={faculty} className="p-4 bg-gray-50 rounded-xl">
                <p className="font-medium text-gray-900">{faculty}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{facultyEmployees.length}</p>
                <p className="text-xs text-gray-500">
                  {facultyEmployees.filter((e) => e.status === 'Active').length} active
                </p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
