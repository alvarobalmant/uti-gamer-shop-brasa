
import { useState } from 'react';
import { Menu, Search, User, ShoppingCart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import GlobalCartIcon from '@/components/GlobalCart/GlobalCartIcon';
import MobileNavigationMenu from './MobileNavigationMenu';

interface MobileHeaderProps {
  onAuthOpen: () => void;
}

const MobileHeader = ({ onAuthOpen }: MobileHeaderProps) => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { hasActiveSubscription } = useSubscriptions();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent body scroll when menu is open
    document.body.style.overflow = isMenuOpen ? 'unset' : 'hidden';
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'unset';
  };

  const handleSearchToggle = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setTimeout(() => {
        const searchInput = document.getElementById('mobile-search-input');
        searchInput?.focus();
      }, 100);
    } else {
      setSearchQuery('');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/busca?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchExpanded(false);
      setSearchQuery('');
    }
  };

  const handleLogin = () => {
    if (user) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        onAuthOpen();
      }
    } else {
      onAuthOpen();
    }
  };

  if (isSearchExpanded) {
    return (
      <header className="bg-white shadow-lg sticky top-0 z-50 lg:hidden">
        <div className="px-4 py-3">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="mobile-search-input"
                type="text"
                placeholder="Buscar jogos, consoles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 h-12 bg-gray-50 border-gray-200 focus:bg-white text-base"
              />
            </div>
            <Button
              type="button"
              onClick={handleSearchToggle}
              variant="ghost"
              size="sm"
              className="p-3 min-h-[48px] min-w-[48px]"
            >
              <X className="w-5 h-5 text-gray-600" />
            </Button>
          </form>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="bg-white shadow-lg sticky top-0 z-50 lg:hidden">
        {/* Top info bar - Compact for mobile */}
        <div className="bg-red-600 text-white py-2 px-4">
          <div className="flex items-center justify-center text-sm font-medium">
            <span className="truncate">📱 (27) 99688-2090 | 🚚 Frete Grátis Colatina</span>
          </div>
        </div>

        {/* Main header */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Hamburger Menu */}
            <Button
              onClick={handleMenuToggle}
              variant="ghost"
              size="sm"
              className="p-2 min-h-[48px] min-w-[48px] hover:bg-gray-100"
              aria-label="Menu de navegação"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </Button>

            {/* Logo - Compact for mobile */}
            <div 
              className="flex items-center cursor-pointer flex-1 justify-center"
              onClick={() => navigate('/')}
            >
              <img 
                src="/lovable-uploads/ad4a0480-9a16-4bb6-844b-c579c660c65d.png" 
                alt="UTI DOS GAMES" 
                className="h-10 w-10 mr-2" 
              />
              <div className="text-center">
                <h1 className="text-base font-black text-gray-900 leading-tight">
                  UTI DOS GAMES
                </h1>
                <p className="text-xs text-gray-600 leading-none -mt-0.5">
                  Loja de games
                </p>
              </div>
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-2">
              {/* Search Icon */}
              <Button
                onClick={handleSearchToggle}
                variant="ghost"
                size="sm"
                className="p-2 min-h-[48px] min-w-[48px] hover:bg-gray-100"
                aria-label="Buscar produtos"
              >
                <Search className="w-5 h-5 text-gray-700" />
              </Button>

              {/* User Account */}
              <Button
                onClick={handleLogin}
                variant="ghost"
                size="sm"
                className="p-2 min-h-[48px] min-w-[48px] hover:bg-gray-100 relative"
                aria-label={user ? (isAdmin ? 'Painel Admin' : 'Minha conta') : 'Entrar'}
              >
                <User className="w-5 h-5 text-gray-700" />
                {hasActiveSubscription() && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full"></div>
                )}
              </Button>

              {/* Shopping Cart */}
              <GlobalCartIcon />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      <MobileNavigationMenu 
        isOpen={isMenuOpen} 
        onClose={closeMenu}
        onAuthOpen={onAuthOpen}
      />
    </>
  );
};

export default MobileHeader;
