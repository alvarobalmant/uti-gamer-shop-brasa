
import React, { useEffect, useState, useMemo } from 'react';
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
  const [isInitialized, setIsInitialized] = useState(false);

  // Memoizar a página para evitar re-renderizações desnecessárias
  const currentPage = useMemo(() => {
    return getPageBySlug(slug);
  }, [slug, getPageBySlug]);

  // Carregar dados da página uma única vez
  useEffect(() => {
    const loadPageData = async () => {
      if (!currentPage) {
        setIsInitialized(true);
        return;
      }

      setPage(currentPage);
      
      try {
        // Carregar layout apenas se necessário
        if (currentPage.id && !pageLayouts[currentPage.id]) {
          await fetchPageLayout(currentPage.id);
        }
      } catch (error) {
        console.error('Erro ao carregar layout:', error);
      } finally {
        setIsInitialized(true);
      }
    };
    
    loadPageData();
  }, [currentPage, fetchPageLayout, pageLayouts]);

  // Atualizar layout quando os dados estiverem disponíveis
  useEffect(() => {
    if (page && pageLayouts[page.id]) {
      const sortedLayout = [...pageLayouts[page.id]].sort(
        (a, b) => a.displayOrder - b.displayOrder
      );
      setLayout(sortedLayout);
    }
  }, [page, pageLayouts]);

  // Filtrar produtos com base nas configurações da página
  const getFilteredProducts = (sectionConfig: any) => {
    if (!sectionConfig || !sectionConfig.filter) return products;
    
    const { tagIds, limit } = sectionConfig.filter;
    
    let filtered = products;
    
    // Filtrar por tags
    if (tagIds && tagIds.length > 0) {
      filtered = filtered.filter(product => 
        product.tags?.some(tag => 
          tagIds.includes(tag.id) || tagIds.includes(tag.name.toLowerCase())
        )
      );
    }
    
    // Limitar quantidade
    if (limit && limit > 0) {
      filtered = filtered.slice(0, limit);
    }
    
    return filtered;
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
            loading={false} // Não mostrar loading aqui para evitar flickering
            onAddToCart={addToCart}
            title={section.title || ''}
            onCardClick={handleProductCardClick}
          />
        );
      
      case 'custom':
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

  // Mostrar loading apenas durante a inicialização
  if (!isInitialized || pageLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
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
      </div>
    );
  }

  // Página não encontrada
  if (!page) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
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
      </div>
    );
  }

  // Aplicar tema da página
  const pageStyle = {
    '--primary-color': page.theme.primaryColor,
    '--secondary-color': page.theme.secondaryColor,
    '--accent-color': page.theme.accentColor || page.theme.primaryColor,
  } as React.CSSProperties;

  return (
    <div style={pageStyle} className="platform-page min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
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
