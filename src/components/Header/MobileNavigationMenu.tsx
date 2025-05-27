
import { X, User, Crown, Home, Gamepad2, ShoppingBag, Percent, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useSubscriptions } from '@/hooks/useSubscriptions';

interface MobileNavigationMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthOpen: () => void;
}

const MobileNavigationMenu = ({ isOpen, onClose, onAuthOpen }: MobileNavigationMenuProps) => {
  const { user, isAdmin, signOut } = useAuth();
  const { hasActiveSubscription } = useSubscriptions();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

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

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  const mainNavItems = [
    { icon: Home, label: 'Início', path: '/' },
    { icon: Gamepad2, label: 'PlayStation', path: '/categoria/playstation' },
    { icon: Gamepad2, label: 'Nintendo', path: '/categoria/nintendo' },
    { icon: Gamepad2, label: 'Xbox', path: '/categoria/xbox' },
    { icon: Gamepad2, label: 'PC Gaming', path: '/categoria/pc' },
    { icon: ShoppingBag, label: 'Acessórios', path: '/categoria/acessorios' },
    { icon: Star, label: 'Colecionáveis', path: '/categoria/colecionaveis' },
    { icon: Percent, label: 'Ofertas', path: '/categoria/ofertas' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      {/* Menu Panel */}
      <div className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-xl overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/ad4a0480-9a16-4bb6-844b-c579c660c65d.png" 
              alt="UTI DOS GAMES" 
              className="h-8 w-8"
            />
            <span className="font-bold text-gray-900 text-lg">Menu</span>
          </div>
          <Button 
            onClick={onClose} 
            variant="ghost" 
            size="sm"
            className="p-2 min-h-[48px] min-w-[48px] hover:bg-gray-200"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4">
          {/* User Section */}
          <div className="border-b pb-6 mb-6">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-600" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 truncate">{user.email}</div>
                    {hasActiveSubscription() && (
                      <div className="flex items-center gap-1 text-xs text-yellow-700">
                        <Crown className="w-3 h-3" />
                        Membro UTI PRO
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button
                    onClick={handleAuthClick}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start min-h-[48px]"
                  >
                    {isAdmin ? 'Painel Admin' : 'Gerenciar Conta'}
                  </Button>
                  
                  <Button
                    onClick={handleSignOut}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 min-h-[48px]"
                  >
                    Sair da Conta
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={handleAuthClick}
                className="w-full bg-red-600 hover:bg-red-700 min-h-[48px] text-base"
              >
                <User className="w-5 h-5 mr-2" />
                Entrar / Cadastrar
              </Button>
            )}
          </div>

          {/* UTI PRO Section */}
          {!hasActiveSubscription() && (
            <div className="mb-6">
              <Button
                onClick={() => handleNavigation('/uti-pro')}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 hover:from-yellow-500 hover:to-yellow-600 min-h-[48px] text-base font-bold"
              >
                <Crown className="w-5 h-5 mr-2" />
                Conheça o UTI PRO
              </Button>
            </div>
          )}

          {/* Navigation Links */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 mb-3 text-base">Navegação</h3>
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50 min-h-[48px] text-base"
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Button>
              );
            })}
          </div>

          {/* Contact Info */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="font-semibold text-gray-900 mb-3 text-base">Contato</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div>📱 (27) 99688-2090</div>
              <div>🕒 Seg à Sex: 9h às 18h</div>
              <div>📍 Colatina - ES</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNavigationMenu;
