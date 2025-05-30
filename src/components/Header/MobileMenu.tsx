
import { useEffect } from 'react';
import { X, User, Crown, Home, Grid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { categories } from './categories';
import { ScrollArea } from '@/components/ui/scroll-area';
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

  // Render even when closed for smooth transitions
  return (
    <div 
      className={cn(
        "fixed inset-0 z-[100] md:hidden transition-all duration-300 ease-in-out",
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      )}
    >
      {/* Full screen backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm" 
        onClick={onClose} 
        aria-hidden="true"
      />
      
      {/* Menu Panel - Full height, slides from left */}
      <div 
        className={cn(
          "absolute top-0 left-0 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out overflow-hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        {/* Header - Fixed at top */}
        <div className="flex items-center justify-between p-4 border-b bg-white flex-shrink-0 min-h-[64px]">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/ad4a0480-9a16-4bb6-844b-c579c660c65d.png" 
              alt="UTI DOS GAMES Logo" 
              className="h-8 w-auto"
            />
            <span id="mobile-menu-title" className="font-bold text-lg text-gray-900">Menu</span>
          </div>
          <Button 
            onClick={onClose} 
            variant="ghost" 
            size="icon" 
            className="text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full w-10 h-10"
          >
            <X className="w-6 h-6" />
            <span className="sr-only">Fechar menu</span>
          </Button>
        </div>

        {/* Scrollable Content - Takes remaining space */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="p-4 space-y-6">
            {/* User Section */}
            <div className="border-b pb-4">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-800 truncate">{user.email}</span>
                  </div>
                  {hasActiveSubscription() && (
                    <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-300 rounded-lg p-2">
                      <Crown className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm font-bold text-yellow-800">Membro UTI PRO</span>
                    </div>
                  )}
                  <Button
                    onClick={handleAuthClick}
                    variant="outline"
                    className="w-full h-12 text-base"
                  >
                    {isAdmin ? 'Painel Admin' : 'Gerenciar Conta'}
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleAuthClick}
                  className="w-full bg-red-600 hover:bg-red-700 h-12 text-base"
                >
                  <User className="w-5 h-5 mr-2" />
                  Entrar / Cadastrar
                </Button>
              )}
            </div>

            {/* Navigation */}
            <div className="space-y-2">
              <Button
                onClick={() => handleNavigation('/')}
                variant="ghost"
                className="w-full justify-start h-12 text-base px-4"
              >
                <Home className="w-5 h-5 mr-3" />
                Início
              </Button>

              <Button
                onClick={() => handleNavigation('/uti-pro')}
                variant="ghost"
                className="w-full justify-start h-12 text-base px-4 bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-300 text-yellow-800 hover:bg-yellow-200 hover:text-yellow-900"
              >
                <Crown className="w-5 h-5 mr-3" />
                UTI PRO
              </Button>
            </div>

            {/* Categories */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-lg px-4">
                <Grid className="w-5 h-5" />
                Categorias
              </h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    onClick={() => handleNavigation(category.path)}
                    variant="ghost"
                    className="w-full justify-start h-12 text-base px-4 text-gray-700 hover:text-red-600 hover:bg-red-50"
                  >
                    {category.name}
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
