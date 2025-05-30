
import { useEffect } from 'react';
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

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [isOpen]);

  const handleAuthClick = () => {
    if (user) {
      if (isAdmin) {
        navigate('/admin');
        onClose();
      } else {
        onAuthOpen();
        onClose();
      }
    } else {
      onAuthOpen();
      onClose();
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Full screen backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[9999]" onClick={onClose} />
      
      {/* Menu modal - positioned like in the image */}
      <div className="fixed top-0 left-4 right-4 bottom-20 bg-white z-[9999] rounded-b-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header - matches the image design */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/ad4a0480-9a16-4bb6-844b-c579c660c65d.png" 
              alt="UTI DOS GAMES" 
              className="h-8 w-8"
            />
            <h2 className="font-bold text-lg text-gray-900">Menu</h2>
          </div>
          <Button 
            onClick={onClose} 
            variant="ghost" 
            size="icon"
            className="text-gray-500 hover:text-gray-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Menu content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Login/Register Button - Red background like in image */}
          {!user ? (
            <Button
              onClick={handleAuthClick}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-medium"
            >
              <User className="w-5 h-5 mr-2" />
              Entrar / Cadastrar
            </Button>
          ) : (
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
                onClick={handleAuthClick}
                variant="outline"
                className="w-full"
              >
                {isAdmin ? 'Painel Admin' : 'Gerenciar Conta'}
              </Button>
            </div>
          )}

          {/* Home button */}
          <Button
            onClick={() => handleNavigation('/')}
            variant="ghost"
            className="w-full justify-start p-4 h-auto text-left"
          >
            <Home className="w-5 h-5 mr-3 text-gray-600" />
            <span className="font-medium text-gray-900">Início</span>
          </Button>

          {/* UTI PRO button - Yellow background like in image */}
          <Button
            onClick={() => handleNavigation('/uti-pro')}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-4 rounded-lg font-medium justify-start"
          >
            <Crown className="w-5 h-5 mr-3" />
            UTI PRO
          </Button>

          {/* Categories section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-2 py-2">
              <Grid className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Categorias</h3>
            </div>
            
            <div className="pl-7 space-y-1">
              {/* Início */}
              <Button
                onClick={() => handleNavigation('/')}
                variant="ghost"
                className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-50 py-2"
              >
                Início
              </Button>

              {/* Categories from the image */}
              {categories.map((category) => (
                <Button
                  key={category.id}
                  onClick={() => handleNavigation(category.path)}
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-50 py-2"
                >
                  {category.name}
                </Button>
              ))}

              {/* UTI PRO at the bottom of categories */}
              <Button
                onClick={() => handleNavigation('/uti-pro')}
                variant="ghost"
                className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-50 py-2"
              >
                UTI PRO
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
