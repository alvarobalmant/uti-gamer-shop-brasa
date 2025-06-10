
import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { usePages, Page, PageLayoutItem } from '@/hooks/usePages';
import { usePageLayouts } from '@/hooks/usePageLayouts'; // Novo hook específico
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/hooks/useProducts';
import PlatformPageLoading from './PlatformPage/PlatformPageLoading';
import PlatformPageNotFound from './PlatformPage/PlatformPageNotFound';
import PlatformPageContent from './PlatformPage/PlatformPageContent';

// Base component for platform pages with enhanced real-time data sync
const PlatformPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { getPageBySlug, loading: pageLoading } = usePages();
  const { layouts, fetchLayout, cacheTimestamp } = usePageLayouts(); // Novo hook
  
  const [page, setPage] = useState<Page | null>(null);
  const [layout, setLayout] = useState<PageLayoutItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Memoize page to avoid unnecessary re-renders
  const currentPage = useMemo(() => {
    return slug ? getPageBySlug(slug) : null;
  }, [slug, getPageBySlug, cacheTimestamp]); // Incluir cacheTimestamp para forçar re-render

  // Enhanced page data loading with real-time sync
  useEffect(() => {
    const loadPageData = async () => {
      console.log(`[PlatformPage] Loading data for slug: ${slug}`);
      
      if (!currentPage) {
        console.log(`[PlatformPage] No page found for slug: ${slug}`);
        setIsInitialized(true);
        return;
      }

      setPage(currentPage);
      
      try {
        // Sempre buscar layout fresh para garantir dados atualizados
        if (currentPage.id) {
          console.log(`[PlatformPage] Fetching layout for page ${currentPage.id}`);
          await fetchLayout(currentPage.id, true); // Sempre force reload
        }
      } catch (error) {
        console.error('Erro ao carregar layout:', error);
      } finally {
        setIsInitialized(true);
      }
    };
    
    loadPageData();
  }, [currentPage, fetchLayout, slug, cacheTimestamp]); // Incluir cacheTimestamp

  // Update layout when data is available - com dependency no cacheTimestamp
  useEffect(() => {
    if (page && layouts[page.id]) {
      const sortedLayout = [...layouts[page.id]].sort(
        (a, b) => (a.display_order || a.displayOrder || 0) - (b.display_order || b.displayOrder || 0)
      );
      console.log(`[PlatformPage] Updated layout for page ${page.id}:`, sortedLayout);
      setLayout(sortedLayout);
    }
  }, [page, layouts, cacheTimestamp]); // Incluir cacheTimestamp

  // Open product modal
  const handleProductCardClick = (productId: string) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  };

  // Wrapper function to adapt addToCart signature for FeaturedProductsSection
  const handleAddToCart = (product: Product, quantity?: number) => {
    addToCart(product);
  };

  // Show loading only during initialization
  if (!isInitialized || pageLoading) {
    return <PlatformPageLoading />;
  }

  // Page not found
  if (!page) {
    return <PlatformPageNotFound />;
  }

  return (
    <PlatformPageContent
      page={page}
      layout={layout}
      products={products}
      onAddToCart={handleAddToCart}
      isModalOpen={isModalOpen}
      selectedProductId={selectedProductId}
      setIsModalOpen={setIsModalOpen}
      handleProductCardClick={handleProductCardClick}
    />
  );
};

export default PlatformPage;
