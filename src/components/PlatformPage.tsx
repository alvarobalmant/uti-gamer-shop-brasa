
import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { usePages, Page, PageLayoutItem } from '@/hooks/usePages';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/hooks/useProducts';
import PlatformPageLoading from './PlatformPage/PlatformPageLoading';
import PlatformPageNotFound from './PlatformPage/PlatformPageNotFound';
import PlatformPageContent from './PlatformPage/PlatformPageContent';

// Base component for platform pages with enhanced data refresh
const PlatformPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { getPageBySlug, fetchPageLayout, pageLayouts, loading: pageLoading, forceRefresh } = usePages();
  
  const [page, setPage] = useState<Page | null>(null);
  const [layout, setLayout] = useState<PageLayoutItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<number>(Date.now());

  // Memoize page to avoid unnecessary re-renders
  const currentPage = useMemo(() => {
    return slug ? getPageBySlug(slug) : null;
  }, [slug, getPageBySlug]);

  // Enhanced page data loading with periodic refresh
  useEffect(() => {
    const loadPageData = async () => {
<<<<<<< HEAD
      if (!currentPage) {
=======
      console.log(`[PlatformPage] Loading data for slug: ${slug}`);
      
      if (!currentPage) {
        console.log(`[PlatformPage] No page found for slug: ${slug}`);
>>>>>>> b625912f6929f41cd101c2aad275766eb7552244
        setIsInitialized(true);
        return;
      }

      setPage(currentPage);
      
      try {
<<<<<<< HEAD
        // Load layout only if necessary
        if (currentPage.id && !pageLayouts[currentPage.id]) {
          await fetchPageLayout(currentPage.id);
=======
        // Always fetch fresh layout to ensure we have the latest data
        if (currentPage.id) {
          console.log(`[PlatformPage] Fetching layout for page ${currentPage.id}`);
          await fetchPageLayout(currentPage.id, true); // Force reload
>>>>>>> b625912f6929f41cd101c2aad275766eb7552244
        }
      } catch (error) {
        console.error('Erro ao carregar layout:', error);
      } finally {
        setIsInitialized(true);
      }
    };
    
    loadPageData();
  }, [currentPage, fetchPageLayout, slug, lastRefresh]);

  // Update layout when data is available
  useEffect(() => {
    if (page && pageLayouts[page.id]) {
      const sortedLayout = [...pageLayouts[page.id]].sort(
        (a, b) => (a.display_order || a.displayOrder || 0) - (b.display_order || b.displayOrder || 0)
      );
<<<<<<< HEAD
=======
      console.log(`[PlatformPage] Updated layout for page ${page.id}:`, sortedLayout);
>>>>>>> b625912f6929f41cd101c2aad275766eb7552244
      setLayout(sortedLayout);
    }
  }, [page, pageLayouts]);

  // Periodic refresh to check for database changes
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('[PlatformPage] Periodic refresh triggered');
      setLastRefresh(Date.now());
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

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
