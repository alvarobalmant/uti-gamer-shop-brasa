
import { useState } from 'react';
import { ShoppingCart, Plus, Minus, Settings, LogIn, User, LogOut, Star, Shield, Truck, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
        return 'bg-green-600';
      case 'nintendo switch':
        return 'bg-red-600';
      case 'pc':
        return 'bg-orange-600';
      default:
        return 'bg-purple-600';
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Profissional */}
      <header className="sticky top-0 z-40 bg-white shadow-xl border-b-4 border-red-600">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/a514a032-d79a-4bc4-a10e-3c9f0f9cde73.png" 
                alt="UTI DOS GAMES" 
                className="w-16 h-16 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-red-600">
                  UTI DOS GAMES
                </h1>
                <p className="text-sm text-gray-600 font-medium">A loja de games mais tradicional de Colatina</p>
                <p className="text-xs text-gray-500">+10 anos de mercado</p>
              </div>
            </div>
            
            {/* Menu Central */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#produtos" className="text-gray-700 hover:text-red-600 font-semibold transition-colors duration-200 relative group">
                Produtos
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-200 group-hover:w-full"></span>
              </a>
              <a href="#sobre" className="text-gray-700 hover:text-red-600 font-semibold transition-colors duration-200 relative group">
                Sobre Nós
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-200 group-hover:w-full"></span>
              </a>
              <a href="#contato" className="text-gray-700 hover:text-red-600 font-semibold transition-colors duration-200 relative group">
                Contato
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-200 group-hover:w-full"></span>
              </a>
            </nav>
            
            {/* Botões de Ação */}
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  {isAdmin && (
                    <Button
                      onClick={() => navigate('/admin')}
                      className="bg-gray-100 text-gray-700 hover:bg-red-600 hover:text-white border-2 border-gray-300 hover:border-red-600 transition-all duration-300 font-semibold"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Admin
                    </Button>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border">
                      <User className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium text-gray-700">{user.email}</span>
                    </div>
                    
                    <Button
                      onClick={signOut}
                      variant="outline"
                      size="sm"
                      className="border-red-300 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300"
                    >
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-white text-red-600 border-2 border-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 font-semibold px-6"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              )}
              
              <Button
                onClick={() => setShowCart(!showCart)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Carrinho ({cart.reduce((sum, item) => sum + item.quantity, 0)})
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Banner Hero Melhorado */}
      <section className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-4">
                <Badge className="bg-white/20 text-white font-bold px-4 py-2 text-sm">
                  ⚡ PROMOÇÃO POR TEMPO LIMITADO!
                </Badge>
              </div>
              
              <h2 className="text-6xl md:text-7xl font-bold mb-6 leading-none">
                GAMING DE
                <span className="block text-white bg-gradient-to-r from-white to-gray-200 bg-clip-text">ALTO NÍVEL</span>
              </h2>
              
              <p className="text-xl mb-8 text-red-100 leading-relaxed max-w-lg">
                Descubra os melhores jogos e acessórios para sua setup gamer. 
                Qualidade garantida e preços imbatíveis!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  className="bg-white text-red-600 hover:bg-gray-100 font-bold py-4 px-8 text-lg rounded-xl shadow-xl transition-all duration-300 hover:scale-105"
                  onClick={() => document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Ver Produtos
                </Button>
                <Button 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-red-600 font-bold py-4 px-8 text-lg rounded-xl transition-all duration-300"
                  onClick={() => window.open('https://wa.me/5527996882090', '_blank')}
                >
                  Falar no WhatsApp
                </Button>
              </div>
              
              <div className="text-sm text-red-100">
                <p>📦 Peça online, receba em casa</p>
                <p>🚚 Entrega rápida em Colatina e região</p>
                <p>💬 Suporte pelo WhatsApp</p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <img 
                src="/lovable-uploads/b20762ad-323a-48fd-a114-f618c180f903.png" 
                alt="Mascote UTI DOS GAMES" 
                className="w-80 h-80 object-contain animate-bounce-slow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Selos de Confiança Melhorados */}
      <section className="bg-white py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex items-center justify-center space-x-4 bg-gray-50 p-6 rounded-2xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">100% Seguro</h3>
                <p className="text-sm text-gray-600">Compra Protegida</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-4 bg-gray-50 p-6 rounded-2xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">Frete Grátis</h3>
                <p className="text-sm text-gray-600">Acima de R$ 200</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-4 bg-gray-50 p-6 rounded-2xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">Melhor Preço</h3>
                <p className="text-sm text-gray-600">Garantido</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center bg-gray-50 p-6 rounded-2xl hover:shadow-lg transition-shadow duration-300">
              <img 
                src="/lovable-uploads/103e7d18-a70a-497f-a476-e6c513079b69.png" 
                alt="Revenda Oficial Sony PlayStation" 
                className="h-16 object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Produtos */}
      <section id="produtos" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              NOSSOS <span className="text-red-600">PRODUTOS</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore nossa coleção exclusiva de jogos e acessórios gamers selecionados especialmente para você
            </p>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <div className="text-xl text-gray-400">Carregando produtos incríveis...</div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <img 
                src="/lovable-uploads/ad940e09-b6fc-44a8-98a5-3247986d6f98.png" 
                alt="Nenhum produto" 
                className="w-32 h-32 mx-auto mb-6 opacity-50"
              />
              <div className="text-2xl text-gray-400 mb-2">Nenhum produto disponível no momento</div>
              <p className="text-gray-500">Em breve teremos novidades incríveis para você!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
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

      {/* Footer Melhorado */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <img 
                  src="/lovable-uploads/a514a032-d79a-4bc4-a10e-3c9f0f9cde73.png" 
                  alt="UTI DOS GAMES" 
                  className="w-16 h-16 object-contain"
                />
                <div>
                  <h3 className="text-2xl font-bold text-red-400">UTI DOS GAMES</h3>
                  <p className="text-gray-400">A loja de games mais tradicional de Colatina</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                Há mais de 10 anos oferecendo os melhores produtos gamer com qualidade garantida, 
                preços justos e atendimento excepcional.
              </p>
              <img 
                src="/lovable-uploads/136bb734-dc02-4a5a-a4b8-300ce6d655b1.png" 
                alt="Mascote Feliz" 
                className="w-20 h-20 object-contain"
              />
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-6 text-red-400">Links Úteis</h4>
              <ul className="space-y-3">
                <li><a href="#produtos" className="text-gray-400 hover:text-white transition-colors duration-200">Produtos</a></li>
                <li><a href="#sobre" className="text-gray-400 hover:text-white transition-colors duration-200">Sobre Nós</a></li>
                <li><a href="#contato" className="text-gray-400 hover:text-white transition-colors duration-200">Contato</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Política de Privacidade</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Termos de Uso</a></li>
              </ul>
            </div>
            
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
              <div className="flex space-x-4 mt-4 md:mt-0">
                <Button variant="outline" size="sm" className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white">
                  Instagram
                </Button>
                <Button variant="outline" size="sm" className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white">
                  WhatsApp
                </Button>
              </div>
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
