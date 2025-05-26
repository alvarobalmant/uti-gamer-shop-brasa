
import { useState, useRef } from 'react';
import { ShoppingCart, User, Menu, X, Grid3X3, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import SearchSuggestions from '@/components/SearchSuggestions';
import MobileSearchBar from './MobileSearchBar';

interface Category {
  id: string;
  name: string;
  path: string;
  subcategories?: { name: string; path: string; }[];
}

const categories: Category[] = [
  { 
    id: 'inicio', 
    name: 'Início', 
    path: '/' 
  },
  { 
    id: 'playstation', 
    name: 'PlayStation', 
    path: '/categoria/playstation',
    subcategories: [
      { name: 'Console PS5', path: '/categoria/playstation/console' },
      { name: 'Jogos PS5', path: '/categoria/playstation/jogos-ps5' },
      { name: 'Jogos PS4', path: '/categoria/playstation/jogos-ps4' },
      { name: 'Acessórios', path: '/categoria/playstation/acessorios' }
    ]
  },
  { 
    id: 'nintendo', 
    name: 'Nintendo', 
    path: '/categoria/nintendo',
    subcategories: [
      { name: 'Console Switch', path: '/categoria/nintendo/console' },
      { name: 'Jogos Switch', path: '/categoria/nintendo/jogos' },
      { name: 'Acessórios', path: '/categoria/nintendo/acessorios' }
    ]
  },
  { 
    id: 'xbox', 
    name: 'Xbox', 
    path: '/categoria/xbox',
    subcategories: [
      { name: 'Console Xbox', path: '/categoria/xbox/console' },
      { name: 'Jogos Xbox', path: '/categoria/xbox/jogos' },
      { name: 'Game Pass', path: '/categoria/xbox/gamepass' },
      { name: 'Acessórios', path: '/categoria/xbox/acessorios' }
    ]
  },
  { 
    id: 'pc', 
    name: 'PC Gaming', 
    path: '/categoria/pc',
    subcategories: [
      { name: 'Jogos Steam', path: '/categoria/pc/steam' },
      { name: 'Periféricos', path: '/categoria/pc/perifericos' },
      { name: 'Hardware', path: '/categoria/pc/hardware' }
    ]
  },
  { 
    id: 'colecionaveis', 
    name: 'Colecionáveis', 
    path: '/categoria/colecionaveis' 
  },
  { 
    id: 'acessorios', 
    name: 'Acessórios', 
    path: '/categoria/acessorios' 
  },
  { 
    id: 'ofertas', 
    name: 'Ofertas', 
    path: '/categoria/ofertas' 
  }
];

interface ProfessionalHeaderProps {
  onCartOpen: () => void;
  onAuthOpen: () => void;
}

const ProfessionalHeader = ({ onCartOpen, onAuthOpen }: ProfessionalHeaderProps) => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { getCartItemsCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigate(`/busca?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    navigate(`/busca?q=${encodeURIComponent(suggestion)}`);
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

  const handleCategoryClick = (category: Category) => {
    navigate(category.path);
    setMobileMenuOpen(false);
    setHoveredCategory(null);
  };

  // Lock body scroll when mobile menu is open
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (!mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  // Close mobile menu and unlock scroll
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <>
      {/* Top promotional banner */}
      <div className="bg-gradient-to-r from-uti-red to-red-700 text-white py-2 overflow-hidden">
        <div className="container-professional">
          <div className="flex animate-marquee whitespace-nowrap text-sm font-medium">
            <span className="mx-8">📱 WhatsApp: (27) 99688-2090</span>
            <span className="mx-8">🚚 Frete grátis acima de R$ 200</span>
            <span className="mx-8">💳 Parcelamento em até 12x sem juros</span>
            <span className="mx-8">⚡ +10 anos de tradição em Colatina</span>
            <span className="mx-8">🏪 Retire na loja física</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="header-professional sticky top-0 z-50">
        <div className="container-professional">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <img 
                src="/lovable-uploads/a514a032-d79a-4bc4-a10e-3c9f0f9cde73.png" 
                alt="UTI DOS GAMES" 
                className="h-12 w-12 mr-3" 
              />
              <div className="hidden sm:block">
                <h1 className="text-2xl font-black text-uti-dark font-heading">
                  UTI DOS GAMES
                </h1>
                <p className="text-xs text-uti-gray font-medium -mt-1">
                  A loja de games de Colatina
                </p>
              </div>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden lg:block flex-1 max-w-2xl mx-8 relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar jogos, consoles, acessórios..."
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(e.target.value.length > 1);
                  }}
                  onKeyPress={handleSearchKeyPress}
                  onFocus={() => setShowSuggestions(searchQuery.length > 1)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="input-professional pl-12 pr-12 h-12 text-base bg-gray-50 border-gray-200 focus:bg-white"
                />
                <Button
                  onClick={handleSearchSubmit}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-uti-red hover:bg-red-700 text-white px-4 py-2 rounded-md"
                >
                  Buscar
                </Button>
              </div>
              
              <SearchSuggestions
                searchQuery={searchQuery}
                onSelectSuggestion={handleSuggestionSelect}
                onSearch={handleSearchSubmit}
                isVisible={showSuggestions}
              />
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-2">
              {/* Mobile Search */}
              <div className="lg:hidden">
                <MobileSearchBar />
              </div>

              {/* Categories Icon for Mobile */}
              <Button 
                onClick={() => setShowCategories(!showCategories)}
                variant="ghost" 
                className="lg:hidden flex flex-col items-center p-3 text-uti-dark hover:text-uti-red hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                <Grid3X3 className="w-5 h-5" />
                <span className="text-xs font-medium mt-1">Menu</span>
              </Button>

              {/* User Account */}
              <Button 
                onClick={handleLogin} 
                variant="ghost" 
                className="hidden sm:flex flex-col items-center p-3 text-uti-dark hover:text-uti-red hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                <User className="w-5 h-5" />
                <span className="text-xs font-medium mt-1">
                  {user ? (isAdmin ? 'Admin' : 'Conta') : 'Entrar'}
                </span>
              </Button>

              {/* Shopping Cart */}
              <Button 
                onClick={onCartOpen} 
                variant="ghost" 
                className="flex flex-col items-center p-3 text-uti-dark hover:text-uti-red hover:bg-red-50 rounded-lg transition-all duration-200 relative"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="text-xs font-medium mt-1">Carrinho</span>
                {getCartItemsCount() > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-uti-red text-white text-xs px-1.5 min-w-[20px] h-5 flex items-center justify-center rounded-full">
                    {getCartItemsCount()}
                  </Badge>
                )}
              </Button>

              {/* Mobile Menu Toggle */}
              <Button 
                onClick={toggleMobileMenu} 
                variant="ghost" 
                className="sm:hidden flex flex-col items-center p-3 text-uti-dark hover:text-uti-red hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                <Menu className="w-5 h-5" />
                <span className="text-xs font-medium mt-1">Mais</span>
              </Button>
            </div>
          </div>

          {/* Mobile Categories */}
          {showCategories && (
            <div className="lg:hidden border-t border-gray-200 bg-gray-50">
              <div className="container-professional py-4">
                <div className="grid grid-cols-2 gap-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category)}
                      className="text-left py-2 px-3 text-sm font-medium text-uti-dark hover:text-uti-red hover:bg-red-50 rounded-md transition-all duration-200"
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Categories Navigation */}
        <div className="hidden lg:block border-t border-gray-200 bg-gray-50">
          <div className="container-professional">
            <nav className="flex items-center space-x-8 py-4">
              {categories.map(category => (
                <div
                  key={category.id}
                  className="relative group"
                  onMouseEnter={() => setHoveredCategory(category.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <button
                    onClick={() => handleCategoryClick(category)}
                    className="text-uti-dark hover:text-uti-red font-medium text-sm transition-colors duration-200 py-2"
                  >
                    {category.name}
                  </button>
                  
                  {/* Mega Menu for subcategories */}
                  {category.subcategories && hoveredCategory === category.id && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-professional border border-gray-200 py-4 z-50">
                      <div className="px-4 pb-2 mb-2 border-b border-gray-100">
                        <h3 className="font-semibold text-uti-dark text-sm">{category.name}</h3>
                      </div>
                      {category.subcategories.map(sub => (
                        <button
                          key={sub.path}
                          onClick={() => navigate(sub.path)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-uti-red hover:bg-red-50 transition-colors duration-200"
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay with Scroll Lock */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeMobileMenu} />
          <div className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <h3 className="text-xl font-bold text-uti-dark">Menu</h3>
                <Button 
                  onClick={closeMobileMenu} 
                  variant="ghost" 
                  size="sm"
                  className="text-gray-400 hover:text-uti-red"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* User Section */}
              {user ? (
                <div className="pb-6 mb-6 border-b border-gray-200">
                  <p className="text-sm text-uti-gray mb-3">Olá, {user.email}</p>
                  {isAdmin && (
                    <Button
                      onClick={() => {
                        navigate('/admin');
                        closeMobileMenu();
                      }}
                      className="w-full mb-3 btn-primary"
                    >
                      Painel Admin
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      signOut();
                      closeMobileMenu();
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Sair
                  </Button>
                </div>
              ) : (
                <div className="pb-6 mb-6 border-b border-gray-200">
                  <Button
                    onClick={() => {
                      onAuthOpen();
                      closeMobileMenu();
                    }}
                    className="w-full btn-primary"
                  >
                    Entrar / Criar Conta
                  </Button>
                </div>
              )}

              {/* Navigation */}
              <div className="space-y-2">
                <h4 className="font-semibold text-uti-dark text-sm mb-3">Categorias</h4>
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category)}
                    className="block w-full text-left py-3 px-4 text-uti-dark hover:text-uti-red hover:bg-red-50 rounded-lg transition-all duration-200 font-medium"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfessionalHeader;
