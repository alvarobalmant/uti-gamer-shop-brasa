import { useState } from 'react';
import { ShoppingCart, Search, User, Heart, Menu, X, Star, Shield, Truck, Zap } from 'lucide-react';
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

  const categories = ['Todos', 'Xbox', 'PlayStation', 'Nintendo', 'PC', 'Acessórios'];

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
        return 'bg-blue-600';
      case 'xbox series x':
        return 'bg-red-600';
      case 'nintendo switch':
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
    const matchesCategory = selectedCategory === 'Todos' || product.platform?.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const featuredProducts = products.slice(0, 4);
  const newProducts = products.slice(0, 6);
  const bestSellers = products.slice(2, 8);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header GameStop Style */}
      <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
        {/* Top Bar */}
        <div className="bg-red-600 text-white py-2">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-4">
                <span>📱 WhatsApp: (27) 99688-2090</span>
                <span>🚚 Frete grátis acima de R$ 200</span>
              </div>
              <div className="flex items-center gap-4">
                <span>💳 Parcelamos em até 12x</span>
                <span>⚡ +10 anos no mercado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/a514a032-d79a-4bc4-a10e-3c9f0f9cde73.png" 
                alt="UTI DOS GAMES" 
                className="h-12 w-12"
              />
              <div className="hidden md:block">
                <h1 className="text-2xl font-bold text-red-600">UTI DOS GAMES</h1>
                <p className="text-xs text-gray-600">A loja de games mais tradicional de Colatina</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8 hidden md:block">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Buscar jogos, consoles, acessórios..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-field pl-12 pr-4 py-3 w-full text-base"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <Button
                      onClick={() => navigate('/admin')}
                      variant="outline"
                      size="sm"
                      className="hidden md:flex border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-xl"
                    >
                      Admin
                    </Button>
                  )}
                  <Button
                    onClick={signOut}
                    variant="ghost"
                    size="sm"
                    className="hidden md:flex text-gray-600 hover:text-red-600 rounded-xl"
                  >
                    <User className="w-4 h-4 mr-1" />
                    Sair
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  variant="outline"
                  size="sm"
                  className="hidden md:flex border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-xl"
                >
                  <User className="w-4 h-4 mr-1" />
                  Entrar
                </Button>
              )}

              <Button
                onClick={() => setShowCart(true)}
                className="bg-red-600 hover:bg-red-700 text-white relative rounded-xl shadow-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs px-1 min-w-[20px] h-5 flex items-center justify-center rounded-full">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </Badge>
                )}
              </Button>

              <Button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                variant="ghost"
                size="sm"
                className="md:hidden rounded-xl"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-field pl-12 pr-4 py-3 w-full"
              />
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="border-t border-gray-200 bg-white">
          <div className="container mx-auto px-4">
            <nav className="hidden md:flex items-center gap-8 py-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden py-4 border-t border-gray-200">
                <div className="flex flex-col gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setMobileMenuOpen(false);
                      }}
                      className={`px-4 py-3 rounded-xl font-medium text-left transition-all duration-200 ${
                        selectedCategory === category
                          ? 'bg-red-600 text-white'
                          : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                  {!user && (
                    <Button
                      onClick={() => {
                        setShowAuthModal(true);
                        setMobileMenuOpen(false);
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white mt-2 rounded-xl"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Entrar
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-yellow-500 text-black font-bold mb-4 px-4 py-2 rounded-full">
                🔥 MEGA PROMOÇÃO!
              </Badge>
              <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                OS MELHORES
                <span className="block text-yellow-400">GAMES</span>
                ESTÃO AQUI!
              </h2>
              <p className="text-xl mb-8 text-red-100">
                Descubra os últimos lançamentos e ofertas exclusivas para sua setup gamer
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 px-8 text-lg rounded-xl shadow-lg hover:scale-105 transition-all duration-300"
                  onClick={() => document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Ver Ofertas
                </Button>
                <Button 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-red-600 font-bold py-4 px-8 text-lg rounded-xl"
                  onClick={() => window.open('https://wa.me/5527996882090', '_blank')}
                >
                  Falar no WhatsApp
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <img 
                src="/lovable-uploads/b20762ad-323a-48fd-a114-f618c180f903.png" 
                alt="Mascote UTI DOS GAMES" 
                className="w-80 h-80 object-contain animate-bounce-soft"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white py-12 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center justify-center gap-3 p-4">
              <Shield className="w-8 h-8 text-red-600" />
              <div className="text-center">
                <h3 className="font-bold text-gray-800">Compra Segura</h3>
                <p className="text-sm text-gray-600">100% Protegida</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4">
              <Truck className="w-8 h-8 text-red-600" />
              <div className="text-center">
                <h3 className="font-bold text-gray-800">Frete Grátis</h3>
                <p className="text-sm text-gray-600">Acima de R$ 200</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4">
              <Zap className="w-8 h-8 text-red-600" />
              <div className="text-center">
                <h3 className="font-bold text-gray-800">Entrega Rápida</h3>
                <p className="text-sm text-gray-600">Em Colatina e região</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4">
              <Star className="w-8 h-8 text-red-600" />
              <div className="text-center">
                <h3 className="font-bold text-gray-800">+10 Anos</h3>
                <p className="text-sm text-gray-600">No mercado</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Carousel */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">
              🔥 <span className="text-red-600">OFERTAS</span> EM DESTAQUE
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  getPlatformColor={getPlatformColor}
                  onProductClick={handleProductClick}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">
              🚀 <span className="text-red-600">LANÇAMENTOS</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {newProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  getPlatformColor={getPlatformColor}
                  onProductClick={handleProductClick}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">
              ⭐ <span className="text-red-600">MAIS VENDIDOS</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {bestSellers.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  getPlatformColor={getPlatformColor}
                  onProductClick={handleProductClick}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Products */}
      <section id="produtos" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            🎮 <span className="text-red-600">TODOS OS PRODUTOS</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

      {/* Footer GameStop Style */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src="/lovable-uploads/a514a032-d79a-4bc4-a10e-3c9f0f9cde73.png" 
                  alt="UTI DOS GAMES" 
                  className="h-16 w-16"
                />
                <div>
                  <h3 className="text-2xl font-bold text-red-400">UTI DOS GAMES</h3>
                  <p className="text-gray-400">A loja de games mais tradicional de Colatina</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Há mais de 10 anos oferecendo os melhores produtos gamer com qualidade garantida, 
                preços justos e atendimento excepcional.
              </p>
              <div className="flex gap-4">
                <Button variant="outline" className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white rounded-xl">
                  Instagram
                </Button>
                <Button variant="outline" className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white rounded-xl">
                  WhatsApp
                </Button>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-xl font-bold mb-6 text-red-400">Links Úteis</h4>
              <ul className="space-y-3">
                <li><a href="#produtos" className="text-gray-400 hover:text-white transition-colors">Produtos</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Xbox</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">PlayStation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Nintendo</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">PC</a></li>
              </ul>
            </div>
            
            {/* Contact */}
            <div>
              <h4 className="text-xl font-bold mb-6 text-red-400">Contato</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center">
                  <span className="mr-2">📱</span>
                  WhatsApp: (27) 99688-2090
                </li>
                <li className="flex items-center">
                  <span className="mr-2">📧</span>
                  contato@utidosgames.com
                </li>
                <li className="flex items-center">
                  <span className="mr-2">🕒</span>
                  Seg à Sex: 9h às 18h
                </li>
                <li className="flex items-center">
                  <span className="mr-2">📍</span>
                  Colatina - ES
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-center md:text-left">
                © 2024 UTI DOS GAMES. Todos os direitos reservados.
              </p>
              <img 
                src="/lovable-uploads/103e7d18-a70a-497f-a476-e6c513079b69.png" 
                alt="Revenda Oficial Sony PlayStation" 
                className="h-12 object-contain mt-4 md:mt-0"
              />
            </div>
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
