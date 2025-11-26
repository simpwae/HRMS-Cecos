import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: { id: 'u1', name: 'Demo User', roles: ['employee', 'hr'] },
  activeRole: 'employee',
  switchRole: (role) => set((s) => ({ activeRole: role })),
  isRole: (role) => role === useAuthStore.getState().activeRole,
}));
