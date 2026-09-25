import { Navigate, Route, Routes } from 'react-router-dom';
import PublicOnlyRoute from '../components/auth/PublicOnlyRoute';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import DashboardLayout from '../components/layout/DashboardLayout';
import Home from '../pages/home/Home';
import Login from '../pages/login/Login';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
