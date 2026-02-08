import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  // Cek Autentikasi
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Cek Role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'technician') {
        return <Navigate to="/technician" replace />;
    } else if (user.role === 'admin') {
        return <Navigate to="/admin" replace />;
    } else {
        return <Navigate to="/" replace />;
    }
  }

  // Redirect default route for technician
  if (location.pathname === '/' && user.role === 'technician') {
    return <Navigate to="/technician" replace />;
  }

  return children;
};

export default ProtectedRoute;