
import React from 'react';
import { Navigate } from 'react-router-dom';

// Redirect to login page since we now have a unified auth page
const RegisterPage = () => {
  return <Navigate to="/login" replace />;
};

export default RegisterPage;
