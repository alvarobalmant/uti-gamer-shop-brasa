
import { useEffect } from 'react';
import { X, User, Crown, Home, Grid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { categories } from './categories';
import { cn } from '@/lib/utils';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthOpen: () => void;
}

const MobileMenu = ({ isOpen, onClose, onAuthOpen }: MobileMenuProps) => {
  const { user, isAdmin } = useAuth();
  const { hasActiveSubscription } = useSubscriptions();
  const navigate = useNavigate();

  // Effect to lock body scroll when menu is open
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

  // Don't render anything when closed
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] md:hidden">
      {/* Full screen backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose} 
        aria-hidden="true"
      />
      
      {/* Menu Panel - Takes up most of the screen */}
      <div 
        className="absolute inset-x-4 inset-y-8 bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        {/* Header - Fixed at top */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-red-600 to-red-700 text-white">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/ad4a0480-9a16-4bb6-844b-c579c660c65d.png" 
              alt="UTI DOS GAMES Logo" 
              className="h-10 w-auto"
            />
            <div>
              <h2 id="mobile-menu-title" className="font-bold text-xl">UTI DOS GAMES</h2>
              <p className="text-red-100 text-sm">Menu Principal</p>
            </div>
          </div>
          <Button 
            onClick={onClose} 
            variant="ghost" 
            size="icon" 
            className="text-white hover:text-red-200 hover:bg-red-800/50 rounded-full w-12 h-12"
          >
            <X className="w-6 h-6" />
            <span className="sr-only">Fechar menu</span>
          </Button>
        </div>

        {/* Scrollable Content - Takes remaining space */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-8">
            {/* User Section */}
            <div className="bg-gray-50 rounded-xl p-6 border">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-lg">Olá!</p>
                      <p className="text-gray-600 text-sm truncate">{user.email}</p>
                    </div>
                  </div>
                  {hasActiveSubscription() && (
                    <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-300 rounded-xl p-4">
                      <Crown className="w-6 h-6 text-yellow-600" />
                      <div>
                        <p className="font-bold text-yellow-800">Membro UTI PRO</p>
                        <p className="text-xs text-yellow-700">Acesso a benefícios exclusivos</p>
                      </div>
                    </div>
                  )}
                  <Button
                    onClick={handleAuthClick}
                    variant="outline"
                    className="w-full h-14 text-lg font-semibold border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                  >
                    {isAdmin ? 'Painel Admin' : 'Gerenciar Conta'}
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-800 mb-2">Entre na sua conta</h3>
                    <p className="text-gray-600 text-sm mb-4">Acesse sua conta ou crie uma nova</p>
                  </div>
                  <Button
                    onClick={handleAuthClick}
                    className="w-full bg-red-600 hover:bg-red-700 h-14 text-lg font-semibold"
                  >
                    <User className="w-5 h-5 mr-2" />
                    Entrar / Cadastrar
                  </Button>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="space-y-3">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Navegação</h3>
              
              <Button
                onClick={() => handleNavigation('/')}
                variant="ghost"
                className="w-full justify-start h-16 text-lg px-6 bg-gray-50 hover:bg-gray-100 rounded-xl"
              >
                <Home className="w-6 h-6 mr-4 text-red-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Início</p>
                  <p className="text-xs text-gray-600">Página principal</p>
                </div>
              </Button>

              <Button
                onClick={() => handleNavigation('/uti-pro')}
                variant="ghost"
                className="w-full justify-start h-16 text-lg px-6 bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-300 hover:bg-yellow-200 rounded-xl"
              >
                <Crown className="w-6 h-6 mr-4 text-yellow-600" />
                <div className="text-left">
                  <p className="font-semibold text-yellow-800">UTI PRO</p>
                  <p className="text-xs text-yellow-700">Plano premium</p>
                </div>
              </Button>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-3">
                <Grid className="w-6 h-6 text-red-600" />
                Categorias
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    onClick={() => handleNavigation(category.path)}
                    variant="ghost"
                    className="w-full justify-start h-14 text-base px-6 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl border border-gray-200 hover:border-red-200"
                  >
                    <span className="font-medium">{category.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
