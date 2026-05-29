import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

export default function ProtectedRoute({ children, requireRole }) {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ padding: '2rem' }}>Carregando...</div>;
  if (!user || (requireRole && user.role !== requireRole)) {
    return <Navigate to="/backoffice" replace />;
  }

  return children;
}
