import React from 'react';
import { Route } from 'react-router-dom';
import HRLayout from '../../app/HRLayout';
import HRLogin from './pages/Login';
import HRDashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import AttendanceList from './pages/AttendanceList';
import LeavesList from './pages/LeavesList';

export const hrRoutes = (
  <>
    <Route path="/hr/login" element={<HRLogin />} />
    <Route path="/hr" element={<HRLayout />}>
      <Route index element={<HRDashboard />} />
      <Route path="employees" element={<Employees />} />
      <Route path="attendance" element={<AttendanceList />} />
      <Route path="leaves" element={<LeavesList />} />
    </Route>
  </>
);
