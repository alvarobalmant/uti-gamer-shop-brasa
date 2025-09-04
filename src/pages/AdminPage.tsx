import React from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return <div className="admin-layout">{children}</div>;
};

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