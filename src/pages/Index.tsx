import { useState, useEffect } from 'react';
import { useProducts, Product } from '@/hooks/useProducts'; // Updated import
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { AuthModal } from '@/components/Auth/AuthModal';
import Cart from '@/components/Cart';
import HeroBannerCarousel from '@/components/HeroBannerCarousel';
import HeroQuickLinks from '@/components/HeroQuickLinks'; // Import HeroQuickLinks
import PromotionalBanner from '@/components/PromotionalBanner';
// Import the new separated service/contact components
import SpecializedServices from '@/components/ServiceCards/SpecializedServices';
import WhyChooseUs from '@/components/ServiceCards/WhyChooseUs';
import ContactHelp from '@/components/ServiceCards/ContactHelp';
import ProfessionalHeader from '@/components/Header/ProfessionalHeader';
import { useCart } from '@/contexts/CartContext';
import FeaturedProductsSection from '@/components/FeaturedProducts/FeaturedProductsSection';
import Footer from '@/components/Footer';
import { useHomepageLayout } from '@/hooks/useHomepageLayout';
import { useProductSections } from '@/hooks/useProductSections';

// Dynamic Homepage Layout based on database configuration
const Index = () => {
  const { products, loading: productsLoading, refetch: refetchProducts } = useProducts();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { items, addToCart, updateQuantity, getCartTotal, getCartItemsCount, sendToWhatsApp } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
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

  // Retry mechanism for failed loads
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    // Se houve erro no carregamento e ainda temos tentativas, tenta novamente
    if (products.length === 0 && !productsLoading && retryCount < MAX_RETRIES) {
      const timer = setTimeout(() => {
        console.log(`Tentativa ${retryCount + 1} de ${MAX_RETRIES} para carregar produtos`);
        setRetryCount(prev => prev + 1);
        refetchProducts();
      }, 2000 * (retryCount + 1)); // Delay incrementa a cada tentativa

      return () => clearTimeout(timer);
    }
  }, [products.length, productsLoading, retryCount, refetchProducts]);

  // Placeholder for fetching banner data (replace with actual logic)
  useEffect(() => {
    // TODO: Fetch actual banner data
  }, []);

  const handleAddToCart = (product: any, size?: string, color?: string) => {
    addToCart(product, size, color);
  };

  // Render section based on section key
  const renderSection = (sectionKey: string) => {
    switch (sectionKey) {
      case 'hero_banner':
        return <HeroBannerCarousel key="hero_banner" />;
      
      // Add case for HeroQuickLinks
      case 'hero_quick_links':
        return <HeroQuickLinks key="hero_quick_links" />;

      case 'promo_banner':
        return (
          <div key="promo_banner" className="container mx-auto px-4 sm:px-6 lg:px-8 my-8 md:my-12">
            <PromotionalBanner {...bannerData} />
          </div>
        );
      
      // Replace 'service_cards' with individual components
      case 'specialized_services':
        return <SpecializedServices key="specialized_services" />;
      case 'why_choose_us':
        return <WhyChooseUs key="why_choose_us" />;
      case 'contact_help':
        return <ContactHelp key="contact_help" />;
      
      default:
        // Handle product sections
        if (sectionKey.startsWith('product_section_')) {
          const sectionId = sectionKey.replace('product_section_', '');
          const section = sections.find(s => s.id === sectionId);
          
          if (!section) return null;
          
          // --- BUG FIX: Deduplicate products --- 
          const productMap = new Map<string, Product>(); // Use a Map to store unique products by ID
          
          if (section.items) {
            for (const item of section.items) {
              if (item.item_type === 'product') {
                // Find specific product by ID
                const product = products.find(p => p.id === item.item_id);
                if (product && !productMap.has(product.id)) { // Check if not already added
                  productMap.set(product.id, product);
                }
              } else if (item.item_type === 'tag') {
                // Find products with this tag
                const tagProducts = products.filter(p => 
                  p.tags?.some(tag => tag.name.toLowerCase() === item.item_id.toLowerCase() || tag.id === item.item_id)
                );
                // Add tag products to the map, overwriting duplicates (which is fine)
                tagProducts.forEach(product => {
                  if (!productMap.has(product.id)) { // Check if not already added
                     productMap.set(product.id, product);
                  }
                });
              }
            }
          }
          
          const uniqueSectionProducts = Array.from(productMap.values()); // Get unique products from the map
          // --- END BUG FIX ---
          
          return (
            <FeaturedProductsSection
              key={sectionKey}
              products={uniqueSectionProducts} // Pass unique products
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

  // Show error state if we've exhausted retries and still no products
  const showErrorState = !productsLoading && products.length === 0 && retryCount >= MAX_RETRIES;

  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden flex flex-col">
      {/* Header */}
      <ProfessionalHeader
        onCartOpen={() => setShowCart(true)}
        onAuthOpen={() => setShowAuthModal(true)}
      />

      <main className="flex-grow">
        {/* Show error state if products failed to load */}
        {showErrorState && (
          <div className="container mx-auto px-4 py-8">
            <div className="text-center bg-red-50 border border-red-200 rounded-lg p-8">
              <h2 className="text-xl font-semibold text-red-800 mb-2">
                Erro ao carregar produtos
              </h2>
              <p className="text-red-600 mb-4">
                Não foi possível carregar os produtos. Verifique sua conexão com a internet.
              </p>
              <button 
                onClick={() => {
                  setRetryCount(0);
                  refetchProducts();
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        )}

        {/* Render sections dynamically based on layout configuration */}
        {!showErrorState && (isLoading ? (
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">Carregando...</div>
          </div>
        ) : (
          layoutItems
            .filter(item => item.is_visible) // Only show visible sections
            .sort((a, b) => a.display_order - b.display_order) // Sort by display order
            .map(item => renderSection(item.section_key))
            .filter(Boolean) // Remove null sections
        ))}
      </main>

      {/* Footer */}
      <Footer />

      {/* Cart Component */}
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
