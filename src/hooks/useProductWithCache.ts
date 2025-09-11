import { useState, useEffect, useCallback } from 'react';
import { useProductCache } from './useProductCache';
import { useProducts } from './useProducts';
import { Product } from './useProducts/types';
import { CachedProduct } from '@/utils/ProductCacheManager';

// Interface para produto com cache compatível com CachedProduct
interface ProductWithCache {
  id: string;
  name: string;
  price: number;
  pro_price?: number;
  list_price?: number;
  image: string;
  images?: string[];
  tags?: { id: string; name: string; }[];
  platform?: string;
  genre?: string;
  stock?: number;
  rating?: number;
  rating_count?: number;
  description?: string;
  fromCache?: boolean;
}

interface UseProductWithCacheResult {
  product: ProductWithCache | null;
  loading: boolean;
  error: string | null;
  fromCache: boolean;
  refetch: () => void;
}

export const useProductWithCache = (productId: string): UseProductWithCacheResult => {
  const [product, setProduct] = useState<ProductWithCache | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);

  const { product: cachedProduct, loading: cacheLoading } = useProductCache(productId);
  const { products, loading: apiLoading } = useProducts();

  // Função para buscar produto
  const fetchProduct = useCallback(async () => {
    if (!productId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Tentar buscar no cache primeiro
      if (cachedProduct && !cacheLoading) {
        // Produto encontrado no cache e válido
        const productWithCache: ProductWithCache = {
          id: cachedProduct.id,
          name: cachedProduct.name,
          price: cachedProduct.price,
          pro_price: cachedProduct.pro_price,
          list_price: cachedProduct.list_price,
          image: cachedProduct.image,
          images: [cachedProduct.image],
          tags: cachedProduct.tags,
          platform: cachedProduct.platform,
          genre: '',
          stock: cachedProduct.stock || 0,
          rating: 0,
          rating_count: 0,
          description: '',
          fromCache: true
        };
        setProduct(productWithCache);
        setFromCache(true);
        setLoading(false);
        return;
      }

      // 2. Se não estiver no cache, buscar na API
      await fetchFromAPI();

    } catch (err) {
      console.error('Erro ao buscar produto:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setLoading(false);
    }
  }, [productId, cachedProduct, cacheLoading]);

  // Função para buscar da API
  const fetchFromAPI = useCallback(async () => {
    try {
      // Aguardar produtos carregarem se ainda estão loading
      if (apiLoading) {
        return;
      }

      // Buscar produto na lista de produtos
      const foundProduct = products.find(p => p.id === productId);
      
      if (!foundProduct) {
        throw new Error('Produto não encontrado');
      }

      // Transformar produto para formato do cache
      const productForCache: ProductWithCache = {
        id: foundProduct.id,
        name: foundProduct.name,
        price: foundProduct.price,
        pro_price: foundProduct.pro_price,
        list_price: foundProduct.list_price,
        image: foundProduct.image,
        images: foundProduct.images,
        tags: foundProduct.tags,
        platform: foundProduct.platform,
        genre: foundProduct.genre,
        stock: foundProduct.stock || 0,
        rating: foundProduct.rating,
        rating_count: foundProduct.rating_count,
        description: foundProduct.description,
        fromCache: false
      };

      // Atualizar estado
      setProduct(productForCache);
      setFromCache(false);
      setLoading(false);

    } catch (err) {
      console.error('Erro ao buscar da API:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar produto');
      setLoading(false);
    }
  }, [products, apiLoading, productId]);

  // Função para forçar refetch
  const refetch = useCallback(() => {
    setFromCache(false);
    fetchProduct();
  }, [fetchProduct]);

  // Effect para buscar produto quando ID mudar
  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    loading,
    error,
    fromCache,
    refetch
  };
};

// Hook para buscar múltiplos produtos com cache
export const useProductsWithCache = (productIds: string[]) => {
  const [products, setProducts] = useState<ProductWithCache[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { products: allProducts, loading: apiLoading } = useProducts();

  const fetchProducts = useCallback(async () => {
    if (!productIds.length) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Aguardar API se necessário
      if (apiLoading) {
        return;
      }

      // Buscar produtos na API
      const foundProducts = allProducts.filter(p => productIds.includes(p.id));
      
      // Transformar produtos
      const transformedProducts: ProductWithCache[] = foundProducts.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        pro_price: p.pro_price,
        list_price: p.list_price,
        image: p.image,
        images: p.images,
        tags: p.tags,
        platform: p.platform,
        genre: p.genre,
        stock: p.stock || 0,
        rating: p.rating,
        rating_count: p.rating_count,
        description: p.description,
        fromCache: false
      }));

      setProducts(transformedProducts);
      setLoading(false);

    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
      setLoading(false);
    }
  }, [productIds, allProducts, apiLoading]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error
  };
};