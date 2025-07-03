
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FindBusesPage from './pages/FindBusesPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminBusManagement from './pages/AdminBusManagement';
import AdminCustomerManagement from './pages/AdminCustomerManagement';

const PrivateRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly = false }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (adminOnly && user.role !== 'ADMIN') {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <div className="flex flex-col min-h-screen font-sans">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/find-buses" element={<FindBusesPage />} />
              <Route path="/my-bookings" element={
                <PrivateRoute>
                  <MyBookingsPage />
                </PrivateRoute>
              } />
              <Route path="/admin/dashboard" element={
                <PrivateRoute adminOnly={true}>
                  <AdminDashboardPage />
                </PrivateRoute>
              } />
              <Route path="/admin/buses" element={
                <PrivateRoute adminOnly={true}>
                  <AdminBusManagement />
                </PrivateRoute>
              } />
              <Route path="/admin/customers" element={
                <PrivateRoute adminOnly={true}>
                  <AdminCustomerManagement />
                </PrivateRoute>
              } />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
