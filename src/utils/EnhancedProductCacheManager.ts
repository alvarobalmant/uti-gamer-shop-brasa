/**
 * EnhancedProductCacheManager - Sistema de Cache Inteligente e Persistente
 * 
 * Melhorias implementadas:
 * - TTL estendido para 15+ minutos
 * - Persistência em localStorage
 * - Cache incremental (adiciona produtos conforme carregados)
 * - Renderização progressiva (não espera imagens)
 * - Invalidação inteligente
 * - Preload automático
 */

import { fetchProductsFromDatabase, fetchSingleProductFromDatabase } from '@/hooks/useProducts/productApi';
import { Product } from '@/hooks/useProducts/types';

// Interface para produto cacheado (dados essenciais + metadados)
export interface EnhancedCachedProduct {
  // IDENTIFICAÇÃO
  id: string;
  name: string;
  slug?: string;

  // PREÇOS (CRÍTICO)
  price: number;
  pro_price?: number;
  list_price?: number;
  uti_pro_enabled?: boolean;
  uti_pro_value?: number;
  uti_pro_custom_price?: number;

  // VISUAL (sem bloquear renderização)
  image: string;
  badge_text?: string;
  badge_color?: string;
  badge_visible?: boolean;

  // CATEGORIZAÇÃO
  platform?: string;
  category?: string;
  tags?: { id: string; name: string; weight?: number; category?: string; }[];

  // ESTADOS
  is_active?: boolean;
  is_featured?: boolean;
  stock?: number;

  // METADADOS DO CACHE
  cached_at: number;
  ttl: number;
  source: 'api' | 'localStorage' | 'incremental';
  image_loaded?: boolean; // Para renderização progressiva
}

// Interface para cache persistente
interface PersistedCache {
  products: Record<string, EnhancedCachedProduct>;
  metadata: {
    last_full_sync: number;
    version: string;
    total_products: number;
  };
}

// Interface para estatísticas avançadas
interface EnhancedCacheStats {
  hits: number;
  misses: number;
  totalRequests: number;
  hitRate: number;
  cacheSize: number;
  persistedSize: number;
  lastSync: Date | null;
  incrementalAdds: number;
}

class EnhancedProductCacheManager {
  private static instance: EnhancedProductCacheManager;
  private memoryCache = new Map<string, EnhancedCachedProduct>();
  private requestQueue = new Map<string, Promise<EnhancedCachedProduct | null>>();
  private relatedCache = new Map<string, EnhancedCachedProduct[]>();
  private imagePreloadQueue = new Set<string>();
  
  private stats: EnhancedCacheStats = {
    hits: 0,
    misses: 0,
    totalRequests: 0,
    hitRate: 0,
    cacheSize: 0,
    persistedSize: 0,
    lastSync: null,
    incrementalAdds: 0
  };

  // TTL estendido: 15 minutos para produtos, 10 minutos para relacionados
  private readonly DEFAULT_TTL = 15 * 60 * 1000; // 15 minutos
  private readonly RELATED_TTL = 10 * 60 * 1000; // 10 minutos
  private readonly STORAGE_KEY = 'uti_products_cache_v2';
  private readonly CACHE_VERSION = '2.0.0';

  private constructor() {
    this.loadFromPersistentStorage();
    this.startCleanupInterval();
    this.startImagePreloadWorker();
  }

  public static getInstance(): EnhancedProductCacheManager {
    if (!EnhancedProductCacheManager.instance) {
      EnhancedProductCacheManager.instance = new EnhancedProductCacheManager();
    }
    return EnhancedProductCacheManager.instance;
  }

  /**
   * Carregar cache do localStorage na inicialização
   */
  private loadFromPersistentStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return;

      const parsed: PersistedCache = JSON.parse(stored);
      
      // Verificar versão do cache
      if (parsed.metadata?.version !== this.CACHE_VERSION) {
        console.log('[EnhancedCache] 🔄 Versão do cache desatualizada, limpando...');
        localStorage.removeItem(this.STORAGE_KEY);
        return;
      }

      // Carregar produtos válidos para memória
      let loadedCount = 0;
      Object.values(parsed.products).forEach(product => {
        if (this.isValid(product)) {
          product.source = 'localStorage';
          this.memoryCache.set(product.id, product);
          loadedCount++;
        }
      });

      this.stats.persistedSize = loadedCount;
      this.stats.lastSync = parsed.metadata.last_full_sync ? new Date(parsed.metadata.last_full_sync) : null;
      
      console.log(`[EnhancedCache] 📦 ${loadedCount} produtos carregados do localStorage`);
    } catch (error) {
      console.warn('[EnhancedCache] ⚠️ Erro ao carregar cache persistente:', error);
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  /**
   * Salvar cache no localStorage
   */
  private saveToPersistentStorage(): void {
    try {
      const cacheData: PersistedCache = {
        products: {},
        metadata: {
          last_full_sync: Date.now(),
          version: this.CACHE_VERSION,
          total_products: this.memoryCache.size
        }
      };

      // Salvar apenas produtos válidos
      this.memoryCache.forEach((product, id) => {
        if (this.isValid(product)) {
          cacheData.products[id] = product;
        }
      });

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cacheData));
      console.log(`[EnhancedCache] 💾 ${Object.keys(cacheData.products).length} produtos salvos no localStorage`);
    } catch (error) {
      console.warn('[EnhancedCache] ⚠️ Erro ao salvar cache persistente:', error);
    }
  }

  /**
   * Converter Product completo para EnhancedCachedProduct
   */
  private productToCached(product: Product, source: 'api' | 'incremental' = 'api'): EnhancedCachedProduct {
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      pro_price: product.pro_price,
      list_price: product.list_price,
      uti_pro_enabled: product.uti_pro_enabled,
      uti_pro_value: product.uti_pro_value,
      uti_pro_custom_price: product.uti_pro_custom_price,
      image: product.image,
      badge_text: product.badge_text,
      badge_color: product.badge_color,
      badge_visible: product.badge_visible,
      platform: product.platform,
      category: product.category,
      tags: product.tags,
      is_active: product.is_active,
      is_featured: product.is_featured,
      stock: product.stock,
      cached_at: Date.now(),
      ttl: this.DEFAULT_TTL,
      source,
      image_loaded: false // Será atualizado pelo preloader
    };
  }

  /**
   * Verificar se um item do cache ainda é válido
   */
  private isValid(item: EnhancedCachedProduct): boolean {
    return (Date.now() - item.cached_at) < item.ttl;
  }

  /**
   * Atualizar estatísticas do cache
   */
  private updateStats(hit: boolean): void {
    this.stats.totalRequests++;
    if (hit) {
      this.stats.hits++;
    } else {
      this.stats.misses++;
    }
    this.stats.hitRate = this.stats.totalRequests > 0 
      ? (this.stats.hits / this.stats.totalRequests) * 100 
      : 0;
    this.stats.cacheSize = this.memoryCache.size;
  }

  /**
   * MÉTODO PRINCIPAL: Buscar produto individual (cache-first)
   */
  public async getProduct(id: string): Promise<EnhancedCachedProduct | null> {
    console.log(`[EnhancedCache] 🔍 Buscando produto ${id}`);

    // 1. Verificar cache em memória
    const cached = this.memoryCache.get(id);
    if (cached && this.isValid(cached)) {
      console.log(`[EnhancedCache] ⚡ Cache HIT para produto ${id} (fonte: ${cached.source})`);
      this.updateStats(true);
      
      // Preload da imagem em background se ainda não carregada
      if (!cached.image_loaded && cached.image) {
        this.preloadImage(cached.image, id);
      }
      
      return cached;
    }

    // 2. Request deduplication
    if (this.requestQueue.has(id)) {
      console.log(`[EnhancedCache] 🔄 Request em andamento para produto ${id}`);
      return await this.requestQueue.get(id)!;
    }

    // 3. Cache MISS - buscar da API
    console.log(`[EnhancedCache] ❌ Cache MISS para produto ${id}`);
    this.updateStats(false);

    const fetchPromise = this.fetchProductFromAPI(id);
    this.requestQueue.set(id, fetchPromise);

    try {
      const result = await fetchPromise;
      return result;
    } finally {
      this.requestQueue.delete(id);
    }
  }

  /**
   * Buscar produto da API e adicionar ao cache incrementalmente
   */
  private async fetchProductFromAPI(id: string): Promise<EnhancedCachedProduct | null> {
    try {
      console.log(`[EnhancedCache] 🌐 Fazendo chamada à API para produto ${id}`);
      
      const product = await fetchSingleProductFromDatabase(id);
      if (!product) {
        console.log(`[EnhancedCache] ❌ Produto ${id} não encontrado na API`);
        return null;
      }

      const cachedProduct = this.productToCached(product, 'incremental');
      
      // Adicionar ao cache incrementalmente
      this.addProductToCache(cachedProduct);
      
      console.log(`[EnhancedCache] 💾 Produto ${id} adicionado incrementalmente ao cache`);
      return cachedProduct;
    } catch (error) {
      console.error(`[EnhancedCache] ❌ Erro ao buscar produto ${id}:`, error);
      
      // Fallback: usar cache expirado se disponível
      const expired = this.memoryCache.get(id);
      if (expired) {
        console.log(`[EnhancedCache] ⚠️ Usando cache expirado para produto ${id}`);
        return expired;
      }
      
      return null;
    }
  }

  /**
   * Adicionar produto ao cache incrementalmente
   */
  public addProductToCache(product: EnhancedCachedProduct): void {
    this.memoryCache.set(product.id, product);
    this.stats.incrementalAdds++;
    
    // Preload da imagem
    if (product.image) {
      this.preloadImage(product.image, product.id);
    }
    
    // Salvar no localStorage periodicamente (a cada 10 produtos)
    if (this.stats.incrementalAdds % 10 === 0) {
      this.saveToPersistentStorage();
    }
  }

  /**
   * Buscar múltiplos produtos (para listas, seções)
   */
  public async getMultipleProducts(ids: string[]): Promise<EnhancedCachedProduct[]> {
    console.log(`[EnhancedCache] 🔍 Buscando ${ids.length} produtos`);

    const results: EnhancedCachedProduct[] = [];
    const missingIds: string[] = [];

    // Verificar quais estão no cache
    for (const id of ids) {
      const cached = this.memoryCache.get(id);
      if (cached && this.isValid(cached)) {
        results.push(cached);
      } else {
        missingIds.push(id);
      }
    }

    console.log(`[EnhancedCache] ⚡ ${results.length} produtos do cache, ${missingIds.length} da API`);

    // Buscar os que faltam em paralelo
    if (missingIds.length > 0) {
      const fetchPromises = missingIds.map(id => this.getProduct(id));
      const fetchedProducts = await Promise.all(fetchPromises);
      
      fetchedProducts.forEach(product => {
        if (product) {
          results.push(product);
        }
      });
    }

    return results;
  }

  /**
   * Buscar todos os produtos (para páginas de seção)
   */
  public async getAllProducts(includeAdmin: boolean = false): Promise<EnhancedCachedProduct[]> {
    console.log(`[EnhancedCache] 🔍 Buscando TODOS os produtos (includeAdmin: ${includeAdmin})`);

    // Se temos um cache recente e completo, usar ele
    const cacheAge = this.stats.lastSync ? Date.now() - this.stats.lastSync.getTime() : Infinity;
    if (cacheAge < this.DEFAULT_TTL && this.memoryCache.size > 50) {
      console.log(`[EnhancedCache] ⚡ Usando cache completo (${this.memoryCache.size} produtos)`);
      const allProducts = Array.from(this.memoryCache.values())
        .filter(p => this.isValid(p))
        .filter(p => includeAdmin || p.is_active !== false);
      
      return allProducts;
    }

    // Cache incompleto ou expirado - buscar da API
    try {
      console.log(`[EnhancedCache] 🌐 Buscando todos os produtos da API`);
      const products = await fetchProductsFromDatabase(includeAdmin);
      
      // Adicionar todos ao cache
      products.forEach(product => {
        const cachedProduct = this.productToCached(product, 'api');
        this.memoryCache.set(product.id, cachedProduct);
      });

      this.stats.lastSync = new Date();
      this.saveToPersistentStorage();
      
      console.log(`[EnhancedCache] 💾 ${products.length} produtos sincronizados no cache`);
      
      return Array.from(this.memoryCache.values())
        .filter(p => this.isValid(p))
        .filter(p => includeAdmin || p.is_active !== false);
    } catch (error) {
      console.error(`[EnhancedCache] ❌ Erro ao buscar todos os produtos:`, error);
      
      // Fallback: retornar cache atual mesmo que expirado
      return Array.from(this.memoryCache.values())
        .filter(p => includeAdmin || p.is_active !== false);
    }
  }

  /**
   * Preload de imagem em background
   */
  private preloadImage(imageUrl: string, productId: string): void {
    if (this.imagePreloadQueue.has(imageUrl)) return;
    
    this.imagePreloadQueue.add(imageUrl);
    
    const img = new Image();
    img.onload = () => {
      // Marcar imagem como carregada
      const product = this.memoryCache.get(productId);
      if (product) {
        product.image_loaded = true;
        this.memoryCache.set(productId, product);
      }
      this.imagePreloadQueue.delete(imageUrl);
      console.log(`[EnhancedCache] 🖼️ Imagem preloaded: ${productId}`);
    };
    img.onerror = () => {
      this.imagePreloadQueue.delete(imageUrl);
    };
    img.src = imageUrl;
  }

  /**
   * Worker para preload de imagens em background
   */
  private startImagePreloadWorker(): void {
    setInterval(() => {
      // Preload de imagens de produtos recém-adicionados
      const recentProducts = Array.from(this.memoryCache.values())
        .filter(p => !p.image_loaded && p.image)
        .slice(0, 5); // Máximo 5 por vez

      recentProducts.forEach(product => {
        if (product.image) {
          this.preloadImage(product.image, product.id);
        }
      });
    }, 2000); // A cada 2 segundos
  }

  /**
   * Invalidar cache específico
   */
  public invalidateProduct(id: string): void {
    this.memoryCache.delete(id);
    
    // Invalidar relacionados
    for (const [key, _] of this.relatedCache) {
      if (key.includes(id)) {
        this.relatedCache.delete(key);
      }
    }
    
    console.log(`[EnhancedCache] 🗑️ Cache invalidado para produto ${id}`);
  }

  /**
   * Limpar todo o cache
   */
  public clearCache(): void {
    this.memoryCache.clear();
    this.relatedCache.clear();
    this.imagePreloadQueue.clear();
    localStorage.removeItem(this.STORAGE_KEY);
    
    this.stats = {
      hits: 0,
      misses: 0,
      totalRequests: 0,
      hitRate: 0,
      cacheSize: 0,
      persistedSize: 0,
      lastSync: null,
      incrementalAdds: 0
    };
    
    console.log(`[EnhancedCache] 🗑️ Cache completo limpo`);
  }

  /**
   * Obter estatísticas avançadas
   */
  public getStats(): EnhancedCacheStats {
    return { ...this.stats };
  }

  /**
   * Limpeza automática de itens expirados
   */
  private startCleanupInterval(): void {
    setInterval(() => {
      const now = Date.now();
      let cleaned = 0;

      // Limpar cache principal
      for (const [id, item] of this.memoryCache) {
        if (!this.isValid(item)) {
          this.memoryCache.delete(id);
          cleaned++;
        }
      }

      // Limpar cache de relacionados
      for (const [key, items] of this.relatedCache) {
        if (items.length === 0 || !this.isValid(items[0])) {
          this.relatedCache.delete(key);
          cleaned++;
        }
      }

      if (cleaned > 0) {
        console.log(`[EnhancedCache] 🧹 Limpeza automática: ${cleaned} itens expirados removidos`);
        // Salvar após limpeza
        this.saveToPersistentStorage();
      }
    }, 2 * 60 * 1000); // Limpeza a cada 2 minutos
  }
}

// Exportar instância singleton
export const enhancedProductCache = EnhancedProductCacheManager.getInstance();
export default enhancedProductCache;
