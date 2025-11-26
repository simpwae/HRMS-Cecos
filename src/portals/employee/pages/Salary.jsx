import { useDataStore } from '../../../state/data';
import Card from '../../../components/Card';

export default function Salary() {
  const { employees, attendance } = useDataStore();
  const employee = employees.find((e) => e.id === 'e1');

  // Mock salary calculation
  const baseSalary = employee?.salaryBase || 5000;
  const lateCount = attendance.filter((a) => a.employeeId === 'e1' && a.status === 'Late').length;
  const earlyCount = 0; // mock
  const lateDeduction = lateCount * 50;
  const earlyDeduction = earlyCount * 50;
  const netPay = baseSalary - lateDeduction - earlyDeduction;

  return (
    <Card title="My Salary" subtitle="View your pay slip for current month">
      <div className="space-y-6">
        <div className="border-b pb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Employee Code</p>
              <p className="font-semibold">{employee?.code}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Designation</p>
              <p className="font-semibold">{employee?.designation}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Base Salary</span>
            <span className="font-semibold">${baseSalary.toFixed(2)}</span>
          </div>
          {lateDeduction > 0 && (
            <div className="flex items-center justify-between text-red-600">
              <span>Deduction (Late - {lateCount} days)</span>
              <span>-${lateDeduction.toFixed(2)}</span>
            </div>
          )}
          {earlyDeduction > 0 && (
            <div className="flex items-center justify-between text-red-600">
              <span>Deduction (Early Leave - {earlyCount} days)</span>
              <span>-${earlyDeduction.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between text-lg font-bold">
            <span>Net Pay</span>
            <span className="text-green-600">${netPay.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
