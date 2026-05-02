import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Redirect root to login for now */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
