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
  const { products, loading: productsLoading } = useProducts();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { items, addToCart, updateQuantity, getCartTotal, getCartItemsCount, sendToWhatsApp } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  // Removed const { setupScrollRestoration } = useScrollPosition();
  
  // Fetch homepage layout and product sections
  const { layoutItems, loading: layoutLoading } = useHomepageLayout();
  const { sections, loading: sectionsLoading } = useProductSections();

  console.log("[Index] Products received:", products); // DEBUG LOG
  console.log("[Index] Sections received:", sections); // DEBUG LOG

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
    // TODO: Fetch actual banner data
  }, []);

  const handleAddToCart = (product: any, size?: string, color?: string) => {
    addToCart(product, size, color);
  };

  // Render section based on section key
  const renderSection = (sectionKey: string) => {
    console.log(`[Index] Renderizando seção: ${sectionKey}`);
    
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
          console.log(`[Index] Buscando seção com ID: ${sectionId}, disponíveis:`, sections.map(s => s.id));
          
          // CORREÇÃO: Usar fallback para seção se não encontrar
          let section = sections.find(s => s.id === sectionId);
          
          if (!section) {
            console.log(`[Index] Seção não encontrada para key: ${sectionKey}, criando fallback`);
            // Criar uma seção fallback para garantir renderização
            section = {
              id: sectionId,
              title: sectionId.charAt(0).toUpperCase() + sectionId.slice(1).replace('_', ' '),
              view_all_link: `/categoria/${sectionId}`,
              items: []
            };
          } else {
            console.log(`[Index] Encontrada seção para key ${sectionKey}:`, section);
          }
          
          // --- BUG FIX: Deduplicate products --- 
          const productMap = new Map<string, Product>(); // Use a Map to store unique products by ID
          
          // CORREÇÃO: Garantir que sempre tenhamos produtos para mostrar
          if (section.items && section.items.length > 0) {
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
                  p.tags?.some(tag => tag.name?.toLowerCase() === item.item_id.toLowerCase() || tag.id === item.item_id)
                );
                // Add tag products to the map, overwriting duplicates (which is fine)
                tagProducts.forEach(product => {
                  if (!productMap.has(product.id)) { // Check if not already added
                     productMap.set(product.id, product);
                  }
                });
              }
            }
          } else if (products.length > 0) {
            // CORREÇÃO: Se não houver itens específicos, mostrar alguns produtos aleatórios
            console.log(`[Index] Sem itens específicos para seção ${sectionKey}, usando produtos aleatórios`);
            // Pegar até 4 produtos aleatórios
            const randomProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, 4);
            randomProducts.forEach(product => {
              productMap.set(product.id, product);
            });
          }
          
          const uniqueSectionProducts = Array.from(productMap.values()); // Get unique products from the map
          console.log(`[Index] Produtos para seção ${sectionKey}:`, uniqueSectionProducts.length);
          
          // CORREÇÃO: Garantir que sempre tenhamos um título válido
          const sectionTitle = section.title || sectionId.charAt(0).toUpperCase() + sectionId.slice(1).replace('_', ' ');
          
          // CORREÇÃO: Sempre renderizar a seção, mesmo sem produtos
          return (
            <FeaturedProductsSection
              key={sectionKey}
              products={uniqueSectionProducts}
              loading={productsLoading || sectionsLoading}
              onAddToCart={handleAddToCart}
              title={sectionTitle}
              viewAllLink={section.view_all_link || `/categoria/${sectionId}`}
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

