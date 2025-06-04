
import { useState, useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useHomepageLayout } from '@/hooks/useHomepageLayout';
import { useProductSections } from '@/hooks/useProductSections';

export const useIndexPage = () => {
  const { products, loading: productsLoading, refetch: refetchProducts } = useProducts();
  const { layoutItems, loading: layoutLoading } = useHomepageLayout();
  const { sections, loading: sectionsLoading } = useProductSections();

  // Banner data state
  const [bannerData] = useState({
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

  const isLoading = layoutLoading || sectionsLoading;
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
    bannerData,
    isLoading,
    showErrorState,
    sectionsLoading,
    handleRetryProducts
  };
};
