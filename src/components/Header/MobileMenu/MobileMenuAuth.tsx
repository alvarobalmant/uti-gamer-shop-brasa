
import { User, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useSubscriptions } from '@/hooks/useSubscriptions';

interface MobileMenuAuthProps {
  onAuthClick: () => void;
}

const MobileMenuAuth = ({ onAuthClick }: MobileMenuAuthProps) => {
  const { user, isAdmin } = useAuth();
  const { hasActiveSubscription } = useSubscriptions();

  if (!user) {
    return (
      <Button
        onClick={onAuthClick}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-medium"
      >
        <User className="w-5 h-5 mr-2" />
        Entrar / Cadastrar
      </Button>
    );
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-medium text-gray-900">Olá!</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>
      {hasActiveSubscription() && (
        <div className="flex items-center gap-2 bg-yellow-100 p-2 rounded-lg mb-3">
          <Crown className="w-4 h-4 text-yellow-600" />
          <span className="text-sm font-medium text-yellow-800">Membro UTI PRO</span>
        </div>
      )}
      <Button
        onClick={onAuthClick}
        variant="outline"
        className="w-full"
      >
        {isAdmin ? 'Painel Admin' : 'Gerenciar Conta'}
      </Button>
    </div>
  );
};

export default MobileMenuAuth;
