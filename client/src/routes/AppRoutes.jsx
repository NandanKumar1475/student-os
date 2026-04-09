import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import pages as you build them
// import LoginPage from '../pages/auth/LoginPage';
// import DashboardPage from '../pages/DashboardPage';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<div>Login Page - Coming Soon</div>} />
        <Route path="/register" element={<div>Register Page - Coming Soon</div>} />

        {/* Main App */}
        <Route path="/" element={<div>Dashboard - Coming Soon</div>} />
        <Route path="/targets" element={<div>Targets - Coming Soon</div>} />
        <Route path="/tasks" element={<div>Tasks - Coming Soon</div>} />
        <Route path="/notes" element={<div>Notes - Coming Soon</div>} />
        <Route path="/skills" element={<div>Skills - Coming Soon</div>} />
        <Route path="/exams" element={<div>Exams - Coming Soon</div>} />
        <Route path="/planner" element={<div>Planner - Coming Soon</div>} />
        <Route path="/pomodoro" element={<div>Pomodoro - Coming Soon</div>} />
        <Route path="/jobs" element={<div>Jobs - Coming Soon</div>} />
        <Route path="/resources" element={<div>Resources - Coming Soon</div>} />
        <Route path="/profile" element={<div>Profile - Coming Soon</div>} />
        <Route path="/settings" element={<div>Settings - Coming Soon</div>} />
        <Route path="/pricing" element={<div>Pricing - Coming Soon</div>} />

        {/* 404 */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;