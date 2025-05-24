
import { useState } from 'react';
import { ShoppingCart, Search, User, Menu, X, Star, Shield, Truck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { AuthModal } from '@/components/Auth/AuthModal';
import ProductCard, { Product } from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import Cart from '@/components/Cart';

interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

const Index = () => {
  const { products, loading } = useProducts();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const categories = ['PlayStation', 'Nintendo', 'Xbox', 'PC', 'Colecionáveis', 'Acessórios', 'Jogos Físicos', 'Jogos Digitais', 'Ofertas', 'Novidades'];

  const addToCart = (product: Product, size: string, color: string) => {
    const existingItem = cart.find(
      item => item.product.id === product.id && item.size === size && item.color === color
    );

    if (existingItem) {
      setCart(cart.map(item =>
        item === existingItem
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, size, color, quantity: 1 }]);
    }
  };

  const updateQuantity = (item: CartItem, change: number) => {
    const newQuantity = item.quantity + change;
    if (newQuantity <= 0) {
      setCart(cart.filter(cartItem => cartItem !== item));
    } else {
      setCart(cart.map(cartItem =>
        cartItem === item
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const sendToWhatsApp = () => {
    const itemsList = cart.map(item => 
      `• ${item.product.name} (${item.size}${item.color ? `, ${item.color}` : ''}) - Qtd: ${item.quantity} - R$ ${(item.product.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    const total = getTotalPrice();
    const message = `Olá! Gostaria de pedir os seguintes itens da UTI DOS GAMES:\n\n${itemsList}\n\n*Total: R$ ${total.toFixed(2)}*`;
    const whatsappUrl = `https://wa.me/5527996882090?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getPlatformColor = (platform: string) => {
    switch (platform?.toLowerCase()) {
      case 'ps5':
      case 'ps4/ps5':
      case 'playstation':
        return 'bg-blue-600';
      case 'xbox series x':
      case 'xbox':
        return 'bg-red-600';
      case 'nintendo switch':
      case 'nintendo':
        return 'bg-red-500';
      case 'pc':
        return 'bg-orange-600';
      default:
        return 'bg-gray-600';
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || 
      product.platform?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      product.category?.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header - GameStop Style */}
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
              <img 
                src="/lovable-uploads/a514a032-d79a-4bc4-a10e-3c9f0f9cde73.png" 
                alt="UTI DOS GAMES" 
                className="h-8 w-8 mr-2"
              />
              <h1 className="text-xl font-bold text-gray-900">GameStop</h1>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowAuthModal(true)}
                variant="ghost"
                size="sm"
                className="flex flex-col items-center p-2 text-gray-700"
              >
                <User className="w-5 h-5" />
                <span className="text-xs">Sign In</span>
              </Button>

              <Button
                onClick={() => setShowCart(true)}
                variant="ghost"
                size="sm"
                className="flex flex-col items-center p-2 text-gray-700 relative"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="text-xs">Cart</span>
                {cart.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1 min-w-[16px] h-4 flex items-center justify-center rounded-full">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </Badge>
                )}
              </Button>

              <Button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                variant="ghost"
                size="sm"
                className="flex flex-col items-center p-2 text-gray-700"
              >
                <Menu className="w-5 h-5" />
                <span className="text-xs">Menu</span>
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search games, consoles & more"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="flex overflow-x-auto scrollbar-hide px-4 py-3 gap-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex-shrink-0 text-sm font-medium whitespace-nowrap ${
                  selectedCategory === category
                    ? 'text-red-600 border-b-2 border-red-600 pb-1'
                    : 'text-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}>
            <div className="bg-white w-80 h-full ml-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Menu</h3>
                <Button
                  onClick={() => setMobileMenuOpen(false)}
                  variant="ghost"
                  size="sm"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="space-y-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-gray-700 hover:text-red-600"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Banner - GameStop Style */}
      <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-red-900 text-white">
        <div className="px-4 py-12">
          <div className="text-center mb-8">
            <Badge className="bg-pink-600 text-white font-bold mb-4 px-4 py-2 rounded-full text-sm">
              ♦ PROS GET 5% EXTRA OFF + 5% EXTRA TRADE CREDIT
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              Pre-Owned, Phone Home!
            </h2>
            <p className="text-lg text-gray-200 mb-6">
              Explore the best pre-owned deals in the universe.
            </p>
            <Button 
              className="bg-white text-gray-900 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg"
              onClick={() => document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Shop Pre-Owned Now
            </Button>
          </div>
          
          {/* Hero Image */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-80 h-48 bg-gradient-to-br from-blue-600 to-purple-800 rounded-lg flex items-center justify-center">
                <div className="text-6xl">🎮</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-6">
        <div className="px-4 text-center">
          <h3 className="text-xl font-bold mb-2">
            Buy & Sell Your Graded Cards At GameStop!
          </h3>
          <Button 
            variant="outline" 
            className="border-2 border-white text-white hover:bg-white hover:text-purple-600 font-bold py-2 px-6 rounded-lg"
          >
            Buy & Sell Graded Cards Now
          </Button>
        </div>
      </section>

      {/* Collectibles Section */}
      <section className="py-12 bg-white">
        <div className="px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Treat Yo Shelf
            </h2>
            <p className="text-gray-600 text-lg">
              Snag all the latest and greatest collectibles!
            </p>
          </div>
          
          {/* Collectibles showcase */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <div className="text-6xl">🕷️</div>
            <div className="text-6xl">🦸‍♂️</div>
            <div className="text-6xl">🤖</div>
            <div className="text-6xl">👾</div>
            <div className="text-6xl">🎯</div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="produtos" className="py-12 bg-gray-50">
        <div className="px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🎮 Todos os Produtos
          </h2>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <div className="text-xl text-gray-500">Carregando produtos...</div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-2xl text-gray-400 mb-2">Nenhum produto encontrado</div>
              <p className="text-gray-500">Tente ajustar os filtros de busca</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  getPlatformColor={getPlatformColor}
                  onProductClick={handleProductClick}
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
              <img 
                src="/lovable-uploads/a514a032-d79a-4bc4-a10e-3c9f0f9cde73.png" 
                alt="UTI DOS GAMES" 
                className="h-12 w-12"
              />
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
                <li><a href="#" className="text-gray-400 hover:text-white">PlayStation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Xbox</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Nintendo</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">PC</a></li>
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

      {/* Modals */}
      <ProductModal
        product={selectedProduct}
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        onAddToCart={addToCart}
        getPlatformColor={getPlatformColor}
      />

      <Cart 
        cart={cart}
        showCart={showCart}
        setShowCart={setShowCart}
        updateQuantity={updateQuantity}
        sendToWhatsApp={sendToWhatsApp}
      />

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

export default Index;
