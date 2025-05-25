
import { useState, useRef } from 'react';
import { ShoppingCart, Search, User, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { AuthModal } from '@/components/Auth/AuthModal';
import ProductCard, { Product } from '@/components/ProductCard';
import Cart from '@/components/Cart';
import SearchSuggestions from '@/components/SearchSuggestions';
import HeroBannerCarousel from '@/components/HeroBannerCarousel';
import ServiceCards from '@/components/ServiceCards';
import { CartItem, useCart } from '@/hooks/useCart';

const Index = () => {
  const { products, loading } = useProducts();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { cart, addToCart, updateQuantity, getCartTotal, getCartItemsCount } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { id: 'inicio', name: 'Início', path: '/' },
    { id: 'playstation', name: 'PlayStation', path: '/categoria/playstation' },
    { id: 'nintendo', name: 'Nintendo', path: '/categoria/nintendo' },
    { id: 'xbox', name: 'Xbox', path: '/categoria/xbox' },
    { id: 'pc', name: 'PC', path: '/categoria/pc' },
    { id: 'colecionaveis', name: 'Colecionáveis', path: '/categoria/colecionaveis' },
    { id: 'acessorios', name: 'Acessórios', path: '/categoria/acessorios' },
    { id: 'jogos-fisicos', name: 'Jogos Físicos', path: '/categoria/jogos-fisicos' },
    { id: 'jogos-digitais', name: 'Jogos Digitais', path: '/categoria/jogos-digitais' },
    { id: 'ofertas', name: 'Ofertas', path: '/categoria/ofertas' },
    { id: 'novidades', name: 'Novidades', path: '/categoria/novidades' }
  ];

  const updateCartQuantity = (item: CartItem, change: number) => {
    const newQuantity = item.quantity + change;
    updateQuantity(item.product.id, item.size, item.color, newQuantity);
  };

  const sendToWhatsApp = () => {
    const itemsList = cart.map(item => `• ${item.product.name} (${item.size || 'Padrão'}${item.color ? `, ${item.color}` : ''}) - Qtd: ${item.quantity} - R$ ${(item.product.price * item.quantity).toFixed(2)}`).join('\n');
    const total = getCartTotal();
    const message = `Olá! Gostaria de pedir os seguintes itens da UTI DOS GAMES:\n\n${itemsList}\n\n*Total: R$ ${total.toFixed(2)}*`;
    const whatsappUrl = `https://wa.me/5527996882090?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getPlatformColor = (product: Product) => {
    const tags = product.tags?.map(tag => tag.name.toLowerCase()) || [];
    
    if (tags.some(tag => tag.includes('playstation'))) {
      return 'bg-blue-600';
    }
    if (tags.some(tag => tag.includes('xbox'))) {
      return 'bg-green-600';
    }
    if (tags.some(tag => tag.includes('nintendo'))) {
      return 'bg-red-500';
    }
    if (tags.some(tag => tag.includes('pc'))) {
      return 'bg-orange-600';
    }
    return 'bg-gray-600';
  };

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
        setShowAuthModal(true);
      }
    } else {
      setShowAuthModal(true);
    }
  };

  const featuredProducts = products.slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-lg sticky top-0 z-50">
        {/* Top rotating banner */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-2 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap">
            <span className="mx-8">📱 WhatsApp: (27) 99688-2090</span>
            <span className="mx-8">🚚 Frete grátis acima de R$ 200</span>
            <span className="mx-8">💳 Parcelamos em até 12x</span>
            <span className="mx-8">⚡ +10 anos no mercado</span>
          </div>
        </div>

        {/* Main Header */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            {/* Logo */}
            <div className="flex items-center">
              <img src="/lovable-uploads/a514a032-d79a-4bc4-a10e-3c9f0f9cde73.png" alt="UTI DOS GAMES" className="h-8 w-8 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">UTI DOS GAMES</h1>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-3">
              <Button onClick={handleLogin} variant="ghost" size="sm" className="flex flex-col items-center p-2 text-gray-700">
                <User className="w-5 h-5" />
                <span className="text-xs">
                  {user ? isAdmin ? 'Admin' : 'Conta' : 'Entrar'}
                </span>
              </Button>

              <Button onClick={() => setShowCart(true)} variant="ghost" size="sm" className="flex flex-col items-center p-2 text-gray-700 relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="text-xs">Carrinho</span>
                {getCartItemsCount() > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1 min-w-[16px] h-4 flex items-center justify-center rounded-full">
                    {getCartItemsCount()}
                  </Badge>
                )}
              </Button>

              <Button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} variant="ghost" size="sm" className="flex flex-col items-center p-2 text-gray-700">
                <Menu className="w-5 h-5" />
                <span className="text-xs">Menu</span>
              </Button>
            </div>
          </div>

          {/* Search Bar with Suggestions */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Buscar jogos, consoles e mais"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setShowSuggestions(e.target.value.length > 1);
              }}
              onKeyPress={handleSearchKeyPress}
              onFocus={() => setShowSuggestions(searchQuery.length > 1)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
            />
            
            <SearchSuggestions
              searchQuery={searchQuery}
              onSelectSuggestion={handleSuggestionSelect}
              onSearch={handleSearchSubmit}
              isVisible={showSuggestions}
            />
          </div>

          {/* Mobile Categories Toggle */}
          <div className="md:hidden mb-2">
            <Button
              onClick={() => setShowCategories(!showCategories)}
              variant="ghost"
              size="sm"
              className="text-gray-600 text-sm"
            >
              Categorias <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showCategories ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Categories Horizontal Scroll */}
        {(showCategories || window.innerWidth >= 768) && (
          <div className="border-t border-gray-200 bg-gray-50">
            <div className="flex overflow-x-auto scrollbar-hide px-4 py-3 gap-6">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => navigate(category.path)}
                  className="flex-shrink-0 text-sm font-medium whitespace-nowrap text-gray-600 hover:text-red-600"
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}>
            <div className="bg-white w-80 h-full ml-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Menu</h3>
                <Button onClick={() => setMobileMenuOpen(false)} variant="ghost" size="sm">
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="space-y-4">
                {user && (
                  <div className="pb-4 border-b border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Olá, {user.email}</p>
                    {isAdmin && (
                      <Button
                        onClick={() => {
                          navigate('/admin');
                          setMobileMenuOpen(false);
                        }}
                        className="w-full bg-red-600 hover:bg-red-700 text-white mb-2"
                      >
                        Painel Admin
                      </Button>
                    )}
                    <Button
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Sair
                    </Button>
                  </div>
                )}
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => {
                      navigate(category.path);
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-gray-700 hover:text-red-600"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Banner Carousel */}
      <HeroBannerCarousel />

      {/* Service Cards */}
      <ServiceCards />

      {/* Featured Products */}
      <section id="produtos" className="py-12 bg-gray-50">
        <div className="px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              🎮 Produtos em Destaque
            </h2>
            <Button onClick={() => navigate('/categoria/inicio')} variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
              Ver Todos
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <div className="text-xl text-gray-500">Carregando produtos...</div>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-2xl text-gray-400 mb-2">
                Nenhum produto disponível
              </div>
              <p className="text-gray-500">
                Produtos serão adicionados em breve
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {featuredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={(product, size, color) => addToCart(product, size, color)}
                  getPlatformColor={() => getPlatformColor(product)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer - GameStop Style */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="px-4">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <img src="/lovable-uploads/a514a032-d79a-4bc4-a10e-3c9f0f9cde73.png" alt="UTI DOS GAMES" className="h-12 w-12" />
              <div>
                <h3 className="text-xl font-bold text-red-400">UTI DOS GAMES</h3>
                <p className="text-gray-400 text-sm">A loja de games mais tradicional de Colatina</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-bold mb-3 text-red-400">Links Úteis</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => navigate('/categoria/playstation')} className="text-gray-400 hover:text-white">PlayStation</button></li>
                <li><button onClick={() => navigate('/categoria/xbox')} className="text-gray-400 hover:text-white">Xbox</button></li>
                <li><button onClick={() => navigate('/categoria/nintendo')} className="text-gray-400 hover:text-white">Nintendo</button></li>
                <li><button onClick={() => navigate('/categoria/pc')} className="text-gray-400 hover:text-white">PC</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-3 text-red-400">Contato</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>📱 (27) 99688-2090</li>
                <li>📧 contato@utidosgames.com</li>
                <li>🕒 Seg à Sex: 9h às 18h</li>
                <li>📍 Colatina - ES</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-6 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 UTI DOS GAMES. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Cart Component */}
      <Cart
        cart={cart}
        showCart={showCart}
        setShowCart={setShowCart}
        updateQuantity={updateCartQuantity}
        sendToWhatsApp={sendToWhatsApp}
      />

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default Index;
