
import { useState } from 'react';
import { Search, Menu, X, ShoppingCart, User, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    { label: 'Assistência Técnica', path: '/servicos', icon: '🔧' },
    { label: 'Trade-in', path: '/trade-in', icon: '🔄' }
  ];

  return (
    <>
      {/* Main Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 lg:hidden">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMenu(true)}
              className="p-2"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </Button>

            {/* Logo */}
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/a514a032-d79a-4bc4-a10e-3c9f0f9cde73.png" 
                alt="UTI DOS GAMES" 
                className="h-8 w-8"
              />
              <span className="text-lg font-bold text-gray-900">UTI DOS GAMES</span>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSearch(true)}
                className="p-2"
              >
                <Search className="w-6 h-6 text-gray-700" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/carrinho')}
                className="relative p-2"
              >
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {getCartItemsCount()}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Search Overlay */}
        {showSearch && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 p-4 shadow-lg">
            <form onSubmit={handleSearch} className="flex items-center space-x-3">
              <Input
                type="text"
                placeholder="Buscar jogos, consoles, acessórios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 h-12 text-base"
                autoFocus
              />
              <Button type="submit" className="bg-red-600 hover:bg-red-700 px-6 h-12">
                <Search className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowSearch(false)}
                className="h-12 px-3"
              >
                <X className="w-5 h-5" />
              </Button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Menu Overlay */}
      {showMenu && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowMenu(false)}
          />
          <div className="fixed top-0 left-0 w-80 h-full bg-white z-50 shadow-2xl overflow-y-auto">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <img 
                  src="/lovable-uploads/a514a032-d79a-4bc4-a10e-3c9f0f9cde73.png" 
                  alt="UTI DOS GAMES" 
                  className="h-8 w-8"
                />
                <span className="text-lg font-bold text-gray-900">Menu</span>
              </div>
              <Button
                variant="ghost"
                onClick={() => setShowMenu(false)}
                className="p-2"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Contact Info */}
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span>Colatina - ES</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
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
                  className="w-full flex items-center space-x-4 px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-base font-medium text-gray-900">{item.label}</span>
                </button>
              ))}
            </div>

            {/* User Actions */}
            <div className="p-4 border-t border-gray-200 space-y-3">
              <Button
                onClick={() => {
                  navigate('/conta');
                  setShowMenu(false);
                }}
                className="w-full bg-gray-100 text-gray-900 hover:bg-gray-200"
              >
                <User className="w-5 h-5 mr-2" />
                Minha Conta
              </Button>
              <Button
                onClick={() => {
                  navigate('/carrinho');
                  setShowMenu(false);
                }}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Carrinho ({getCartItemsCount()})
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MobileHeader;
