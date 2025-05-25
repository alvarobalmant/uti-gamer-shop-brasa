
import { useState } from 'react';
import { Search, Menu, X, ShoppingCart, User, MapPin, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';

interface MobileHeaderProps {
  onSearchSubmit: (query: string) => void;
}

const MobileHeader = ({ onSearchSubmit }: MobileHeaderProps) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { getCartItemsCount } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const menuItems = [
    { label: 'PlayStation', path: '/categoria/playstation', icon: '🎮' },
    { label: 'Xbox', path: '/categoria/xbox', icon: '🎯' },
    { label: 'Nintendo', path: '/categoria/nintendo', icon: '🍄' },
    { label: 'PC Gaming', path: '/categoria/pc', icon: '💻' },
    { label: 'Acessórios', path: '/categoria/acessorios', icon: '🎧' },
    { label: 'Colecionáveis', path: '/categoria/colecionaveis', icon: '🏆' }
  ];

  return (
    <>
      {/* Main Header */}
      <header className="header-premium sticky top-0 z-50 lg:hidden">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Menu Button */}
            <button
              onClick={() => setShowMenu(true)}
              className="p-2 -ml-2 focus-premium"
            >
              <Menu className="w-6 h-6 text-uti-black" />
            </button>

            {/* Logo */}
            <div 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <img 
                src="/lovable-uploads/a514a032-d79a-4bc4-a10e-3c9f0f9cde73.png" 
                alt="UTI DOS GAMES" 
                className="h-8 w-8"
              />
              <div>
                <span className="text-lg font-bold text-uti-black">UTI DOS GAMES</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 focus-premium"
              >
                <Search className="w-6 h-6 text-uti-black" />
              </button>

              <button
                onClick={() => navigate('/carrinho')}
                className="relative p-2 focus-premium"
              >
                <ShoppingCart className="w-6 h-6 text-uti-black" />
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-uti-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {getCartItemsCount()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Overlay */}
        {showSearch && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-uti-gray-100 p-4">
            <form onSubmit={handleSearch} className="flex items-center space-x-3">
              <input
                type="text"
                placeholder="Buscar jogos, consoles, acessórios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-premium flex-1 h-12 text-base"
                autoFocus
              />
              <button 
                type="submit" 
                className="btn-primary-premium px-6 h-12 shrink-0"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setShowSearch(false)}
                className="btn-ghost-premium h-12 px-3 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Menu Overlay */}
      {showMenu && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setShowMenu(false)}
          />
          <div className="fixed top-0 left-0 w-80 h-full bg-white z-50 overflow-y-auto"
               style={{ boxShadow: 'var(--shadow-premium-xl)' }}>
            
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-uti-gray-100">
              <div className="flex items-center space-x-2">
                <img 
                  src="/lovable-uploads/a514a032-d79a-4bc4-a10e-3c9f0f9cde73.png" 
                  alt="UTI DOS GAMES" 
                  className="h-8 w-8"
                />
                <span className="text-lg font-bold text-uti-black">Menu</span>
              </div>
              <button
                onClick={() => setShowMenu(false)}
                className="p-2 focus-premium"
              >
                <X className="w-6 h-6 text-uti-black" />
              </button>
            </div>

            {/* Contact Info */}
            <div className="p-4 bg-uti-gray-50 border-b border-uti-gray-100">
              <div className="flex items-center space-x-2 text-sm text-uti-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span>Colatina - ES</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-uti-gray-600">
                <Phone className="w-4 h-4" />
                <span>(27) 99688-2090</span>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-4">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    navigate(item.path);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center space-x-4 px-6 py-4 text-left hover:bg-uti-gray-50 transition-colors focus-premium"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-base font-medium text-uti-black">{item.label}</span>
                </button>
              ))}
            </div>

            {/* User Actions */}
            <div className="p-4 border-t border-uti-gray-100 space-y-3">
              <button
                onClick={() => {
                  navigate('/conta');
                  setShowMenu(false);
                }}
                className="w-full flex items-center justify-center space-x-2 bg-uti-gray-100 hover:bg-uti-gray-300 text-uti-black font-medium py-3 rounded-lg transition-colors focus-premium"
              >
                <User className="w-5 h-5" />
                <span>Minha Conta</span>
              </button>
              <button
                onClick={() => {
                  navigate('/carrinho');
                  setShowMenu(false);
                }}
                className="btn-primary-premium w-full flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Carrinho ({getCartItemsCount()})</span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MobileHeader;
