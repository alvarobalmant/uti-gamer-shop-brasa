
import { useAuth } from '@/hooks/useAuth';
import { AdminPanel } from '@/components/Admin/AdminPanel';
import { LoginPage } from '@/components/Auth/LoginPage';

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Acesso Negado</h1>
          <p className="text-gray-400">Você não tem permissão para acessar esta área.</p>
        </div>
      </div>
    );
  }

  return <AdminPanel />;
};

export default Admin;
