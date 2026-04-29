/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { StrictMode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ProjectsManage from './pages/admin/ProjectsManage';
import UsersManage from './pages/admin/UsersManage';
import ConsultationsManage from './pages/admin/ConsultationsManage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) => {
  const { user, profile, loading, isAdmin } = useAuth();

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (requireAdmin && !isAdmin) return <Navigate to="/" />;

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f8]">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/projects" element={
            <ProtectedRoute requireAdmin>
              <ProjectsManage />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute requireAdmin>
              <UsersManage />
            </ProtectedRoute>
          } />
          <Route path="/admin/consultations" element={
            <ProtectedRoute requireAdmin>
              <ConsultationsManage />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

