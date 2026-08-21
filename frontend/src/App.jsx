import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import LoadingSpinner from './components/LoadingSpinner';

const Home          = lazy(() => import('./pages/Home'));
const Login         = lazy(() => import('./pages/Login'));
const Register      = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const About = lazy(() => import('./pages/About'));
const Trainers = lazy(() => import('./pages/Trainers'));
const Memberships = lazy(() => import('./pages/Memberships'));
const ApplyMembership = lazy(() => import('./pages/ApplyMembership'));
const Store = lazy(() => import('./pages/Store'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Contact = lazy(() => import('./pages/Contact'));

const PageFallback = () => (
  <div className="loading-screen">
    <div className="spinner" />
  </div>
);

export default function App() {
  return (
    <>
      <Navbar />
      <Toaster position="top-right" />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/about"         element={<About />} />
          <Route path="/trainers"      element={<Trainers />} />
          <Route path="/memberships"   element={<Memberships />} />
          <Route path="/apply-membership/:planId" element={
            <ProtectedRoute><ApplyMembership /></ProtectedRoute>
          } />
          <Route path="/store"         element={<Store />} />
          <Route path="/store/:productId" element={<ProductDetails />} />
          <Route path="/checkout"      element={
            <ProtectedRoute><Checkout /></ProtectedRoute>
          } />
          <Route path="/contact"       element={<Contact />} />
          <Route path="/login"         element={<Login />} />
          <Route path="/register"      element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password"  element={<ResetPassword />} />
          <Route path="/dashboard" element={
            <ProtectedRoute><UserDashboard /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <AdminRoute><AdminDashboard /></AdminRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}
