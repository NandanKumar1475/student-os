import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import ProfilePage from '../pages/ProfilePage';
import TargetsPage from '../pages/TargetsPage';
import Tasks from '../pages/Tasks';
import Notes from '../pages/Notes';
import Streaks from '../pages/Streaks';
import AnalyticsPage from '../pages/AnalyticsPage';
import JobsPage from '../pages/JobsPage';
import ResourcesPage from '../pages/ResourcesPage';
import VRStudyRoom from '../pages/VRStudyRoom';

import ProtectedRoute from '../components/auth/ProtectedRoute';
import MainLayout from '../layouts/MainLayout';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected with shared animated layout */}
        <Route element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardPage />} />
          <Route path="/targets" element={<TargetsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/streaks" element={<Streaks />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
        </Route>

        <Route path="/vr" element={
          <ProtectedRoute>
            <VRStudyRoom />
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
