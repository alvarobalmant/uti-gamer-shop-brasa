
import { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, Menu, X, User, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { SearchSuggestions } from '@/components/SearchSuggestions';
import { useIsMobile } from '@/hooks/use-mobile';

const PremiumHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const { getCartItemsCount } = useCart();
  const { user, logout } = useAuth();
  const searchRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const cartItemsCount = getCartItemsCount();

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/busca?q=${encodeURIComponent(searchTerm.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSearchSelect = (term: string) => {
    setSearchTerm(term);
    navigate(`/busca?q=${encodeURIComponent(term)}`);
    setShowSuggestions(false);
  };

  const navigationItems = [
    { name: 'PlayStation', path: '/categoria/playstation' },
    { name: 'Xbox', path: '/categoria/xbox' },
    { name: 'Nintendo', path: '/categoria/nintendo' },
    { name: 'PC Gaming', path: '/categoria/pc' },
    { name: 'Acessórios', path: '/categoria/acessorios' },
    { name: 'Colecionáveis', path: '/categoria/colecionaveis' }
  ];

  const announcements = [
    '🎮 Mais de 10 anos servindo a comunidade gamer de Colatina',
    '🏪 Loja física com assistência técnica especializada',
    '📱 WhatsApp: (27) 99688-2090 - Atendimento de Seg à Sex',
    '🚚 Entrega rápida em Colatina e região',
    '💳 Parcelamento em até 12x sem juros'
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Announcement Bar */}
      <div className="bg-red-600 text-white py-2 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex animate-marquee whitespace-nowrap">
            {announcements.map((announcement, index) => (
              <span key={index} className="mx-8 text-sm font-medium">
                {announcement}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate('/')} className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/a514a032-d79a-4bc4-a10e-3c9f0f9cde73.png" 
                alt="UTI DOS GAMES" 
                className="h-8 w-8 md:h-10 md:w-10" 
              />
              <div className="hidden sm:block">
                <h1 className="text-lg md:text-xl font-bold text-red-600">UTI DOS GAMES</h1>
                <p className="text-xs text-gray-600">A vanguarda gamer de Colatina</p>
              </div>
              {/* Mobile Title - Smaller Size */}
              <div className="block sm:hidden">
                <h1 className="text-sm font-bold text-red-600">UTI DOS GAMES</h1>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden lg:flex space-x-8">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200"
                >
                  {item.name}
                </button>
              ))}
            </nav>
          )}

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4 relative" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>

            {/* Search Suggestions */}
            {showSuggestions && searchTerm && (
              <SearchSuggestions
                query={searchTerm}
                onSelect={handleSearchSelect}
                onClose={() => setShowSuggestions(false)}
              />
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Contact Info - Desktop Only */}
            {!isMobile && (
              <div className="hidden lg:flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>Colatina - ES</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="h-4 w-4" />
                  <span>(27) 99688-2090</span>
                </div>
              </div>
            )}

            {/* User Account */}
            {user ? (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-gray-700 hover:text-red-600"
                >
                  <User className="h-4 w-4 mr-1" />
                  {!isMobile && 'Sair'}
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
                className="text-gray-700 hover:text-red-600"
              >
                <User className="h-4 w-4 mr-1" />
                {!isMobile && 'Entrar'}
              </Button>
            )}

            {/* Cart */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/carrinho')}
              className="relative text-gray-700 hover:text-red-600"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Button>

            {/* Mobile Menu Toggle */}
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-red-600"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobile && isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2 pt-4">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    setIsMenuOpen(false);
                  }}
                  className="text-left px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  {item.name}
                </button>
              ))}
              
              {/* Mobile Contact Info */}
              <div className="px-4 py-2 text-sm text-gray-600 border-t border-gray-200 mt-2 pt-4">
                <div className="flex items-center space-x-2 mb-1">
                  <MapPin className="h-4 w-4" />
                  <span>Colatina - ES</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>(27) 99688-2090</span>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default PremiumHeader;
