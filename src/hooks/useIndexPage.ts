
import { useState, useEffect, useCallback } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useHomepageLayout } from '@/hooks/useHomepageLayout';
import { useProductSections } from '@/hooks/useProductSections';
import { useSpecialSections } from '@/hooks/useSpecialSections'; // Import the new hook

export const useIndexPage = () => {
  const { products, loading: productsLoading, refetch: refetchProducts } = useProducts();
  const { layoutItems, loading: layoutLoading } = useHomepageLayout();
  const { sections, loading: sectionsLoading } = useProductSections();
  const { specialSections, loading: specialSectionsLoading } = useSpecialSections(); // Use the hook

  // Banner data state (Consider moving this to DB if dynamic banners are needed)
  const [bannerData] = useState({
    imageUrl: "",
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
    // If product loading failed and we still have retries, try again
    if (products.length === 0 && !productsLoading && retryCount < MAX_RETRIES) {
      const timer = setTimeout(() => {
        console.log(`Attempt ${retryCount + 1} of ${MAX_RETRIES} to load products`);
        setRetryCount(prev => prev + 1);
        refetchProducts();
      }, 2000 * (retryCount + 1)); // Delay increases with each retry

      return () => clearTimeout(timer);
    }
  }, [products.length, productsLoading, retryCount, refetchProducts]);

  // Combine loading states
  const isLoading = layoutLoading || sectionsLoading || specialSectionsLoading;
  const showErrorState = !productsLoading && products.length === 0 && retryCount >= MAX_RETRIES;

  const handleRetryProducts = () => {
    setRetryCount(0);
    refetchProducts();
  };

  return {
    products,
    productsLoading,
    layoutItems,
    sections,
    specialSections, // Return special sections
    bannerData,
    isLoading,
    showErrorState,
    sectionsLoading,
    specialSectionsLoading, // Return loading state for special sections
    handleRetryProducts
  };
};

