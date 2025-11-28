import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { format, differenceInDays, parseISO, addDays } from 'date-fns';
import { useDataStore, leaveTypes } from '../../../state/data';
import { useAuthStore } from '../../../state/auth';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import Badge from '../../../components/Badge';
import Modal from '../../../components/Modal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/Tabs';
import {
  DocumentTextIcon,
  PlusIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

export default function Leave() {
  const user = useAuthStore((s) => s.user);
  const { employees, leaves, addLeave } = useDataStore();

  const employee = useMemo(
    () => employees.find((e) => e.id === user?.id || e.email === user?.email),
    [employees, user],
  );
  const employeeId = employee?.id || user?.id;

  const [showModal, setShowModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      type: 'annual',
      startDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      endDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      reason: '',
    },
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const selectedType = watch('type');

  // Calculate days
  const calculatedDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const days = differenceInDays(parseISO(endDate), parseISO(startDate)) + 1;
    return days > 0 ? days : 0;
  }, [startDate, endDate]);

  // Leave balance
  const leaveBalance = employee?.leaveBalance || { annual: 0, sick: 0, casual: 0 };

  // Check if enough balance
  const hasEnoughBalance = useMemo(() => {
    const balance = leaveBalance[selectedType] || 0;
    return calculatedDays <= balance;
  }, [leaveBalance, selectedType, calculatedDays]);

  // My leaves
  const myLeaves = useMemo(
    () =>
      leaves
        .filter((l) => l.employeeId === employeeId)
        .sort((a, b) => parseISO(b.appliedOn) - parseISO(a.appliedOn)),
    [leaves, employeeId],
  );

  const pendingLeaves = myLeaves.filter((l) => l.status === 'Pending');
  const approvedLeaves = myLeaves.filter((l) => l.status === 'Approved');
  const rejectedLeaves = myLeaves.filter((l) => l.status === 'Rejected');

  const onSubmit = (data) => {
    const leaveType = leaveTypes.find((lt) => lt.id === data.type);

    const newLeave = {
      id: `l-${Date.now()}`,
      employeeId: employeeId,
      employeeName: employee?.name || user?.name,
      department: employee?.department || user?.department,
      faculty: employee?.faculty || user?.faculty,
      type: data.type,
      startDate: data.startDate,
      endDate: data.endDate,
      days: calculatedDays,
      reason: data.reason,
      status: 'Pending',
      appliedOn: format(new Date(), 'yyyy-MM-dd'),
      approvalChain: [
        { role: 'hod', status: 'pending', by: null, date: null },
        { role: 'dean', status: 'pending', by: null, date: null },
        { role: 'hr', status: 'pending', by: null, date: null },
      ],
    };

    addLeave(newLeave);
    reset();
    setShowModal(false);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-gray-600">Apply for leave and track your requests</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-2">
          <PlusIcon className="w-5 h-5" />
          Apply for Leave
        </Button>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(leaveBalance).map(([type, days]) => {
          const leaveType = leaveTypes.find((lt) => lt.id === type);
          const maxDays = leaveType?.defaultDays || 20;
          const usedDays = maxDays - days;

          return (
            <Card key={type} className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8">
                <div
                  className={`w-full h-full rounded-full opacity-10 ${
                    type === 'annual'
                      ? 'bg-blue-500'
                      : type === 'sick'
                        ? 'bg-red-500'
                        : 'bg-green-500'
                  }`}
                />
              </div>
              <div className="relative">
                <p className="text-sm font-medium text-gray-500 capitalize">{type} Leave</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{days}</p>
                <p className="text-xs text-gray-500 mt-1">of {maxDays} days remaining</p>
                <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      days > maxDays * 0.5
                        ? 'bg-green-500'
                        : days > maxDays * 0.2
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                    }`}
                    style={{ width: `${(days / maxDays) * 100}%` }}
                  />
                </div>
              </div>
            </Card>
          );
        })}
        <Card className="bg-gray-50 border-dashed border-2">
          <div className="flex flex-col items-center justify-center h-full text-center py-2">
            <DocumentTextIcon className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-600">Total Requests</p>
            <p className="text-2xl font-bold text-gray-900">{myLeaves.length}</p>
          </div>
        </Card>
      </div>

      {/* Leave Requests */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Requests ({myLeaves.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingLeaves.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedLeaves.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedLeaves.length})</TabsTrigger>
        </TabsList>

        {['all', 'pending', 'approved', 'rejected'].map((tab) => {
          const filteredLeaves =
            tab === 'all'
              ? myLeaves
              : tab === 'pending'
                ? pendingLeaves
                : tab === 'approved'
                  ? approvedLeaves
                  : rejectedLeaves;

          return (
            <TabsContent key={tab} value={tab}>
              <Card>
                {filteredLeaves.length === 0 ? (
                  <div className="text-center py-12">
                    <DocumentTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No {tab === 'all' ? '' : tab} leave requests</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredLeaves.map((leave) => (
                      <div
                        key={leave.id}
                        className="border rounded-xl p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setSelectedLeave(leave)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-gray-900">
                                {getLeaveTypeName(leave.type)}
                              </h4>
                              <Badge variant={getBadgeVariant(leave.status)}>{leave.status}</Badge>
                            </div>
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
                            <p className="text-sm text-gray-500 mt-2 line-clamp-1">
                              {leave.reason}
                            </p>
                          </div>
                          <div className="text-sm text-gray-500">
                            Applied {format(parseISO(leave.appliedOn), 'MMM d, yyyy')}
                          </div>
                        </div>

                        {/* Approval Chain */}
                        {leave.approvalChain && (
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-xs font-medium text-gray-500 uppercase mb-2">
                              Approval Status
                            </p>
                            <div className="flex items-center gap-2">
                              {leave.approvalChain.map((step, idx) => (
                                <div key={idx} className="flex items-center">
                                  <div
                                    className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                                      step.status === 'approved'
                                        ? 'bg-green-100 text-green-800'
                                        : step.status === 'rejected'
                                          ? 'bg-red-100 text-red-800'
                                          : 'bg-gray-100 text-gray-600'
                                    }`}
                                  >
                                    {step.status === 'approved' ? (
                                      <CheckCircleIcon className="w-3.5 h-3.5" />
                                    ) : step.status === 'rejected' ? (
                                      <XCircleIcon className="w-3.5 h-3.5" />
                                    ) : (
                                      <ClockIcon className="w-3.5 h-3.5" />
                                    )}
                                    <span className="uppercase">{step.role}</span>
                                  </div>
                                  {idx < leave.approvalChain.length - 1 && (
                                    <div className="w-4 h-0.5 bg-gray-200 mx-1" />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Apply for Leave"
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Leave Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Leave Type <span className="text-red-500">*</span>
            </label>
            <select
              {...register('type', { required: 'Please select a leave type' })}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {leaveTypes.map((lt) => (
                <option key={lt.id} value={lt.id}>
                  {lt.name} ({leaveBalance[lt.id] || 0} days available)
                </option>
              ))}
            </select>
            {errors.type && <p className="text-sm text-red-600 mt-1">{errors.type.message}</p>}
          </div>

          {/* Date Range */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register('startDate', { required: 'Start date is required' })}
                min={format(new Date(), 'yyyy-MM-dd')}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.startDate && (
                <p className="text-sm text-red-600 mt-1">{errors.startDate.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register('endDate', { required: 'End date is required' })}
                min={startDate || format(new Date(), 'yyyy-MM-dd')}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.endDate && (
                <p className="text-sm text-red-600 mt-1">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          {/* Duration Display */}
          {calculatedDays > 0 && (
            <div className={`p-3 rounded-lg ${hasEnoughBalance ? 'bg-blue-50' : 'bg-red-50'}`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${hasEnoughBalance ? 'text-blue-700' : 'text-red-700'}`}>
                  Total Duration
                </span>
                <span
                  className={`font-semibold ${hasEnoughBalance ? 'text-blue-900' : 'text-red-900'}`}
                >
                  {calculatedDays} day{calculatedDays > 1 ? 's' : ''}
                </span>
              </div>
              {!hasEnoughBalance && (
                <div className="flex items-center gap-1 mt-2 text-sm text-red-600">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  Insufficient leave balance
                </div>
              )}
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('reason', {
                required: 'Please provide a reason',
                minLength: { value: 10, message: 'Reason must be at least 10 characters' },
              })}
              rows={3}
              placeholder="Please provide a reason for your leave request..."
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.reason && <p className="text-sm text-red-600 mt-1">{errors.reason.message}</p>}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!hasEnoughBalance || isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Leave Detail Modal */}
      <Modal
        isOpen={!!selectedLeave}
        onClose={() => setSelectedLeave(null)}
        title="Leave Request Details"
      >
        {selectedLeave && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant={getBadgeVariant(selectedLeave.status)} size="lg">
                {selectedLeave.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
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

            {selectedLeave.approvalChain && (
              <div>
                <p className="text-xs text-gray-500 uppercase mb-2">Approval Chain</p>
                <div className="space-y-2">
                  {selectedLeave.approvalChain.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        {step.status === 'approved' ? (
                          <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        ) : step.status === 'rejected' ? (
                          <XCircleIcon className="w-5 h-5 text-red-500" />
                        ) : (
                          <ClockIcon className="w-5 h-5 text-gray-400" />
                        )}
                        <span className="font-medium uppercase">{step.role}</span>
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

            <div className="flex justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setSelectedLeave(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
