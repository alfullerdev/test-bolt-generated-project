import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import { ProtectedRoute } from './components/ProtectedRoute';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './pages/admin/AdminLayout';
import VendorLayout from './pages/vendor/VendorLayout';
import UserLayout from './pages/user/UserLayout';

// Public Pages
import Home from './pages/Home';
import Products from './pages/Products';
import Solutions from './pages/Solutions';
import Developers from './pages/Developers';
import Resources from './pages/Resources';
import Pricing from './pages/Pricing';
import SignIn from './pages/SignIn';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Careers from './pages/Careers';
import About from './pages/About';
import Customers from './pages/Customers';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import VendorSignupForm from './components/VendorSignup/VendorSignupForm';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import POS from './pages/admin/POS';
import Vendors from './pages/admin/Vendors';
import Users from './pages/admin/Users';
import Events from './pages/admin/Events';
import Reports from './pages/admin/Reports';
import Analytics from './pages/admin/Analytics';
import Settings from './pages/admin/Settings';
import Support from './pages/admin/Support';

// Vendor Pages
import VendorDashboard from './pages/vendor/Dashboard';

// User Pages
import UserDashboard from './pages/user/Dashboard';
import UserProfile from './pages/user/Profile';
import UserOrders from './pages/user/Orders';
import UserSettings from './pages/user/Settings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedTypes={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="pos" element={<POS />} />
            <Route path="vendors" element={<Vendors />} />
            <Route path="users" element={<Users />} />
            <Route path="events" element={<Events />} />
            <Route path="reports" element={<Reports />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="support" element={<Support />} />
          </Route>

          {/* Vendor Routes */}
          <Route path="/vendor" element={
            <ProtectedRoute allowedTypes={['vendor']}>
              <VendorLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/vendor/dashboard" replace />} />
            <Route path="dashboard" element={<VendorDashboard />} />
          </Route>

          {/* User Routes */}
          <Route path="/user" element={
            <ProtectedRoute allowedTypes={['user']}>
              <UserLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/user/dashboard" replace />} />
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="orders" element={<UserOrders />} />
            <Route path="settings" element={<UserSettings />} />
          </Route>

          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="solutions" element={<Solutions />} />
            <Route path="developers" element={<Developers />} />
            <Route path="resources" element={<Resources />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="signup" element={<VendorSignupForm />} />
            <Route path="careers" element={<Careers />} />
            <Route path="about" element={<About />} />
            <Route path="customers" element={<Customers />} />
            <Route path="contact" element={<Contact />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
