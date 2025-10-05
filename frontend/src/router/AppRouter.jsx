// router/AppRouter.jsx
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import UserDashboard from '../pages/UserDashboard';
import AgentDashboard from '../pages/AgentDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import NewTicketPage from '../pages/NewTicketPage';
import TicketDetailPage from '../pages/TicketDetailPage';

// PrivateRoute checks authentication
const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

// RoleRoute checks both authentication and role
const RoleRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/login" />;
  return children;
};

const AppRouter = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    {/* Dashboards */}
    <Route
      path="/user/dashboard"
      element={
        <RoleRoute allowedRoles={['user']}>
          <UserDashboard />
        </RoleRoute>
      }
    />
    <Route
      path="/agent/dashboard"
      element={
        <RoleRoute allowedRoles={['agent']}>
          <AgentDashboard />
        </RoleRoute>
      }
    />
    <Route
      path="/admin/dashboard"
      element={
        <RoleRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </RoleRoute>
      }
    />

    {/* Ticket Routes */}
    <Route
      path="/tickets/new"
      element={
        <PrivateRoute>
          <NewTicketPage />
        </PrivateRoute>
      }
    />
    <Route
      path="/tickets/:id"
      element={
        <PrivateRoute>
          <TicketDetailPage />
        </PrivateRoute>
      }
    />

    {/* Fallback */}
    <Route path="*" element={<Navigate to="/register" />} />
  </Routes>
);

export default AppRouter;
