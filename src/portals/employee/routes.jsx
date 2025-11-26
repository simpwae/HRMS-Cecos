import React from 'react';
import { Route } from 'react-router-dom';
import EmployeeLayout from '../../app/EmployeeLayout';
import EmployeeLogin from './pages/Login';
import EmployeeDashboard from './pages/Dashboard';
import Entry from './pages/Entry';
import Attendance from './pages/Attendance';
import Leave from './pages/Leave';
import Salary from './pages/Salary';

export const employeeRoutes = (
  <>
    <Route path="/employee/login" element={<EmployeeLogin />} />
    <Route path="/employee" element={<EmployeeLayout />}>
      <Route index element={<EmployeeDashboard />} />
      <Route path="entry" element={<Entry />} />
      <Route path="attendance" element={<Attendance />} />
      <Route path="leave" element={<Leave />} />
      <Route path="salary" element={<Salary />} />
    </Route>
  </>
);
