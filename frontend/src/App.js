import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
const BranchPage = React.lazy(() => import('./pages/BranchPage'));
const ReviewPage = React.lazy(() => import('./pages/ReviewPage'));
const OAuth2Redirect = React.lazy(() => import('./pages/OAuth2Redirect'));

const Loading = () => (
  <div style={{ textAlign: 'center', padding: '3rem', color: '#4a2c2a' }}>
    Loading...
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <React.Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/menu/:branchId" element={<MenuPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
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
        </Routes>
      </React.Suspense>
    </AuthProvider>
  );
}

export default App;
