import React from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';

const AdminPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Painel Administrativo</h1>
        <p>Sistema administrativo carregado com sucesso.</p>
      </div>
    </AdminLayout>
  );
};

export default AdminPage;