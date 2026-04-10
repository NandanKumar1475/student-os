import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import ProfilePage from '../pages/ProfilePage';
import TargetsPage from '../pages/TargetsPage';
import Tasks from '../pages/Tasks'; // ✅ fixed

import ProtectedRoute from '../components/auth/ProtectedRoute';
import MainLayout from '../layouts/MainLayout';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected with Layout */}
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout><DashboardPage /></MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/targets" element={
          <ProtectedRoute>
            <MainLayout><TargetsPage /></MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <MainLayout><ProfilePage /></MainLayout>
          </ProtectedRoute>
        } />

        {/* FIXED TASKS ROUTE */}
        <Route path="/tasks" element={
          <ProtectedRoute>
            <MainLayout><Tasks /></MainLayout>
          </ProtectedRoute>
        } />

        {/* 404 */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-[#0f0f1a]">
            <h1 className="text-3xl font-bold text-gray-500">
              404 - Page Not Found
            </h1>
          </div>
        } />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;