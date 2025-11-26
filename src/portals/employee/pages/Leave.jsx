import { useState } from 'react';
import { useDataStore } from '../../../state/data';
import Card from '../../../components/Card';
import FormField from '../../../components/FormField';
import Button from '../../../components/Button';
import Badge from '../../../components/Badge';

export default function Leave() {
  const { leaves, addLeave } = useDataStore();
  const [formData, setFormData] = useState({
    type: 'Annual',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const newLeave = {
      id: `l${Date.now()}`,
      employeeId: 'e1',
      ...formData,
      days,
      status: 'Pending',
    };
    addLeave(newLeave);
    alert('Leave request submitted!');
    setFormData({ type: 'Annual', startDate: '', endDate: '', reason: '' });
  };

  const myLeaves = leaves.filter((l) => l.employeeId === 'e1');

  const getBadgeVariant = (status) => {
    if (status === 'Approved') return 'success';
    if (status === 'Pending') return 'warning';
    if (status === 'Rejected') return 'error';
    return 'info';
  };

  return (
    <div className="space-y-6">
      <Card title="Apply for Leave" subtitle="Request time off">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Leave Type" id="type" required>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option>Annual</option>
              <option>Sick</option>
              <option>Casual</option>
              <option>Unpaid</option>
            </select>
          </FormField>
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField label="Start Date" id="startDate" required>
              <input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </FormField>
            <FormField label="End Date" id="endDate" required>
              <input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </FormField>
          </div>
          <FormField label="Reason" id="reason" required>
            <textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              rows="3"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </FormField>
          <Button type="submit">Submit Request</Button>
        </form>
      </Card>

      <Card title="My Leave Requests" subtitle="View your leave history">
        {myLeaves.length === 0 ? (
          <p className="text-sm text-gray-500">No leave requests yet.</p>
        ) : (
          <div className="space-y-4">
            {myLeaves.map((leave) => (
              <div key={leave.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">{leave.type} Leave</span>
                  <Badge variant={getBadgeVariant(leave.status)}>{leave.status}</Badge>
                </div>
                <div className="text-sm text-gray-600">
                  {leave.startDate} to {leave.endDate} ({leave.days} days)
                </div>
                <p className="text-sm text-gray-700">{leave.reason}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
