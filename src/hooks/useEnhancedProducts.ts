/**
 * useEnhancedProducts - Hook Unificado para Substituir useProducts()
 * 
 * Este hook substitui o useProducts() original e implementa:
 * - Cache persistente de 15+ minutos
 * - Renderização progressiva (não espera imagens)
 * - Adição incremental de produtos
 * - Fallback inteligente
 * - Interface compatível com código existente
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { enhancedProductCache, EnhancedCachedProduct } from '@/utils/EnhancedProductCacheManager';
import { Product } from '@/hooks/useProducts/types';

// Interface de resultado compatível com useProducts()
interface UseEnhancedProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  fromCache: boolean;
  cacheStats: any;
  refreshProducts: () => Promise<void>;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

// Interface para produto individual
interface UseEnhancedProductResult {
  product: Product | null;
  loading: boolean;
  error: string | null;
  fromCache: boolean;
  retry: () => void;
}

// Interface para múltiplos produtos
interface UseEnhancedMultipleProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  fromCache: boolean;
  refresh: () => void;
}

/**
 * Converter EnhancedCachedProduct para Product (interface completa)
 */
const cachedToProduct = (cached: EnhancedCachedProduct): Product => ({
  id: cached.id,
  name: cached.name,
  slug: cached.slug || '',
  price: cached.price,
  pro_price: cached.pro_price,
  list_price: cached.list_price,
  uti_pro_enabled: cached.uti_pro_enabled || false,
  uti_pro_value: cached.uti_pro_value,
  uti_pro_custom_price: cached.uti_pro_custom_price,
  image: cached.image,
  badge_text: cached.badge_text || '',
  badge_color: cached.badge_color || '#22c55e',
  badge_visible: cached.badge_visible || false,
  platform: cached.platform || '',
  category: cached.category || '',
  tags: cached.tags || [],
  is_active: cached.is_active !== false,
  is_featured: cached.is_featured || false,
  stock: cached.stock || 0,
  
  // Campos que podem não estar no cache (valores padrão)
  brand: '',
  description: '',
  additional_images: [],
  sizes: [],
  colors: [],
  specifications: [],
  technical_specs: {},
  product_features: {},
  shipping_weight: undefined,
  free_shipping: false,
  meta_title: '',
  meta_description: '',
  uti_pro_type: 'percentage',
  uti_coins_cashback_percentage: undefined,
  uti_coins_discount_percentage: undefined,
  parent_product_id: undefined,
  is_master_product: false,
  product_type: 'simple',
  sku_code: undefined,
  variant_attributes: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
});

/**
 * Hook principal que substitui useProducts() - COMPATÍVEL
 */
export const useEnhancedProducts = (includeAdmin: boolean = false): UseEnhancedProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(`[useEnhancedProducts] 🔍 Buscando produtos (includeAdmin: ${includeAdmin})`);
      
      const cachedProducts = await enhancedProductCache.getAllProducts(includeAdmin);
      
      // Converter para interface Product
      const convertedProducts = cachedProducts.map(cachedToProduct);
      
      setProducts(convertedProducts);
      setFromCache(true);
      
      console.log(`[useEnhancedProducts] ✅ ${convertedProducts.length} produtos carregados`);
    } catch (err: any) {
      console.error(`[useEnhancedProducts] ❌ Erro ao buscar produtos:`, err);
      setError(err.message || 'Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  }, [includeAdmin]);

  const refreshProducts = useCallback(async () => {
    console.log('[useEnhancedProducts] 🔄 Refresh manual solicitado');
    await fetchProducts();
  }, [fetchProducts]);

  // Funções CRUD para compatibilidade (implementação básica)
  const addProduct = useCallback((product: Product) => {
    const cached = enhancedProductCache.productToCached ? 
      enhancedProductCache.productToCached(product, 'incremental') : 
      null;
    
    if (cached) {
      enhancedProductCache.addProductToCache(cached);
      setProducts(prev => [...prev, product]);
    }
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    enhancedProductCache.invalidateProduct(id);
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    enhancedProductCache.invalidateProduct(id);
  }, []);

  // Carregar produtos na inicialização
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const cacheStats = useMemo(() => enhancedProductCache.getStats(), [products]);

  return {
    products,
    loading,
    error,
    fromCache,
    cacheStats,
    refreshProducts,
    addProduct,
    updateProduct,
    deleteProduct
  };
};

/**
 * Hook para produto individual (substitui useProductCache)
 */
export const useEnhancedProduct = (productId: string): UseEnhancedProductResult => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);

  const fetchProduct = useCallback(async () => {
    if (!productId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log(`[useEnhancedProduct] 🔍 Buscando produto ${productId}`);
      
      const cachedProduct = await enhancedProductCache.getProduct(productId);
      
      if (cachedProduct) {
        const convertedProduct = cachedToProduct(cachedProduct);
        setProduct(convertedProduct);
        setFromCache(true);
        console.log(`[useEnhancedProduct] ✅ Produto ${productId} carregado`);
      } else {
        setError('Produto não encontrado');
        console.log(`[useEnhancedProduct] ❌ Produto ${productId} não encontrado`);
      }
    } catch (err: any) {
      console.error(`[useEnhancedProduct] ❌ Erro ao buscar produto ${productId}:`, err);
      setError(err.message || 'Erro ao carregar produto');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const retry = useCallback(() => {
    enhancedProductCache.invalidateProduct(productId);
    fetchProduct();
  }, [productId, fetchProduct]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    loading,
    error,
    fromCache,
    retry
  };
};

/**
 * Hook para múltiplos produtos específicos
 */
export const useEnhancedMultipleProducts = (productIds: string[]): UseEnhancedMultipleProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);

  const fetchProducts = useCallback(async () => {
    if (!productIds || productIds.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log(`[useEnhancedMultipleProducts] 🔍 Buscando ${productIds.length} produtos`);
      
      const cachedProducts = await enhancedProductCache.getMultipleProducts(productIds);
      
      // Converter para interface Product
      const convertedProducts = cachedProducts.map(cachedToProduct);
      
      setProducts(convertedProducts);
      setFromCache(true);
      
      console.log(`[useEnhancedMultipleProducts] ✅ ${convertedProducts.length} produtos carregados`);
    } catch (err: any) {
      console.error(`[useEnhancedMultipleProducts] ❌ Erro ao buscar produtos:`, err);
      setError(err.message || 'Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  }, [productIds]);

  const refresh = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    fromCache,
    refresh
  };
};

/**
 * Hook para produtos por critério (seções, categorias, etc.)
 */
export const useEnhancedProductsByCriteria = (
  criteria: {
    category?: string;
    platform?: string;
    tags?: string[];
    featured?: boolean;
    active?: boolean;
  },
  limit?: number
) => {
  const { products: allProducts, loading: allLoading } = useEnhancedProducts();
  
  const filteredProducts = useMemo(() => {
    if (!allProducts.length) return [];
    
    let filtered = allProducts;
    
    // Aplicar filtros
    if (criteria.category) {
      filtered = filtered.filter(p => p.category === criteria.category);
    }
    
    if (criteria.platform) {
      filtered = filtered.filter(p => p.platform === criteria.platform);
    }
    
    if (criteria.tags && criteria.tags.length > 0) {
      filtered = filtered.filter(p => 
        p.tags?.some(tag => criteria.tags!.includes(tag.id) || criteria.tags!.includes(tag.name))
      );
    }
    
    if (criteria.featured !== undefined) {
      filtered = filtered.filter(p => p.is_featured === criteria.featured);
    }
    
    if (criteria.active !== undefined) {
      filtered = filtered.filter(p => p.is_active === criteria.active);
    }
    
    // Aplicar limite se especificado
    if (limit && limit > 0) {
      filtered = filtered.slice(0, limit);
    }
    
    return filtered;
  }, [allProducts, criteria, limit]);

  return {
    products: filteredProducts,
    loading: allLoading,
    error: null,
    fromCache: true
  };
};

/**
 * Hook para estatísticas do cache
 */
export const useEnhancedCacheStats = () => {
  const [stats, setStats] = useState(enhancedProductCache.getStats());

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(enhancedProductCache.getStats());
    }, 2000); // Atualizar a cada 2 segundos

    return () => clearInterval(interval);
  }, []);

  const clearCache = useCallback(() => {
    enhancedProductCache.clearCache();
    setStats(enhancedProductCache.getStats());
  }, []);

  return {
    stats,
    clearCache
  };
};

// Exportar como padrão para substituição fácil
export default useEnhancedProducts;
