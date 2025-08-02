import { NavigationItem } from '@/types/navigation';

const CACHE_KEY = 'navigation_cache';
const CACHE_TIMESTAMP_KEY = 'navigation_cache_timestamp';
const CACHE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 horas

export class NavigationCache {
  static save(items: NavigationItem[]): void {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(items));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
      console.log('📦 [NAV-CACHE] Items salvos no cache:', items.length);
    } catch (error) {
      console.warn('⚠️ [NAV-CACHE] Erro ao salvar cache:', error);
    }
  }

  static load(): NavigationItem[] {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      
      if (!cached || !timestamp) {
        console.log('📦 [NAV-CACHE] Cache vazio');
        return [];
      }
      
      // Verificar se cache ainda é válido
      const cacheAge = Date.now() - parseInt(timestamp);
      if (cacheAge > CACHE_MAX_AGE) {
        console.log('📦 [NAV-CACHE] Cache expirado, limpando...');
        NavigationCache.clear();
        return [];
      }
      
      const items = JSON.parse(cached) as NavigationItem[];
      console.log('📦 [NAV-CACHE] Items carregados do cache:', items.length);
      return items;
    } catch (error) {
      console.warn('⚠️ [NAV-CACHE] Erro ao carregar cache:', error);
      NavigationCache.clear();
      return [];
    }
  }

  static clear(): void {
    try {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_TIMESTAMP_KEY);
      console.log('📦 [NAV-CACHE] Cache limpo');
    } catch (error) {
      console.warn('⚠️ [NAV-CACHE] Erro ao limpar cache:', error);
    }
  }

  static isValid(): boolean {
    try {
      const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      if (!timestamp) return false;
      
      const cacheAge = Date.now() - parseInt(timestamp);
      return cacheAge <= CACHE_MAX_AGE;
    } catch {
      return false;
    }
  }

  static getAge(): number {
    try {
      const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      if (!timestamp) return -1;
      
      return Date.now() - parseInt(timestamp);
    } catch {
      return -1;
    }
  }
}

