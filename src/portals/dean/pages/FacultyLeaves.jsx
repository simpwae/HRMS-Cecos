import { useState, useMemo } from 'react';
import { useDataStore } from '../../../state/data';
import { useAuthStore } from '../../../state/auth';
import Card from '../../../components/Card';
import Badge from '../../../components/Badge';
import Button from '../../../components/Button';
import Modal from '../../../components/Modal';
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { format, parseISO, differenceInDays } from 'date-fns';

const TABS = [
  { id: 'all', label: 'All Requests' },
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
];

export default function FacultyLeaves() {
  const employees = useDataStore((s) => s.employees);
  const leaves = useDataStore((s) => s.leaves);
  const updateLeave = useDataStore((s) => s.updateLeave);
  const user = useAuthStore((s) => s.user);

  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeaveType, setSelectedLeaveType] = useState('all');
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState(null);
  const [approvalComment, setApprovalComment] = useState('');

  // Get faculty employees
  const facultyEmployees = useMemo(
    () => employees.filter((e) => e.faculty === user.faculty),
    [employees, user.faculty],
  );

  const facultyEmployeeIds = useMemo(
    () => new Set(facultyEmployees.map((e) => e.id)),
    [facultyEmployees],
  );

  // Get faculty leaves with employee info
  const facultyLeaves = useMemo(
    () =>
      leaves
        .filter((l) => facultyEmployeeIds.has(l.employeeId))
        .map((leave) => ({
          ...leave,
          employee: employees.find((e) => e.id === leave.employeeId),
          days:
            leave.days ||
            (leave.startDate && leave.endDate
              ? differenceInDays(parseISO(leave.endDate), parseISO(leave.startDate)) + 1
              : 0),
        }))
        .sort((a, b) => new Date(b.appliedOn) - new Date(a.appliedOn)),
    [leaves, employees, facultyEmployeeIds],
  );

  // Get unique leave types
  const leaveTypes = useMemo(
    () => [...new Set(facultyLeaves.map((l) => l.type))].sort(),
    [facultyLeaves],
  );

  // Filter leaves
  const filteredLeaves = useMemo(() => {
    return facultyLeaves.filter((leave) => {
      // Tab filter
      if (activeTab !== 'all' && leave.status.toLowerCase() !== activeTab) {
        return false;
      }
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesName = leave.employee?.name?.toLowerCase().includes(searchLower);
        const matchesCode = leave.employee?.code?.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesCode) return false;
      }
      // Leave type filter
      if (selectedLeaveType !== 'all' && leave.type !== selectedLeaveType) {
        return false;
      }
      return true;
    });
  }, [facultyLeaves, activeTab, searchTerm, selectedLeaveType]);

  // Statistics
  const stats = useMemo(
    () => ({
      total: facultyLeaves.length,
      pending: facultyLeaves.filter((l) => l.status === 'Pending').length,
      approved: facultyLeaves.filter((l) => l.status === 'Approved').length,
      rejected: facultyLeaves.filter((l) => l.status === 'Rejected').length,
    }),
    [facultyLeaves],
  );

  const handleOpenApproval = (leave, action) => {
    setSelectedLeave(leave);
    setApprovalAction(action);
    setApprovalComment('');
    setShowApprovalModal(true);
  };

  const handleApprovalSubmit = () => {
    if (!selectedLeave || !approvalAction) return;

    const newStatus = approvalAction === 'approve' ? 'Approved' : 'Rejected';

    updateLeave(selectedLeave.id, {
      status: newStatus,
      reviewedBy: user.name,
      reviewedOn: new Date().toISOString().split('T')[0],
      comments: approvalComment || undefined,
    });

    setShowApprovalModal(false);
    setSelectedLeave(null);
    setApprovalAction(null);
    setApprovalComment('');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <Badge variant="success">{status}</Badge>;
      case 'Rejected':
        return <Badge variant="danger">{status}</Badge>;
      case 'Pending':
        return <Badge variant="warning">{status}</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getLeaveTypeBadge = (type) => {
    const colors = {
      Annual: 'bg-blue-100 text-blue-700',
      Sick: 'bg-red-100 text-red-700',
      Casual: 'bg-purple-100 text-purple-700',
      Maternity: 'bg-pink-100 text-pink-700',
      Paternity: 'bg-cyan-100 text-cyan-700',
      Unpaid: 'bg-gray-100 text-gray-700',
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${colors[type] || 'bg-gray-100 text-gray-700'}`}
      >
        {type}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Faculty Leave Requests</h2>
        <p className="text-gray-500 mt-1">Manage leave requests for {user.faculty}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-100">
              <CalendarDaysIcon className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500">Total Requests</p>
            </div>
          </div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100">
              <ClockIcon className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
          </div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100">
              <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{stats.approved}</p>
              <p className="text-xs text-gray-500">Approved</p>
            </div>
          </div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100">
              <XCircleIcon className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              <p className="text-xs text-gray-500">Rejected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
            {tab.id === 'pending' && stats.pending > 0 && (
              <span className="ml-2 px-1.5 py-0.5 bg-white/20 rounded text-xs">
                {stats.pending}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <div className="mb-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by employee name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedLeaveType}
            onChange={(e) => setSelectedLeaveType(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Leave Types</option>
            {leaveTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Leave Requests List */}
        <div className="space-y-4">
          {filteredLeaves.length === 0 ? (
            <div className="text-center py-12">
              <CalendarDaysIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No leave requests found</p>
            </div>
          ) : (
            filteredLeaves.map((leave) => (
              <div
                key={leave.id}
                className="p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Employee Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                      {leave.employee?.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{leave.employee?.name}</h4>
                      <p className="text-sm text-gray-500">
                        {leave.employee?.code} • {leave.employee?.department}
                      </p>
                    </div>
                  </div>

                  {/* Leave Details */}
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="text-sm">{getLeaveTypeBadge(leave.type)}</div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">
                        {leave.startDate ? format(parseISO(leave.startDate), 'MMM d') : 'N/A'}
                      </span>
                      <span className="mx-1">→</span>
                      <span className="font-medium">
                        {leave.endDate ? format(parseISO(leave.endDate), 'MMM d, yyyy') : 'N/A'}
                      </span>
                      <span className="text-gray-400 ml-2">
                        ({leave.days} day{leave.days > 1 ? 's' : ''})
                      </span>
                    </div>
                    {getStatusBadge(leave.status)}
                  </div>

                  {/* Actions */}
                  {leave.status === 'Pending' && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenApproval(leave, 'approve')}
                        className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                      >
                        <CheckCircleIcon className="w-4 h-4" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenApproval(leave, 'reject')}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <XCircleIcon className="w-4 h-4" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>

                {/* Reason */}
                {leave.reason && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-700">Reason: </span>
                      {leave.reason}
                    </p>
                  </div>
                )}

                {/* Review Info */}
                {leave.reviewedBy && (
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                    <UserIcon className="w-4 h-4" />
                    <span>
                      {leave.status} by {leave.reviewedBy}
                      {leave.reviewedOn &&
                        ` on ${format(parseISO(leave.reviewedOn), 'MMM d, yyyy')}`}
                    </span>
                    {leave.comments && (
                      <>
                        <ChatBubbleLeftRightIcon className="w-4 h-4 ml-2" />
                        <span>"{leave.comments}"</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Approval Modal */}
      <Modal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        title={`${approvalAction === 'approve' ? 'Approve' : 'Reject'} Leave Request`}
      >
        {selectedLeave && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                  {selectedLeave.employee?.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{selectedLeave.employee?.name}</p>
                  <p className="text-sm text-gray-500">{selectedLeave.employee?.department}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Type:</span>
                  <span className="ml-2 font-medium">{selectedLeave.type}</span>
                </div>
                <div>
                  <span className="text-gray-500">Duration:</span>
                  <span className="ml-2 font-medium">{selectedLeave.days} day(s)</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Period:</span>
                  <span className="ml-2 font-medium">
                    {selectedLeave.startDate
                      ? format(parseISO(selectedLeave.startDate), 'MMM d')
                      : 'N/A'}{' '}
                    -{' '}
                    {selectedLeave.endDate
                      ? format(parseISO(selectedLeave.endDate), 'MMM d, yyyy')
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment (Optional)
              </label>
              <textarea
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
                placeholder={
                  approvalAction === 'approve' ? 'Add any notes...' : 'Reason for rejection...'
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowApprovalModal(false)}>
                Cancel
              </Button>
              <Button
                variant={approvalAction === 'approve' ? 'primary' : 'danger'}
                onClick={handleApprovalSubmit}
              >
                {approvalAction === 'approve' ? 'Approve Request' : 'Reject Request'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
