
import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { AuthModal } from '@/components/Auth/AuthModal';
import ProductCard, { Product } from '@/components/ProductCard';
import Cart from '@/components/Cart';
import HeroBannerCarousel from '@/components/HeroBannerCarousel';
import ServiceCards from '@/components/ServiceCards';
import ProfessionalHeader from '@/components/Header/ProfessionalHeader';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { products, loading } = useProducts();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { cart, addToCart, updateQuantity, getCartTotal, getCartItemsCount } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Use scroll position hook
  useScrollPosition();

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

  const featuredProducts = products.slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfessionalHeader 
        onCartOpen={() => setShowCart(true)}
        onAuthOpen={() => setShowAuthModal(true)}
      />

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
        updateQuantity={updateQuantity}
        sendToWhatsApp={sendToWhatsApp}
      />

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default Index;
