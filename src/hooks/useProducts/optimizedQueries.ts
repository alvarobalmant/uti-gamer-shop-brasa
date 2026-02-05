// Stub: Legacy optimized queries - use integra_products via productApi
import { Product } from './types';
import { supabase } from '@/integrations/supabase/client';

export const fetchProductsOptimized = async (): Promise<Product[]> => {
  console.log('[optimizedQueries] Stub - use productApi instead');
  return [];
};

export const fetchProductBySlugOptimized = async (slug: string): Promise<Product | null> => {
  console.log('[optimizedQueries] Stub - use productApi instead');
  return null;
};

export const fetchProductsByIdsOptimized = async (ids: string[]): Promise<Product[]> => {
  console.log('[optimizedQueries] Stub - use productApi instead');
  return [];
};

export const fetchProductsByCategoryOptimized = async (category: string): Promise<Product[]> => {
  console.log('[optimizedQueries] Stub - use productApi instead');
  return [];
};

export const fetchFeaturedProductsOptimized = async (): Promise<Product[]> => {
  console.log('[optimizedQueries] Stub - use productApi instead');
  return [];
};

export interface PerformanceResult {
  productCount: number;
  indexStatus: string;
  recommendations: string[];
}

// Stub for database performance analysis
export const analyzeDatabasePerformance = async (): Promise<PerformanceResult> => {
  try {
    const { count, error } = await supabase
      .from('integra_products')
      .select('*', { count: 'exact', head: true });

    const productCount = count || 0;
    const recommendations: string[] = [];

    if (productCount > 2000) {
      recommendations.push('Considere implementar paginação para melhor performance');
    }
    if (productCount > 5000) {
      recommendations.push('Recomendado criar índices adicionais para buscas frequentes');
    }

    return {
      productCount,
      indexStatus: error ? 'error' : 'ok',
      recommendations
    };
  } catch (error) {
    console.error('[analyzeDatabasePerformance] Error:', error);
    return {
      productCount: 0,
      indexStatus: 'error',
      recommendations: ['Erro ao analisar performance']
    };
  }
};
