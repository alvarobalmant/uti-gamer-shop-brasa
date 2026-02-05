
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Product } from '@/hooks/useProducts/types';
import { 
  fetchProductsFromDatabase,
  fetchSingleProductFromDatabase
} from '@/hooks/useProducts/productApi';
import { handleProductError } from '@/hooks/useProducts/productErrorHandler';
import { toast } from 'sonner';

// Type for lightweight product data
export interface ProductLight {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
}

interface ProductContextOptimizedType {
  // Estado para listagem (versão light)
  productsLight: ProductLight[];
  loadingLight: boolean;
  hasMore: boolean;
  currentPage: number;
  totalProducts: number;
  
  // Estado para produtos completos (cache)
  productDetails: Map<string, Product>;
  loadingDetails: Set<string>;
  
  // Funções de carregamento
  loadMoreProducts: () => Promise<void>;
  refreshProducts: () => Promise<void>;
  getProductDetails: (id: string) => Promise<Product | null>;
  
  // Funções de seção
  loadProductsForSection: (config: any, limit?: number) => Promise<ProductLight[]>;
  
  // Funções de cache
  invalidateCache: () => void;
  preloadImages: (count?: number) => void;
  
  // Sistema de notificação
  subscribeToUpdates: (callback: (products: ProductLight[]) => void) => () => void;
}

const ProductContextOptimized = createContext<ProductContextOptimizedType | undefined>(undefined);

interface ProductProviderOptimizedProps {
  children: ReactNode;
}

export const ProductProviderOptimized: React.FC<ProductProviderOptimizedProps> = ({ children }) => {
  // Estado para produtos light (listagem)
  const [productsLight, setProductsLight] = useState<ProductLight[]>([]);
  const [loadingLight, setLoadingLight] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  
  // Estado para detalhes completos (cache)
  const [productDetails, setProductDetails] = useState<Map<string, Product>>(new Map());
  const [loadingDetails, setLoadingDetails] = useState<Set<string>>(new Set());
  
  // Subscribers para notificações
  const [subscribers, setSubscribers] = useState<Set<(products: ProductLight[]) => void>>(new Set());

  // Função para notificar subscribers
  const notifySubscribers = useCallback((updatedProducts: ProductLight[]) => {
    subscribers.forEach(callback => {
      try {
        callback(updatedProducts);
      } catch (error) {
        console.error('Error in subscriber callback:', error);
      }
    });
  }, [subscribers]);

  // Carregar mais produtos (paginação)
  const loadMoreProducts = useCallback(async () => {
    if (loadingLight || !hasMore) return;

    try {
      setLoadingLight(true);
      
      const products = await fetchProductsFromDatabase(true);
      const pageSize = 20;
      const start = currentPage * pageSize;
      const slice = products.slice(start, start + pageSize);
      
      const lightProducts: ProductLight[] = slice.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        slug: p.slug || p.id
      }));
      
      if (currentPage === 0) {
        setProductsLight(lightProducts);
      } else {
        setProductsLight(prev => [...prev, ...lightProducts]);
      }
      
      setHasMore(start + pageSize < products.length);
      setTotalProducts(products.length);
      setCurrentPage(prev => prev + 1);
      
      // Notificar subscribers
      notifySubscribers(currentPage === 0 ? lightProducts : [...productsLight, ...lightProducts]);
      
      console.log(`[loadMoreProducts] Carregados ${lightProducts.length} produtos, página ${currentPage}`);
    } catch (error) {
      console.error('Error loading more products:', error);
      const errorMessage = handleProductError(error, 'ao carregar produtos');
      if (errorMessage) {
        toast.error(errorMessage);
      }
    } finally {
      setLoadingLight(false);
    }
  }, [loadingLight, hasMore, currentPage, productsLight, notifySubscribers]);

  // Refresh completo dos produtos
  const refreshProducts = useCallback(async () => {
    try {
      setCurrentPage(0);
      setHasMore(true);
      setProductsLight([]);
      
      await loadMoreProducts();
    } catch (error) {
      console.error('Error refreshing products:', error);
      const errorMessage = handleProductError(error, 'ao atualizar produtos');
      if (errorMessage) {
        toast.error(errorMessage);
      }
    }
  }, [loadMoreProducts]);

  // Obter detalhes completos de um produto
  const getProductDetails = useCallback(async (id: string): Promise<Product | null> => {
    // Verificar cache primeiro
    if (productDetails.has(id)) {
      return productDetails.get(id)!;
    }

    // Verificar se já está carregando
    if (loadingDetails.has(id)) {
      // Aguardar carregamento atual
      return new Promise((resolve) => {
        const checkLoading = () => {
          if (!loadingDetails.has(id)) {
            resolve(productDetails.get(id) || null);
          } else {
            setTimeout(checkLoading, 100);
          }
        };
        checkLoading();
      });
    }

    try {
      // Marcar como carregando
      setLoadingDetails(prev => new Set([...prev, id]));
      
      const product = await fetchSingleProductFromDatabase(id);
      
      if (product) {
        // Adicionar ao cache
        setProductDetails(prev => new Map([...prev, [id, product]]));
      }
      
      return product;
    } catch (error) {
      console.error('Error loading product details:', error);
      const errorMessage = handleProductError(error, 'ao carregar detalhes do produto');
      if (errorMessage) {
        toast.error(errorMessage);
      }
      return null;
    } finally {
      // Remover do loading
      setLoadingDetails(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  }, [productDetails, loadingDetails]);

  // Carregar produtos para seção específica
  const loadProductsForSection = useCallback(async (
    config: any, 
    limit: number = 12
  ): Promise<ProductLight[]> => {
    try {
      const products = await fetchProductsFromDatabase(true);
      const lightProducts: ProductLight[] = products.slice(0, limit).map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        slug: p.slug || p.id
      }));
      console.log(`[loadProductsForSection] Carregados ${lightProducts.length} produtos para seção`);
      return lightProducts;
    } catch (error) {
      console.error('Error loading products for section:', error);
      const errorMessage = handleProductError(error, 'ao carregar produtos da seção');
      if (errorMessage) {
        toast.error(errorMessage);
      }
      return [];
    }
  }, []);

  // Invalidar cache
  const invalidateCache = useCallback(() => {
    setProductDetails(new Map());
    console.log('[ProductContextOptimized] Cache invalidado');
  }, []);

  // Pré-carregar imagens
  const preloadImages = useCallback((count: number = 6) => {
    productsLight.slice(0, count).forEach(p => {
      if (p.image) {
        const img = new Image();
        img.src = p.image;
      }
    });
  }, [productsLight]);

  // Sistema de subscription
  const subscribeToUpdates = useCallback((callback: (products: ProductLight[]) => void) => {
    setSubscribers(prev => new Set([...prev, callback]));
    
    // Retornar função de unsubscribe
    return () => {
      setSubscribers(prev => {
        const newSet = new Set(prev);
        newSet.delete(callback);
        return newSet;
      });
    };
  }, []);

  // Carregamento inicial
  useEffect(() => {
    if (productsLight.length === 0 && !loadingLight) {
      loadMoreProducts();
    }
  }, []);

  const value: ProductContextOptimizedType = {
    // Estado
    productsLight,
    loadingLight,
    hasMore,
    currentPage,
    totalProducts,
    productDetails,
    loadingDetails,
    
    // Funções
    loadMoreProducts,
    refreshProducts,
    getProductDetails,
    loadProductsForSection,
    invalidateCache,
    preloadImages,
    subscribeToUpdates,
  };

  return (
    <ProductContextOptimized.Provider value={value}>
      {children}
    </ProductContextOptimized.Provider>
  );
};

export const useProductsOptimized = () => {
  const context = useContext(ProductContextOptimized);
  if (context === undefined) {
    throw new Error('useProductsOptimized must be used within a ProductProviderOptimized');
  }
  return context;
};

export default ProductContextOptimized;
