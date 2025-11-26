import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, startOfMonth } from 'date-fns';
import { useDataStore } from '../../../state/data';
import Card from '../../../components/Card';
import Badge from '../../../components/Badge';
import 'react-day-picker/dist/style.css';

export default function Attendance() {
  const attendance = useDataStore((s) => s.attendance);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const dayAttendance = attendance.filter(
    (a) => a.employeeId === 'e1' && a.date === format(selectedDate, 'yyyy-MM-dd'),
  )[0];

  const markedDays = attendance.filter((a) => a.employeeId === 'e1').map((a) => new Date(a.date));

  const getBadgeVariant = (status) => {
    if (status === 'Present') return 'success';
    if (status === 'Late') return 'warning';
    if (status === 'Absent') return 'error';
    return 'default';
  };

  return (
    <div className="space-y-6">
      <Card title="My Attendance" subtitle="View your clock-in and clock-out times">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              month={startOfMonth(selectedDate)}
              modifiers={{ marked: markedDays }}
              modifiersClassNames={{ marked: 'bg-indigo-100 font-bold' }}
              className="border rounded-lg p-4"
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">
              Details for {format(selectedDate, 'MMM dd, yyyy')}
            </h3>
            {dayAttendance ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge variant={getBadgeVariant(dayAttendance.status)}>
                    {dayAttendance.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Clock In:</span>
                  <span className="font-semibold">{dayAttendance.clockIn}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Clock Out:</span>
                  <span className="font-semibold">{dayAttendance.clockOut}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No attendance record for this date.</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
