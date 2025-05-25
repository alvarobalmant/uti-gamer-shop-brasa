
import { useState } from 'react';
import { Search, ShoppingCart, User, Menu, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';

const PremiumHeader = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { getCartItemsCount } = useCart();
  const { user } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/busca?q=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const navigationItems = [
    { label: 'PlayStation', path: '/categoria/playstation' },
    { label: 'Xbox', path: '/categoria/xbox' },
    { label: 'Nintendo', path: '/categoria/nintendo' },
    { label: 'PC Gaming', path: '/categoria/pc' },
    { label: 'Acessórios', path: '/categoria/acessorios' },
    { label: 'Colecionáveis', path: '/categoria/colecionaveis' }
  ];

  return (
    <header className="header-premium hidden lg:block">
      {/* Top Bar */}
      <div className="bg-uti-gray-900 text-white py-2">
        <div className="container-premium">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>(27) 99688-2090</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Colatina - ES</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span>Mais de 10 anos servindo a comunidade gamer</span>
              <button 
                onClick={() => navigate('/trade-in')}
                className="text-uti-red hover:text-white transition-colors"
              >
                Trade-in disponível
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white py-4">
        <div className="container-premium">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <img 
                src="/lovable-uploads/a514a032-d79a-4bc4-a10e-3c9f0f9cde73.png" 
                alt="UTI DOS GAMES" 
                className="h-12 w-12"
              />
              <div>
                <h1 className="text-xl font-bold text-uti-black">UTI DOS GAMES</h1>
                <p className="text-xs text-uti-gray-600">A vanguarda gamer de Colatina</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Buscar jogos, consoles, acessórios..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-premium pl-12 pr-4"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-uti-gray-600" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary-premium px-4 py-2 text-sm"
                >
                  Buscar
                </button>
              </form>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/conta')}
                className="flex items-center space-x-2 text-uti-black hover:text-uti-red transition-colors focus-premium"
              >
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {user ? 'Minha Conta' : 'Entrar'}
                </span>
              </button>

              <button
                onClick={() => navigate('/carrinho')}
                className="relative flex items-center space-x-2 text-uti-black hover:text-uti-red transition-colors focus-premium"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="text-sm font-medium">Carrinho</span>
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-uti-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {getCartItemsCount()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-uti-gray-50 py-3">
        <div className="container-premium">
          <div className="flex items-center justify-center space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="text-sm font-medium text-uti-black hover:text-uti-red transition-colors py-2 focus-premium"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default PremiumHeader;
