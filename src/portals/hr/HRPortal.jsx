import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HRLayout from './components/HRLayout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import AttendanceList from './pages/AttendanceList';
import LeavesList from './pages/LeavesList';
import Promotions from './pages/Promotions';
import Resignations from './pages/Resignations';
import ExEmployees from './pages/ExEmployees';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import PolicyAdvisory from './pages/PolicyAdvisory';
import Announcements from './pages/Announcements';
import Settings from './pages/Settings';

export default function HRPortal() {
  return (
    <Routes>
      <Route element={<HRLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="employees" element={<Employees />} />
        <Route path="attendance" element={<AttendanceList />} />
        <Route path="leaves" element={<LeavesList />} />
        <Route path="promotions" element={<Promotions />} />
        <Route path="resignations" element={<Resignations />} />
        <Route path="ex-employees" element={<ExEmployees />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="reports" element={<Reports />} />
        <Route path="policy-advisory" element={<PolicyAdvisory />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Route>
    </Routes>
  );
}
