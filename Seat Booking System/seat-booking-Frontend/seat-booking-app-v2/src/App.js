import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
 
// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
 
// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminShows from './pages/admin/AdminShows';
import AdminVenues from './pages/admin/AdminVenues';
import AdminSchedules from './pages/admin/AdminSchedules';
import AdminSeats from './pages/admin/AdminSeats';
import AdminBookings from './pages/admin/AdminBookings';
 
// User Pages
import UserDashboard from './pages/user/UserDashboard';
import ShowsPage from './pages/user/ShowsPage';
import ShowDetailPage from './pages/user/ShowDetailPage';
import SeatSelectionPage from './pages/user/SeatSelectionPage';
import CheckoutPage from './pages/user/CheckoutPage';
import BookingConfirmPage from './pages/user/BookingConfirmPage';
import MyBookingsPage from './pages/user/MyBookingsPage';
import NotificationsPage from './pages/user/NotificationsPage';
 
// Layout
import AdminLayout from './components/AdminLayout';
import UserLayout from './components/UserLayout';
 
// ── Protected Route Wrappers ──────────────────────────────────────────────────
const ProtectedAdmin = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'ADMIN') return <Navigate to="/portal" replace />;
  return children;
};
 
const ProtectedUser = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'USER') return <Navigate to="/admin" replace />;
  return children;
};
 
const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
  return <Navigate to="/portal" replace />;
};
 
// ── App ───────────────────────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
 
      {/* Admin Portal */}
      <Route path="/admin" element={<ProtectedAdmin><AdminLayout /></ProtectedAdmin>}>
        <Route index element={<AdminDashboard />} />
        <Route path="shows" element={<AdminShows />} />
        <Route path="venues" element={<AdminVenues />} />
        <Route path="schedules" element={<AdminSchedules />} />
        <Route path="seats" element={<AdminSeats />} />
        <Route path="bookings" element={<AdminBookings />} />
      </Route>
 
      {/* User Portal */}
      <Route path="/portal" element={<ProtectedUser><UserLayout /></ProtectedUser>}>
        <Route index element={<UserDashboard />} />
        <Route path="shows" element={<ShowsPage />} />
        <Route path="shows/:showId" element={<ShowDetailPage />} />
        <Route path="seats/:scheduleId" element={<SeatSelectionPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="booking-confirm/:bookingId" element={<BookingConfirmPage />} />
        <Route path="my-bookings" element={<MyBookingsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
      </Route>
 
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
 
export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}