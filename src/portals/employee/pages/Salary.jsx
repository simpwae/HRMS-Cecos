import { useMemo, useState } from 'react';
import { format, startOfMonth, endOfMonth, parseISO, isWithinInterval, subMonths } from 'date-fns';
import { useDataStore } from '../../../state/data';
import { useAuthStore } from '../../../state/auth';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import Badge from '../../../components/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/Tabs';
import {
  CurrencyDollarIcon,
  DocumentArrowDownIcon,
  CalendarDaysIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  PrinterIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
} from '@heroicons/react/24/outline';

export default function Salary() {
  const user = useAuthStore((s) => s.user);
  const { employees, attendance } = useDataStore();

  const employee = useMemo(
    () => employees.find((e) => e.id === user?.id || e.email === user?.email),
    [employees, user],
  );
  const employeeId = employee?.id || user?.id;

  const [selectedMonth, setSelectedMonth] = useState(new Date());

  // Get attendance for selected month
  const monthAttendance = useMemo(() => {
    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);

    return attendance.filter((a) => {
      if (a.employeeId !== employeeId) return false;
      const date = parseISO(a.date);
      return isWithinInterval(date, { start: monthStart, end: monthEnd });
    });
  }, [attendance, employeeId, selectedMonth]);

  // Salary calculation
  const baseSalary = employee?.salaryBase || 0;
  const presentDays = monthAttendance.filter((a) => a.status === 'Present').length;
  const lateDays = monthAttendance.filter((a) => a.status === 'Late').length;
  const absentDays = monthAttendance.filter((a) => a.status === 'Absent').length;
  const workingDays = 22; // Standard working days

  // Deductions
  const lateDeduction = lateDays * 500; // PKR 500 per late
  const absentDeduction = absentDays * Math.round(baseSalary / workingDays);
  const taxDeduction = baseSalary > 100000 ? Math.round(baseSalary * 0.05) : 0; // 5% tax if above 100k
  const totalDeductions = lateDeduction + absentDeduction + taxDeduction;

  // Allowances
  const houseAllowance = Math.round(baseSalary * 0.45);
  const medicalAllowance = Math.round(baseSalary * 0.1);
  const transportAllowance = 5000;
  const totalAllowances = houseAllowance + medicalAllowance + transportAllowance;

  // Net calculations
  const grossSalary = baseSalary + totalAllowances;
  const netSalary = grossSalary - totalDeductions;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(amount);

  // Previous months for history
  const salaryHistory = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const month = subMonths(new Date(), i);
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);

      const monthAtt = attendance.filter((a) => {
        if (a.employeeId !== employeeId) return false;
        const date = parseISO(a.date);
        return isWithinInterval(date, { start: monthStart, end: monthEnd });
      });

      const late = monthAtt.filter((a) => a.status === 'Late').length;
      const absent = monthAtt.filter((a) => a.status === 'Absent').length;
      const lateDed = late * 500;
      const absentDed = absent * Math.round(baseSalary / workingDays);
      const tax = baseSalary > 100000 ? Math.round(baseSalary * 0.05) : 0;
      const gross = baseSalary + totalAllowances;
      const net = gross - (lateDed + absentDed + tax);

      return {
        month: format(month, 'MMMM yyyy'),
        shortMonth: format(month, 'MMM yyyy'),
        gross,
        deductions: lateDed + absentDed + tax,
        net,
        status: i === 0 ? 'Processing' : 'Paid',
      };
    });
  }, [attendance, employeeId, baseSalary, totalAllowances]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Salary & Payslip</h1>
          <p className="text-gray-600">View your salary details and download payslips</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint} className="gap-2">
            <PrinterIcon className="w-5 h-5" />
            Print
          </Button>
          <Button className="gap-2">
            <DocumentArrowDownIcon className="w-5 h-5" />
            Download Payslip
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-linear-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">Net Salary</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{formatCurrency(netSalary)}</p>
              <p className="text-xs text-green-700 mt-1">{format(selectedMonth, 'MMMM yyyy')}</p>
            </div>
            <div className="p-3 bg-green-500 rounded-lg">
              <BanknotesIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-linear-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Gross Salary</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{formatCurrency(grossSalary)}</p>
              <p className="text-xs text-blue-700 mt-1">Base + Allowances</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-lg">
              <CurrencyDollarIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-linear-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-red-800">Total Deductions</p>
              <p className="text-2xl font-bold text-red-900 mt-1">
                {formatCurrency(totalDeductions)}
              </p>
              <p className="text-xs text-red-700 mt-1">
                {lateDays} late, {absentDays} absent
              </p>
            </div>
            <div className="p-3 bg-red-500 rounded-lg">
              <ArrowTrendingDownIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-linear-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-purple-800">Total Allowances</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">
                {formatCurrency(totalAllowances)}
              </p>
              <p className="text-xs text-purple-700 mt-1">Housing, Medical, Transport</p>
            </div>
            <div className="p-3 bg-purple-500 rounded-lg">
              <ArrowTrendingUpIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="payslip">
        <TabsList>
          <TabsTrigger value="payslip">Current Payslip</TabsTrigger>
          <TabsTrigger value="history">Salary History</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="payslip">
          {/* Payslip Card */}
          <Card className="print:shadow-none">
            <div className="border-b pb-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">CECOS University</h2>
                  <p className="text-sm text-gray-600">
                    Pay Slip for {format(selectedMonth, 'MMMM yyyy')}
                  </p>
                </div>
                <Badge variant={salaryHistory[0]?.status === 'Paid' ? 'success' : 'warning'}>
                  {salaryHistory[0]?.status}
                </Badge>
              </div>
            </div>

            {/* Employee Info */}
            <div className="grid sm:grid-cols-2 gap-4 pb-4 mb-4 border-b">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Employee Name</span>
                  <span className="font-medium">{employee?.name || user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Employee Code</span>
                  <span className="font-medium">{employee?.code || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Department</span>
                  <span className="font-medium">{employee?.department || user?.department}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Designation</span>
                  <span className="font-medium">{employee?.designation || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Bank Account</span>
                  <span className="font-medium">{employee?.bankAccount || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Pay Period</span>
                  <span className="font-medium">{format(selectedMonth, 'MMM yyyy')}</span>
                </div>
              </div>
            </div>

            {/* Earnings & Deductions */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Earnings */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Earnings</h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Basic Salary</span>
                    <span className="font-medium">{formatCurrency(baseSalary)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">House Rent Allowance (45%)</span>
                    <span className="font-medium">{formatCurrency(houseAllowance)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Medical Allowance (10%)</span>
                    <span className="font-medium">{formatCurrency(medicalAllowance)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Transport Allowance</span>
                    <span className="font-medium">{formatCurrency(transportAllowance)}</span>
                  </div>
                  <div className="flex justify-between py-2 font-semibold text-green-600">
                    <span>Total Earnings</span>
                    <span>{formatCurrency(grossSalary)}</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Deductions</h3>
                <div className="space-y-2">
                  {lateDeduction > 0 && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Late Arrival ({lateDays} days × ₨500)</span>
                      <span className="font-medium text-red-600">
                        -{formatCurrency(lateDeduction)}
                      </span>
                    </div>
                  )}
                  {absentDeduction > 0 && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Absent Days ({absentDays} days)</span>
                      <span className="font-medium text-red-600">
                        -{formatCurrency(absentDeduction)}
                      </span>
                    </div>
                  )}
                  {taxDeduction > 0 && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Income Tax (5%)</span>
                      <span className="font-medium text-red-600">
                        -{formatCurrency(taxDeduction)}
                      </span>
                    </div>
                  )}
                  {totalDeductions === 0 && (
                    <div className="py-4 text-center text-gray-500">No deductions this month</div>
                  )}
                  <div className="flex justify-between py-2 font-semibold text-red-600">
                    <span>Total Deductions</span>
                    <span>-{formatCurrency(totalDeductions)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Pay */}
            <div className="mt-6 pt-4 border-t-2 border-dashed">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-gray-900">Net Pay</p>
                  <p className="text-sm text-gray-500">Amount credited to bank account</p>
                </div>
                <p className="text-3xl font-bold text-green-600">{formatCurrency(netSalary)}</p>
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
                      Month
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">
                      Gross
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">
                      Deductions
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">
                      Net Pay
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">
                      Status
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {salaryHistory.map((record, idx) => (
                    <tr key={idx} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <CalendarDaysIcon className="w-5 h-5 text-gray-400" />
                          <span className="font-medium text-gray-900">{record.month}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right text-gray-900">
                        {formatCurrency(record.gross)}
                      </td>
                      <td className="py-3 px-4 text-right text-red-600">
                        -{formatCurrency(record.deductions)}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-green-600">
                        {formatCurrency(record.net)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={record.status === 'Paid' ? 'success' : 'warning'}>
                          {record.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button size="sm" variant="ghost">
                          <DocumentArrowDownIcon className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />
                Earnings Breakdown
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Basic Salary', amount: baseSalary, percentage: 100 },
                  { label: 'House Rent', amount: houseAllowance, percentage: 45 },
                  { label: 'Medical', amount: medicalAllowance, percentage: 10 },
                  { label: 'Transport', amount: transportAllowance, percentage: null },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{item.label}</span>
                      <span className="font-medium">{formatCurrency(item.amount)}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${(item.amount / grossSalary) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ReceiptPercentIcon className="w-5 h-5 text-red-500" />
                Deductions Breakdown
              </h3>
              {totalDeductions > 0 ? (
                <div className="space-y-4">
                  {lateDeduction > 0 && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Late Arrivals</span>
                        <span className="font-medium text-red-600">
                          -{formatCurrency(lateDeduction)}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500 rounded-full"
                          style={{ width: `${(lateDeduction / totalDeductions) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {absentDeduction > 0 && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Absent Days</span>
                        <span className="font-medium text-red-600">
                          -{formatCurrency(absentDeduction)}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500 rounded-full"
                          style={{ width: `${(absentDeduction / totalDeductions) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {taxDeduction > 0 && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Income Tax</span>
                        <span className="font-medium text-red-600">
                          -{formatCurrency(taxDeduction)}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500 rounded-full"
                          style={{ width: `${(taxDeduction / totalDeductions) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BanknotesIcon className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="font-medium text-gray-900">No Deductions!</p>
                  <p className="text-sm text-gray-500">Perfect attendance this month</p>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
