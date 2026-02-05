
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '@/components/Admin/AdminLayout';
import ProductManager from '@/components/Admin/ProductManager';
import ProductEasyManager from '@/components/Admin/ProductEasyManager';
import StorageManager from '@/components/Admin/StorageManager';

const AdminDashboard = () => {
  return (
    <Routes>
      <Route path="/*" element={<AdminLayout />}>
        <Route index element={<ProductManager />} />
        <Route path="products" element={<ProductManager />} />
        <Route path="easy-manager" element={<ProductEasyManager />} />
        <Route path="storage" element={<StorageManager />} />
      </Route>
    </Routes>
  );
};

export default AdminDashboard;
