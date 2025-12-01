import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('weglowUser'));
  const token = localStorage.getItem('adminToken');

  // Check if user exists, has admin role, and has a token
  const isAdmin = user && user.role === "admin" && token;

  return isAdmin ? children : <Navigate to="/login" replace />;
};

export default ProtectedAdminRoute;
