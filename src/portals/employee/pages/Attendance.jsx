import { useState, useMemo } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, startOfMonth, endOfMonth, parseISO, isWithinInterval, subMonths } from 'date-fns';
import { useDataStore } from '../../../state/data';
import { useAuthStore } from '../../../state/auth';
import Card from '../../../components/Card';
import Badge from '../../../components/Badge';
import StatCard from '../../../components/StatCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/Tabs';
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import 'react-day-picker/dist/style.css';

export default function Attendance() {
  const user = useAuthStore((s) => s.user);
  const { employees, attendance } = useDataStore();

  const employee = useMemo(
    () => employees.find((e) => e.id === user?.id || e.email === user?.email),
    [employees, user],
  );
  const employeeId = employee?.id || user?.id;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMonth, setViewMonth] = useState(new Date());

  // Get all attendance records for this employee
  const myAttendance = useMemo(
    () => attendance.filter((a) => a.employeeId === employeeId),
    [attendance, employeeId],
  );

  // Get attendance for selected date
  const dayAttendance = useMemo(
    () => myAttendance.find((a) => a.date === format(selectedDate, 'yyyy-MM-dd')),
    [myAttendance, selectedDate],
  );

  // Current month stats
  const currentMonthStats = useMemo(() => {
    const monthStart = startOfMonth(viewMonth);
    const monthEnd = endOfMonth(viewMonth);

    const monthRecords = myAttendance.filter((a) => {
      const date = parseISO(a.date);
      return isWithinInterval(date, { start: monthStart, end: monthEnd });
    });

    return {
      present: monthRecords.filter((a) => a.status === 'Present').length,
      late: monthRecords.filter((a) => a.status === 'Late').length,
      absent: monthRecords.filter((a) => a.status === 'Absent').length,
      total: monthRecords.length,
      avgHours:
        monthRecords.reduce((sum, a) => sum + (a.workHours || 0), 0) / (monthRecords.length || 1),
    };
  }, [myAttendance, viewMonth]);

  // Marked days for calendar
  const markedDays = useMemo(
    () => ({
      present: myAttendance.filter((a) => a.status === 'Present').map((a) => parseISO(a.date)),
      late: myAttendance.filter((a) => a.status === 'Late').map((a) => parseISO(a.date)),
      absent: myAttendance.filter((a) => a.status === 'Absent').map((a) => parseISO(a.date)),
    }),
    [myAttendance],
  );

  const getBadgeVariant = (status) => {
    if (status === 'Present') return 'success';
    if (status === 'Late') return 'warning';
    if (status === 'Absent') return 'error';
    return 'default';
  };

  // Monthly breakdown
  const monthlyData = useMemo(() => {
    const months = [];
    for (let i = 0; i < 6; i++) {
      const month = subMonths(new Date(), i);
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);

      const records = myAttendance.filter((a) => {
        const date = parseISO(a.date);
        return isWithinInterval(date, { start: monthStart, end: monthEnd });
      });

      months.push({
        month: format(month, 'MMM yyyy'),
        present: records.filter((a) => a.status === 'Present').length,
        late: records.filter((a) => a.status === 'Late').length,
        absent: records.filter((a) => a.status === 'Absent').length,
        total: records.length,
      });
    }
    return months;
  }, [myAttendance]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Attendance</h1>
        <p className="text-gray-600">Track your clock-in, clock-out times and attendance history</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Present Days"
          value={currentMonthStats.present}
          subtitle={format(viewMonth, 'MMMM yyyy')}
          icon={CheckCircleIcon}
          color="success"
        />
        <StatCard
          title="Late Arrivals"
          value={currentMonthStats.late}
          subtitle="This month"
          icon={ExclamationTriangleIcon}
          color="warning"
        />
        <StatCard
          title="Absent Days"
          value={currentMonthStats.absent}
          subtitle="This month"
          icon={XCircleIcon}
          color="error"
        />
        <StatCard
          title="Avg. Work Hours"
          value={currentMonthStats.avgHours.toFixed(1)}
          subtitle="Hours per day"
          icon={ClockIcon}
          color="primary"
        />
      </div>

      {/* Main Content */}
      <Tabs defaultValue="calendar">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Report</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <Card>
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Calendar */}
              <div>
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  month={viewMonth}
                  onMonthChange={setViewMonth}
                  modifiers={{
                    present: markedDays.present,
                    late: markedDays.late,
                    absent: markedDays.absent,
                  }}
                  modifiersClassNames={{
                    present: 'bg-green-100 text-green-800 font-semibold',
                    late: 'bg-yellow-100 text-yellow-800 font-semibold',
                    absent: 'bg-red-100 text-red-800 font-semibold',
                  }}
                  className="border rounded-xl p-4 mx-auto"
                />
                <div className="flex items-center justify-center gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-gray-600">Present</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-gray-600">Late</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-gray-600">Absent</span>
                  </div>
                </div>
              </div>

              {/* Selected Day Details */}
              <div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CalendarDaysIcon className="w-5 h-5 text-gray-500" />
                    <h3 className="font-semibold text-gray-900">
                      {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </h3>
                  </div>

                  {dayAttendance ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Status</span>
                        <Badge variant={getBadgeVariant(dayAttendance.status)} size="lg">
                          {dayAttendance.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4 text-center border">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Clock In</p>
                          <p className="text-2xl font-bold text-gray-900 mt-1">
                            {dayAttendance.clockIn || '--:--'}
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center border">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Clock Out</p>
                          <p className="text-2xl font-bold text-gray-900 mt-1">
                            {dayAttendance.clockOut || '--:--'}
                          </p>
                        </div>
                      </div>

                      {dayAttendance.workHours > 0 && (
                        <div className="bg-white rounded-lg p-4 border">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Total Work Hours
                          </p>
                          <p className="text-xl font-bold text-gray-900 mt-1">
                            {dayAttendance.workHours.toFixed(1)} hours
                          </p>
                        </div>
                      )}

                      {dayAttendance.status === 'Late' && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <div className="flex items-start gap-2">
                            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5" />
                            <div>
                              <p className="font-medium text-yellow-800">Late Arrival</p>
                              <p className="text-sm text-yellow-700">
                                Office hours start at 09:00. A deduction may apply.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CalendarDaysIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No attendance record for this date</p>
                      <p className="text-sm text-gray-400 mt-1">Weekend or holiday</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Day</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Clock In
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Clock Out
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Work Hours
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {myAttendance.slice(0, 30).map((record) => (
                    <tr key={record.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {format(parseISO(record.date), 'MMM d, yyyy')}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {format(parseISO(record.date), 'EEEE')}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">{record.clockIn || '--'}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{record.clockOut || '--'}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {record.workHours ? `${record.workHours.toFixed(1)}h` : '--'}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getBadgeVariant(record.status)}>{record.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="monthly">
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Month
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">
                      Present
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">
                      Late
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">
                      Absent
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">
                      Total Days
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">
                      Attendance %
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map((month) => {
                    const percentage =
                      month.total > 0
                        ? Math.round(((month.present + month.late) / month.total) * 100)
                        : 0;
                    return (
                      <tr key={month.month} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">
                          {month.month}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-800 font-semibold text-sm">
                            {month.present}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-800 font-semibold text-sm">
                            {month.late}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-800 font-semibold text-sm">
                            {month.absent}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-gray-900">
                          {month.total}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  percentage >= 90
                                    ? 'bg-green-500'
                                    : percentage >= 75
                                      ? 'bg-yellow-500'
                                      : 'bg-red-500'
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900">{percentage}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
