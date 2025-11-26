import {
  CalendarIcon,
  ClockIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { useDataStore } from '../../../state/data';
import { format } from 'date-fns';
import Card from '../../../components/Card';
import Badge from '../../../components/Badge';

export default function EmployeeDashboard() {
  const { employees, attendance, leaves } = useDataStore();
  const employee = employees.find((e) => e.id === 'e1');

  // Calculate stats
  const myAttendance = attendance.filter((a) => a.employeeId === 'e1');
  const todayAttendance = myAttendance.find((a) => a.date === format(new Date(), 'yyyy-MM-dd'));
  const myLeaves = leaves.filter((l) => l.employeeId === 'e1');
  const pendingLeaves = myLeaves.filter((l) => l.status === 'Pending').length;
  const approvedLeaves = myLeaves.filter((l) => l.status === 'Approved').length;

  // Calculate salary with deductions
  const baseSalary = employee?.salaryBase || 5000;
  const lateCount = myAttendance.filter((a) => a.status === 'Late').length;
  const lateDeduction = lateCount * 50;
  const netPay = baseSalary - lateDeduction;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome Back, {employee?.name?.split(' ')[0]}!
        </h2>
        <p className="text-gray-600">Here's your overview for today</p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Today's Attendance */}
        <Card className="bg-linear-to-br from-blue-50 to-blue-100 border-blue-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-[#001F3F]">Today's Status</p>
              {todayAttendance ? (
                <>
                  <p className="text-2xl font-bold text-[#001F3F] mt-2">
                    {todayAttendance.clockIn}
                  </p>
                  <Badge
                    variant={todayAttendance.status === 'Present' ? 'success' : 'warning'}
                    className="mt-2"
                  >
                    {todayAttendance.status}
                  </Badge>
                </>
              ) : (
                <p className="text-lg text-[#001F3F] mt-2">Not clocked in</p>
              )}
            </div>
            <div className="p-3 bg-[#001F3F] rounded-lg">
              <ClockIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        {/* Leave Balance */}
        <Card className="bg-linear-to-br from-red-50 to-red-100 border-red-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-[#800020]">Leave Requests</p>
              <p className="text-2xl font-bold text-[#800020] mt-2">{myLeaves.length}</p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs text-red-700">{approvedLeaves} approved</span>
                <span className="text-xs text-red-700">{pendingLeaves} pending</span>
              </div>
            </div>
            <div className="p-3 bg-[#800020] rounded-lg">
              <DocumentTextIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        {/* Attendance Summary */}
        <Card className="bg-linear-to-br from-amber-50 to-amber-100 border-amber-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-amber-900">This Month</p>
              <p className="text-2xl font-bold text-amber-700 mt-2">{myAttendance.length} days</p>
              <p className="text-xs text-amber-600 mt-2">{lateCount} late arrivals</p>
            </div>
            <div className="p-3 bg-[#D4AF37] rounded-lg">
              <CalendarIcon className="w-6 h-6 text-gray-900" />
            </div>
          </div>
        </Card>

        {/* Net Salary */}
        <Card className="bg-linear-to-br from-emerald-50 to-emerald-100 border-emerald-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-900">Net Salary</p>
              <p className="text-2xl font-bold text-emerald-700 mt-2">${netPay.toLocaleString()}</p>
              <p className="text-xs text-emerald-600 mt-2">Base: ${baseSalary.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-emerald-600 rounded-lg">
              <CurrencyDollarIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Profile Card */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card title="My Profile" className="md:col-span-2">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Employee Code</p>
              <p className="font-semibold text-gray-900">{employee?.code}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Department</p>
              <p className="font-semibold text-gray-900">{employee?.department}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Designation</p>
              <p className="font-semibold text-gray-900">{employee?.designation}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Join Date</p>
              <p className="font-semibold text-gray-900">{employee?.joinDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <Badge variant="success">{employee?.status}</Badge>
            </div>
          </div>
        </Card>

        {/* Recent Leave Status */}
        <Card title="Recent Leaves">
          {myLeaves.length === 0 ? (
            <p className="text-sm text-gray-500">No leave requests yet</p>
          ) : (
            <div className="space-y-3">
              {myLeaves.slice(0, 3).map((leave) => (
                <div
                  key={leave.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{leave.type}</p>
                    <p className="text-xs text-gray-500">{leave.days} days</p>
                  </div>
                  <Badge
                    variant={
                      leave.status === 'Approved'
                        ? 'success'
                        : leave.status === 'Pending'
                          ? 'warning'
                          : 'error'
                    }
                  >
                    {leave.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
