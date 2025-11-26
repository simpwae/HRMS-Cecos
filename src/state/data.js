import { create } from 'zustand';
import { format } from 'date-fns';

const today = new Date();

export const useDataStore = create((set) => ({
  employees: [
    {
      id: 'e1',
      code: 'EMP001',
      name: 'Alice Smith',
      department: 'IT',
      designation: 'Developer',
      joinDate: '2024-06-01',
      status: 'Active',
      salaryBase: 5000,
    },
    {
      id: 'e2',
      code: 'EMP002',
      name: 'Bob Ahmed',
      department: 'HR',
      designation: 'HR Assistant',
      joinDate: '2024-07-15',
      status: 'Active',
      salaryBase: 4200,
    },
  ],
  attendance: [
    {
      id: 'a1',
      employeeId: 'e1',
      date: format(today, 'yyyy-MM-dd'),
      clockIn: '09:03',
      clockOut: '17:02',
      status: 'Late',
    },
    {
      id: 'a2',
      employeeId: 'e2',
      date: format(today, 'yyyy-MM-dd'),
      clockIn: '08:55',
      clockOut: '16:55',
      status: 'Present',
    },
  ],
  leaves: [
    {
      id: 'l1',
      employeeId: 'e1',
      type: 'Annual',
      startDate: '2025-12-10',
      endDate: '2025-12-12',
      days: 3,
      reason: 'Vacation',
      status: 'Pending',
    },
  ],
  addEmployee: (emp) => set((s) => ({ employees: [...s.employees, emp] })),
  addLeave: (leave) => set((s) => ({ leaves: [...s.leaves, leave] })),
  updateLeaveStatus: (id, status) =>
    set((s) => ({ leaves: s.leaves.map((l) => (l.id === id ? { ...l, status } : l)) })),
}));
