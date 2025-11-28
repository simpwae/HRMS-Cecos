import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format, subDays, addDays } from 'date-fns';

const today = new Date();

// Helper to generate IDs
const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Faculties and Departments structure
export const faculties = {
  Computing: ['CS', 'IT', 'SE', 'AI'],
  Engineering: ['EE', 'ME', 'CE', 'CH'],
  Management: ['BBA', 'MBA', 'HRM', 'Finance'],
  Sciences: ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
};

export const departments = Object.values(faculties).flat();

export const designations = [
  'Professor',
  'Associate Professor',
  'Assistant Professor',
  'Senior Lecturer',
  'Lecturer',
  'Lab Engineer',
  'Research Assistant',
  'Administrative Officer',
  'HR Manager',
  'Registrar',
  'Dean',
  'HOD',
];

export const leaveTypes = [
  { id: 'annual', name: 'Annual Leave', defaultDays: 20 },
  { id: 'sick', name: 'Sick Leave', defaultDays: 12 },
  { id: 'casual', name: 'Casual Leave', defaultDays: 10 },
  { id: 'maternity', name: 'Maternity Leave', defaultDays: 90 },
  { id: 'paternity', name: 'Paternity Leave', defaultDays: 7 },
  { id: 'study', name: 'Study Leave', defaultDays: 30 },
  { id: 'unpaid', name: 'Unpaid Leave', defaultDays: 0 },
];

// Initial mock data
const initialEmployees = [
  {
    id: 'e1',
    code: 'EMP001',
    name: 'Alice Smith',
    email: 'alice@cecos.edu.pk',
    phone: '+92-321-1234567',
    department: 'CS',
    faculty: 'Computing',
    designation: 'Senior Lecturer',
    joinDate: '2022-06-01',
    status: 'Active',
    salaryBase: 120000,
    bankAccount: 'HBL-123456789',
    cnic: '17301-1234567-1',
    address: '123 University Road, Peshawar',
    emergencyContact: '+92-321-9876543',
    leaveBalance: { annual: 18, sick: 10, casual: 8 },
  },
  {
    id: 'e2',
    code: 'EMP002',
    name: 'Bob Ahmed',
    email: 'bob@cecos.edu.pk',
    phone: '+92-333-2345678',
    department: 'HRM',
    faculty: 'Management',
    designation: 'HR Manager',
    joinDate: '2021-07-15',
    status: 'Active',
    salaryBase: 150000,
    bankAccount: 'MCB-987654321',
    cnic: '17301-2345678-2',
    address: '456 Hayatabad, Peshawar',
    emergencyContact: '+92-333-8765432',
    leaveBalance: { annual: 20, sick: 12, casual: 10 },
  },
  {
    id: 'e3',
    code: 'EMP003',
    name: 'Dr. Charlie Brown',
    email: 'charlie@cecos.edu.pk',
    phone: '+92-345-3456789',
    department: 'AI',
    faculty: 'Computing',
    designation: 'Associate Professor',
    joinDate: '2020-08-01',
    status: 'Active',
    salaryBase: 200000,
    bankAccount: 'UBL-456789123',
    cnic: '17301-3456789-3',
    address: '789 DHA, Peshawar',
    emergencyContact: '+92-345-7654321',
    leaveBalance: { annual: 15, sick: 8, casual: 6 },
  },
  {
    id: 'e4',
    code: 'EMP004',
    name: 'Dr. Diana Prince',
    email: 'diana@cecos.edu.pk',
    phone: '+92-311-4567890',
    department: 'BBA',
    faculty: 'Management',
    designation: 'Professor',
    joinDate: '2019-01-10',
    status: 'On Leave',
    salaryBase: 250000,
    bankAccount: 'ABL-789123456',
    cnic: '17301-4567890-4',
    address: '101 Saddar, Peshawar',
    emergencyContact: '+92-311-6543210',
    leaveBalance: { annual: 5, sick: 12, casual: 4 },
  },
  {
    id: 'e5',
    code: 'EMP005',
    name: 'Eng. Faraz Khan',
    email: 'faraz@cecos.edu.pk',
    phone: '+92-300-5678901',
    department: 'EE',
    faculty: 'Engineering',
    designation: 'Lab Engineer',
    joinDate: '2023-03-15',
    status: 'Active',
    salaryBase: 80000,
    bankAccount: 'HBL-321654987',
    cnic: '17301-5678901-5',
    address: '202 University Town, Peshawar',
    emergencyContact: '+92-300-1098765',
    leaveBalance: { annual: 20, sick: 12, casual: 10 },
  },
  {
    id: 'e6',
    code: 'EMP006',
    name: 'Sana Malik',
    email: 'sana@cecos.edu.pk',
    phone: '+92-322-6789012',
    department: 'Physics',
    faculty: 'Sciences',
    designation: 'Lecturer',
    joinDate: '2024-01-20',
    status: 'Active',
    salaryBase: 90000,
    bankAccount: 'MCB-654987321',
    cnic: '17301-6789012-6',
    address: '303 Cantt, Peshawar',
    emergencyContact: '+92-322-2109876',
    leaveBalance: { annual: 20, sick: 12, casual: 10 },
  },
];

// Generate attendance for past 30 days
const generateAttendance = () => {
  const records = [];
  const statuses = ['Present', 'Present', 'Present', 'Late', 'Absent'];

  initialEmployees.forEach((emp) => {
    for (let i = 0; i < 30; i++) {
      const date = format(subDays(today, i), 'yyyy-MM-dd');
      const dayOfWeek = subDays(today, i).getDay();

      // Skip weekends
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;

      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const clockIn =
        status === 'Absent'
          ? null
          : status === 'Late'
            ? `09:${15 + Math.floor(Math.random() * 30)}`
            : `08:${45 + Math.floor(Math.random() * 15)}`;
      const clockOut = status === 'Absent' ? null : `17:${Math.floor(Math.random() * 30)}`;

      records.push({
        id: generateId('att'),
        employeeId: emp.id,
        date,
        clockIn,
        clockOut,
        status,
        workHours: clockIn && clockOut ? 8 + Math.random() : 0,
      });
    }
  });

  return records;
};

const initialLeaves = [
  {
    id: 'l1',
    employeeId: 'e1',
    employeeName: 'Alice Smith',
    department: 'CS',
    faculty: 'Computing',
    type: 'annual',
    startDate: format(addDays(today, 5), 'yyyy-MM-dd'),
    endDate: format(addDays(today, 7), 'yyyy-MM-dd'),
    days: 3,
    reason: 'Family vacation',
    status: 'Pending',
    appliedOn: format(subDays(today, 2), 'yyyy-MM-dd'),
    approvalChain: [
      { role: 'hod', status: 'pending', by: null, date: null },
      { role: 'dean', status: 'pending', by: null, date: null },
      { role: 'hr', status: 'pending', by: null, date: null },
    ],
  },
  {
    id: 'l2',
    employeeId: 'e4',
    employeeName: 'Dr. Diana Prince',
    department: 'BBA',
    faculty: 'Management',
    type: 'sick',
    startDate: format(subDays(today, 10), 'yyyy-MM-dd'),
    endDate: format(subDays(today, 5), 'yyyy-MM-dd'),
    days: 5,
    reason: 'Medical procedure',
    status: 'Approved',
    appliedOn: format(subDays(today, 15), 'yyyy-MM-dd'),
    approvalChain: [
      {
        role: 'hod',
        status: 'approved',
        by: 'Dr. HOD',
        date: format(subDays(today, 14), 'yyyy-MM-dd'),
      },
      {
        role: 'dean',
        status: 'approved',
        by: 'Dean',
        date: format(subDays(today, 13), 'yyyy-MM-dd'),
      },
      {
        role: 'hr',
        status: 'approved',
        by: 'HR Manager',
        date: format(subDays(today, 12), 'yyyy-MM-dd'),
      },
    ],
  },
  {
    id: 'l3',
    employeeId: 'e3',
    employeeName: 'Dr. Charlie Brown',
    department: 'AI',
    faculty: 'Computing',
    type: 'study',
    startDate: format(addDays(today, 15), 'yyyy-MM-dd'),
    endDate: format(addDays(today, 25), 'yyyy-MM-dd'),
    days: 10,
    reason: 'International conference presentation',
    status: 'Forwarded',
    appliedOn: format(subDays(today, 5), 'yyyy-MM-dd'),
    approvalChain: [
      {
        role: 'hod',
        status: 'approved',
        by: 'Dr. HOD',
        date: format(subDays(today, 4), 'yyyy-MM-dd'),
      },
      { role: 'dean', status: 'pending', by: null, date: null },
      { role: 'hr', status: 'pending', by: null, date: null },
    ],
  },
];

const initialNotifications = [
  {
    id: 'n1',
    userId: 'all',
    title: 'System Maintenance',
    message: 'HRMS will be under maintenance on Saturday 10 PM - 2 AM',
    type: 'info',
    read: false,
    createdAt: format(subDays(today, 1), 'yyyy-MM-dd HH:mm'),
  },
  {
    id: 'n2',
    userId: 'e1',
    title: 'Leave Request Update',
    message: 'Your leave request has been forwarded to Dean',
    type: 'success',
    read: false,
    createdAt: format(today, 'yyyy-MM-dd HH:mm'),
  },
];

export const useDataStore = create(
  persist(
    (set, get) => ({
      employees: initialEmployees,
      attendance: generateAttendance(),
      leaves: initialLeaves,
      notifications: initialNotifications,

      // Employee actions
      addEmployee: (emp) =>
        set((s) => ({
          employees: [
            ...s.employees,
            {
              ...emp,
              id: generateId('e'),
              code: `EMP${String(s.employees.length + 1).padStart(3, '0')}`,
              leaveBalance: { annual: 20, sick: 12, casual: 10 },
            },
          ],
        })),

      updateEmployee: (id, updates) =>
        set((s) => ({
          employees: s.employees.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        })),

      deleteEmployee: (id) =>
        set((s) => ({
          employees: s.employees.filter((e) => e.id !== id),
        })),

      getEmployee: (id) => get().employees.find((e) => e.id === id),

      getEmployeesByDepartment: (dept) => get().employees.filter((e) => e.department === dept),

      getEmployeesByFaculty: (faculty) => get().employees.filter((e) => e.faculty === faculty),

      // Attendance actions
      clockIn: (employeeId) => {
        const now = new Date();
        const dateStr = format(now, 'yyyy-MM-dd');
        const timeStr = format(now, 'HH:mm');
        const isLate = now.getHours() >= 9 || (now.getHours() === 9 && now.getMinutes() > 0);

        set((s) => ({
          attendance: [
            ...s.attendance,
            {
              id: generateId('att'),
              employeeId,
              date: dateStr,
              clockIn: timeStr,
              clockOut: null,
              status: isLate ? 'Late' : 'Present',
              workHours: 0,
            },
          ],
        }));
      },

      clockOut: (employeeId) => {
        const now = new Date();
        const dateStr = format(now, 'yyyy-MM-dd');
        const timeStr = format(now, 'HH:mm');

        set((s) => ({
          attendance: s.attendance.map((a) =>
            a.employeeId === employeeId && a.date === dateStr
              ? { ...a, clockOut: timeStr, workHours: 8 }
              : a,
          ),
        }));
      },

      getTodayAttendance: (employeeId) => {
        const dateStr = format(today, 'yyyy-MM-dd');
        return get().attendance.find((a) => a.employeeId === employeeId && a.date === dateStr);
      },

      getAttendanceByEmployee: (employeeId) =>
        get().attendance.filter((a) => a.employeeId === employeeId),

      getAttendanceByDate: (date) => get().attendance.filter((a) => a.date === date),

      // Leave actions
      addLeave: (leave) => {
        const employee = get().getEmployee(leave.employeeId);
        set((s) => ({
          leaves: [
            ...s.leaves,
            {
              ...leave,
              id: generateId('l'),
              employeeName: employee?.name,
              department: employee?.department,
              faculty: employee?.faculty,
              status: 'Pending',
              appliedOn: format(today, 'yyyy-MM-dd'),
              approvalChain: [
                { role: 'hod', status: 'pending', by: null, date: null },
                { role: 'dean', status: 'pending', by: null, date: null },
                { role: 'hr', status: 'pending', by: null, date: null },
              ],
            },
          ],
        }));
      },

      updateLeaveStatus: (id, status, approverRole, approverName) => {
        set((s) => ({
          leaves: s.leaves.map((l) => {
            if (l.id !== id) return l;

            const newApprovalChain = l.approvalChain.map((step) => {
              if (step.role === approverRole) {
                return {
                  ...step,
                  status:
                    status === 'Approved'
                      ? 'approved'
                      : status === 'Rejected'
                        ? 'rejected'
                        : 'pending',
                  by: approverName,
                  date: format(today, 'yyyy-MM-dd'),
                };
              }
              return step;
            });

            // Determine overall status
            let newStatus = status;
            if (status === 'Approved') {
              const nextPending = newApprovalChain.find((s) => s.status === 'pending');
              newStatus = nextPending ? 'Forwarded' : 'Approved';
            }

            return {
              ...l,
              status: newStatus,
              approvalChain: newApprovalChain,
            };
          }),
        }));

        // Deduct leave balance if approved
        if (status === 'Approved') {
          const leave = get().leaves.find((l) => l.id === id);
          if (leave) {
            set((s) => ({
              employees: s.employees.map((e) => {
                if (e.id !== leave.employeeId) return e;
                return {
                  ...e,
                  leaveBalance: {
                    ...e.leaveBalance,
                    [leave.type]: Math.max(0, (e.leaveBalance[leave.type] || 0) - leave.days),
                  },
                };
              }),
            }));
          }
        }
      },

      getLeavesByEmployee: (employeeId) => get().leaves.filter((l) => l.employeeId === employeeId),

      getLeavesByDepartment: (dept) => get().leaves.filter((l) => l.department === dept),

      getLeavesByFaculty: (faculty) => get().leaves.filter((l) => l.faculty === faculty),

      getPendingLeaves: () =>
        get().leaves.filter((l) => l.status === 'Pending' || l.status === 'Forwarded'),

      // Notification actions
      addNotification: (notification) =>
        set((s) => ({
          notifications: [
            {
              ...notification,
              id: generateId('n'),
              read: false,
              createdAt: format(today, 'yyyy-MM-dd HH:mm'),
            },
            ...s.notifications,
          ],
        })),

      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),

      getNotifications: (userId) =>
        get().notifications.filter((n) => n.userId === userId || n.userId === 'all'),

      getUnreadCount: (userId) =>
        get().notifications.filter((n) => !n.read && (n.userId === userId || n.userId === 'all'))
          .length,

      // Stats and analytics
      getStats: () => {
        const state = get();
        const todayStr = format(today, 'yyyy-MM-dd');
        const todayAttendance = state.attendance.filter((a) => a.date === todayStr);

        return {
          totalEmployees: state.employees.length,
          activeEmployees: state.employees.filter((e) => e.status === 'Active').length,
          presentToday: todayAttendance.filter((a) => a.status === 'Present').length,
          lateToday: todayAttendance.filter((a) => a.status === 'Late').length,
          absentToday: state.employees.length - todayAttendance.length,
          pendingLeaves: state.leaves.filter((l) => l.status === 'Pending').length,
          onLeave: state.employees.filter((e) => e.status === 'On Leave').length,
          totalPayroll: state.employees.reduce((sum, e) => sum + e.salaryBase, 0),
        };
      },

      // Reset to initial data (for demo)
      resetData: () =>
        set({
          employees: initialEmployees,
          attendance: generateAttendance(),
          leaves: initialLeaves,
          notifications: initialNotifications,
        }),
    }),
    {
      name: 'hrms-data',
      partialize: (state) => ({
        employees: state.employees,
        attendance: state.attendance,
        leaves: state.leaves,
        notifications: state.notifications,
      }),
    },
  ),
);
