
import { useState, useEffect } from 'react';
import { useProducts, Product } from '@/hooks/useProducts'; // Import Product type
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
// Removed import { useScrollPosition } from '@/hooks/useScrollPosition';
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
  console.log('Index component: Starting render');
  
  const { products, loading: productsLoading } = useProducts();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { items, addToCart, updateQuantity, getCartTotal, getCartItemsCount, sendToWhatsApp } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  console.log('Index component: Products loading:', productsLoading, 'Products count:', products.length);
  
  // Fetch homepage layout and product sections
  const { layoutItems, loading: layoutLoading, error: layoutError } = useHomepageLayout();
  const { sections, loading: sectionsLoading, error: sectionsError } = useProductSections();

  console.log('Index component: Layout loading:', layoutLoading, 'Layout items:', layoutItems.length);
  console.log('Index component: Sections loading:', sectionsLoading, 'Sections count:', sections.length);
  console.log('Index component: Layout error:', layoutError);
  console.log('Index component: Sections error:', sectionsError);

  // Placeholder for fetching banner data (replace with actual logic)
  const [bannerData, setBannerData] = useState({
    imageUrl: '/banners/uti-pro-banner.webp',
    title: 'Desbloqueie Vantagens com UTI PRO!',
    description: 'Tenha acesso a descontos exclusivos, frete grátis e muito mais. Torne-se membro hoje mesmo!',
    buttonText: 'Saiba Mais sobre UTI PRO',
    buttonLink: '/uti-pro',
    targetBlank: false,
  });

  // Removed useEffect for setupScrollRestoration - This is handled globally by useScrollRestoration
  useEffect(() => {
    console.log('Index component: useEffect banner data initialization');
    // TODO: Fetch actual banner data
  }, []);

  const handleAddToCart = (product: any, size?: string, color?: string) => {
    console.log('Index component: Adding to cart:', product.name);
    addToCart(product, size, color);
  };

  // Render section based on section key
  const renderSection = (sectionKey: string) => {
    console.log('Index component: Rendering section:', sectionKey);
    
    try {
      switch (sectionKey) {
        case 'hero_banner':
          console.log('Index component: Rendering hero_banner');
          return <HeroBannerCarousel key="hero_banner" />;
        
        // Add case for HeroQuickLinks
        case 'hero_quick_links':
          console.log('Index component: Rendering hero_quick_links');
          return <HeroQuickLinks key="hero_quick_links" />;

        case 'promo_banner':
          console.log('Index component: Rendering promo_banner');
          return (
            <div key="promo_banner" className="container mx-auto px-4 sm:px-6 lg:px-8 my-8 md:my-12">
              <PromotionalBanner {...bannerData} />
            </div>
          );
        
        // Replace 'service_cards' with individual components
        case 'specialized_services':
          console.log('Index component: Rendering specialized_services');
          return <SpecializedServices key="specialized_services" />;
        case 'why_choose_us':
          console.log('Index component: Rendering why_choose_us');
          return <WhyChooseUs key="why_choose_us" />;
        case 'contact_help':
          console.log('Index component: Rendering contact_help');
          return <ContactHelp key="contact_help" />;
        
        default:
          // Handle product sections
          if (sectionKey.startsWith('product_section_')) {
            console.log('Index component: Rendering product section:', sectionKey);
            const sectionId = sectionKey.replace('product_section_', '');
            const section = sections.find(s => s.id === sectionId);
            
            if (!section) {
              console.log('Index component: Section not found for key:', sectionKey);
              return null;
            }
            
            console.log('Index component: Found section:', section.title, 'Items:', section.items?.length);
            
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
            console.log('Index component: Unique products for section:', uniqueSectionProducts.length);
            
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
          
          console.log('Index component: Unknown section key:', sectionKey);
          return null;
      }
    } catch (error) {
      console.error('Index component: Error rendering section:', sectionKey, error);
      return null;
    }
  };

  const isLoading = layoutLoading || sectionsLoading;
  console.log('Index component: Overall loading state:', isLoading);

  console.log('Index component: About to render, layout items count:', layoutItems.length);

  // Add fallback for completely empty state
  if (!isLoading && layoutItems.length === 0 && !layoutError && !sectionsError) {
    console.log('Index component: No layout items found, showing fallback content');
    return (
      <div className="min-h-screen bg-background w-full overflow-x-hidden flex flex-col">
        <ProfessionalHeader
          onCartOpen={() => setShowCart(true)}
          onAuthOpen={() => setShowAuthModal(true)}
        />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Bem-vindo à UTI DOS GAMES</h1>
              <p>O layout da página está sendo configurado. Por favor, acesse o painel administrativo para configurar as seções.</p>
            </div>
          </div>
        </main>
        <Footer />
        <Cart showCart={showCart} setShowCart={setShowCart} />
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    );
  }

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
            <div className="text-center">Carregando layout da página...</div>
          </div>
        ) : layoutError || sectionsError ? (
          // Error state
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-red-600">
              <p>Ocorreu um erro ao carregar o conteúdo da página inicial.</p>
              <p>Por favor, tente recarregar a página ou contate o suporte se o problema persistir.</p>
              {layoutError && <p className="text-sm mt-2">Erro Layout: {layoutError}</p>}
              {sectionsError && <p className="text-sm mt-2">Erro Seções: {sectionsError}</p>}
            </div>
          </div>
        ) : (
          <>
            {console.log('Index component: Rendering layout items:', layoutItems.length)}
            {layoutItems
              .filter(item => {
                console.log('Index component: Checking visibility for item:', item.section_key, item.is_visible);
                return item.is_visible;
              })
              .sort((a, b) => a.display_order - b.display_order)
              .map(item => {
                console.log('Index component: About to render item:', item.section_key);
                const rendered = renderSection(item.section_key);
                console.log('Index component: Rendered result for', item.section_key, ':', !!rendered);
                return rendered;
              })
              .filter(Boolean)}
          </>
        )}
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
