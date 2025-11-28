import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute';
import VPLayout from './components/VPLayout';
import VPDashboard from './pages/Dashboard';
import VPAllEmployees from './pages/AllEmployees';
import VPReports from './pages/Reports';
import VPAnalytics from './pages/Analytics';
import VPAdvisory from './pages/Advisory';
import VPSettings from './pages/Settings';

export const vpRoutes = (
  <Route
    path="/vp"
    element={
      <ProtectedRoute allowedRoles={['vp']}>
        <VPLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<VPDashboard />} />
    <Route path="employees" element={<VPAllEmployees />} />
    <Route path="reports" element={<VPReports />} />
    <Route path="analytics" element={<VPAnalytics />} />
    <Route path="advisory" element={<VPAdvisory />} />
    <Route path="settings" element={<VPSettings />} />
  </Route>
);
