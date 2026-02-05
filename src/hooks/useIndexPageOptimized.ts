import { useMemo } from 'react';
import { useHomepageProducts } from '@/hooks/useHomepageProducts';
import { useHomepageLayoutOptimized } from '@/hooks/useHomepageLayoutOptimized';
import { useProductSectionsOptimized } from '@/hooks/useProductSectionsOptimized';
import { useSpecialSectionsOptimized } from '@/hooks/useSpecialSectionsOptimized';

export const useIndexPageOptimized = () => {
  // Use hooks - handle both React Query and regular hook return formats
  const homepageProducts = useHomepageProducts() as any;
  const homepageLayout = useHomepageLayoutOptimized() as any;
  const productSections = useProductSectionsOptimized() as any;
  const specialSectionsHook = useSpecialSectionsOptimized() as any;

  // Extract data with fallbacks for different hook return formats
  const products = homepageProducts?.data ?? homepageProducts?.products ?? [];
  const productsLoading = homepageProducts?.isLoading ?? homepageProducts?.loading ?? false;
  const refetch = homepageProducts?.refetch ?? (() => {});

  const layoutItems = homepageLayout?.data ?? homepageLayout?.layoutItems ?? [];
  const layoutLoading = homepageLayout?.isLoading ?? homepageLayout?.loading ?? false;

  const sections = productSections?.data ?? productSections?.sections ?? [];
  const sectionsLoading = productSections?.isLoading ?? productSections?.loading ?? false;

  const specialSections = specialSectionsHook?.data ?? specialSectionsHook?.sections ?? [];
  const specialSectionsLoading = specialSectionsHook?.isLoading ?? specialSectionsHook?.loading ?? false;

  // Memoizar banner data (dados estáticos)
  const bannerData = useMemo(() => ({
    imageUrl: "",
    title: 'Desbloqueie Vantagens com UTI PRO!',
    description: 'Tenha acesso a descontos exclusivos, frete grátis e muito mais. Torne-se membro hoje mesmo!',
    buttonText: 'Saiba Mais sobre UTI PRO',
    buttonLink: '/uti-pro',
    targetBlank: false,
  }), []);

  // Calcular loading geral
  const isLoading = productsLoading || layoutLoading || sectionsLoading || specialSectionsLoading;

  // Log para debug
  console.log('[useIndexPageOptimized] Loading states:', {
    productsLoading,
    layoutLoading,
    sectionsLoading,
    specialSectionsLoading,
    isLoading
  });

  return {
    products: products || [],
    productsLoading,
    layoutItems: layoutItems || [],
    sections: sections || [],
    specialSections: specialSections || [],
    bannerData,
    isLoading,
    loading: isLoading, // Compatibilidade com código existente
    sectionsLoading, // Compatibilidade
    specialSectionsLoading, // Compatibilidade
    handleRetryProducts: refetch,
    retryCount: 0,
    MAX_RETRIES: 3
  };
};

