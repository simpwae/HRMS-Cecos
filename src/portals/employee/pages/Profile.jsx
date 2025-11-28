import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { format, parseISO } from 'date-fns';
import { useDataStore } from '../../../state/data';
import { useAuthStore } from '../../../state/auth';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import Badge from '../../../components/Badge';
import Modal from '../../../components/Modal';
import Avatar from '../../../components/Avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/Tabs';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingOffice2Icon,
  AcademicCapIcon,
  CalendarDaysIcon,
  IdentificationIcon,
  BanknotesIcon,
  PencilSquareIcon,
  ShieldCheckIcon,
  KeyIcon,
  BellIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const { employees, updateEmployee } = useDataStore();

  const employee = useMemo(
    () => employees.find((e) => e.id === user?.id || e.email === user?.email),
    [employees, user],
  );

  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: employee?.phone || '',
      address: employee?.address || '',
      emergencyContact: employee?.emergencyContact || '',
    },
  });

  const onSubmit = (data) => {
    if (employee) {
      updateEmployee(employee.id, data);
    }
    setShowEditModal(false);
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(amount || 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600">View and manage your personal information</p>
      </div>

      {/* Profile Header Card */}
      <Card className="relative overflow-hidden">
        {/* Cover Pattern */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-r from-blue-600 to-blue-800" />

        <div className="relative pt-16 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            {/* Avatar */}
            <div className="relative">
              <Avatar
                name={employee?.name || user?.name}
                size="2xl"
                className="ring-4 ring-white"
              />
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full" />
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{employee?.name || user?.name}</h2>
              <p className="text-gray-600">{employee?.designation || 'Employee'}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="primary">{employee?.department || user?.department}</Badge>
                <Badge variant="outline">{employee?.faculty || user?.faculty}</Badge>
                <Badge variant={employee?.status === 'Active' ? 'success' : 'warning'}>
                  {employee?.status || 'Active'}
                </Badge>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowEditModal(true)} className="gap-2">
                <PencilSquareIcon className="w-4 h-4" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="personal">
        <TabsList>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="employment">Employment</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <UserCircleIcon className="w-5 h-5 text-gray-400" />
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <EnvelopeIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Email Address</p>
                    <p className="font-medium text-gray-900">{employee?.email || user?.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <PhoneIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Phone Number</p>
                    <p className="font-medium text-gray-900">{employee?.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Address</p>
                    <p className="font-medium text-gray-900">
                      {employee?.address || 'Not provided'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <PhoneIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Emergency Contact</p>
                    <p className="font-medium text-gray-900">
                      {employee?.emergencyContact || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Identification */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <IdentificationIcon className="w-5 h-5 text-gray-400" />
                Identification
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <IdentificationIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Employee Code</p>
                    <p className="font-medium text-gray-900">{employee?.code || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <IdentificationIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">CNIC</p>
                    <p className="font-medium text-gray-900">{employee?.cnic || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BanknotesIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Bank Account</p>
                    <p className="font-medium text-gray-900">
                      {employee?.bankAccount || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="employment">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Job Details */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BuildingOffice2Icon className="w-5 h-5 text-gray-400" />
                Job Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <AcademicCapIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Designation</p>
                    <p className="font-medium text-gray-900">{employee?.designation || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BuildingOffice2Icon className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Department</p>
                    <p className="font-medium text-gray-900">
                      {employee?.department || user?.department}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AcademicCapIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Faculty</p>
                    <p className="font-medium text-gray-900">
                      {employee?.faculty || user?.faculty}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CalendarDaysIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Join Date</p>
                    <p className="font-medium text-gray-900">
                      {employee?.joinDate
                        ? format(parseISO(employee.joinDate), 'MMMM d, yyyy')
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Compensation */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BanknotesIcon className="w-5 h-5 text-gray-400" />
                Compensation
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <BanknotesIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Basic Salary</p>
                    <p className="font-medium text-gray-900">
                      {formatCurrency(employee?.salaryBase)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BanknotesIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">House Rent Allowance</p>
                    <p className="font-medium text-gray-900">
                      {formatCurrency((employee?.salaryBase || 0) * 0.45)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BanknotesIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Medical Allowance</p>
                    <p className="font-medium text-gray-900">
                      {formatCurrency((employee?.salaryBase || 0) * 0.1)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Leave Balance */}
            <Card className="md:col-span-2">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CalendarDaysIcon className="w-5 h-5 text-gray-400" />
                Leave Balances
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {Object.entries(employee?.leaveBalance || {}).map(([type, days]) => (
                  <div key={type} className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 capitalize">{type} Leave</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{days}</p>
                    <p className="text-xs text-gray-500">days remaining</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DocumentTextIcon className="w-5 h-5 text-gray-400" />
              My Documents
            </h3>
            <div className="text-center py-12">
              <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No documents uploaded yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Your appointment letter, contracts, and certificates will appear here
              </p>
              <Button variant="outline" className="mt-4">
                Request Documents from HR
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <KeyIcon className="w-5 h-5 text-gray-400" />
                Password & Security
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Password</p>
                    <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowPasswordModal(true)}>
                    Change
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">Not enabled</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BellIcon className="w-5 h-5 text-gray-400" />
                Notification Preferences
              </h3>
              <div className="space-y-4">
                {[
                  {
                    label: 'Email notifications',
                    description: 'Receive updates via email',
                    enabled: true,
                  },
                  {
                    label: 'Leave updates',
                    description: 'Get notified about leave approvals',
                    enabled: true,
                  },
                  {
                    label: 'Salary notifications',
                    description: 'Get payslip notifications',
                    enabled: true,
                  },
                  {
                    label: 'Announcements',
                    description: 'University announcements',
                    enabled: false,
                  },
                ].map((pref, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{pref.label}</p>
                      <p className="text-xs text-gray-500">{pref.description}</p>
                    </div>
                    <div
                      className={`w-10 h-6 rounded-full relative transition-colors ${pref.enabled ? 'bg-blue-600' : 'bg-gray-300'}`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${pref.enabled ? 'right-1' : 'left-1'}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="md:col-span-2">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5 text-gray-400" />
                Active Sessions
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <ShieldCheckIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Current Session</p>
                      <p className="text-sm text-gray-500">Windows • Chrome • Peshawar, Pakistan</p>
                    </div>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Profile Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Profile">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              {...register('phone')}
              placeholder="+92-XXX-XXXXXXX"
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              {...register('address')}
              rows={2}
              placeholder="Enter your address"
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emergency Contact
            </label>
            <input
              type="tel"
              {...register('emergencyContact')}
              placeholder="+92-XXX-XXXXXXX"
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              placeholder="Enter current password"
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="Confirm new password"
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setShowPasswordModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Password</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
