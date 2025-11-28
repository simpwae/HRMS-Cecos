import { useMemo, useState } from 'react';
import { format, startOfMonth, endOfMonth, parseISO, isWithinInterval, subMonths } from 'date-fns';
import { useDataStore, faculties, departments } from '../../../state/data';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/Tabs';
import {
  ChartBarIcon,
  DocumentArrowDownIcon,
  CalendarDaysIcon,
  UsersIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';

export default function Reports() {
  const { employees, attendance, leaves } = useDataStore();
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  // Employee stats
  const employeeStats = useMemo(() => {
    const byDepartment = {};
    const byFaculty = {};
    const byStatus = { Active: 0, 'On Leave': 0, Resigned: 0 };

    employees.forEach((emp) => {
      byDepartment[emp.department] = (byDepartment[emp.department] || 0) + 1;
      byFaculty[emp.faculty] = (byFaculty[emp.faculty] || 0) + 1;
      byStatus[emp.status] = (byStatus[emp.status] || 0) + 1;
    });

    return { byDepartment, byFaculty, byStatus };
  }, [employees]);

  // Attendance stats for selected month
  const attendanceStats = useMemo(() => {
    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);

    const monthRecords = attendance.filter((a) => {
      const date = parseISO(a.date);
      return isWithinInterval(date, { start: monthStart, end: monthEnd });
    });

    const present = monthRecords.filter((a) => a.status === 'Present').length;
    const late = monthRecords.filter((a) => a.status === 'Late').length;
    const absent = monthRecords.filter((a) => a.status === 'Absent').length;
    const total = monthRecords.length;

    // By employee
    const byEmployee = {};
    monthRecords.forEach((record) => {
      if (!byEmployee[record.employeeId]) {
        byEmployee[record.employeeId] = { present: 0, late: 0, absent: 0 };
      }
      byEmployee[record.employeeId][record.status.toLowerCase()]++;
    });

    return { present, late, absent, total, byEmployee };
  }, [attendance, selectedMonth]);

  // Leave stats
  const leaveStats = useMemo(() => {
    const byStatus = { Pending: 0, Approved: 0, Rejected: 0 };
    const byType = {};

    leaves.forEach((leave) => {
      byStatus[leave.status] = (byStatus[leave.status] || 0) + 1;
      byType[leave.type] = (byType[leave.type] || 0) + 1;
    });

    return { byStatus, byType, total: leaves.length };
  }, [leaves]);

  // Monthly trend data
  const monthlyTrend = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const month = subMonths(new Date(), i);
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);

      const monthRecords = attendance.filter((a) => {
        const date = parseISO(a.date);
        return isWithinInterval(date, { start: monthStart, end: monthEnd });
      });

      const present = monthRecords.filter((a) => a.status === 'Present').length;
      const late = monthRecords.filter((a) => a.status === 'Late').length;
      const absent = monthRecords.filter((a) => a.status === 'Absent').length;

      return {
        month: format(month, 'MMM yyyy'),
        present,
        late,
        absent,
        total: present + late + absent,
        attendanceRate:
          monthRecords.length > 0 ? Math.round(((present + late) / monthRecords.length) * 100) : 0,
      };
    }).reverse();
  }, [attendance]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(amount);

  // Total salary expense
  const totalSalaryExpense = employees
    .filter((e) => e.status === 'Active')
    .reduce((sum, e) => sum + (e.salaryBase || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">View detailed reports and statistics</p>
        </div>
        <Button className="gap-2">
          <DocumentArrowDownIcon className="w-5 h-5" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-linear-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Total Employees</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{employees.length}</p>
              <p className="text-xs text-blue-700 mt-1">{employeeStats.byStatus.Active} active</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-lg">
              <UsersIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-linear-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">Avg Attendance</p>
              <p className="text-3xl font-bold text-green-900 mt-1">
                {attendanceStats.total > 0
                  ? Math.round(
                      ((attendanceStats.present + attendanceStats.late) / attendanceStats.total) *
                        100,
                    )
                  : 0}
                %
              </p>
              <p className="text-xs text-green-700 mt-1">{format(selectedMonth, 'MMMM yyyy')}</p>
            </div>
            <div className="p-3 bg-green-500 rounded-lg">
              <ClockIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-linear-to-br from-amber-50 to-amber-100 border-amber-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-amber-800">Pending Leaves</p>
              <p className="text-3xl font-bold text-amber-900 mt-1">
                {leaveStats.byStatus.Pending}
              </p>
              <p className="text-xs text-amber-700 mt-1">{leaveStats.total} total requests</p>
            </div>
            <div className="p-3 bg-amber-500 rounded-lg">
              <CalendarDaysIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-linear-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-purple-800">Monthly Payroll</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">
                {formatCurrency(totalSalaryExpense)}
              </p>
              <p className="text-xs text-purple-700 mt-1">Base salary expense</p>
            </div>
            <div className="p-3 bg-purple-500 rounded-lg">
              <CurrencyDollarIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="attendance">
        <TabsList>
          <TabsTrigger value="attendance">Attendance Report</TabsTrigger>
          <TabsTrigger value="employees">Employee Report</TabsTrigger>
          <TabsTrigger value="leaves">Leave Report</TabsTrigger>
          <TabsTrigger value="payroll">Payroll Report</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Monthly Trend */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Attendance Trend (Last 6 Months)</h3>
              <div className="space-y-4">
                {monthlyTrend.map((month) => (
                  <div key={month.month}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{month.month}</span>
                      <span className="font-medium">{month.attendanceRate}%</span>
                    </div>
                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden flex">
                      <div
                        className="bg-green-500 h-full"
                        style={{ width: `${(month.present / (month.total || 1)) * 100}%` }}
                      />
                      <div
                        className="bg-yellow-500 h-full"
                        style={{ width: `${(month.late / (month.total || 1)) * 100}%` }}
                      />
                      <div
                        className="bg-red-500 h-full"
                        style={{ width: `${(month.absent / (month.total || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-4 mt-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-green-500" />
                  <span>Present</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-yellow-500" />
                  <span>Late</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-red-500" />
                  <span>Absent</span>
                </div>
              </div>
            </Card>

            {/* This Month Summary */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">This Month Summary</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <p className="text-3xl font-bold text-green-600">{attendanceStats.present}</p>
                  <p className="text-sm text-green-700">Present</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-xl">
                  <p className="text-3xl font-bold text-yellow-600">{attendanceStats.late}</p>
                  <p className="text-sm text-yellow-700">Late</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-xl">
                  <p className="text-3xl font-bold text-red-600">{attendanceStats.absent}</p>
                  <p className="text-sm text-red-700">Absent</p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="employees">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* By Department */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Employees by Department</h3>
              <div className="space-y-3">
                {Object.entries(employeeStats.byDepartment).map(([dept, count]) => (
                  <div key={dept} className="flex items-center justify-between">
                    <span className="text-gray-600">{dept}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${(count / employees.length) * 100}%` }}
                        />
                      </div>
                      <span className="font-medium w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* By Faculty */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Employees by Faculty</h3>
              <div className="space-y-3">
                {Object.entries(employeeStats.byFaculty).map(([faculty, count]) => (
                  <div key={faculty} className="flex items-center justify-between">
                    <span className="text-gray-600">{faculty}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full"
                          style={{ width: `${(count / employees.length) * 100}%` }}
                        />
                      </div>
                      <span className="font-medium w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* By Status */}
            <Card className="lg:col-span-2">
              <h3 className="font-semibold text-gray-900 mb-4">Employee Status Distribution</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {Object.entries(employeeStats.byStatus).map(([status, count]) => (
                  <div
                    key={status}
                    className={`p-4 rounded-xl ${
                      status === 'Active'
                        ? 'bg-green-50'
                        : status === 'On Leave'
                          ? 'bg-yellow-50'
                          : 'bg-red-50'
                    }`}
                  >
                    <p
                      className={`text-3xl font-bold ${
                        status === 'Active'
                          ? 'text-green-600'
                          : status === 'On Leave'
                            ? 'text-yellow-600'
                            : 'text-red-600'
                      }`}
                    >
                      {count}
                    </p>
                    <p className="text-sm text-gray-600">{status}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leaves">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* By Status */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Leave Requests by Status</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-yellow-50 rounded-xl">
                  <p className="text-3xl font-bold text-yellow-600">
                    {leaveStats.byStatus.Pending}
                  </p>
                  <p className="text-sm text-yellow-700">Pending</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <p className="text-3xl font-bold text-green-600">
                    {leaveStats.byStatus.Approved}
                  </p>
                  <p className="text-sm text-green-700">Approved</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-xl">
                  <p className="text-3xl font-bold text-red-600">{leaveStats.byStatus.Rejected}</p>
                  <p className="text-sm text-red-700">Rejected</p>
                </div>
              </div>
            </Card>

            {/* By Type */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Leave Requests by Type</h3>
              <div className="space-y-3">
                {Object.entries(leaveStats.byType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-gray-600 capitalize">{type}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${(count / leaveStats.total) * 100}%` }}
                        />
                      </div>
                      <span className="font-medium w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payroll">
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Payroll Summary</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Department
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">
                      Employees
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">
                      Total Salary
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">
                      Avg Salary
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(employeeStats.byDepartment).map(([dept, count]) => {
                    const deptEmployees = employees.filter((e) => e.department === dept);
                    const totalSalary = deptEmployees.reduce(
                      (sum, e) => sum + (e.salaryBase || 0),
                      0,
                    );
                    const avgSalary = totalSalary / count;

                    return (
                      <tr key={dept} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{dept}</td>
                        <td className="py-3 px-4 text-center text-gray-600">{count}</td>
                        <td className="py-3 px-4 text-right text-gray-900">
                          {formatCurrency(totalSalary)}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-600">
                          {formatCurrency(avgSalary)}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-gray-50 font-semibold">
                    <td className="py-3 px-4">Total</td>
                    <td className="py-3 px-4 text-center">{employees.length}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(totalSalaryExpense)}</td>
                    <td className="py-3 px-4 text-right">
                      {formatCurrency(totalSalaryExpense / employees.length)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
