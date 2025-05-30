import { useState, useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts'; // Removed unused Product type
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { AuthModal } from '@/components/Auth/AuthModal';
import Cart from '@/components/Cart';
import HeroBannerCarousel from '@/components/HeroBannerCarousel';
import HeroQuickLinks from '@/components/HeroQuickLinks';
import PromotionalBanner from '@/components/PromotionalBanner';
import ServiceCards from '@/components/ServiceCards'; // Contains Services, Benefits, Contact
import ProfessionalHeader from '@/components/Header/ProfessionalHeader';
import { useCart } from '@/contexts/CartContext';
import FeaturedProductsSection from '@/components/FeaturedProducts/FeaturedProductsSection';
import Footer from '@/components/Footer';
// SectionTitle is used within FeaturedProductsSection and ServiceCards

// **Radical Redesign - Home Page Layout Reorganization**
const Index = () => {
  const { products, loading } = useProducts();
  const { user, isAdmin, signOut } = useAuth(); // Keep auth hooks
  const navigate = useNavigate(); // Keep navigate
  const { items, addToCart, updateQuantity, getCartTotal, getCartItemsCount, sendToWhatsApp } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { setupScrollRestoration } = useScrollPosition();

  // Placeholder for fetching banner data (replace with actual logic)
  const [bannerData, setBannerData] = useState({
    imageUrl: '/banners/uti-pro-banner.webp',
    title: 'Desbloqueie Vantagens com UTI PRO!',
    description: 'Tenha acesso a descontos exclusivos, frete grátis e muito mais. Torne-se membro hoje mesmo!',
    buttonText: 'Saiba Mais sobre UTI PRO',
    buttonLink: '/uti-pro',
    targetBlank: false, // Ensure link opens in the same tab
  });

  // Placeholder for fetching featured sections data (replace with actual logic, potentially from admin)
  // Added more example sections
  const [featuredSections, setFeaturedSections] = useState([
    { id: 'destaques', title: 'Destaques da Semana', tag: 'featured', viewAllLink: '/categoria/destaques' },
    { id: 'novidades', title: 'Novidades', tag: 'new', viewAllLink: '/categoria/novidades' },
    { id: 'mais_vendidos', title: 'Mais Vendidos', tag: 'bestseller', viewAllLink: '/categoria/mais-vendidos' },
    // Add more sections as needed or fetch dynamically
  ]);

  useEffect(() => {
    const cleanup = setupScrollRestoration();
    // TODO: Fetch actual banner data & featured sections data
    return cleanup;
  }, [setupScrollRestoration]);

  // handleAddToCart remains the same, passed to FeaturedProductsSection
  const handleAddToCart = (product: any, size?: string, color?: string) => {
    addToCart(product, size, color);
  };

  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden flex flex-col">
      {/* Header - Redesigned */}
      <ProfessionalHeader
        onCartOpen={() => setShowCart(true)}
        onAuthOpen={() => setShowAuthModal(true)}
      />

      <main className="flex-grow">
        {/* Hero Section (includes Quick Links) */}
        <HeroBannerCarousel />

        {/* Promotional Banner (UTI PRO) */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-8 md:my-12"> {/* Added margin */}
          <PromotionalBanner {...bannerData} />
        </div>

        {/* Dynamically Rendered Featured Products Sections */}
        {featuredSections.map((section) => (
          <FeaturedProductsSection
            key={section.id}
            // Filter products based on section tag or fetch specific products per section
            // Example filtering - adjust based on actual product data structure
            products={products.filter(p => p.tags?.some(t => t.name.toLowerCase() === section.tag) || section.tag === 'featured')} 
            loading={loading}
            onAddToCart={handleAddToCart}
            title={section.title} // Use dynamic title
            viewAllLink={section.viewAllLink} // Pass the specific link
          />
        ))}

        {/* Service Cards Section (Includes Services, Benefits, Contact) - Redesigned for mobile */}
        <ServiceCards />

      </main>

      {/* Footer - Redesigned */}
      <Footer />

      {/* Cart Component */}
      <Cart
        cart={items}
        showCart={showCart}
        setShowCart={setShowCart}
        updateQuantity={updateQuantity} // Pass the correct update function
        sendToWhatsApp={sendToWhatsApp}
      />

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default Index;

