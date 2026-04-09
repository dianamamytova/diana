import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

// Page placeholders - to be implemented
const HomePage = React.lazy(() => import('./pages/HomePage'));
const MenuPage = React.lazy(() => import('./pages/MenuPage'));
const ReservationPage = React.lazy(() => import('./pages/ReservationPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const UserDashboard = React.lazy(() => import('./pages/UserDashboard'));
const AdminPanel = React.lazy(() => import('./pages/AdminPanel'));
const AdminMenuPage = React.lazy(() => import('./pages/AdminMenuPage'));
const AdminReservationsPage = React.lazy(() => import('./pages/AdminReservationsPage'));
const AdminReviewsPage = React.lazy(() => import('./pages/AdminReviewsPage'));
const AdminAnalyticsPage = React.lazy(() => import('./pages/AdminAnalyticsPage'));
const AdminQrPage = React.lazy(() => import('./pages/AdminQrPage'));
const AdminBranchesPage = React.lazy(() => import('./pages/AdminBranchesPage'));
const BranchPage = React.lazy(() => import('./pages/BranchPage'));
const BranchesPage = React.lazy(() => import('./pages/BranchesPage'));
const ReviewPage = React.lazy(() => import('./pages/ReviewPage'));
const OAuth2Redirect = React.lazy(() => import('./pages/OAuth2Redirect'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

const Loading = () => (
  <div style={{ textAlign: 'center', padding: '3rem', color: '#4a2c2a' }}>
    Loading...
  </div>
);

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminPage && <Navbar />}
      <ToastContainer position="top-right" autoClose={3000} />
      <React.Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/menu/:branchId" element={<MenuPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/branches" element={<BranchesPage />} />
          <Route path="/branch/:branchId" element={<BranchPage />} />
          <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />

          {/* Protected routes */}
          <Route path="/reservation" element={
            <PrivateRoute><ReservationPage /></PrivateRoute>
          } />
          <Route path="/dashboard" element={
            <PrivateRoute><UserDashboard /></PrivateRoute>
          } />
          <Route path="/review" element={
            <PrivateRoute><ReviewPage /></PrivateRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin" element={
            <AdminRoute><AdminPanel /></AdminRoute>
          } />
          <Route path="/admin/menu" element={
            <AdminRoute><AdminMenuPage /></AdminRoute>
          } />
          <Route path="/admin/reservations" element={
            <AdminRoute><AdminReservationsPage /></AdminRoute>
          } />
          <Route path="/admin/reviews" element={
            <AdminRoute><AdminReviewsPage /></AdminRoute>
          } />
          <Route path="/admin/analytics" element={
            <AdminRoute><AdminAnalyticsPage /></AdminRoute>
          } />
          <Route path="/admin/qr" element={
            <AdminRoute><AdminQrPage /></AdminRoute>
          } />
          <Route path="/admin/branches" element={
            <AdminRoute><AdminBranchesPage /></AdminRoute>
          } />

          {/* 404 catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </React.Suspense>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
