
import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { AuthModal } from '@/components/Auth/AuthModal';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/hooks/useProducts';
import Cart from '@/components/Cart';
import HeroBannerCarousel from '@/components/HeroBannerCarousel';
import ServiceCards from '@/components/ServiceCards';
import ProfessionalHeader from '@/components/Header/ProfessionalHeader';
import { useCart } from '@/contexts/CartContext';
import FeaturedProductsSection from '@/components/FeaturedProducts/FeaturedProductsSection';

const Index = () => {
  const { products, loading } = useProducts();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { items, addToCart, updateQuantity, getCartTotal, getCartItemsCount, sendToWhatsApp } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Use scroll position hook
  useScrollPosition();

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

  const handleAddToCart = (product: Product, size?: string, color?: string) => {
    addToCart(product, size, color);
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      <ProfessionalHeader 
        onCartOpen={() => setShowCart(true)}
        onAuthOpen={() => setShowAuthModal(true)}
      />

      {/* Hero Banner Carousel with Mobile Optimization */}
      <div className="w-full overflow-x-hidden">
        <HeroBannerCarousel />
      </div>

      {/* Service Cards - Hidden on very small mobile screens */}
      <div className="w-full overflow-x-hidden hidden sm:block">
        <ServiceCards />
      </div>

      {/* Featured Products Section with Mobile Optimization */}
      <FeaturedProductsSection 
        products={products}
        loading={loading}
        onAddToCart={handleAddToCart}
        getPlatformColor={getPlatformColor}
      />

      {/* Footer - Mobile Optimized */}
      <footer className="bg-gray-900 text-white py-6 lg:py-8 w-full overflow-x-hidden">
        <div className="w-full max-w-full px-4 mx-auto">
          <div className="text-center mb-4 lg:mb-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div>
                <h3 className="text-lg lg:text-xl font-bold text-red-400">UTI DOS GAMES</h3>
                <p className="text-gray-400 text-xs lg:text-sm">A loja de games mais tradicional de Colatina</p>
              </div>
            </div>
          </div>
          
          {/* Mobile: Stack vertically, Desktop: Grid */}
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 lg:gap-6 mb-4 lg:mb-6 w-full">
            <div className="min-w-0">
              <h4 className="font-bold mb-2 lg:mb-3 text-red-400 text-sm lg:text-base">Links Úteis</h4>
              <div className="grid grid-cols-2 lg:flex lg:flex-col gap-1 lg:gap-2 text-xs lg:text-sm">
                <button onClick={() => navigate('/categoria/playstation')} className="text-gray-400 hover:text-white text-left min-h-[44px] lg:min-h-auto py-2 lg:py-0">PlayStation</button>
                <button onClick={() => navigate('/categoria/xbox')} className="text-gray-400 hover:text-white text-left min-h-[44px] lg:min-h-auto py-2 lg:py-0">Xbox</button>
                <button onClick={() => navigate('/categoria/nintendo')} className="text-gray-400 hover:text-white text-left min-h-[44px] lg:min-h-auto py-2 lg:py-0">Nintendo</button>
                <button onClick={() => navigate('/categoria/pc')} className="text-gray-400 hover:text-white text-left min-h-[44px] lg:min-h-auto py-2 lg:py-0">PC</button>
              </div>
            </div>
            
            <div className="min-w-0">
              <h4 className="font-bold mb-2 lg:mb-3 text-red-400 text-sm lg:text-base">Contato</h4>
              <ul className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-400">
                <li className="truncate">📱 (27) 99688-2090</li>
                <li className="truncate">📧 contato@utidosgames.com</li>
                <li className="truncate">🕒 Seg à Sex: 9h às 18h</li>
                <li className="truncate">📍 Colatina - ES</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-4 lg:pt-6 text-center w-full">
            <p className="text-gray-400 text-xs lg:text-sm">
              © 2024 UTI DOS GAMES. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Cart Component */}
      <Cart
        cart={items}
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
