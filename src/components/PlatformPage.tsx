import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePages, Page, PageLayoutItem } from '@/hooks/usePages';
import { useProducts, Product } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FeaturedProductsSection from '@/components/FeaturedProducts/FeaturedProductsSection';
import HeroBanner from '@/components/HeroBanner';
import ProductModal from '@/components/ProductModal';

// Componente base para páginas de plataforma
const PlatformPage: React.FC<{ slug: string }> = ({ slug }) => {
  const { products, loading: productsLoading } = useProducts();
  const { addToCart } = useCart();
  const { getPageBySlug, fetchPageLayout, pageLayouts, loading: pageLoading } = usePages();
  
  const [page, setPage] = useState<Page | null>(null);
  const [layout, setLayout] = useState<PageLayoutItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Carregar dados da página
  useEffect(() => {
    const loadPage = async () => {
      const foundPage = getPageBySlug(slug);
      if (foundPage) {
        setPage(foundPage);
        
        // Carregar layout da página
        if (foundPage.id) {
          await fetchPageLayout(foundPage.id);
        }
      }
    };
    
    loadPage();
  }, [slug, getPageBySlug, fetchPageLayout]);

  // Atualizar layout quando os dados forem carregados
  useEffect(() => {
    if (page && pageLayouts[page.id]) {
      // Ordenar seções por displayOrder
      const sortedLayout = [...pageLayouts[page.id]].sort(
        (a, b) => a.displayOrder - b.displayOrder
      );
      setLayout(sortedLayout);
    }
  }, [page, pageLayouts]);

  // Filtrar produtos com base nas configurações da página
  const getFilteredProducts = (sectionConfig: any) => {
    if (!sectionConfig || !sectionConfig.filter) return products;
    
    const { tagIds, categoryIds, limit } = sectionConfig.filter;
    
    let filtered = products;
    
    // Filtrar por tags
    if (tagIds && tagIds.length > 0) {
      filtered = filtered.filter(product => 
        product.tags?.some(tag => 
          tagIds.includes(tag.id) || tagIds.includes(tag.name.toLowerCase())
        )
      );
    }
    
    // Note: Removed category filtering since Product interface doesn't have categories
    // This will need to be handled differently if category filtering is needed
    
    // Limitar quantidade
    if (limit && limit > 0) {
      filtered = filtered.slice(0, limit);
    }
    
    return filtered;
  };

  // Wrapper function to adapt addToCart signature for FeaturedProductsSection
  const handleAddToCart = (product: Product, quantity?: number) => {
    // Call the cart's addToCart with default size and color
    addToCart(product);
  };

  // Abrir modal de produto
  const handleProductCardClick = (productId: string) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  };

  // Renderizar seção com base no tipo
  const renderSection = (section: PageLayoutItem) => {
    if (!section.isVisible) return null;
    
    switch (section.sectionType) {
      case 'banner':
        return (
          <HeroBanner
            key={section.id}
            title={section.sectionConfig?.title || section.title || ''}
            subtitle={section.sectionConfig?.subtitle || ''}
            imageUrl={section.sectionConfig?.imageUrl || '/banners/default-banner.jpg'}
            ctaText={section.sectionConfig?.ctaText}
            ctaLink={section.sectionConfig?.ctaLink}
            theme={page?.theme}
          />
        );
      
      case 'products':
      case 'featured':
        const sectionProducts = getFilteredProducts(section.sectionConfig);
        return (
          <FeaturedProductsSection
            key={section.id}
            products={sectionProducts}
            loading={productsLoading}
            onAddToCart={handleAddToCart}
            title={section.title || ''}
            onCardClick={handleProductCardClick}
          />
        );
      
      case 'custom':
        // Renderizar conteúdo personalizado
        return (
          <div key={section.id} className="py-8 container mx-auto">
            <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: section.sectionConfig?.content || '' }} />
          </div>
        );
      
      default:
        return null;
    }
  };

  // Renderizar estado de carregamento
  if (pageLoading || productsLoading) {
    return (
      <>
        <Header />
        <main>
          <div className="container mx-auto py-8">
            <Skeleton className="h-64 w-full rounded-lg mb-8" />
            <Skeleton className="h-8 w-1/3 mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-lg" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Renderizar página não encontrada
  if (!page) {
    return (
      <>
        <Header />
        <main>
          <div className="container mx-auto py-16">
            <Alert variant="destructive" className="max-w-lg mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Página não encontrada</AlertTitle>
              <AlertDescription>
                A página que você está procurando não existe ou não está disponível.
              </AlertDescription>
            </Alert>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Aplicar tema da página ao estilo
  const pageStyle = {
    '--primary-color': page.theme.primaryColor,
    '--secondary-color': page.theme.secondaryColor,
    '--accent-color': page.theme.accentColor || page.theme.primaryColor,
  } as React.CSSProperties;

  return (
    <div style={pageStyle} className="platform-page">
      <Header />
      <main>
        {/* Renderizar seções na ordem definida */}
        {layout.length > 0 ? (
          layout.map(section => renderSection(section))
        ) : (
          <div className="container mx-auto py-16 text-center">
            <p className="text-muted-foreground">
              Esta página ainda não possui seções configuradas.
            </p>
          </div>
        )}
      </main>
      <Footer />

      {/* Modal de produto */}
      <ProductModal
        productId={selectedProductId}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
};

export default PlatformPage;
