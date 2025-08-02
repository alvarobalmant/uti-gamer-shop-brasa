// Sistema de cache para produtos
interface CachedProduct {
  data: any;
  timestamp: number;
}

interface ProductCacheConfig {
  maxAge: number; // em milissegundos
  maxSize: number; // número máximo de produtos em cache
}

class ProductCache {
  private static readonly CACHE_KEY = 'products_cache';
  private static readonly DEFAULT_CONFIG: ProductCacheConfig = {
    maxAge: 30 * 60 * 1000, // 30 minutos
    maxSize: 100 // máximo 100 produtos
  };

  private static config: ProductCacheConfig = ProductCache.DEFAULT_CONFIG;

  // Configurar cache
  static configure(config: Partial<ProductCacheConfig>): void {
    ProductCache.config = { ...ProductCache.DEFAULT_CONFIG, ...config };
    console.log('🛍️ [PRODUCT-CACHE] Configurado:', ProductCache.config);
  }

  // Obter cache do localStorage
  private static getCache(): Record<string, CachedProduct> {
    try {
      const cached = localStorage.getItem(ProductCache.CACHE_KEY);
      return cached ? JSON.parse(cached) : {};
    } catch (error) {
      console.warn('🛍️ [PRODUCT-CACHE] Erro ao ler cache:', error);
      return {};
    }
  }

  // Salvar cache no localStorage
  private static saveCache(cache: Record<string, CachedProduct>): void {
    try {
      localStorage.setItem(ProductCache.CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
      console.warn('🛍️ [PRODUCT-CACHE] Erro ao salvar cache:', error);
      // Se falhar, limpar cache para evitar problemas
      ProductCache.clear();
    }
  }

  // Limpar itens expirados
  private static cleanExpired(cache: Record<string, CachedProduct>): Record<string, CachedProduct> {
    const now = Date.now();
    const cleaned: Record<string, CachedProduct> = {};
    let removedCount = 0;

    Object.entries(cache).forEach(([key, item]) => {
      if (now - item.timestamp < ProductCache.config.maxAge) {
        cleaned[key] = item;
      } else {
        removedCount++;
      }
    });

    if (removedCount > 0) {
      console.log(`🛍️ [PRODUCT-CACHE] Removidos ${removedCount} itens expirados`);
    }

    return cleaned;
  }

  // Limitar tamanho do cache (LRU - Least Recently Used)
  private static limitSize(cache: Record<string, CachedProduct>): Record<string, CachedProduct> {
    const entries = Object.entries(cache);
    
    if (entries.length <= ProductCache.config.maxSize) {
      return cache;
    }

    // Ordenar por timestamp (mais recente primeiro)
    entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
    
    // Manter apenas os mais recentes
    const limited = entries.slice(0, ProductCache.config.maxSize);
    const removedCount = entries.length - limited.length;
    
    console.log(`🛍️ [PRODUCT-CACHE] Removidos ${removedCount} itens por limite de tamanho`);
    
    return Object.fromEntries(limited);
  }

  // Salvar produto no cache
  static save(productId: string, product: any): void {
    try {
      let cache = ProductCache.getCache();
      
      // Limpar expirados
      cache = ProductCache.cleanExpired(cache);
      
      // Adicionar novo item
      cache[productId] = {
        data: product,
        timestamp: Date.now()
      };
      
      // Limitar tamanho
      cache = ProductCache.limitSize(cache);
      
      // Salvar
      ProductCache.saveCache(cache);
      
      console.log(`🛍️ [PRODUCT-CACHE] Produto ${productId} salvo no cache`);
    } catch (error) {
      console.error('🛍️ [PRODUCT-CACHE] Erro ao salvar produto:', error);
    }
  }

  // Carregar produto do cache
  static load(productId: string): any | null {
    try {
      const cache = ProductCache.getCache();
      const item = cache[productId];
      
      if (!item) {
        console.log(`🛍️ [PRODUCT-CACHE] Produto ${productId} não encontrado no cache`);
        return null;
      }
      
      // Verificar se expirou
      const isExpired = Date.now() - item.timestamp > ProductCache.config.maxAge;
      if (isExpired) {
        console.log(`🛍️ [PRODUCT-CACHE] Produto ${productId} expirado no cache`);
        ProductCache.remove(productId);
        return null;
      }
      
      // Atualizar timestamp (LRU)
      item.timestamp = Date.now();
      ProductCache.saveCache({ ...cache, [productId]: item });
      
      console.log(`🛍️ [PRODUCT-CACHE] Produto ${productId} carregado do cache`);
      return item.data;
    } catch (error) {
      console.error('🛍️ [PRODUCT-CACHE] Erro ao carregar produto:', error);
      return null;
    }
  }

  // Remover produto específico
  static remove(productId: string): void {
    try {
      const cache = ProductCache.getCache();
      delete cache[productId];
      ProductCache.saveCache(cache);
      console.log(`🛍️ [PRODUCT-CACHE] Produto ${productId} removido do cache`);
    } catch (error) {
      console.error('🛍️ [PRODUCT-CACHE] Erro ao remover produto:', error);
    }
  }

  // Verificar se produto existe no cache
  static has(productId: string): boolean {
    const cache = ProductCache.getCache();
    const item = cache[productId];
    
    if (!item) return false;
    
    // Verificar se não expirou
    const isExpired = Date.now() - item.timestamp > ProductCache.config.maxAge;
    if (isExpired) {
      ProductCache.remove(productId);
      return false;
    }
    
    return true;
  }

  // Limpar todo o cache
  static clear(): void {
    try {
      localStorage.removeItem(ProductCache.CACHE_KEY);
      console.log('🛍️ [PRODUCT-CACHE] Cache limpo completamente');
    } catch (error) {
      console.error('🛍️ [PRODUCT-CACHE] Erro ao limpar cache:', error);
    }
  }

  // Obter estatísticas do cache
  static getStats(): {
    totalItems: number;
    cacheSize: string;
    oldestItem: string;
    newestItem: string;
  } {
    try {
      const cache = ProductCache.getCache();
      const entries = Object.entries(cache);
      
      if (entries.length === 0) {
        return {
          totalItems: 0,
          cacheSize: '0 KB',
          oldestItem: 'N/A',
          newestItem: 'N/A'
        };
      }
      
      // Calcular tamanho aproximado
      const cacheString = JSON.stringify(cache);
      const sizeKB = Math.round(cacheString.length / 1024);
      
      // Encontrar itens mais antigo e mais novo
      const timestamps = entries.map(([_, item]) => item.timestamp);
      const oldest = Math.min(...timestamps);
      const newest = Math.max(...timestamps);
      
      return {
        totalItems: entries.length,
        cacheSize: `${sizeKB} KB`,
        oldestItem: new Date(oldest).toLocaleString('pt-BR'),
        newestItem: new Date(newest).toLocaleString('pt-BR')
      };
    } catch (error) {
      console.error('🛍️ [PRODUCT-CACHE] Erro ao obter estatísticas:', error);
      return {
        totalItems: 0,
        cacheSize: 'Erro',
        oldestItem: 'Erro',
        newestItem: 'Erro'
      };
    }
  }

  // Pré-carregar produtos (para páginas que sabemos que serão acessadas)
  static preload(productIds: string[], fetchFunction: (id: string) => Promise<any>): void {
    console.log(`🛍️ [PRODUCT-CACHE] Pré-carregando ${productIds.length} produtos`);
    
    productIds.forEach(async (productId) => {
      // Só carregar se não estiver em cache
      if (!ProductCache.has(productId)) {
        try {
          const product = await fetchFunction(productId);
          if (product) {
            ProductCache.save(productId, product);
          }
        } catch (error) {
          console.warn(`🛍️ [PRODUCT-CACHE] Erro ao pré-carregar produto ${productId}:`, error);
        }
      }
    });
  }

  // Invalidar cache de produtos relacionados (útil quando um produto é atualizado)
  static invalidateRelated(masterProductId: string): void {
    try {
      const cache = ProductCache.getCache();
      const toRemove: string[] = [];
      
      Object.entries(cache).forEach(([productId, item]) => {
        const product = item.data;
        // Remover produto mestre e todos os SKUs relacionados
        if (productId === masterProductId || 
            product?.parent_product_id === masterProductId ||
            product?.id === masterProductId) {
          toRemove.push(productId);
        }
      });
      
      toRemove.forEach(productId => ProductCache.remove(productId));
      
      if (toRemove.length > 0) {
        console.log(`🛍️ [PRODUCT-CACHE] Invalidados ${toRemove.length} produtos relacionados a ${masterProductId}`);
      }
    } catch (error) {
      console.error('🛍️ [PRODUCT-CACHE] Erro ao invalidar produtos relacionados:', error);
    }
  }
}

export default ProductCache;

// Configurar cache com valores otimizados para e-commerce
ProductCache.configure({
  maxAge: 30 * 60 * 1000, // 30 minutos (produtos podem mudar preço/estoque)
  maxSize: 50 // 50 produtos (suficiente para navegação típica)
});

// Limpar cache expirado na inicialização
try {
  const cache = (ProductCache as any).getCache();
  const cleaned = (ProductCache as any).cleanExpired(cache);
  (ProductCache as any).saveCache(cleaned);
} catch (error) {
  console.warn('🛍️ [PRODUCT-CACHE] Erro na limpeza inicial:', error);
}

