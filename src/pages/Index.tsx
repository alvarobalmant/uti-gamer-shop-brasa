import { useState } from 'react';
import { ShoppingCart, Plus, Minus, Settings, LogIn, User, LogOut, Star, Shield, Truck, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { AuthModal } from '@/components/Auth/AuthModal';
import ProductCard from '@/components/ProductCard';
import Cart from '@/components/Cart';

interface CartItem {
  product: any;
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

  const addToCart = (product: any, size: string, color: string) => {
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header Profissional */}
      <header className="sticky top-0 z-50 bg-white shadow-lg border-b-4 border-red-600">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/a514a032-d79a-4bc4-a10e-3c9f0f9cde73.png" 
                alt="UTI DOS GAMES" 
                className="w-16 h-16 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-red-600">
                  UTI DOS GAMES
                </h1>
                <p className="text-sm text-gray-600 font-medium">Sua loja gamer de confiança</p>
              </div>
            </div>
            
            {/* Menu Central */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#produtos" className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200">
                Produtos
              </a>
              <a href="#sobre" className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200">
                Sobre Nós
              </a>
              <a href="#contato" className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200">
                Contato
              </a>
            </nav>
            
            {/* Botões de Ação */}
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  {isAdmin && (
                    <Button
                      onClick={() => navigate('/admin')}
                      className="bg-gray-100 text-gray-700 hover:bg-red-600 hover:text-white border-2 border-gray-300 hover:border-red-600 transition-all duration-300"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Admin
                    </Button>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
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
                  className="bg-white text-red-600 border-2 border-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 font-semibold"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              )}
              
              <Button
                onClick={() => setShowCart(!showCart)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Carrinho ({cart.reduce((sum, item) => sum + item.quantity, 0)})
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Banner Hero */}
      <section className="relative bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                GAMING DE
                <span className="block text-white drop-shadow-lg">ALTO NÍVEL</span>
              </h2>
              <p className="text-xl mb-8 text-red-100 leading-relaxed">
                Descubra os melhores jogos e acessórios para sua setup gamer. 
                Qualidade garantida e preços imbatíveis!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="bg-white text-red-600 hover:bg-gray-100 font-bold py-4 px-8 text-lg rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
                  onClick={() => document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Ver Produtos
                </Button>
                <Button 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-red-600 font-bold py-4 px-8 text-lg rounded-lg transition-all duration-300"
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
                className="w-80 h-80 object-contain animate-bounce"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Selos de Confiança */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex items-center justify-center space-x-3 bg-white p-6 rounded-lg shadow-sm">
              <Shield className="w-8 h-8 text-red-600" />
              <div>
                <h3 className="font-bold text-gray-800">100% Seguro</h3>
                <p className="text-sm text-gray-600">Compra Protegida</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3 bg-white p-6 rounded-lg shadow-sm">
              <Truck className="w-8 h-8 text-red-600" />
              <div>
                <h3 className="font-bold text-gray-800">Frete Grátis</h3>
                <p className="text-sm text-gray-600">Acima de R$ 200</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3 bg-white p-6 rounded-lg shadow-sm">
              <Star className="w-8 h-8 text-red-600" />
              <div>
                <h3 className="font-bold text-gray-800">Melhor Preço</h3>
                <p className="text-sm text-gray-600">Garantido</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
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
      <section id="produtos" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              NOSSOS <span className="text-red-600">PRODUTOS</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore nossa coleção exclusiva de jogos e acessórios gamers
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-xl text-gray-400">Carregando produtos...</div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <img 
                src="/lovable-uploads/ad940e09-b6fc-44a8-98a5-3247986d6f98.png" 
                alt="Nenhum produto" 
                className="w-32 h-32 mx-auto mb-4 opacity-50"
              />
              <div className="text-xl text-gray-400">Nenhum produto disponível no momento.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  getPlatformColor={getPlatformColor}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/lovable-uploads/a514a032-d79a-4bc4-a10e-3c9f0f9cde73.png" 
                  alt="UTI DOS GAMES" 
                  className="w-12 h-12 object-contain"
                />
                <h3 className="text-xl font-bold text-red-400">UTI DOS GAMES</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Sua loja gamer de confiança. Os melhores produtos com qualidade garantida.
              </p>
              <img 
                src="/lovable-uploads/136bb734-dc02-4a5a-a4b8-300ce6d655b1.png" 
                alt="Mascote Feliz" 
                className="w-16 h-16 object-contain"
              />
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4 text-red-400">Links Úteis</h4>
              <ul className="space-y-2">
                <li><a href="#produtos" className="text-gray-400 hover:text-white transition-colors">Produtos</a></li>
                <li><a href="#sobre" className="text-gray-400 hover:text-white transition-colors">Sobre Nós</a></li>
                <li><a href="#contato" className="text-gray-400 hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Política de Privacidade</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4 text-red-400">Contato</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📱 WhatsApp: (27) 99688-2090</li>
                <li>📧 Email: contato@utidosgames.com</li>
                <li>🕒 Atendimento: 9h às 18h</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4 text-red-400">Redes Sociais</h4>
              <div className="flex space-x-4">
                <Button variant="outline" size="sm" className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white">
                  Instagram
                </Button>
                <Button variant="outline" size="sm" className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white">
                  WhatsApp
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 UTI DOS GAMES. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Cart */}
      <Cart 
        cart={cart}
        showCart={showCart}
        setShowCart={setShowCart}
        updateQuantity={updateQuantity}
        sendToWhatsApp={sendToWhatsApp}
      />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

export default Index;
