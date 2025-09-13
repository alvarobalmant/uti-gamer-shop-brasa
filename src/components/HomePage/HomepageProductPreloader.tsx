import React, { useEffect } from 'react';
// import { useProductPreloader } from '@/hooks/useProductPreloader'; // Temporariamente desabilitado

interface HomepageProductPreloaderProps {
  children: React.ReactNode;
  products?: any[];
}

export const HomepageProductPreloader: React.FC<HomepageProductPreloaderProps> = ({ 
  children, 
  products = [] 
}) => {
  // const { addHomepageProducts, addCategoryProducts, getStats } = useProductPreloader(); // Temporariamente desabilitado

  useEffect(() => {
    if (products && products.length > 0) {
      // Aguardar um pouco para garantir que a homepage carregou
      const timer = setTimeout(() => {
        console.log('🏠 Iniciando preload de produtos da homepage');

        // Produtos em destaque (alta prioridade)
        const featuredProducts = products
          .filter(p => p.is_featured)
          .slice(0, 12)
          .map(p => p.id);

        // Produtos mais vendidos/populares (baseado em algum critério)
        const popularProducts = products
          .filter(p => !p.is_featured && p.stock > 0)
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 10)
          .map(p => p.id);

        // Produtos por categoria (PlayStation, Xbox, etc.)
        const playstationProducts = products
          .filter(p => p.platform?.toLowerCase().includes('playstation'))
          .slice(0, 8)
          .map(p => p.id);

        const xboxProducts = products
          .filter(p => p.platform?.toLowerCase().includes('xbox'))
          .slice(0, 8)
          .map(p => p.id);

        const nintendoProducts = products
          .filter(p => p.platform?.toLowerCase().includes('nintendo'))
          .slice(0, 6)
          .map(p => p.id);

        // Preload temporariamente desabilitado
        const categoryProducts = [...playstationProducts, ...xboxProducts, ...nintendoProducts];
        console.log(`📌 ${featuredProducts.length} produtos em destaque identificados`);
        console.log(`⭐ ${popularProducts.length} produtos populares identificados`);
        console.log(`🎮 ${categoryProducts.length} produtos por categoria identificados`);

      }, 2000); // Aguardar 2 segundos após produtos carregarem

      return () => clearTimeout(timer);
    }
  }, [products]);

  return <>{children}</>;
};

