import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ParkingProvider } from './context/ParkingContext';
import { Layout } from './components/common/Layout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UserDashboard } from './pages/UserDashboard';
import { QRParkingPage } from './pages/QRParkingPage';
import { NearbyParkingPage } from './pages/NearbyParkingPage';
import { ViolationReportPage } from './pages/ViolationReportPage';
import { AdminDashboard } from './pages/AdminDashboard';

// Route Guard for Authenticated Users
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

// Route Guard for Admin Only
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login?portal=admin" replace />;
  }
  if (!isAdmin) {
    // If a driver attempts to open admin console, direct them back to driver dashboard
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ParkingProvider>
          <Routes>
            {/* Public Landing & Authentication */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* App Layout with Navy Sidebar & Header */}
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/qr-parking" element={<QRParkingPage />} />
              <Route path="/nearby" element={<NearbyParkingPage />} />
              <Route path="/report-violation" element={<ViolationReportPage />} />

              {/* Admin Only Route */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ParkingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
