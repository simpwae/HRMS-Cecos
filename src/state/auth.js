import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Demo users for different roles
const demoUsers = {
  admin: {
    id: 'u-admin',
    name: 'System Administrator',
    email: 'admin@cecos.edu.pk',
    avatar: null,
    roles: ['admin'],
    primaryRole: 'admin',
    department: null,
    faculty: null,
  },
  hr: {
    id: 'u-hr',
    name: 'Sarah Khan',
    email: 'hr@cecos.edu.pk',
    avatar: null,
    roles: ['hr', 'employee'],
    primaryRole: 'hr',
    department: 'Human Resources',
    faculty: 'Administration',
  },
  vp: {
    id: 'u-vp',
    name: 'Dr. Ahmad Malik',
    email: 'vp@cecos.edu.pk',
    avatar: null,
    roles: ['vp', 'employee'],
    primaryRole: 'vp',
    department: 'Executive',
    faculty: null,
  },
  dean: {
    id: 'u-dean',
    name: 'Prof. Fatima Ali',
    email: 'dean.computing@cecos.edu.pk',
    avatar: null,
    roles: ['dean', 'employee'],
    primaryRole: 'dean',
    department: 'CS',
    faculty: 'Computing',
  },
  hod: {
    id: 'u-hod',
    name: 'Dr. Imran Shah',
    email: 'hod.cs@cecos.edu.pk',
    avatar: null,
    roles: ['hod', 'employee'],
    primaryRole: 'hod',
    department: 'CS',
    faculty: 'Computing',
  },
  employee: {
    id: 'e1',
    name: 'Alice Smith',
    email: 'alice@cecos.edu.pk',
    avatar: null,
    roles: ['employee'],
    primaryRole: 'employee',
    department: 'CS',
    faculty: 'Computing',
    designation: 'Senior Lecturer',
    employeeCode: 'EMP001',
  },
  demo: {
    id: 'u-demo',
    name: 'Demo User',
    email: 'demo@cecos.edu.pk',
    avatar: null,
    roles: ['employee', 'hr', 'vp', 'dean', 'hod', 'admin'],
    primaryRole: 'employee',
    department: 'CS',
    faculty: 'Computing',
  },
};

// Role hierarchy for permission checking
const roleHierarchy = {
  admin: 100,
  vp: 90,
  dean: 70,
  hod: 60,
  hr: 50,
  employee: 10,
};

// Portal routes for each role
export const portalRoutes = {
  admin: '/admin',
  vp: '/vp',
  dean: '/dean',
  hod: '/hod',
  hr: '/hr',
  employee: '/employee',
};

// Role display names
export const roleNames = {
  admin: 'Administrator',
  vp: 'Vice President',
  dean: 'Dean',
  hod: 'Head of Department',
  hr: 'HR Manager',
  employee: 'Employee',
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      activeRole: null,
      isAuthenticated: false,

      // Login with email/password (demo mode)
      login: (email, password) => {
        // Find matching demo user by email
        const userKey = Object.keys(demoUsers).find((key) => demoUsers[key].email === email);

        // Demo mode: accept any password for demo users
        if (userKey && password) {
          const user = demoUsers[userKey];
          set({
            user,
            activeRole: user.primaryRole,
            isAuthenticated: true,
          });
          return { success: true, user, redirectTo: portalRoutes[user.primaryRole] };
        }

        // Quick demo login by role
        if (demoUsers[email.toLowerCase()]) {
          const user = demoUsers[email.toLowerCase()];
          set({
            user,
            activeRole: user.primaryRole,
            isAuthenticated: true,
          });
          return { success: true, user, redirectTo: portalRoutes[user.primaryRole] };
        }

        return { success: false, error: 'Invalid credentials' };
      },

      // Quick login by role (for demo purposes)
      loginAsRole: (role) => {
        const user = demoUsers[role] || demoUsers.demo;
        set({
          user: { ...user, primaryRole: role },
          activeRole: role,
          isAuthenticated: true,
        });
        return portalRoutes[role] || '/employee';
      },

      // Logout
      logout: () => {
        set({
          user: null,
          activeRole: null,
          isAuthenticated: false,
        });
      },

      // Switch active role (for users with multiple roles)
      switchRole: (role) => {
        const { user } = get();
        if (user && user.roles.includes(role)) {
          set({ activeRole: role });
          return portalRoutes[role];
        }
        return null;
      },

      // Check if current user has a specific role
      hasRole: (role) => {
        const { user } = get();
        return user?.roles?.includes(role) || false;
      },

      // Check if current active role matches
      isRole: (role) => {
        return get().activeRole === role;
      },

      // Check if user can access a role level (based on hierarchy)
      canAccess: (requiredRole) => {
        const { activeRole } = get();
        if (!activeRole) return false;
        return roleHierarchy[activeRole] >= roleHierarchy[requiredRole];
      },

      // Get available roles for the current user
      getAvailableRoles: () => {
        const { user } = get();
        return user?.roles || [];
      },

      // Update user profile
      updateProfile: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },
    }),
    {
      name: 'hrms-auth',
      partialize: (state) => ({
        user: state.user,
        activeRole: state.activeRole,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

// Export demo users for login page suggestions
export { demoUsers };
