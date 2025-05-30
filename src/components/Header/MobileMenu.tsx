
import { useEffect } from 'react'; // Import useEffect
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
    } else {
      document.body.style.overflow = '';
    }
    // Cleanup function to reset overflow when component unmounts or isOpen changes
    return () => {
      document.body.style.overflow = '';
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

  // Do not render anything if not open (improves performance slightly)
  // The transition control is handled by the parent managing isOpen state
  // if (!isOpen) return null; 
  // Keep rendering structure for transitions

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 md:hidden transition-opacity duration-300 ease-in-out",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none" // Control visibility via opacity
      )}
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose} 
        aria-hidden="true"
      />
      
      {/* Menu Panel - Slide in from left, 80% width, max-w-xs, full height */}
      <div 
        className={cn(
          "fixed top-0 left-0 h-full w-4/5 max-w-xs bg-white shadow-xl flex flex-col transition-transform duration-300 ease-in-out", // Restored width constraints
          isOpen ? "translate-x-0" : "-translate-x-full" // Control slide via transform
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/ad4a0480-9a16-4bb6-844b-c579c660c65d.png" 
              alt="UTI DOS GAMES Logo" 
              className="h-8 w-auto"
            />
            <span id="mobile-menu-title" className="font-bold text-lg text-gray-900">Menu</span>
          </div>
          <Button onClick={onClose} variant="ghost" size="icon" className="text-gray-600 hover:text-red-600 hover:bg-red-50">
            <X className="w-6 h-6" />
            <span className="sr-only">Fechar menu</span>
          </Button>
        </div>

        {/* Scrollable Content Area */} 
        <ScrollArea className="flex-grow">
          <div className="p-4 space-y-6"> {/* Increased spacing */}
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
                    className="w-full h-11 text-base" // Increased height and text size
                  >
                    {isAdmin ? 'Painel Admin' : 'Gerenciar Conta'}
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleAuthClick}
                  className="w-full bg-red-600 hover:bg-red-700 h-11 text-base" // Increased height and text size
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
                className="w-full justify-start h-11 text-base px-3" // Increased height, text size, padding
              >
                <Home className="w-5 h-5 mr-3" />
                Início
              </Button>

              {/* UTI PRO Link */}
              <Button
                onClick={() => handleNavigation('/uti-pro')}
                variant="ghost"
                className="w-full justify-start h-11 text-base px-3 bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-300 text-yellow-800 hover:bg-yellow-200 hover:text-yellow-900"
              >
                <Crown className="w-5 h-5 mr-3" />
                UTI PRO
              </Button>
            </div>

            {/* Categories */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-lg px-3">
                <Grid className="w-5 h-5" />
                Categorias
              </h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    onClick={() => handleNavigation(category.path)}
                    variant="ghost"
                    className="w-full justify-start h-11 text-base px-3 text-gray-700 hover:text-red-600 hover:bg-red-50" // Increased height, text size, padding
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default MobileMenu;

