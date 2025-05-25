
import { useState, useRef, useEffect } from 'react';
import { Search, User, ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { AuthModal } from '@/components/Auth/AuthModal';
import { useIsMobile } from '@/hooks/use-mobile';
import SearchSuggestions from '@/components/SearchSuggestions';

const PremiumHeader = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { user, isAdmin, signOut } = useAuth();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const cartItemsCount = getCartItemsCount();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/busca?q=${encodeURIComponent(searchTerm.trim())}`);
      setShowSearchSuggestions(false);
      setShowMobileSearch(false);
    }
  };

  const handleUserAction = () => {
    if (user) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        signOut();
      }
    } else {
      setShowAuthModal(true);
    }
  };

  const categories = [
    {
      name: 'PlayStation',
      subcategories: ['PlayStation 5', 'PlayStation 4', 'Jogos PS5', 'Jogos PS4', 'Acessórios PS']
    },
    {
      name: 'Xbox',
      subcategories: ['Xbox Series X/S', 'Xbox One', 'Jogos Xbox', 'Game Pass', 'Acessórios Xbox']
    },
    {
      name: 'Nintendo',
      subcategories: ['Nintendo Switch', 'Nintendo Switch OLED', 'Nintendo Switch Lite', 'Jogos Nintendo', 'Acessórios Nintendo']
    },
    {
      name: 'PC Gaming',
      subcategories: ['Periféricos', 'Headsets', 'Teclados', 'Mouses', 'Mousepads']
    }
  ];

  return (
    <>
      {/* Info Bar */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-2">
        <div className="container-premium">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span>📱</span>
                <span>WhatsApp: (27) 99688-2090</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>📍</span>
                <span>Colatina - ES</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span>🕒</span>
                <span>Seg à Sex: 9h às 18h</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>⚡</span>
                <span>+10 Anos de Tradição</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="container-premium">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/a514a032-d79a-4bc4-a10e-3c9f0f9cde73.png" 
                alt="UTI DOS GAMES" 
                className="h-10 w-10 md:h-12 md:w-12"
              />
              {!isMobile && (
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-red-600">UTI DOS GAMES</h1>
                  <p className="text-xs text-gray-600 hidden md:block">A vanguarda gamer de Colatina</p>
                </div>
              )}
            </div>

            {/* Desktop Navigation */}
            {!isMobile && (
              <nav className="hidden lg:flex items-center space-x-8">
                {categories.map((category) => (
                  <div key={category.name} className="relative group">
                    <button 
                      onClick={() => navigate(`/categoria/${category.name.toLowerCase()}`)}
                      className="flex items-center space-x-1 text-gray-700 hover:text-red-600 font-medium py-2 transition-colors duration-200"
                    >
                      <span>{category.name}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    
                    {/* Dropdown */}
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="py-2">
                        {category.subcategories.map((sub) => (
                          <button
                            key={sub}
                            onClick={() => navigate(`/categoria/${sub.toLowerCase().replace(/\s+/g, '-')}`)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </nav>
            )}

            {/* Search Bar - Desktop */}
            {!isMobile && (
              <div className="flex-1 max-w-md mx-8 relative" ref={searchRef}>
                <form onSubmit={handleSearch} className="relative">
                  <Input
                    type="text"
                    placeholder="Buscar jogos, consoles e mais..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowSearchSuggestions(e.target.value.length > 0);
                    }}
                    onFocus={() => searchTerm.length > 0 && setShowSearchSuggestions(true)}
                    className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white px-3"
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </form>
                
                {showSearchSuggestions && (
                  <SearchSuggestions 
                    searchTerm={searchTerm}
                    onSelect={(term) => {
                      setSearchTerm(term);
                      setShowSearchSuggestions(false);
                      navigate(`/busca?q=${encodeURIComponent(term)}`);
                    }}
                    onClose={() => setShowSearchSuggestions(false)}
                  />
                )}
              </div>
            )}

            {/* Right Actions */}
            <div className="flex items-center space-x-3">
              {/* Mobile Search Button */}
              {isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMobileSearch(true)}
                  className="p-2"
                >
                  <Search className="w-5 h-5" />
                </Button>
              )}

              {/* User Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUserAction}
                className="flex items-center space-x-2 p-2"
              >
                <User className="w-5 h-5" />
                {!isMobile && (
                  <span className="text-sm">
                    {user ? (isAdmin ? 'Admin' : 'Sair') : 'Entrar'}
                  </span>
                )}
              </Button>

              {/* Cart Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/carrinho')}
                className="relative p-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {cartItemsCount}
                  </span>
                )}
                {!isMobile && <span className="text-sm ml-2">Carrinho</span>}
              </Button>

              {/* Mobile Menu Button */}
              {isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMobileMenu(true)}
                  className="p-2"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        {showMobileSearch && (
          <div className="fixed inset-0 bg-white z-50">
            <div className="flex items-center p-4 border-b">
              <div className="flex-1 relative" ref={searchRef}>
                <form onSubmit={handleSearch} className="relative">
                  <Input
                    type="text"
                    placeholder="Buscar jogos, consoles e mais..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowSearchSuggestions(e.target.value.length > 0);
                    }}
                    className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg"
                    autoFocus
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white px-3"
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </form>
              </div>
              <Button
                variant="ghost"
                onClick={() => setShowMobileSearch(false)}
                className="ml-2 p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {showSearchSuggestions && (
              <SearchSuggestions 
                searchTerm={searchTerm}
                onSelect={(term) => {
                  setSearchTerm(term);
                  setShowSearchSuggestions(false);
                  setShowMobileSearch(false);
                  navigate(`/busca?q=${encodeURIComponent(term)}`);
                }}
                onClose={() => setShowSearchSuggestions(false)}
              />
            )}
          </div>
        )}

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg overflow-y-auto">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold">Menu</h2>
                <Button
                  variant="ghost"
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="p-4 space-y-4">
                {categories.map((category) => (
                  <div key={category.name} className="space-y-2">
                    <button
                      onClick={() => {
                        navigate(`/categoria/${category.name.toLowerCase()}`);
                        setShowMobileMenu(false);
                      }}
                      className="block w-full text-left font-medium text-gray-900 py-2"
                    >
                      {category.name}
                    </button>
                    <div className="pl-4 space-y-1">
                      {category.subcategories.map((sub) => (
                        <button
                          key={sub}
                          onClick={() => {
                            navigate(`/categoria/${sub.toLowerCase().replace(/\s+/g, '-')}`);
                            setShowMobileMenu(false);
                          }}
                          className="block w-full text-left text-sm text-gray-600 py-1 hover:text-red-600"
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};

export default PremiumHeader;
