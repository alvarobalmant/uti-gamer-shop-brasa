
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  ChevronDown,
  MapPin,
  Clock,
  Phone,
  Star,
  Zap,
  Gamepad2,
  Headphones,
  Monitor
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';

interface UltraPremiumHeaderProps {
  onCartClick: () => void;
  onAuthClick: () => void;
}

const UltraPremiumHeader = ({ onCartClick, onAuthClick }: UltraPremiumHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { getCartItemsCount } = useCart();

  const cartItemsCount = getCartItemsCount();

  // Info bar items with animations
  const infoItems = [
    { icon: MapPin, text: "Loja Física em Colatina - ES", link: "/localizacao" },
    { icon: Clock, text: "Seg à Sex: 9h às 18h | Sáb: 9h às 16h", link: null },
    { icon: Phone, text: "WhatsApp: (27) 99688-2090", link: "https://wa.me/5527996882090" },
    { icon: Star, text: "Mais de 10 anos no mercado gamer", link: "/sobre" },
    { icon: Zap, text: "Assistência técnica especializada", link: "/servicos" },
  ];

  // Category menu with icons
  const categories = [
    {
      id: 'playstation',
      name: 'PlayStation',
      icon: Gamepad2,
      color: 'playstation',
      subcategories: ['PS5', 'PS4', 'Jogos PS', 'Acessórios PS', 'PlayStation Plus']
    },
    {
      id: 'xbox',
      name: 'Xbox',
      icon: Gamepad2,
      color: 'xbox',
      subcategories: ['Xbox Series X|S', 'Xbox One', 'Jogos Xbox', 'Acessórios Xbox', 'Game Pass']
    },
    {
      id: 'nintendo',
      name: 'Nintendo',
      icon: Gamepad2,
      color: 'nintendo',
      subcategories: ['Nintendo Switch', 'Switch OLED', 'Switch Lite', 'Jogos Nintendo', 'Acessórios']
    },
    {
      id: 'pc',
      name: 'PC Gaming',
      icon: Monitor,
      color: 'pc-gaming',
      subcategories: ['Periféricos', 'Componentes', 'Jogos PC', 'Cadeiras Gamer', 'Streaming']
    },
    {
      id: 'acessorios',
      name: 'Acessórios',
      icon: Headphones,
      color: 'accessories',
      subcategories: ['Controles', 'Headsets', 'Teclados', 'Mouses', 'Mousepad']
    }
  ];

  // Search suggestions
  const searchSuggestions = [
    { type: 'popular', text: 'Spider-Man 2', category: 'PlayStation' },
    { type: 'popular', text: 'FIFA 24', category: 'Jogos' },
    { type: 'popular', text: 'DualSense', category: 'Acessórios' },
    { type: 'category', text: 'Novidades', category: 'Categorias' },
    { type: 'category', text: 'Promoções', category: 'Ofertas' },
  ];

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/busca?q=${encodeURIComponent(query)}`);
      setShowSearchSuggestions(false);
      setIsSearchExpanded(false);
    }
  };

  const handleCategoryHover = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const handleCategoryLeave = () => {
    setActiveCategory(null);
  };

  const handleInfoItemClick = (link: string | null) => {
    if (link) {
      if (link.startsWith('http')) {
        window.open(link, '_blank');
      } else {
        navigate(link);
      }
    }
  };

  return (
    <header className="header-premium sticky top-0 z-50">
      {/* Top Info Bar with Gradient */}
      <div className="header-info-bar text-white py-2 overflow-hidden">
        <div className="container-premium">
          <div className="hidden md:flex items-center justify-center">
            <div className="flex items-center space-x-8 animate-fade-in">
              {infoItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleInfoItemClick(item.link)}
                  className="flex items-center space-x-2 text-sm font-medium hover:text-uti-red-50 transition-colors duration-200 hover:shadow-glow-sm"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.text}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Mobile scrolling info bar */}
          <div className="md:hidden">
            <div className="flex animate-marquee space-x-8">
              {[...infoItems, ...infoItems].map((item, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm font-medium whitespace-nowrap">
                  <item.icon className="w-4 h-4" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b border-gray-system-200 py-4">
        <div className="container-premium">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-3 hover-lift"
              >
                <img
                  src="/lovable-uploads/a514a032-d79a-4bc4-a10e-3c9f0f9cde73.png"
                  alt="UTI DOS GAMES"
                  className="h-12 w-12 shadow-level-1 rounded-lg"
                />
                <div className="hidden sm:block">
                  <h1 className="text-h2 font-bold text-uti-red">UTI DOS GAMES</h1>
                  <p className="text-xs text-gray-system-500 font-medium">A vanguarda gamer de Colatina</p>
                </div>
              </button>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8 relative">
              <div className={`relative w-full transition-all duration-300 ${
                isSearchExpanded ? 'scale-105' : 'scale-100'
              }`}>
                <Input
                  type="text"
                  placeholder="Buscar jogos, consoles, acessórios..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    setIsSearchExpanded(true);
                    setShowSearchSuggestions(true);
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      setIsSearchExpanded(false);
                      setShowSearchSuggestions(false);
                    }, 200);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(searchQuery);
                    }
                  }}
                  className="input-premium pl-4 pr-12 py-3 text-base"
                />
                <Button
                  onClick={() => handleSearch(searchQuery)}
                  className="absolute right-1 top-1 bottom-1 px-3 btn-primary"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </div>

              {/* Search Suggestions Dropdown */}
              {showSearchSuggestions && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-level-3 rounded-lg mt-1 py-2 z-60 animate-slide-down">
                  <div className="px-4 py-2 text-sm font-medium text-gray-system-500 border-b border-gray-system-100">
                    Sugestões populares
                  </div>
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(suggestion.text)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-system-50 transition-colors duration-150 flex items-center justify-between"
                    >
                      <span className="text-sm">{suggestion.text}</span>
                      <span className="text-xs text-gray-system-400">{suggestion.category}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              {/* Mobile Search */}
              <Button
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                className="lg:hidden btn-ghost w-10 h-10 p-0"
              >
                <Search className="w-5 h-5" />
              </Button>

              {/* User Account */}
              <Button
                onClick={onAuthClick}
                className="btn-ghost hidden sm:flex items-center space-x-2"
              >
                <User className="w-5 h-5" />
                <span className="hidden md:inline">
                  {user ? (isAdmin ? 'Admin' : 'Minha Conta') : 'Entrar'}
                </span>
              </Button>

              {/* Shopping Cart */}
              <Button
                onClick={onCartClick}
                className="btn-ghost relative hover-scale"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-uti-red text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse-glow">
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </span>
                )}
              </Button>

              {/* Mobile Menu Toggle */}
              <Button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden btn-ghost w-10 h-10 p-0"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Search Expanded */}
          {isSearchExpanded && (
            <div className="lg:hidden mt-4 animate-slide-down">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(searchQuery);
                    }
                  }}
                  className="input-premium pl-4 pr-12"
                  autoFocus
                />
                <Button
                  onClick={() => handleSearch(searchQuery)}
                  className="absolute right-1 top-1 bottom-1 px-3 btn-primary"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Categories Navigation */}
      <div className="hidden lg:block bg-gray-system-50 border-b border-gray-system-200">
        <div className="container-premium">
          <nav className="flex items-center space-x-8 py-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="relative"
                onMouseEnter={() => handleCategoryHover(category.id)}
                onMouseLeave={handleCategoryLeave}
              >
                <button
                  onClick={() => navigate(`/categoria/${category.id}`)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover-lift ${
                    activeCategory === category.id
                      ? `bg-${category.color} text-white shadow-level-2`
                      : 'text-uti-black hover:bg-white hover:shadow-level-1'
                  }`}
                >
                  <category.icon className="w-5 h-5" />
                  <span>{category.name}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                    activeCategory === category.id ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* Dropdown Menu */}
                {activeCategory === category.id && (
                  <div className="absolute top-full left-0 bg-white shadow-level-3 rounded-lg mt-1 py-2 min-w-48 z-60 animate-slide-down">
                    {category.subcategories.map((subcategory, index) => (
                      <button
                        key={index}
                        onClick={() => navigate(`/categoria/${category.id}/${subcategory.toLowerCase().replace(/\s+/g, '-')}`)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-system-50 transition-colors duration-150 text-sm"
                      >
                        {subcategory}
                      </button>
                    ))}
                    <div className="border-t border-gray-system-100 mt-2 pt-2">
                      <button
                        onClick={() => navigate(`/categoria/${category.id}`)}
                        className="w-full px-4 py-2 text-left text-uti-red hover:bg-uti-red-50 transition-colors duration-150 text-sm font-medium"
                      >
                        Ver todos em {category.name}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Special Categories */}
            <button
              onClick={() => navigate('/promocoes')}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-uti-red hover:bg-uti-red-50 transition-all duration-200 hover-lift"
            >
              <Zap className="w-5 h-5" />
              <span>Promoções</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-70 bg-uti-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}>
          <div 
            className="absolute right-0 top-0 h-full w-80 bg-white shadow-level-4 animate-slide-in-right overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-h2 font-bold text-uti-black">Menu</h2>
                <Button
                  onClick={() => setIsMenuOpen(false)}
                  className="btn-ghost w-8 h-8 p-0"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Mobile Categories */}
              <nav className="space-y-4">
                {categories.map((category) => (
                  <div key={category.id}>
                    <button
                      onClick={() => navigate(`/categoria/${category.id}`)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 hover:shadow-level-1 bg-${category.color}-light`}
                    >
                      <category.icon className={`w-5 h-5 text-${category.color}`} />
                      <span className="font-medium">{category.name}</span>
                    </button>
                  </div>
                ))}
              </nav>

              {/* Mobile User Actions */}
              <div className="mt-8 pt-6 border-t border-gray-system-200 space-y-4">
                <Button
                  onClick={onAuthClick}
                  className="w-full btn-ghost justify-start"
                >
                  <User className="w-5 h-5 mr-3" />
                  {user ? 'Minha Conta' : 'Entrar'}
                </Button>
                
                <Button
                  onClick={onCartClick}
                  className="w-full btn-ghost justify-start"
                >
                  <ShoppingCart className="w-5 h-5 mr-3" />
                  Carrinho ({cartItemsCount})
                </Button>
              </div>

              {/* Contact Info */}
              <div className="mt-8 pt-6 border-t border-gray-system-200">
                <h3 className="font-semibold text-uti-black mb-4">Contato</h3>
                <div className="space-y-3">
                  <a
                    href="https://wa.me/5527996882090"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-sm text-gray-system-600"
                  >
                    <Phone className="w-4 h-4" />
                    <span>(27) 99688-2090</span>
                  </a>
                  <div className="flex items-center space-x-3 text-sm text-gray-system-600">
                    <MapPin className="w-4 h-4" />
                    <span>Colatina - ES</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default UltraPremiumHeader;
