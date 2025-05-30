
import { useState, useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { AuthModal } from '@/components/Auth/AuthModal';
import Cart from '@/components/Cart';
import HeroBannerCarousel from '@/components/HeroBannerCarousel';
import PromotionalBanner from '@/components/PromotionalBanner';
import ServiceCards from '@/components/ServiceCards';
import ProfessionalHeader from '@/components/Header/ProfessionalHeader';
import { useCart } from '@/contexts/CartContext';
import FeaturedProductsSection from '@/components/FeaturedProducts/FeaturedProductsSection';
import Footer from '@/components/Footer';
import { useHomepageLayout } from '@/hooks/useHomepageLayout';
import { useProductSections } from '@/hooks/useProductSections';

// Dynamic Homepage Layout based on database configuration
const Index = () => {
  const { products, loading: productsLoading } = useProducts();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { items, addToCart, updateQuantity, getCartTotal, getCartItemsCount, sendToWhatsApp } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { setupScrollRestoration } = useScrollPosition();
  
  // Fetch homepage layout and product sections
  const { layoutItems, loading: layoutLoading } = useHomepageLayout();
  const { sections, loading: sectionsLoading } = useProductSections();

  // Placeholder for fetching banner data (replace with actual logic)
  const [bannerData, setBannerData] = useState({
    imageUrl: '/banners/uti-pro-banner.webp',
    title: 'Desbloqueie Vantagens com UTI PRO!',
    description: 'Tenha acesso a descontos exclusivos, frete grátis e muito mais. Torne-se membro hoje mesmo!',
    buttonText: 'Saiba Mais sobre UTI PRO',
    buttonLink: '/uti-pro',
    targetBlank: false,
  });

  useEffect(() => {
    const cleanup = setupScrollRestoration();
    // TODO: Fetch actual banner data
    return cleanup;
  }, [setupScrollRestoration]);

  const handleAddToCart = (product: any, size?: string, color?: string) => {
    addToCart(product, size, color);
  };

  // Render section based on section key
  const renderSection = (sectionKey: string) => {
    switch (sectionKey) {
      case 'hero_banner':
        return <HeroBannerCarousel key="hero_banner" />;
      
      case 'promo_banner':
        return (
          <div key="promo_banner" className="container mx-auto px-4 sm:px-6 lg:px-8 my-8 md:my-12">
            <PromotionalBanner {...bannerData} />
          </div>
        );
      
      case 'service_cards':
        return <ServiceCards key="service_cards" />;
      
      default:
        // Handle product sections
        if (sectionKey.startsWith('product_section_')) {
          const sectionId = sectionKey.replace('product_section_', '');
          const section = sections.find(s => s.id === sectionId);
          
          if (!section) return null;
          
          // Filter products based on section items
          let sectionProducts = [];
          if (section.items) {
            for (const item of section.items) {
              if (item.item_type === 'product') {
                // Find specific product by ID
                const product = products.find(p => p.id === item.item_id);
                if (product) sectionProducts.push(product);
              } else if (item.item_type === 'tag') {
                // Find products with this tag
                const tagProducts = products.filter(p => 
                  p.tags?.some(tag => tag.name.toLowerCase() === item.item_id.toLowerCase() || tag.id === item.item_id)
                );
                sectionProducts.push(...tagProducts);
              }
            }
          }
          
          return (
            <FeaturedProductsSection
              key={sectionKey}
              products={sectionProducts}
              loading={productsLoading || sectionsLoading}
              onAddToCart={handleAddToCart}
              title={section.title}
              viewAllLink={section.view_all_link || undefined}
            />
          );
        }
        
        return null;
    }
  };

  const isLoading = layoutLoading || sectionsLoading;

  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden flex flex-col">
      {/* Header */}
      <ProfessionalHeader
        onCartOpen={() => setShowCart(true)}
        onAuthOpen={() => setShowAuthModal(true)}
      />

      <main className="flex-grow">
        {/* Render sections dynamically based on layout configuration */}
        {isLoading ? (
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">Carregando...</div>
          </div>
        ) : (
          layoutItems
            .filter(item => item.is_visible) // Only show visible sections
            .sort((a, b) => a.display_order - b.display_order) // Sort by display order
            .map(item => renderSection(item.section_key))
            .filter(Boolean) // Remove null sections
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Cart Component - Fixed props to match CartSheetProps interface */}
      <Cart
        showCart={showCart}
        setShowCart={setShowCart}
      />

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default Index;
