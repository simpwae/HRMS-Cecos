import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/Toast';

// Pages
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import NotFound from './app/NotFound';

// Portal Routes
import { employeeRoutes } from './portals/employee/routes';
import { hrRoutes } from './portals/hr/routes';
import { vpRoutes } from './portals/vp/routes';
import { deanRoutes } from './portals/dean/routes';
import { hodRoutes } from './portals/hod/routes';
import { adminRoutes } from './portals/admin/routes';

import './styles/globals.css';

function App() {
  // Vite provides import.meta.env.BASE_URL (ends with '/'). Remove trailing slash for router basename.
  const rawBase = import.meta.env.BASE_URL || '/';
  const basename = rawBase.replace(/\/$/, '');

  return (
    <ToastProvider>
      <BrowserRouter basename={basename}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Portal Routes */}
          {employeeRoutes}
          {hrRoutes}
          {vpRoutes}
          {deanRoutes}
          {hodRoutes}
          {adminRoutes}

          {/* Legacy redirects */}
          <Route path="/employee/login" element={<Navigate to="/login" replace />} />
          <Route path="/hr/login" element={<Navigate to="/login" replace />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
