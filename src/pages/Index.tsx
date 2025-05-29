import { useState, useEffect } from 'react';
import { useProducts, Product } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { AuthModal } from '@/components/Auth/AuthModal';
import ProductCard from '@/components/ProductCard';
import Cart from '@/components/Cart';
import HeroBannerCarousel from '@/components/HeroBannerCarousel';
import HeroQuickLinks from '@/components/HeroQuickLinks'; // Assuming this component exists or is created
import PromotionalBanner from '@/components/PromotionalBanner'; // Import the new banner
import ServiceCards from '@/components/ServiceCards';
import ProfessionalHeader from '@/components/Header/ProfessionalHeader';
import { useCart } from '@/contexts/CartContext';
import FeaturedProductsSection from '@/components/FeaturedProducts/FeaturedProductsSection';
import Footer from '@/components/Footer'; // Assuming a Footer component exists or will be created

// **Radical Redesign - Home Page Layout Reorganization**
const Index = () => {
  const { products, loading } = useProducts();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { items, addToCart, updateQuantity, getCartTotal, getCartItemsCount, sendToWhatsApp } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { setupScrollRestoration } = useScrollPosition();

  // Placeholder for fetching banner data (replace with actual logic, e.g., from useSettings hook)
  const [bannerData, setBannerData] = useState({
    imageUrl: '/banners/uti-pro-banner.webp', // Example placeholder image
    title: 'Desbloqueie Vantagens com UTI PRO!',
    description: 'Tenha acesso a descontos exclusivos, frete grátis e muito mais. Torne-se membro hoje mesmo!',
    buttonText: 'Saiba Mais sobre UTI PRO',
    buttonLink: '/uti-pro', // Link to the UTI PRO page
    // Optional: backgroundColor: 'bg-uti-pro-gradient', textColor: 'text-white'
  });

  useEffect(() => {
    const cleanup = setupScrollRestoration();
    // TODO: Fetch actual banner data from backend/CMS here and setBannerData
    return cleanup;
  }, [setupScrollRestoration]);

  const handleAddToCart = (product: Product, size?: string, color?: string) => {
    addToCart(product, size, color);
    // Optional: Show toast notification
  };

  // Removed getPlatformColor as it's likely handled within ProductCard now

  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden flex flex-col">
      <ProfessionalHeader 
        onCartOpen={() => setShowCart(true)}
        onAuthOpen={() => setShowAuthModal(true)}
      />

      <main className="flex-grow">
        {/* Hero Section */}
        <HeroBannerCarousel />
        
        {/* Quick Links Section (Below Hero) */}
        <HeroQuickLinks /> 

        {/* Promotional Banner (UTI PRO) - Placed after quick links */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <PromotionalBanner {...bannerData} />
        </div>

        {/* Featured Products Section */}
        <FeaturedProductsSection 
          products={products} // Pass only relevant products (e.g., featured)
          loading={loading}
          onAddToCart={handleAddToCart}
          title="Destaques da Semana" // Example title
        />

        {/* Service Cards Section (Can be placed higher or lower depending on priority) */}
        <ServiceCards />

        {/* Other sections can be added here (e.g., New Releases, Top Categories) */}

      </main>

      {/* Footer */}
      <Footer />

      {/* Cart Component */}
      <Cart
        cart={items}
        showCart={showCart}
        setShowCart={setShowCart}
        updateQuantity={updateQuantity}
        sendToWhatsApp={sendToWhatsApp} // Ensure this is still needed/functional
      />

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default Index;

