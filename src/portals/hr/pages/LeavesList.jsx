import { useDataStore } from '../../../state/data';
import Card from '../../../components/Card';
import Badge from '../../../components/Badge';
import Button from '../../../components/Button';

export default function LeavesList() {
  const { employees, leaves, updateLeaveStatus } = useDataStore();

  const leavesWithNames = leaves.map((l) => {
    const emp = employees.find((e) => e.id === l.employeeId);
    return { ...l, employeeName: emp?.name, employeeCode: emp?.code };
  });

  const handleAction = (id, status) => {
    updateLeaveStatus(id, status);
  };

  const getBadgeVariant = (status) => {
    if (status === 'Approved') return 'success';
    if (status === 'Pending') return 'warning';
    if (status === 'Rejected') return 'error';
    return 'info';
  };

  return (
    <Card title="Leave Requests" subtitle="Approve or reject leave applications">
      {leavesWithNames.length === 0 ? (
        <p className="text-sm text-gray-500">No leave requests.</p>
      ) : (
        <div className="space-y-4">
          {leavesWithNames.map((leave) => (
            <div key={leave.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">
                    {leave.employeeName} ({leave.employeeCode})
                  </p>
                  <p className="text-sm text-gray-600">
                    {leave.type} Leave - {leave.days} days
                  </p>
                </div>
                <Badge variant={getBadgeVariant(leave.status)}>{leave.status}</Badge>
              </div>
              <div className="text-sm text-gray-700">
                <p>
                  <span className="font-medium">Dates:</span> {leave.startDate} to {leave.endDate}
                </p>
                <p>
                  <span className="font-medium">Reason:</span> {leave.reason}
                </p>
              </div>
              {leave.status === 'Pending' && (
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    onClick={() => handleAction(leave.id, 'Approved')}
                    className="text-sm"
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleAction(leave.id, 'Rejected')}
                    className="text-sm"
                  >
                    Reject
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleAction(leave.id, 'Forwarded')}
                    className="text-sm"
                  >
                    Forward
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
