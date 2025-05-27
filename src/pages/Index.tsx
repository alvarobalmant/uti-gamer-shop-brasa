
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
import { useCart } from '@/contexts/CartContext';
import FeaturedProductsSection from '@/components/FeaturedProducts/FeaturedProductsSection';
import Footer from '@/components/Footer';

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

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      <ProfessionalHeader 
        onCartOpen={() => setShowCart(true)}
        onAuthOpen={() => setShowAuthModal(true)}
      />

      {/* Hero Banner Carousel with Quick Links */}
      <div className="w-full overflow-x-hidden">
        <HeroBannerCarousel />
      </div>

      {/* Service Cards */}
      <div className="w-full overflow-x-hidden">
        <ServiceCards />
      </div>

      {/* Featured Products Section with Premium Design */}
      <FeaturedProductsSection 
        products={products}
        loading={loading}
        onAddToCart={addToCart}
        getPlatformColor={getPlatformColor}
      />

      {/* Footer Premium */}
      <Footer />

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
