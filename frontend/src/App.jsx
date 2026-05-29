import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

// Redireciona para o dashboard se já estiver logado como admin
function BackofficeIndex() {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: '2rem' }}>Carregando...</div>;
  if (user?.role === 'admin') return <Navigate to="/backoffice/dashboard" replace />;
  return <LoginPage />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Site — página em branco para os alunos desenvolverem */}
          <Route path="/" element={<div />} />

          {/* Backoffice — área administrativa */}
          <Route path="/backoffice" element={<BackofficeIndex />} />
          <Route
            path="/backoffice/dashboard"
            element={
              <ProtectedRoute requireRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Qualquer outra rota volta para o site */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
