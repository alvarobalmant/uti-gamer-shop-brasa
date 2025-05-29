
import { X, User, Crown, Home, Grid, Search } from 'lucide-react';
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden"> {/* Changed sm:hidden to md:hidden to match toggle button */}
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      {/* Menu Panel - Slide in from left */}
      <div className="fixed top-0 left-0 h-full w-4/5 max-w-xs bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/ad4a0480-9a16-4bb6-844b-c579c660c65d.png" 
              alt="UTI DOS GAMES" 
              className="h-8 w-8"
            />
            <span className="font-bold text-gray-900">Menu</span>
          </div>
          <Button onClick={onClose} variant="ghost" size="icon" className="-mr-2">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {/* User Section */}
          <div className="border-b pb-4">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">{user.email}</span>
                </div>
                {hasActiveSubscription() && (
                  <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-300 rounded-lg p-2">
                    <Crown className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-bold text-yellow-800">Membro UTI PRO</span>
                  </div>
                )}
                <Button
                  onClick={handleAuthClick}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  {isAdmin ? 'Painel Admin' : 'Gerenciar Conta'}
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleAuthClick}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                <User className="w-4 h-4 mr-2" />
                Entrar / Cadastrar
              </Button>
            )}
          </div>

          {/* Navigation */}
          <div className="space-y-2">
            <Button
              onClick={() => handleNavigation('/')}
              variant="ghost"
              className="w-full justify-start"
            >
              <Home className="w-4 h-4 mr-2" />
              Início
            </Button>

            {/* UTI PRO Link */}
            <Button
              onClick={() => handleNavigation('/uti-pro')}
              variant="ghost"
              className="w-full justify-start bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-300 text-yellow-800 hover:bg-yellow-200"
            >
              <Crown className="w-4 h-4 mr-2" />
              UTI PRO
            </Button>
          </div>

          {/* Categories */}
          <div className="border-t pt-4">
            <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <Grid className="w-4 h-4" />
              Categorias
            </h3>
            <div className="space-y-1">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  onClick={() => handleNavigation(category.path)}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-gray-600 hover:text-red-600"
                >
                  {category.name}
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
