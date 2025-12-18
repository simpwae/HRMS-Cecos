import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format, subDays, addDays, differenceInDays, parseISO } from 'date-fns';

const today = new Date();

// Helper to generate IDs
const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// ============ MATERNITY LEAVE VALIDATION FUNCTIONS ============

/**
 * Calculate probation end date given join date
 * @param {string} joinDate - Join date in 'yyyy-MM-dd' format
 * @param {number} probationMonths - Duration of probation in months (default: 6)
 * @returns {string} Probation end date in 'yyyy-MM-dd' format
 */
export const calculateProbationEndDate = (joinDate, probationMonths = 6) => {
  const joinDateObj = parseISO(joinDate);
  const endDate = addDays(joinDateObj, probationMonths * 30);
  return format(endDate, 'yyyy-MM-dd');
};

/**
 * Validate maternity leave eligibility based on employee status
 * @param {Object} employee - Employee object with gender and employmentStatus
 * @returns {Object} { eligible: boolean, reason: string }
 */
export const validateMaternityEligibility = (employee) => {
  if (!employee) {
    return { eligible: false, reason: 'Employee not found' };
  }

  // Check 1: Gender must be female
  if (employee.gender?.toLowerCase() !== 'female') {
    return { eligible: false, reason: 'Maternity leave is only available for female employees' };
  }

  // Check 2: Employment status must be confirmed
  if (employee.employmentStatus === 'probation') {
    const probationEndDate = employee.probationEndDate;
    if (probationEndDate) {
      return {
        eligible: false,
        reason: `You are currently on probation. Maternity leave will be available after probation ends on ${format(parseISO(probationEndDate), 'MMM d, yyyy')}`,
      };
    }
    return {
      eligible: false,
      reason:
        'Maternity leave is not available during probation period. Only confirmed employees can apply.',
    };
  }

  return { eligible: true, reason: 'Employee is eligible for maternity leave' };
};

/**
 * Validate maternity leave advance notice requirement (2 months = 60 days)
 * @param {string} expectedDeliveryDate - Expected delivery date in 'yyyy-MM-dd' format
 * @param {string} applicationDate - Application date in 'yyyy-MM-dd' format (default: today)
 * @returns {Object} { valid: boolean, daysInAdvance: number, minRequired: number }
 */
export const validateAdvanceNotice = (
  expectedDeliveryDate,
  applicationDate = format(today, 'yyyy-MM-dd'),
) => {
  const MIN_DAYS_ADVANCE = 60; // 2 months

  if (!expectedDeliveryDate) {
    return {
      valid: false,
      daysInAdvance: 0,
      minRequired: MIN_DAYS_ADVANCE,
      reason: 'Expected delivery date is required for maternity leave application',
    };
  }

  const daysInAdvance = differenceInDays(parseISO(expectedDeliveryDate), parseISO(applicationDate));

  if (daysInAdvance < MIN_DAYS_ADVANCE) {
    return {
      valid: false,
      daysInAdvance,
      minRequired: MIN_DAYS_ADVANCE,
      reason: `Maternity leave requires at least ${MIN_DAYS_ADVANCE} days advance notice. You have only ${daysInAdvance} days.`,
    };
  }

  return {
    valid: true,
    daysInAdvance,
    minRequired: MIN_DAYS_ADVANCE,
    reason: `Valid application with ${daysInAdvance} days advance notice`,
  };
};

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

// Promotion hierarchy
export const promotionPath = {
  'Research Assistant': 'Lecturer',
  Lecturer: 'Senior Lecturer',
  'Senior Lecturer': 'Assistant Professor',
  'Assistant Professor': 'Associate Professor',
  'Associate Professor': 'Professor',
  'Lab Engineer': 'Senior Lab Engineer',
  'Administrative Officer': 'Senior Administrative Officer',
};

// Leave types with medical leave configuration
export const leaveTypes = [
  { id: 'annual', name: 'Annual Leave', days: 30, color: 'blue' },
  { id: 'sick', name: 'Sick Leave', days: 10, color: 'red' }, // keep, but lower
  { id: 'casual', name: 'Casual Leave', days: 10, color: 'purple' },
  {
    id: 'maternity',
    name: 'Maternity Leave',
    days: 90,
    color: 'pink',
    requiresDocuments: false,
    genderRestriction: 'female',
  },
  {
    id: 'medical',
    name: 'Medical Leave',
    days: 30, // increased allowance to prevent blocking
    color: 'teal',
    requiresDocuments: true,
    approvalFlow: ['hod', 'vc', 'president'],
  },
  { id: 'unpaid', name: 'Unpaid Leave', days: 0, color: 'gray' },
];

// Exit survey questions
export const exitSurveyQuestions = [
  {
    id: 'reason',
    question: 'Primary reason for leaving',
    type: 'select',
    options: [
      'Better Opportunity',
      'Personal Reasons',
      'Relocation',
      'Health Issues',
      'Career Change',
      'Retirement',
      'Higher Studies',
      'Other',
    ],
  },
  { id: 'satisfaction', question: 'Overall job satisfaction (1-5)', type: 'rating' },
  { id: 'management', question: 'Management satisfaction (1-5)', type: 'rating' },
  { id: 'workEnvironment', question: 'Work environment satisfaction (1-5)', type: 'rating' },
  { id: 'growth', question: 'Career growth opportunities (1-5)', type: 'rating' },
  { id: 'wouldRecommend', question: 'Would you recommend CECOS to others?', type: 'boolean' },
  { id: 'wouldReturn', question: 'Would you consider returning in the future?', type: 'boolean' },
  { id: 'feedback', question: 'Additional feedback or suggestions', type: 'textarea' },
];

// Initial mock data
const initialEmployees = [
  {
    id: 'e1',
    code: 'EMP001',
    name: 'Alice Smith',
    email: 'alice@cecos.edu.pk',
    phone: '+92-321-1234567',
    gender: 'female',
    department: 'CS',
    faculty: 'Computing',
    designation: 'Senior Lecturer',
    joinDate: '2022-06-01',
    employmentStatus: 'confirmed',
    status: 'Active',
    salaryBase: 120000,
    bankAccount: 'HBL-123456789',
    cnic: '17301-1234567-1',
    address: '123 University Road, Peshawar',
    emergencyContact: '+92-321-9876543',
    leaveBalance: { annual: 18, sick: 8, casual: 8, medical: 30 }, // added medical, aligned with allowance
    dependents: [],
    qualifications: [],
    publications: [],
  },
  {
    id: 'e2',
    code: 'EMP002',
    name: 'Bob Ahmed',
    email: 'bob@cecos.edu.pk',
    phone: '+92-333-2345678',
    gender: 'male',
    department: 'HRM',
    faculty: 'Management',
    designation: 'HR Manager',
    joinDate: '2021-07-15',
    employmentStatus: 'confirmed',
    status: 'Active',
    salaryBase: 150000,
    bankAccount: 'MCB-987654321',
    cnic: '17301-2345678-2',
    address: '456 Hayatabad, Peshawar',
    emergencyContact: '+92-333-8765432',
    leaveBalance: { annual: 20, sick: 10, casual: 10, medical: 30 },
    dependents: [],
    qualifications: [],
    publications: [],
  },
  {
    id: 'e3',
    code: 'EMP003',
    name: 'Dr. Diana Prince',
    email: 'diana@cecos.edu.pk',
    phone: '+92-300-3456789',
    gender: 'female',
    department: 'BBA',
    faculty: 'Management',
    designation: 'Associate Professor',
    joinDate: '2020-08-01',
    employmentStatus: 'confirmed',
    status: 'Active',
    salaryBase: 200000,
    bankAccount: 'UBL-456789123',
    cnic: '17301-3456789-3',
    address: '789 University Town, Peshawar',
    emergencyContact: '+92-300-9876543',
    leaveBalance: { annual: 15, sick: 8, casual: 5, medical: 30 },
    dependents: [],
    qualifications: [],
    publications: [],
  },
  {
    id: 'e4',
    code: 'EMP004',
    name: 'Prof. Rashid Ali',
    email: 'rashid@cecos.edu.pk',
    phone: '+92-311-4567890',
    gender: 'male',
    department: 'CS',
    faculty: 'Computing',
    designation: 'Professor',
    joinDate: '2019-01-10',
    employmentStatus: 'confirmed',
    status: 'Active',
    salaryBase: 250000,
    bankAccount: 'ABL-321654987',
    cnic: '17301-4567890-4',
    address: '101 Saddar, Peshawar',
    emergencyContact: '+92-311-6543210',
    leaveBalance: { annual: 5, sick: 12, casual: 4, medical: 30 },
    dependents: [],
    qualifications: [],
    publications: [],
  },
  {
    id: 'e5',
    code: 'EMP005',
    name: 'Eng. Faraz Khan',
    email: 'faraz@cecos.edu.pk',
    phone: '+92-322-5678901',
    gender: 'male',
    department: 'EE',
    faculty: 'Engineering',
    designation: 'Lab Engineer',
    joinDate: '2023-03-15',
    employmentStatus: 'probation',
    probationEndDate: '2023-09-15',
    status: 'Active',
    salaryBase: 80000,
    bankAccount: 'HBL-789456123',
    cnic: '17301-5678901-5',
    address: '202 Cantt, Peshawar',
    emergencyContact: '+92-300-1098765',
    leaveBalance: { annual: 20, sick: 12, casual: 10, medical: 30 },
    dependents: [],
    qualifications: [],
    publications: [],
  },
  {
    id: 'e6',
    code: 'EMP006',
    name: 'Sana Malik',
    email: 'sana@cecos.edu.pk',
    phone: '+92-333-6789012',
    gender: 'female',
    department: 'Physics',
    faculty: 'Sciences',
    designation: 'Lecturer',
    joinDate: '2024-01-20',
    employmentStatus: 'probation',
    probationEndDate: '2024-07-20',
    status: 'Active',
    salaryBase: 90000,
    bankAccount: 'MCB-654987321',
    cnic: '17301-6789012-6',
    address: '303 Cantt, Peshawar',
    emergencyContact: '+92-322-2109876',
    leaveBalance: { annual: 20, sick: 12, casual: 10, medical: 30 },
    dependents: [],
    qualifications: [],
    publications: [],
  },
];

// Generate attendance for past 30 days
function generateAttendance() {
  const records = [];
  const statuses = ['Present', 'Present', 'Present', 'Late', 'Absent'];

  initialEmployees.forEach((emp) => {
    for (let i = 0; i < 30; i++) {
      const date = format(subDays(today, i), 'yyyy-MM-dd');
      const dayOfWeek = subDays(today, i).getDay();

      // Skip weekends
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;

      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const clockIn = status === 'Absent' ? null : `08:${15 + Math.floor(Math.random() * 30)}`;
      const clockOut = status === 'Absent' ? null : `17:${45 + Math.floor(Math.random() * 15)}`;

      records.push({
        id: `att-${emp.id}-${date}`,
        employeeId: emp.id,
        date,
        clockIn,
        clockOut,
        status,
        workHours: status === 'Absent' ? 0 : 8 + Math.random(),
      });
    }
  });

  return records;
}

// Initial leaves data
const initialLeaves = [
  {
    id: 'l1',
    employeeId: 'e1',
    employeeName: 'Alice Smith',
    department: 'CS',
    faculty: 'Computing',
    type: 'annual',
    startDate: format(subDays(today, 5), 'yyyy-MM-dd'),
    endDate: format(subDays(today, 3), 'yyyy-MM-dd'),
    days: 3,
    reason: 'Family vacation',
    status: 'Approved',
    appliedOn: format(subDays(today, 10), 'yyyy-MM-dd'),
    reviewedBy: 'Dr. HOD',
    reviewedOn: format(subDays(today, 8), 'yyyy-MM-dd'),
    paidDays: null,
    unpaidDays: null,
    leaveCategory: null,
    approvalChain: [
      {
        role: 'hod',
        status: 'approved',
        by: 'Dr. HOD',
        date: format(subDays(today, 8), 'yyyy-MM-dd'),
        comment: null,
      },
      {
        role: 'dean',
        status: 'approved',
        by: 'Prof. Dean',
        date: format(subDays(today, 7), 'yyyy-MM-dd'),
        comment: null,
      },
      {
        role: 'hr',
        status: 'approved',
        by: 'HR Manager',
        date: format(subDays(today, 6), 'yyyy-MM-dd'),
        comment: null,
      },
    ],
  },
  {
    id: 'l2',
    employeeId: 'e3',
    employeeName: 'Dr. Diana Prince',
    department: 'BBA',
    faculty: 'Management',
    type: 'medical',
    startDate: format(subDays(today, 12), 'yyyy-MM-dd'),
    endDate: format(subDays(today, 8), 'yyyy-MM-dd'),
    days: 5,
    reason: 'Medical procedure',
    status: 'Approved',
    appliedOn: format(subDays(today, 15), 'yyyy-MM-dd'),
    reviewedBy: 'President',
    reviewedOn: format(subDays(today, 5), 'yyyy-MM-dd'),
    paidDays: 3,
    unpaidDays: 2,
    leaveCategory: 'medical',
    documents: [
      {
        id: 'doc1',
        name: 'Medical Certificate.pdf',
        file: '/mock/medical-cert.pdf',
        size: 125000,
        uploadedAt: format(subDays(today, 15), 'yyyy-MM-dd'),
      },
    ],
    approvalChain: [
      {
        role: 'hod',
        status: 'approved',
        by: 'Dr. HOD',
        date: format(subDays(today, 14), 'yyyy-MM-dd'),
        comment: 'Medical documents verified',
      },
      {
        role: 'vc',
        status: 'approved',
        by: 'Vice Chancellor',
        date: format(subDays(today, 10), 'yyyy-MM-dd'),
        comment: 'Recommended for approval',
      },
      {
        role: 'president',
        status: 'approved',
        by: 'President',
        date: format(subDays(today, 5), 'yyyy-MM-dd'),
        comment: 'Approved',
        paidDays: 3,
        unpaidDays: 2,
        leaveCategory: 'medical',
      },
    ],
  },
  {
    id: 'l3',
    employeeId: 'e4',
    employeeName: 'Prof. Rashid Ali',
    department: 'CS',
    faculty: 'Computing',
    type: 'sick',
    startDate: format(subDays(today, 4), 'yyyy-MM-dd'),
    endDate: format(subDays(today, 2), 'yyyy-MM-dd'),
    days: 3,
    reason: 'Flu',
    status: 'Pending',
    appliedOn: format(subDays(today, 5), 'yyyy-MM-dd'),
    paidDays: null,
    unpaidDays: null,
    leaveCategory: null,
    approvalChain: [
      { role: 'hod', status: 'pending', by: null, date: null, comment: null },
      { role: 'dean', status: 'pending', by: null, date: null, comment: null },
      { role: 'hr', status: 'pending', by: null, date: null, comment: null },
    ],
  },
];

// Initial notifications
const initialNotifications = [
  {
    id: 'n1',
    userId: 'all',
    title: 'System Maintenance',
    message: 'The HR system will be under maintenance on Saturday 10 PM - 2 AM',
    type: 'info',
    read: false,
    createdAt: format(subDays(today, 1), 'yyyy-MM-dd HH:mm'),
  },
  {
    id: 'n2',
    userId: 'e1',
    title: 'Leave Approved',
    message: 'Your leave request has been forwarded to Dean',
    type: 'success',
    read: false,
    createdAt: format(today, 'yyyy-MM-dd HH:mm'),
  },
];

// Initial promotions
const initialPromotions = [
  {
    id: 'pr1',
    employeeId: 'e1',
    employeeName: 'Alice Smith',
    department: 'CS',
    faculty: 'Computing',
    currentDesignation: 'Senior Lecturer',
    requestedDesignation: 'Assistant Professor',
    justification: 'Completed PhD and published 5 research papers in reputed journals',
    status: 'Pending',
    appliedOn: format(subDays(today, 10), 'yyyy-MM-dd'),
    supportingDocuments: ['PhD Certificate', 'Research Publications'],
    committeeReview: null,
    hrDecision: null,
  },
];

// Initial resignations
const initialResignations = [
  {
    id: 'res1',
    employeeId: 'e6',
    employeeName: 'Sana Malik',
    department: 'Physics',
    faculty: 'Sciences',
    designation: 'Lecturer',
    reason: 'Higher studies abroad',
    noticePeriod: 60,
    lastWorkingDate: format(addDays(today, 30), 'yyyy-MM-dd'),
    status: 'Pending',
    appliedOn: format(subDays(today, 5), 'yyyy-MM-dd'),
    exitSurvey: null,
    hrApproval: null,
    handoverStatus: 'pending',
  },
];

// Initial ex-employees
const initialExEmployees = [
  {
    id: 'alum1',
    employeeId: 'ex-e10',
    name: 'Dr. Rashid Khan',
    email: 'rashid.khan@gmail.com',
    department: 'EE',
    faculty: 'Engineering',
    designation: 'Associate Professor',
    joinDate: '2015-06-01',
    exitDate: format(subDays(today, 180), 'yyyy-MM-dd'),
    yearsOfService: 8,
    exitReason: 'Better Opportunity',
    exitSurvey: {
      reason: 'Better Opportunity',
      satisfaction: 4,
      management: 4,
      workEnvironment: 4,
      growth: 3,
      wouldRecommend: true,
      wouldReturn: true,
      feedback: 'Great institution, wonderful colleagues. Left for a senior position abroad.',
    },
  },
  {
    id: 'alum2',
    employeeId: 'ex-e11',
    name: 'Prof. Amina Bibi',
    email: 'amina.bibi@outlook.com',
    department: 'Chemistry',
    faculty: 'Sciences',
    designation: 'Professor',
    joinDate: '2010-03-15',
    exitDate: format(subDays(today, 365), 'yyyy-MM-dd'),
    yearsOfService: 14,
    exitReason: 'Retirement',
    exitSurvey: {
      reason: 'Retirement',
      satisfaction: 5,
      management: 5,
      workEnvironment: 5,
      growth: 4,
      wouldRecommend: true,
      wouldReturn: false,
      feedback: 'Wonderful career at CECOS. Will cherish the memories forever.',
    },
  },
];

// Announcements
const initialAnnouncements = [
  {
    id: 'ann1',
    title: 'Eid Holidays Schedule',
    message:
      'CECOS University will remain closed from June 28 to July 3 for Eid ul Adha. Wishing everyone a blessed Eid!',
    priority: 'high',
    targetAudience: 'all',
    createdBy: 'HR Department',
    createdAt: format(subDays(today, 2), 'yyyy-MM-dd HH:mm'),
    expiresAt: format(addDays(today, 10), 'yyyy-MM-dd'),
    isActive: true,
  },
  {
    id: 'ann2',
    title: 'Faculty Meeting Notice',
    message:
      'All faculty members are requested to attend the quarterly meeting on Friday at 2:00 PM in the main auditorium.',
    priority: 'medium',
    targetAudience: 'faculty',
    department: null,
    createdBy: 'HR Department',
    createdAt: format(subDays(today, 1), 'yyyy-MM-dd HH:mm'),
    expiresAt: format(addDays(today, 5), 'yyyy-MM-dd'),
    isActive: true,
  },
];

export const useDataStore = create(
  persist(
    (set, get) => ({
      employees: initialEmployees,
      attendance: generateAttendance(),
      leaves: initialLeaves,
      notifications: initialNotifications,
      promotions: initialPromotions,
      resignations: initialResignations,
      exEmployees: initialExEmployees,
      announcements: initialAnnouncements,

      // Employee actions
      addEmployee: (emp) => {
        // Calculate probation end date if employee is on probation
        const probationEndDate =
          emp.employmentStatus === 'probation' && emp.joinDate
            ? calculateProbationEndDate(emp.joinDate)
            : null;

        return set((s) => ({
          employees: [
            ...s.employees,
            {
              ...emp,
              id: generateId('e'),
              code: `EMP${String(s.employees.length + 1).padStart(3, '0')}`,
              status: 'Active',
              leaveBalance: { annual: 20, sick: 12, casual: 10, medical: 30 },
              probationEndDate,
              gender: emp.gender || 'male',
              employmentStatus: emp.employmentStatus || 'confirmed',
            },
          ],
        }));
      },

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
              paidDays: leave.paidDays ?? null,
              unpaidDays: leave.unpaidDays ?? null,
              leaveCategory: leave.leaveCategory ?? null,
              approvalChain:
                leave.type === 'medical'
                  ? [
                      { role: 'hod', status: 'pending', by: null, date: null, comment: null },
                      { role: 'vc', status: 'pending', by: null, date: null, comment: null },
                      {
                        role: 'president',
                        status: 'pending',
                        by: null,
                        date: null,
                        comment: null,
                        paidDays: null,
                        unpaidDays: null,
                        leaveCategory: null,
                      },
                    ]
                  : [
                      { role: 'hod', status: 'pending', by: null, date: null, comment: null },
                      { role: 'dean', status: 'pending', by: null, date: null, comment: null },
                      { role: 'hr', status: 'pending', by: null, date: null, comment: null },
                    ],
            },
          ],
        }));
      },

      updateLeaveStatus: (
        leaveId,
        newStatus,
        approverRole,
        approverName,
        comments = '',
        metadata = {},
      ) => {
        set((state) => {
          const normalizedRole = approverRole;
          const leaves = state.leaves.map((leave) => {
            if (leave.id !== leaveId) return leave;

            const now = new Date().toISOString();
            let updatedLeave = { ...leave };

            // Initialize approval chain based on leave type
            if (!updatedLeave.approvalChain) {
              if (leave.type === 'medical') {
                // Medical leave: HOD → VC → President
                updatedLeave.approvalChain = [
                  { role: 'hod', status: 'pending', by: null, date: null, comment: null },
                  { role: 'vc', status: 'pending', by: null, date: null, comment: null },
                  {
                    role: 'president',
                    status: 'pending',
                    by: null,
                    date: null,
                    comment: null,
                    paidDays: null,
                    unpaidDays: null,
                    leaveCategory: null,
                  },
                ];
              } else {
                // Other leaves: HOD → Dean → HR
                updatedLeave.approvalChain = [
                  { role: 'hod', status: 'pending', by: null, date: null, comment: null },
                  {
                    role: 'dean',
                    status: 'pending',
                    by: null,
                    date: null,
                    comment: null,
                    paidDays: null,
                    unpaidDays: null,
                  },
                  { role: 'hr', status: 'pending', by: null, date: null, comment: null },
                ];
              }
            }

            // Find current step
            const currentStepIndex = updatedLeave.approvalChain.findIndex(
              (step) => step.role === normalizedRole,
            );

            if (currentStepIndex === -1) return leave;

            // Update current step
            updatedLeave.approvalChain[currentStepIndex] = {
              ...updatedLeave.approvalChain[currentStepIndex],
              status: newStatus.toLowerCase(),
              by: approverName,
              date: now,
              comment: comments || null,
            };

            // President's paid/unpaid split and categorization for medical leave
            if (
              leave.type === 'medical' &&
              normalizedRole === 'president' &&
              newStatus === 'Approved'
            ) {
              if (metadata.paidDays !== undefined) {
                updatedLeave.approvalChain[currentStepIndex].paidDays = metadata.paidDays;
                updatedLeave.approvalChain[currentStepIndex].unpaidDays = metadata.unpaidDays;
                updatedLeave.paidDays = metadata.paidDays;
                updatedLeave.unpaidDays = metadata.unpaidDays;
              }
              if (metadata.leaveCategory) {
                updatedLeave.approvalChain[currentStepIndex].leaveCategory = metadata.leaveCategory;
                updatedLeave.leaveCategory = metadata.leaveCategory;
              }
            }

            // Dean's paid/unpaid split for non-medical leaves
            if (approverRole === 'dean' && metadata.paidDays !== undefined) {
              updatedLeave.approvalChain[currentStepIndex].paidDays = metadata.paidDays;
              updatedLeave.approvalChain[currentStepIndex].unpaidDays = metadata.unpaidDays;
              updatedLeave.paidDays = metadata.paidDays;
              updatedLeave.unpaidDays = metadata.unpaidDays;
            }

            // HR's medical categorization for non-medical flow
            if (approverRole === 'hr' && metadata.leaveCategory) {
              updatedLeave.leaveCategory = metadata.leaveCategory;
            }

            if (newStatus === 'Rejected') {
              updatedLeave.status = 'Rejected';
              updatedLeave.reviewedBy = approverName;
              updatedLeave.reviewedOn = now;
              updatedLeave.comments = comments;
            } else if (newStatus === 'Approved') {
              const nextPendingStep = updatedLeave.approvalChain.find(
                (step, idx) => idx > currentStepIndex && step.status === 'pending',
              );

              if (nextPendingStep) {
                updatedLeave.status = 'Forwarded';
                updatedLeave.currentApprover = nextPendingStep.role;
              } else {
                updatedLeave.status = 'Approved';
                updatedLeave.reviewedBy = approverName;
                updatedLeave.reviewedOn = now;
              }

              if (comments) {
                updatedLeave.comments = comments;
              }
            }

            return updatedLeave;
          });

          return { leaves };
        });
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

      // ============ PROMOTION ACTIONS ============
      addPromotion: (promotion) => {
        const employee = get().getEmployee(promotion.employeeId);
        set((s) => ({
          promotions: [
            ...s.promotions,
            {
              ...promotion,
              id: generateId('pr'),
              employeeName: employee?.name,
              department: employee?.department,
              faculty: employee?.faculty,
              currentDesignation: employee?.designation,
              status: 'Pending',
              appliedOn: format(new Date(), 'yyyy-MM-dd'),
              committeeReview: null,
              hrDecision: null,
            },
          ],
        }));
      },

      updatePromotionStatus: (id, status, decision) =>
        set((s) => ({
          promotions: s.promotions.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status,
                  ...(decision.type === 'committee' && { committeeReview: decision }),
                  ...(decision.type === 'hr' && { hrDecision: decision }),
                }
              : p,
          ),
        })),

      approvePromotion: (id) => {
        const promotion = get().promotions.find((p) => p.id === id);
        if (promotion) {
          set((s) => ({
            employees: s.employees.map((e) =>
              e.id === promotion.employeeId
                ? { ...e, designation: promotion.requestedDesignation }
                : e,
            ),
            promotions: s.promotions.map((p) =>
              p.id === id
                ? { ...p, status: 'Approved', approvedOn: format(new Date(), 'yyyy-MM-dd') }
                : p,
            ),
          }));
        }
      },

      getPromotionsByEmployee: (employeeId) =>
        get().promotions.filter((p) => p.employeeId === employeeId),

      getPendingPromotions: () =>
        get().promotions.filter((p) => p.status === 'Pending' || p.status === 'Under Review'),

      // ============ RESIGNATION ACTIONS ============
      addResignation: (resignation) => {
        const employee = get().getEmployee(resignation.employeeId);
        set((s) => ({
          resignations: [
            ...s.resignations,
            {
              ...resignation,
              id: generateId('res'),
              employeeName: employee?.name,
              department: employee?.department,
              faculty: employee?.faculty,
              designation: employee?.designation,
              status: 'Pending',
              appliedOn: format(new Date(), 'yyyy-MM-dd'),
              exitSurvey: null,
              hrApproval: null,
              handoverStatus: 'pending',
            },
          ],
        }));
      },

      updateResignationStatus: (id, status, updates = {}) =>
        set((s) => ({
          resignations: s.resignations.map((r) => (r.id === id ? { ...r, status, ...updates } : r)),
        })),

      submitExitSurvey: (resignationId, survey) =>
        set((s) => ({
          resignations: s.resignations.map((r) =>
            r.id === resignationId
              ? { ...r, exitSurvey: survey, exitSurveyDate: format(new Date(), 'yyyy-MM-dd') }
              : r,
          ),
        })),

      processResignation: (id) => {
        const resignation = get().resignations.find((r) => r.id === id);
        if (resignation) {
          const employee = get().getEmployee(resignation.employeeId);
          if (employee) {
            // Move to ex-employees
            set((s) => ({
              exEmployees: [
                ...s.exEmployees,
                {
                  id: generateId('alum'),
                  employeeId: employee.id,
                  name: employee.name,
                  email: employee.email,
                  department: employee.department,
                  faculty: employee.faculty,
                  designation: employee.designation,
                  joinDate: employee.joinDate,
                  exitDate: resignation.lastWorkingDate,
                  yearsOfService: Math.floor(
                    (new Date(resignation.lastWorkingDate) - new Date(employee.joinDate)) /
                      (365.25 * 24 * 60 * 60 * 1000),
                  ),
                  exitReason: resignation.reason,
                  exitSurvey: resignation.exitSurvey,
                },
              ],
              employees: s.employees.filter((e) => e.id !== resignation.employeeId),
              resignations: s.resignations.map((r) =>
                r.id === id
                  ? { ...r, status: 'Completed', processedOn: format(new Date(), 'yyyy-MM-dd') }
                  : r,
              ),
            }));
          }
        }
      },

      getResignationsByEmployee: (employeeId) =>
        get().resignations.filter((r) => r.employeeId === employeeId),

      getPendingResignations: () =>
        get().resignations.filter((r) => r.status === 'Pending' || r.status === 'Approved'),

      // ============ EX-EMPLOYEES ACTIONS ============
      getExEmployeesByDepartment: (dept) => get().exEmployees.filter((a) => a.department === dept),

      getExEmployeesByFaculty: (faculty) => get().exEmployees.filter((a) => a.faculty === faculty),

      searchExEmployees: (query) => {
        const q = query.toLowerCase();
        return get().exEmployees.filter(
          (a) =>
            a.name.toLowerCase().includes(q) ||
            a.department.toLowerCase().includes(q) ||
            a.designation.toLowerCase().includes(q),
        );
      },

      // ============ ANNOUNCEMENT ACTIONS ============
      addAnnouncement: (announcement) =>
        set((s) => ({
          announcements: [
            {
              ...announcement,
              id: generateId('ann'),
              createdAt: format(new Date(), 'yyyy-MM-dd HH:mm'),
              isActive: true,
            },
            ...s.announcements,
          ],
        })),

      updateAnnouncement: (id, updates) =>
        set((s) => ({
          announcements: s.announcements.map((a) => (a.id === id ? { ...a, ...updates } : a)),
        })),

      deleteAnnouncement: (id) =>
        set((s) => ({
          announcements: s.announcements.filter((a) => a.id !== id),
        })),

      getActiveAnnouncements: () => {
        const now = new Date();
        return get().announcements.filter(
          (a) => a.isActive && (!a.expiresAt || new Date(a.expiresAt) > now),
        );
      },

      getAnnouncementsForUser: (user) => {
        const active = get().getActiveAnnouncements();
        return active.filter((a) => {
          if (a.targetAudience === 'all') return true;
          if (a.targetAudience === 'faculty' && user?.faculty) return true;
          if (a.department && a.department === user?.department) return true;
          return false;
        });
      },

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
          pendingPromotions: state.promotions.filter((p) => p.status === 'Pending').length,
          pendingResignations: state.resignations.filter((r) => r.status === 'Pending').length,
          onLeave: state.employees.filter((e) => e.status === 'On Leave').length,
          totalPayroll: state.employees.reduce((sum, e) => sum + e.salaryBase, 0),
          totalExEmployees: state.exEmployees.length,
        };
      },

      // Reset to initial data (for demo)
      resetData: () =>
        set({
          employees: initialEmployees,
          attendance: generateAttendance(),
          leaves: initialLeaves,
          notifications: initialNotifications,
          promotions: initialPromotions,
          resignations: initialResignations,
          exEmployees: initialExEmployees,
          announcements: initialAnnouncements,
        }),
    }),
    {
      name: 'hrms-data',
      partialize: (state) => ({
        employees: state.employees,
        attendance: state.attendance,
        leaves: state.leaves,
        notifications: state.notifications,
        promotions: state.promotions,
        resignations: state.resignations,
        exEmployees: state.exEmployees,
        announcements: state.announcements,
      }),
    },
  ),
);

// ============ EMAIL SERVICE FUNCTIONS ============

const WEB3FORMS_ACCESS_KEY = '18a0400c-1b05-4bbb-a7f9-8ba08012816e';
const API_ENDPOINT = 'https://api.web3forms.com/submit';

export const sendEmail = async (emailData) => {
  try {
    const formData = new FormData();
    formData.append('access_key', WEB3FORMS_ACCESS_KEY);
    formData.append('to_email', emailData.to);
    formData.append('subject', emailData.subject);
    formData.append('message', emailData.message);
    formData.append('from_name', emailData.from_name || 'HRMS System');

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

export const sendLeaveNotification = async (leaveData, currentUserEmail) => {
  // Get all employees from the store
  const store = useDataStore.getState();
  const allEmployees = store.employees || [];

  // Get all employee emails, excluding the current user
  const recipients = allEmployees
    .filter((emp) => emp.email && emp.email !== currentUserEmail)
    .map((emp) => emp.email);

  // If no recipients, log and return
  if (recipients.length === 0) {
    console.log('No recipients found for leave notification');
    return null;
  }

  const emailMessage = `Dear Colleague,

A new leave request has been submitted:

Employee Name: ${leaveData.employeeName}
Leave Type: ${leaveData.leaveType.charAt(0).toUpperCase() + leaveData.leaveType.slice(1)}
Start Date: ${leaveData.startDate}
End Date: ${leaveData.endDate}
Duration: ${leaveData.days} day(s)
Reason: ${leaveData.reason}
Status: ${leaveData.status}

Please review and process this leave request through the HRMS dashboard.

Best regards,
HRMS System
CECOS University`;

  const emailPromises = recipients.map((email) =>
    sendEmail({
      to: email,
      subject: `New Leave Request - ${leaveData.employeeName} (${leaveData.leaveType})`,
      message: emailMessage,
      from_name: 'HRMS Leave Management',
    }),
  );

  try {
    const results = await Promise.all(emailPromises);
    console.log(
      `Leave notification emails sent successfully to ${recipients.length} recipients`,
      results,
    );
    return results;
  } catch (error) {
    console.error('Leave notification emails failed:', error);
    return null;
  }
};

export const sendNewEmployeeNotification = async (employeeData, currentUserEmail) => {
  // Get all employees from the store
  const store = useDataStore.getState();
  const allEmployees = store.employees || [];

  // Get all employee emails, excluding the current user and new employee
  const recipients = allEmployees
    .filter(
      (emp) => emp.email && emp.email !== currentUserEmail && emp.email !== employeeData.email,
    )
    .map((emp) => emp.email);

  const emailMessage = `Dear Team,

A new employee has been added to the system:

Employee Name: ${employeeData.name}
Employee Code: ${employeeData.code}
Email: ${employeeData.email}
Designation: ${employeeData.designation}
Department: ${employeeData.department}
Join Date: ${employeeData.joinDate}

Please update your records accordingly.

Best regards,
HRMS System
CECOS University`;

  const emailPromises = recipients.map((email) =>
    sendEmail({
      to: email,
      subject: `New Employee Added - ${employeeData.name}`,
      message: emailMessage,
      from_name: 'HRMS Employee Management',
    }),
  );

  try {
    const results = await Promise.all(emailPromises);

    // Welcome email to new employee
    await sendEmail({
      to: employeeData.email,
      subject: 'Welcome to CECOS University - Your Employee Account',
      message: `Dear ${employeeData.name},

Welcome to CECOS University!

Your employee account has been created in the HRMS.

Your Employee Code: ${employeeData.code}
Your Designation: ${employeeData.designation}
Your Department: ${employeeData.department}

You can now access the HRMS portal using your credentials.

Best regards,
HRMS System
CECOS University`,
      from_name: 'HRMS Welcome',
    });

    console.log(
      `New employee notification emails sent successfully to ${recipients.length} recipients`,
      results,
    );
    return results;
  } catch (error) {
    console.error('New employee notification emails failed:', error);
    return null;
  }
};

export const sendAnnouncementNotification = async (announcementData, currentUserEmail) => {
  // Get all employees from the store
  const store = useDataStore.getState();
  const allEmployees = store.employees || [];

  // Get all employee emails, excluding the current user
  const recipients = allEmployees
    .filter((emp) => emp.email && emp.email !== currentUserEmail)
    .map((emp) => emp.email);

  // If no recipients, log and return
  if (recipients.length === 0) {
    console.log('No recipients found for announcement notification');
    return null;
  }

  const emailMessage = `New Announcement:

Title: ${announcementData.title}

${announcementData.description}

Audience: ${announcementData.audience}
Posted by: ${announcementData.postedBy}
Date: ${new Date().toLocaleString('en-PK')}

Please log in to the HRMS system to view full details.

Best regards,
HRMS System
CECOS University`;

  const emailPromises = recipients.map((email) =>
    sendEmail({
      to: email,
      subject: `New Announcement - ${announcementData.title}`,
      message: emailMessage,
      from_name: 'HRMS Announcements',
    }),
  );

  try {
    const results = await Promise.all(emailPromises);
    console.log(
      `Announcement notification emails sent successfully to ${recipients.length} recipients`,
      results,
    );
    return results;
  } catch (error) {
    console.error('Announcement notification emails failed:', error);
    return null;
  }
};

export const sendMeetingNotification = async (meetingData, currentUserEmail) => {
  // Get all employees from the store
  const store = useDataStore.getState();
  const allEmployees = store.employees || [];

  // Get all employee emails, excluding the current user (meeting convener)
  const recipients = allEmployees
    .filter((emp) => emp.email && emp.email !== currentUserEmail)
    .map((emp) => emp.email);

  // If no recipients, log and return
  if (recipients.length === 0) {
    console.log('No recipients found for meeting notification');
    return null;
  }

  const emailMessage = `Dear Colleague,

You are cordially invited to attend a committee meeting.

Meeting Title: ${meetingData.title}
Date: ${meetingData.date}
Time: ${meetingData.time}
Location: ${meetingData.location}

Agenda:
${meetingData.agenda}

Convener: ${meetingData.convener}

Please confirm your attendance and inform if you have any specific topics to discuss.

Best regards,
HRMS System
CECOS University`;

  const emailPromises = recipients.map((email) =>
    sendEmail({
      to: email,
      subject: `Committee Meeting Invitation - ${meetingData.title}`,
      message: emailMessage,
      from_name: `Committee Meeting - ${meetingData.convener}`,
    }),
  );

  try {
    const results = await Promise.all(emailPromises);
    console.log(
      `Meeting notification emails sent successfully to ${recipients.length} recipients`,
      results,
    );
    return results;
  } catch (error) {
    console.error('Meeting notification emails failed:', error);
    return null;
  }
};
