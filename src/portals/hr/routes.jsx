import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute';
import HRLayout from './components/HRLayout';
import HRDashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import AttendanceList from './pages/AttendanceList';
import LeavesList from './pages/LeavesList';
import Reports from './pages/Reports';
import Announcements from './pages/Announcements';
import Settings from './pages/Settings';
import Promotions from './pages/Promotions';
import Resignations from './pages/Resignations';
import Alumni from './pages/Alumni';
import Analytics from './pages/Analytics';

export const hrRoutes = (
  <Route
    path="/hr"
    element={
      <ProtectedRoute allowedRoles={['hr', 'admin']} redirectTo="/login">
        <HRLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<HRDashboard />} />
    <Route path="employees" element={<Employees />} />
    <Route path="attendance" element={<AttendanceList />} />
    <Route path="leaves" element={<LeavesList />} />
    <Route path="promotions" element={<Promotions />} />
    <Route path="resignations" element={<Resignations />} />
    <Route path="alumni" element={<Alumni />} />
    <Route path="analytics" element={<Analytics />} />
    <Route path="reports" element={<Reports />} />
    <Route path="announcements" element={<Announcements />} />
    <Route path="settings" element={<Settings />} />
  </Route>
);
