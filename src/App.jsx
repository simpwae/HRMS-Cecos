import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { employeeRoutes } from './portals/employee/routes';
import { hrRoutes } from './portals/hr/routes';
import NotFound from './app/NotFound';
import './styles/globals.css';

function App() {
  // Vite provides import.meta.env.BASE_URL (ends with '/'). Remove trailing slash for router basename.
  const rawBase = import.meta.env.BASE_URL || '/';
  const basename = rawBase.replace(/\/$/, '');
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<Navigate to="/employee/login" replace />} />
        {employeeRoutes}
        {hrRoutes}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
