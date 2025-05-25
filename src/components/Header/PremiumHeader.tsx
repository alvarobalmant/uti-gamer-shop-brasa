
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingCart, Menu, X, ChevronDown, Phone, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import SearchSuggestions from '@/components/SearchSuggestions';

const PremiumHeader = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    {
      id: 'playstation',
      name: 'PlayStation',
      path: '/categoria/playstation',
      subcategories: [
        { name: 'PlayStation 5', path: '/categoria/playstation-5', icon: '🎮' },
        { name: 'PlayStation 4', path: '/categoria/playstation-4', icon: '🎮' },
        { name: 'Jogos PS5', path: '/categoria/jogos-ps5', icon: '💿' },
        { name: 'Jogos PS4', path: '/categoria/jogos-ps4', icon: '💿' },
        { name: 'Acessórios PS', path: '/categoria/acessorios-ps', icon: '🎧' },
        { name: 'VR PlayStation', path: '/categoria/vr-playstation', icon: '🥽' }
      ],
      color: 'bg-blue-600',
      featured: {
        title: 'PlayStation 5 Slim',
        price: 'R$ 3.999,99',
        image: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=200&h=200&fit=crop'
      }
    },
    {
      id: 'xbox',
      name: 'Xbox',
      path: '/categoria/xbox',
      subcategories: [
        { name: 'Xbox Series X|S', path: '/categoria/xbox-series', icon: '🎮' },
        { name: 'Xbox One', path: '/categoria/xbox-one', icon: '🎮' },
        { name: 'Jogos Xbox', path: '/categoria/jogos-xbox', icon: '💿' },
        { name: 'Game Pass', path: '/categoria/game-pass', icon: '📱' },
        { name: 'Acessórios Xbox', path: '/categoria/acessorios-xbox', icon: '🎧' },
        { name: 'Controles', path: '/categoria/controles-xbox', icon: '🕹️' }
      ],
      color: 'bg-green-600',
      featured: {
        title: 'Xbox Series X',
        price: 'R$ 4.299,99',
        image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=200&h=200&fit=crop'
      }
    },
    {
      id: 'nintendo',
      name: 'Nintendo',
      path: '/categoria/nintendo',
      subcategories: [
        { name: 'Nintendo Switch', path: '/categoria/nintendo-switch', icon: '🎮' },
        { name: 'Switch OLED', path: '/categoria/switch-oled', icon: '📺' },
        { name: 'Switch Lite', path: '/categoria/switch-lite', icon: '🎮' },
        { name: 'Jogos Nintendo', path: '/categoria/jogos-nintendo', icon: '💿' },
        { name: 'Acessórios', path: '/categoria/acessorios-nintendo', icon: '🎧' },
        { name: 'amiibo', path: '/categoria/amiibo', icon: '🎪' }
      ],
      color: 'bg-red-500',
      featured: {
        title: 'Nintendo Switch OLED',
        price: 'R$ 2.299,99',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop'
      }
    },
    {
      id: 'pc',
      name: 'PC Gaming',
      path: '/categoria/pc',
      subcategories: [
        { name: 'Periféricos', path: '/categoria/perifericos-pc', icon: '⌨️' },
        { name: 'Headsets', path: '/categoria/headsets-pc', icon: '🎧' },
        { name: 'Mouses', path: '/categoria/mouses-pc', icon: '🖱️' },
        { name: 'Teclados', path: '/categoria/teclados-pc', icon: '⌨️' },
        { name: 'Monitores', path: '/categoria/monitores-pc', icon: '🖥️' },
        { name: 'Steam Deck', path: '/categoria/steam-deck', icon: '🎮' }
      ],
      color: 'bg-orange-600',
      featured: {
        title: 'Headset Gamer RGB',
        price: 'R$ 299,99',
        image: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=200&h=200&fit=crop'
      }
    }
  ];

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeMegaMenu && !(event.target as Element).closest('.mega-menu-container')) {
        setActiveMegaMenu(null);
      }
      if (showUserMenu && !(event.target as Element).closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeMegaMenu, showUserMenu]);

  return (
    <>
      {/* Top Contact Bar */}
      <div className="bg-uti-dark text-white py-2 overflow-hidden relative">
        <div className="animate-marquee whitespace-nowrap">
          <span className="mx-8 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            WhatsApp: (27) 99688-2090
          </span>
          <span className="mx-8 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Colatina - ES
          </span>
          <span className="mx-8 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Seg à Sex: 9h às 18h
          </span>
          <span className="mx-8">🚚 Frete grátis acima de R$ 200</span>
          <span className="mx-8">💳 Parcelamos em até 12x</span>
          <span className="mx-8">⚡ +10 anos no mercado</span>
        </div>
      </div>

      {/* Main Header */}
      <header className="header-premium sticky top-0 z-50">
        <div className="container-premium">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <img 
                  src="/lovable-uploads/a514a032-d79a-4bc4-a10e-3c9f0f9cde73.png" 
                  alt="UTI DOS GAMES" 
                  className="h-12 w-12 transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-accent rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>
              <div>
                <h1 className="text-2xl font-black text-uti-dark">
                  UTI DOS GAMES
                </h1>
                <p className="text-xs text-uti-gray -mt-1">A vanguarda gamer de Colatina</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {categories.map((category) => (
                <div key={category.id} className="mega-menu-container relative">
                  <button
                    onMouseEnter={() => setActiveMegaMenu(category.id)}
                    className="flex items-center space-x-1 px-4 py-3 text-uti-dark hover:text-uti-red transition-colors duration-300 font-medium"
                  >
                    <span>{category.name}</span>
                    <ChevronDown className="w-4 h-4 transition-transform duration-300" />
                  </button>

                  {/* Mega Menu */}
                  {activeMegaMenu === category.id && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 pt-2">
                      <div className="bg-white rounded-3xl shadow-2xl border border-uti-border p-8 w-[600px] animate-fade-in-up">
                        <div className="grid grid-cols-2 gap-8">
                          {/* Subcategories */}
                          <div>
                            <h3 className="text-lg font-bold text-uti-dark mb-4">Categorias</h3>
                            <div className="grid grid-cols-2 gap-2">
                              {category.subcategories.map((sub) => (
                                <Link
                                  key={sub.path}
                                  to={sub.path}
                                  className="flex items-center space-x-2 p-3 rounded-2xl hover:bg-uti-light text-uti-dark hover:text-uti-red transition-all duration-300"
                                  onClick={() => setActiveMegaMenu(null)}
                                >
                                  <span className="text-lg">{sub.icon}</span>
                                  <span className="text-sm font-medium">{sub.name}</span>
                                </Link>
                              ))}
                            </div>
                          </div>

                          {/* Featured Product */}
                          <div className="bg-gradient-mesh rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-uti-dark mb-4">Em Destaque</h3>
                            <div className="space-y-4">
                              <img
                                src={category.featured.image}
                                alt={category.featured.title}
                                className="w-full h-32 object-cover rounded-xl"
                              />
                              <div>
                                <h4 className="font-semibold text-uti-dark">{category.featured.title}</h4>
                                <p className="text-xl font-bold text-uti-red">{category.featured.price}</p>
                                <Button className="btn-primary mt-3 w-full">
                                  Ver Produto
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl mx-8 relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-uti-gray w-5 h-5" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar jogos, consoles e mais..."
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(e.target.value.length > 1);
                  }}
                  onKeyPress={handleSearchKeyPress}
                  onFocus={() => setShowSuggestions(searchQuery.length > 1)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="input-premium pl-12 pr-4 w-full"
                />
              </div>
              
              <SearchSuggestions
                searchQuery={searchQuery}
                onSelectSuggestion={handleSuggestionSelect}
                onSearch={handleSearchSubmit}
                isVisible={showSuggestions}
              />
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-2">
              {/* User Menu */}
              <div className="user-menu-container relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex flex-col items-center p-3 text-uti-dark hover:text-uti-red transition-colors duration-300"
                >
                  <User className="w-6 h-6" />
                  <span className="text-xs font-medium mt-1">
                    {user ? isAdmin ? 'Admin' : 'Conta' : 'Entrar'}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-uti-border p-4 animate-fade-in-up">
                    {user ? (
                      <div className="space-y-3">
                        <div className="pb-3 border-b border-uti-border">
                          <p className="text-sm text-uti-gray">Olá,</p>
                          <p className="font-semibold text-uti-dark">{user.email}</p>
                        </div>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="block w-full text-left p-3 rounded-xl hover:bg-uti-light text-uti-dark hover:text-uti-red transition-all duration-300"
                            onClick={() => setShowUserMenu(false)}
                          >
                            Painel Admin
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            signOut();
                            setShowUserMenu(false);
                          }}
                          className="block w-full text-left p-3 rounded-xl hover:bg-uti-light text-uti-dark hover:text-uti-red transition-all duration-300"
                        >
                          Sair
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-sm text-uti-gray">Faça login para acessar sua conta</p>
                        <Button className="btn-primary w-full">
                          Entrar / Cadastrar
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link
                to="#"
                className="flex flex-col items-center p-3 text-uti-dark hover:text-uti-red transition-colors duration-300 relative"
              >
                <ShoppingCart className="w-6 h-6" />
                <span className="text-xs font-medium mt-1">Carrinho</span>
                {getCartItemsCount() > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-uti-red text-white text-xs px-2 h-5 flex items-center justify-center rounded-full animate-bounce-premium">
                    {getCartItemsCount()}
                  </Badge>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden flex flex-col items-center p-3 text-uti-dark hover:text-uti-red transition-colors duration-300"
              >
                <Menu className="w-6 h-6" />
                <span className="text-xs font-medium mt-1">Menu</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}>
            <div className="bg-white w-80 h-full ml-auto p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-uti-dark">Menu</h3>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl hover:bg-uti-light text-uti-dark"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {categories.map(category => (
                  <div key={category.id} className="space-y-2">
                    <Link
                      to={category.path}
                      className="block p-4 rounded-xl hover:bg-uti-light text-uti-dark hover:text-uti-red transition-all duration-300 font-semibold"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                    <div className="pl-4 space-y-1">
                      {category.subcategories.slice(0, 4).map(sub => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          className="block p-2 text-sm text-uti-gray hover:text-uti-red transition-colors duration-300"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {sub.icon} {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Overlay for mega menu */}
      {activeMegaMenu && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-40"
          onMouseEnter={() => setActiveMegaMenu(null)}
        />
      )}
    </>
  );
};

export default PremiumHeader;
