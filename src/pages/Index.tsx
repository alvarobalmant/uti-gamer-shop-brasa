
import { useState, useEffect } from 'react';
import { useProducts, Product } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { AuthModal } from '@/components/Auth/AuthModal';
import Cart from '@/components/Cart';
import HeroBannerCarousel from '@/components/HeroBannerCarousel';
import HeroQuickLinks from '@/components/HeroQuickLinks';
import PromotionalBanner from '@/components/PromotionalBanner';
import SpecializedServices from '@/components/ServiceCards/SpecializedServices';
import WhyChooseUs from '@/components/ServiceCards/WhyChooseUs';
import ContactHelp from '@/components/ServiceCards/ContactHelp';
import ProfessionalHeader from '@/components/Header/ProfessionalHeader';
import { useCart } from '@/contexts/CartContext';
import FeaturedProductsSection from '@/components/FeaturedProducts/FeaturedProductsSection';
import Footer from '@/components/Footer';
import { useHomepageLayout } from '@/hooks/useHomepageLayout';
import { useProductSections } from '@/hooks/useProductSections';
import DataSeeder from '@/components/DataSeeder';

const Index = () => {
  console.log('[Index] Componente Index RENDERIZANDO...');
  const { products, loading: productsLoading, fetchProducts } = useProducts();
  const { user, isAdmin, signOut } = useAuth();
  console.log(`[Index] Estado de autenticação: user=${!!user}, isAdmin=${isAdmin}`);
  const navigate = useNavigate();
  const { items, addToCart, updateQuantity, getCartTotal, getCartItemsCount, sendToWhatsApp } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { layoutItems, loading: layoutLoading, fetchLayout } = useHomepageLayout();
  const { sections, loading: sectionsLoading, fetchProductSections } = useProductSections();

  console.log("[Index] Produtos recebidos (estado):", products);
  console.log("[Index] Seções recebidas (estado):", sections);
  console.log("[Index] Layout recebido (estado):", layoutItems);

  const [bannerData, setBannerData] = useState({
    imageUrl: '/banners/uti-pro-banner.webp',
    title: 'Desbloqueie Vantagens com UTI PRO!',
    description: 'Tenha acesso a descontos exclusivos, frete grátis e muito mais. Torne-se membro hoje mesmo!',
    buttonText: 'Saiba Mais sobre UTI PRO',
    buttonLink: '/uti-pro',
    targetBlank: false,
  });

  useEffect(() => {
    console.log('[Index] useEffect inicial EXECUTANDO...');
    if (!layoutLoading) {
      console.log('[Index] useEffect inicial: Chamando fetchLayout...');
      fetchLayout();
    }
    if (!sectionsLoading) {
      console.log("[Index] useEffect inicial: Chamando fetchProductSections...");
      fetchProductSections();
    }
    console.log('[Index] useEffect inicial: Buscando banners (placeholder)...');
  }, [fetchLayout, fetchProductSections, layoutLoading, sectionsLoading]);

  const handleAddToCart = (product: any, size?: string, color?: string) => {
    addToCart(product, size, color);
  };

  const renderSection = (sectionKey: string) => {
    console.log(`[Index] Renderizando seção: ${sectionKey}`);
    
    switch (sectionKey) {
      case 'hero_banner':
        console.log('[Index] Renderizando HeroBannerCarousel');
        return <HeroBannerCarousel key="hero_banner" />;
      
      case 'hero_quick_links':
        console.log('[Index] Renderizando HeroQuickLinks');
        return <HeroQuickLinks key="hero_quick_links" />;

      case 'promo_banner':
        console.log('[Index] Renderizando PromotionalBanner');
        return (
          <div key="promo_banner" className="container mx-auto px-4 sm:px-6 lg:px-8 my-8 md:my-12">
            <PromotionalBanner {...bannerData} />
          </div>
        );
      
      case 'specialized_services':
        console.log('[Index] Renderizando SpecializedServices');
        return <SpecializedServices key="specialized_services" />;
      case 'why_choose_us':
        console.log('[Index] Renderizando WhyChooseUs');
        return <WhyChooseUs key="why_choose_us" />;
      case 'contact_help':
        console.log('[Index] Renderizando ContactHelp');
        return <ContactHelp key="contact_help" />;
      
      default:
        if (sectionKey.startsWith('product_section_')) {
          const sectionId = sectionKey.replace('product_section_', '');
          console.log(`[Index] Buscando seção de produto com ID: ${sectionId}, disponíveis:`, sections.map(s => s.id));
          
          let section = sections.find(s => s.id === sectionId);
          
          if (!section) {
            console.log(`[Index] Seção de produto não encontrada para key: ${sectionKey}, criando fallback`);
            section = {
              id: sectionId,
              title: sectionId.charAt(0).toUpperCase() + sectionId.slice(1).replace('_', ' '),
              view_all_link: `/categoria/${sectionId}`,
              items: []
            };
          } else {
            console.log(`[Index] Encontrada seção de produto para key ${sectionKey}:`, section);
          }
          
          const productMap = new Map<string, Product>();
          
          if (section.items && section.items.length > 0) {
            console.log(`[Index] Processando itens específicos para seção ${sectionKey}`);
            for (const item of section.items) {
              if (item.item_type === 'product') {
                const product = products.find(p => p.id === item.item_id);
                if (product && !productMap.has(product.id)) {
                  console.log(`[Index] Adicionando produto específico ${product.id} à seção ${sectionKey}`);
                  productMap.set(product.id, product);
                }
              } else if (item.item_type === 'tag') {
                console.log(`[Index] Buscando produtos com tag ${item.item_id} para seção ${sectionKey}`);
                const tagProducts = products.filter(p => 
                  p.tags?.some(tag => tag.name?.toLowerCase() === item.item_id.toLowerCase() || tag.id === item.item_id)
                );
                tagProducts.forEach(product => {
                  if (!productMap.has(product.id)) {
                     console.log(`[Index] Adicionando produto com tag ${item.item_id} (${product.id}) à seção ${sectionKey}`);
                     productMap.set(product.id, product);
                  }
                });
              }
            }
          } else if (products.length > 0) {
            console.log(`[Index] Sem itens específicos para seção ${sectionKey}, usando produtos aleatórios`);
            const randomProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, 4);
            randomProducts.forEach(product => {
              productMap.set(product.id, product);
            });
          }
          
          const uniqueSectionProducts = Array.from(productMap.values());
          console.log(`[Index] Produtos finais para seção ${sectionKey}:`, uniqueSectionProducts.length);
          
          const sectionTitle = section.title || sectionId.charAt(0).toUpperCase() + sectionId.slice(1).replace('_', ' ');
          
          console.log(`[Index] Renderizando FeaturedProductsSection para ${sectionKey} com ${uniqueSectionProducts.length} produtos`);
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
        
        console.warn(`[Index] Chave de seção desconhecida ou não tratada: ${sectionKey}`);
        return null;
    }
  };

  const isLoading = layoutLoading || sectionsLoading;
  console.log(`[Index] Estado de carregamento geral: isLoading=${isLoading} (layoutLoading=${layoutLoading}, sectionsLoading=${sectionsLoading})`);

  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden flex flex-col">
      <DataSeeder />
      
      <ProfessionalHeader
        onCartOpen={() => setShowCart(true)}
        onAuthOpen={() => setShowAuthModal(true)}
      />

      <main className="flex-grow">
        {isLoading ? (
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">Carregando layout da página...</div>
          </div>
        ) : (
          layoutItems
            .filter(item => item.is_visible)
            .sort((a, b) => a.display_order - b.display_order)
            .map(item => renderSection(item.section_key))
            .filter(Boolean)
        )}
      </main>

      <Footer />

      <Cart
        showCart={showCart}
        setShowCart={setShowCart}
      />

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default Index;
