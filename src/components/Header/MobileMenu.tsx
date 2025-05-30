
import { X, User, Crown, Home, Grid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { categories } from './categories';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthOpen: () => void;
}

const MobileMenu = ({ isOpen, onClose, onAuthOpen }: MobileMenuProps) => {
  const { user, isAdmin } = useAuth();
  const { hasActiveSubscription } = useSubscriptions();
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (user) {
      if (isAdmin) {
        navigate('/admin');
        onClose();
      } else {
        onAuthOpen();
      }
    } else {
      onAuthOpen();
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop with proper opacity */}
      <div 
        className="fixed inset-0 bg-black/60 transition-opacity duration-300"
        onClick={handleBackdropClick}
      />
      
      {/* Menu Panel - Better sizing and positioning */}
      <div className={`
        fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header with proper contrast */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/ad4a0480-9a16-4bb6-844b-c579c660c65d.png" 
              alt="UTI DOS GAMES" 
              className="h-8 w-8"
            />
            <span className="font-bold text-gray-900 text-lg">Menu</span>
          </div>
          <Button onClick={onClose} variant="ghost" size="icon" className="hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-600" />
          </Button>
        </div>

        {/* Scrollable Content with proper spacing */}
        <div className="flex-grow overflow-y-auto p-4 space-y-6 bg-white">
          {/* User Section with better styling */}
          <div className="border-b border-gray-200 pb-4">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">Logado como:</p>
                    <p className="text-gray-600 text-xs truncate">{user.email}</p>
                  </div>
                </div>
                
                {hasActiveSubscription() && (
                  <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-300 rounded-lg p-3">
                    <Crown className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm font-bold text-yellow-800">Membro UTI PRO</span>
                  </div>
                )}
                
                <Button
                  onClick={handleAuthClick}
                  variant="outline"
                  size="sm"
                  className="w-full border-red-200 text-red-600 hover:bg-red-50"
                >
                  {isAdmin ? 'Painel Admin' : 'Gerenciar Conta'}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <User className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-600 text-sm">Faça login para acessar sua conta</p>
                </div>
                <Button
                  onClick={handleAuthClick}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  Entrar / Cadastrar
                </Button>
              </div>
            )}
          </div>

          {/* Navigation with better spacing */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide mb-3">
              Navegação
            </h3>
            
            <Button
              onClick={() => handleNavigation('/')}
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:bg-gray-100 h-12"
            >
              <Home className="w-5 h-5 mr-3" />
              <span className="font-medium">Início</span>
            </Button>

            <Button
              onClick={() => handleNavigation('/uti-pro')}
              variant="ghost"
              className="w-full justify-start bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 text-yellow-800 hover:bg-yellow-200 h-12"
            >
              <Crown className="w-5 h-5 mr-3" />
              <span className="font-medium">UTI PRO</span>
            </Button>
          </div>

          {/* Categories with better organization */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
              <Grid className="w-4 h-4" />
              Categorias
            </h3>
            <div className="grid grid-cols-1 gap-1">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  onClick={() => handleNavigation(category.path)}
                  variant="ghost"
                  className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50 h-11"
                >
                  <span className="font-medium">{category.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
