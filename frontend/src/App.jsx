import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider, useAuth } from './AuthContext.jsx';

import ProtectedRoute from './ProtectedRoute.jsx';

import LoginPage from './pages/LoginPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

import HomePage from './pages/HomePage.jsx';
import ProductDetails from './pages/ProductDetails.jsx';

function BackofficeIndex() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: '2rem' }}>Carregando...</div>;
  }

  if (user?.role === 'admin') {
    return <Navigate to="/backoffice/dashboard" replace />;
  }

  return <LoginPage />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/product/:id" element={<ProductDetails />} />

          <Route path="/backoffice" element={<BackofficeIndex />} />

          <Route
            path="/backoffice/dashboard"
            element={
              <ProtectedRoute requireRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}