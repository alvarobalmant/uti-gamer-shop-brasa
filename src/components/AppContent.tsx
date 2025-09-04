import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import ProductPage from '@/pages/ProductPage';
import AdminPage from '@/pages/AdminPage';

const AppContent: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
};

export default AppContent;