
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '@/components/Admin/AdminLayout';
import ProductManager from '@/components/Admin/ProductManager';
import ProductImageManager from '@/pages/Admin/ProductImageManager';

const AdminDashboard = () => {
  return (
    <Routes>
      <Route path="/*" element={<AdminLayout />}>
        <Route index element={<ProductManager />} />
        <Route path="products" element={<ProductManager />} />
        <Route path="images" element={<ProductImageManager />} />
      </Route>
    </Routes>
  );
};

export default AdminDashboard;
