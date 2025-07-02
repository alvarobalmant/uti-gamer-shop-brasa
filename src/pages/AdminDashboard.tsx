
// @ts-nocheck
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '@/components/Admin/AdminLayout';
import ProductManager from '@/components/Admin/ProductManager';

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<ProductManager />} />
        <Route path="/products" element={<ProductManager />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;
