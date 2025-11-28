import { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { useDataStore, leaveTypes } from '../../../state/data';
import { useAuthStore } from '../../../state/auth';
import Card from '../../../components/Card';
import Badge from '../../../components/Badge';
import Button from '../../../components/Button';
import Modal from '../../../components/Modal';
import Avatar from '../../../components/Avatar';
import StatCard from '../../../components/StatCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/Tabs';
import {
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CalendarDaysIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

export default function LeavesList() {
  const user = useAuthStore((s) => s.user);
  const { employees, leaves, updateLeaveStatus } = useDataStore();
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Stats
  const stats = useMemo(
    () => ({
      total: leaves.length,
      pending: leaves.filter((l) => l.status === 'Pending').length,
      approved: leaves.filter((l) => l.status === 'Approved').length,
      rejected: leaves.filter((l) => l.status === 'Rejected').length,
    }),
    [leaves],
  );

  // Enrich leaves with employee data
  const enrichedLeaves = useMemo(() => {
    return leaves.map((leave) => {
      const employee = employees.find((e) => e.id === leave.employeeId);
      return {
        ...leave,
        employee,
        employeeName: leave.employeeName || employee?.name,
        department: leave.department || employee?.department,
        faculty: leave.faculty || employee?.faculty,
      };
    });
  }, [leaves, employees]);

  // Filtered leaves
  const filteredLeaves = useMemo(() => {
    return enrichedLeaves
      .filter((leave) => {
        const matchesSearch =
          leave.employeeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          leave.department?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = filterType === 'all' || leave.type === filterType;
        const matchesStatus = filterStatus === 'all' || leave.status === filterStatus;

        return matchesSearch && matchesType && matchesStatus;
      })
      .sort((a, b) => parseISO(b.appliedOn) - parseISO(a.appliedOn));
  }, [enrichedLeaves, searchQuery, filterType, filterStatus]);

  // Group by status
  const pendingLeaves = filteredLeaves.filter((l) => l.status === 'Pending');
  const approvedLeaves = filteredLeaves.filter((l) => l.status === 'Approved');
  const rejectedLeaves = filteredLeaves.filter((l) => l.status === 'Rejected');

  const handleAction = (leaveId, status, comment = '') => {
    updateLeaveStatus(leaveId, status, {
      by: user?.name || 'HR',
      date: format(new Date(), 'yyyy-MM-dd'),
      comment,
    });
    setSelectedLeave(null);
  };

  const getBadgeVariant = (status) => {
    if (status === 'Approved') return 'success';
    if (status === 'Pending') return 'warning';
    if (status === 'Rejected') return 'error';
    return 'info';
  };

  const getLeaveTypeName = (typeId) => {
    return leaveTypes.find((lt) => lt.id === typeId)?.name || typeId;
  };

  const renderLeaveCard = (leave) => (
    <div
      key={leave.id}
      className="border rounded-xl p-4 hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={() => setSelectedLeave(leave)}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <Avatar name={leave.employeeName} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-900">{leave.employeeName}</h4>
            <Badge variant={getBadgeVariant(leave.status)}>{leave.status}</Badge>
          </div>
          <p className="text-sm text-gray-500 mb-2">
            {leave.department} • {getLeaveTypeName(leave.type)}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <CalendarDaysIcon className="w-4 h-4" />
              {format(parseISO(leave.startDate), 'MMM d')} -{' '}
              {format(parseISO(leave.endDate), 'MMM d, yyyy')}
            </span>
            <span className="flex items-center gap-1">
              <ClockIcon className="w-4 h-4" />
              {leave.days} day{leave.days > 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2 line-clamp-1">{leave.reason}</p>
        </div>
        <div className="text-right text-sm text-gray-500">
          <p>Applied</p>
          <p className="font-medium">{format(parseISO(leave.appliedOn), 'MMM d')}</p>
        </div>
      </div>

      {leave.status === 'Pending' && (
        <div className="flex gap-2 mt-4 pt-4 border-t">
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleAction(leave.id, 'Approved');
            }}
            className="gap-1"
          >
            <CheckCircleIcon className="w-4 h-4" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleAction(leave.id, 'Rejected');
            }}
            className="gap-1 text-red-600 border-red-200 hover:bg-red-50"
          >
            <XCircleIcon className="w-4 h-4" />
            Reject
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedLeave(leave);
            }}
            className="gap-1"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Forward
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Leave Requests</h1>
        <p className="text-gray-600">Review and manage employee leave applications</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Requests"
          value={stats.total}
          icon={DocumentTextIcon}
          color="primary"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          subtitle="Awaiting approval"
          icon={ClockIcon}
          color="warning"
        />
        <StatCard title="Approved" value={stats.approved} icon={CheckCircleIcon} color="success" />
        <StatCard title="Rejected" value={stats.rejected} icon={XCircleIcon} color="error" />
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by employee name or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              {leaveTypes.map((lt) => (
                <option key={lt.id} value={lt.id}>
                  {lt.name}
                </option>
              ))}
            </select>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </Card>

      {/* Leave Requests Tabs */}
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingLeaves.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedLeaves.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedLeaves.length})</TabsTrigger>
          <TabsTrigger value="all">All ({filteredLeaves.length})</TabsTrigger>
        </TabsList>

        {[
          { key: 'pending', data: pendingLeaves },
          { key: 'approved', data: approvedLeaves },
          { key: 'rejected', data: rejectedLeaves },
          { key: 'all', data: filteredLeaves },
        ].map(({ key, data }) => (
          <TabsContent key={key} value={key}>
            <Card>
              {data.length === 0 ? (
                <div className="text-center py-12">
                  <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No {key === 'all' ? '' : key} leave requests</p>
                </div>
              ) : (
                <div className="space-y-4">{data.map(renderLeaveCard)}</div>
              )}
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Leave Detail Modal */}
      <Modal
        isOpen={!!selectedLeave}
        onClose={() => setSelectedLeave(null)}
        title="Leave Request Details"
        size="lg"
      >
        {selectedLeave && (
          <div className="space-y-6">
            {/* Employee Info */}
            <div className="flex items-center gap-4">
              <Avatar name={selectedLeave.employeeName} size="lg" />
              <div>
                <h3 className="font-semibold text-gray-900">{selectedLeave.employeeName}</h3>
                <p className="text-sm text-gray-500">
                  {selectedLeave.department} • {selectedLeave.faculty}
                </p>
                <Badge variant={getBadgeVariant(selectedLeave.status)} className="mt-1">
                  {selectedLeave.status}
                </Badge>
              </div>
            </div>

            {/* Leave Details */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Leave Type</p>
                <p className="font-medium">{getLeaveTypeName(selectedLeave.type)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Duration</p>
                <p className="font-medium">
                  {selectedLeave.days} day{selectedLeave.days > 1 ? 's' : ''}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">From</p>
                <p className="font-medium">
                  {format(parseISO(selectedLeave.startDate), 'MMMM d, yyyy')}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">To</p>
                <p className="font-medium">
                  {format(parseISO(selectedLeave.endDate), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Reason</p>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedLeave.reason}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Applied On</p>
              <p className="font-medium">
                {format(parseISO(selectedLeave.appliedOn), 'MMMM d, yyyy')}
              </p>
            </div>

            {/* Approval Chain */}
            {selectedLeave.approvalChain && (
              <div>
                <p className="text-xs text-gray-500 uppercase mb-2">Approval Chain</p>
                <div className="space-y-2">
                  {selectedLeave.approvalChain.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        {step.status === 'approved' ? (
                          <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        ) : step.status === 'rejected' ? (
                          <XCircleIcon className="w-5 h-5 text-red-500" />
                        ) : (
                          <ClockIcon className="w-5 h-5 text-gray-400" />
                        )}
                        <div>
                          <span className="font-medium uppercase">{step.role}</span>
                          {step.by && (
                            <span className="text-sm text-gray-500 ml-2">by {step.by}</span>
                          )}
                        </div>
                      </div>
                      <span
                        className={`text-sm capitalize ${
                          step.status === 'approved'
                            ? 'text-green-600'
                            : step.status === 'rejected'
                              ? 'text-red-600'
                              : 'text-gray-500'
                        }`}
                      >
                        {step.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            {selectedLeave.status === 'Pending' && (
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => handleAction(selectedLeave.id, 'Rejected')}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Reject
                </Button>
                <Button onClick={() => handleAction(selectedLeave.id, 'Approved')}>Approve</Button>
              </div>
            )}

            {selectedLeave.status !== 'Pending' && (
              <div className="flex justify-end pt-4 border-t">
                <Button variant="outline" onClick={() => setSelectedLeave(null)}>
                  Close
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
