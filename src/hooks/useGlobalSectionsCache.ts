/**
 * useGlobalSectionsCache - Cache Global para Seções
 * 
 * Cache singleton para seções de produtos e seções especiais,
 * evitando requisições desnecessárias quando navegando entre páginas.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ProductSection } from '@/hooks/useProductSections';
import { Database } from '@/integrations/supabase/types';

type SpecialSection = Database['public']['Tables']['special_sections']['Row'];

interface GlobalSectionsCacheState {
  productSections: ProductSection[];
  specialSections: SpecialSection[];
  loading: boolean;
  lastFetch: number | null;
  error: string | null;
}

// Cache global singleton
let globalSectionsCache: GlobalSectionsCacheState = {
  productSections: [],
  specialSections: [],
  loading: false,
  lastFetch: null,
  error: null
};

// Subscribers
let sectionsSubscribers: Set<(cache: GlobalSectionsCacheState) => void> = new Set();

// TTL: 15 minutos (seções mudam menos que produtos)
const SECTIONS_CACHE_TTL = 15 * 60 * 1000;

// Notificar subscribers
const notifySectionsSubscribers = () => {
  sectionsSubscribers.forEach(callback => {
    try {
      callback({ ...globalSectionsCache });
    } catch (error) {
      console.error('Erro ao notificar subscriber de seções:', error);
    }
  });
};

// Verificar se cache é válido
const isSectionsCacheValid = (): boolean => {
  if (!globalSectionsCache.lastFetch) return false;
  return (Date.now() - globalSectionsCache.lastFetch) < SECTIONS_CACHE_TTL;
};

// Fetch singleton para seções
let sectionsFetchPromise: Promise<void> | null = null;

const fetchSectionsToCache = async (): Promise<void> => {
  // Se já há requisição em andamento, aguardar
  if (sectionsFetchPromise) {
    return sectionsFetchPromise;
  }

  // Se cache é válido, não fazer nova requisição
  if (isSectionsCacheValid() && globalSectionsCache.productSections.length > 0) {
    console.log('[SectionsCache] ✅ Cache de seções válido, usando dados existentes');
    return Promise.resolve();
  }

  console.log('[SectionsCache] 🌐 Fazendo nova requisição para seções');
  
  globalSectionsCache.loading = true;
  globalSectionsCache.error = null;
  notifySectionsSubscribers();

  sectionsFetchPromise = (async () => {
    try {
      // Buscar seções de produtos
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('product_sections')
        .select('*')
        .order('created_at', { ascending: false });

      if (sectionsError) throw sectionsError;

      // Buscar itens das seções
      const sectionsWithItems: ProductSection[] = [];
      
      if (sectionsData && sectionsData.length > 0) {
        for (const section of sectionsData) {
          const { data: itemsData, error: itemsError } = await supabase
            .from('product_section_items')
            .select('*')
            .eq('section_id', section.id)
            .order('display_order', { ascending: true });

          if (itemsError) {
            console.warn(`Erro ao buscar itens da seção ${section.id}:`, itemsError);
          }

          sectionsWithItems.push({
            ...section,
            items: itemsData || []
          });
        }
      }

      // Buscar seções especiais
      const { data: specialSectionsData, error: specialSectionsError } = await supabase
        .from('special_sections')
        .select('*')
        .order('created_at', { ascending: false });

      if (specialSectionsError) throw specialSectionsError;

      // Atualizar cache
      globalSectionsCache.productSections = sectionsWithItems;
      globalSectionsCache.specialSections = specialSectionsData || [];
      globalSectionsCache.lastFetch = Date.now();
      globalSectionsCache.loading = false;
      globalSectionsCache.error = null;

      console.log(`[SectionsCache] ✅ ${sectionsWithItems.length} seções de produtos e ${(specialSectionsData || []).length} seções especiais carregadas`);
      notifySectionsSubscribers();
    } catch (error: any) {
      globalSectionsCache.loading = false;
      globalSectionsCache.error = error.message || 'Erro ao carregar seções';
      
      console.error('[SectionsCache] ❌ Erro ao carregar seções:', error);
      notifySectionsSubscribers();
    } finally {
      sectionsFetchPromise = null;
    }
  })();

  return sectionsFetchPromise;
};

/**
 * Hook para cache global de seções de produtos
 */
export const useGlobalProductSectionsCache = () => {
  const [cacheState, setCacheState] = useState<GlobalSectionsCacheState>(() => ({ ...globalSectionsCache }));
  const { toast } = useToast();
  const subscriberRef = useRef<(cache: GlobalSectionsCacheState) => void>();

  // Função para refresh manual
  const refreshSections = useCallback(async () => {
    console.log('[SectionsCache] 🔄 Refresh manual de seções solicitado');
    globalSectionsCache.lastFetch = null;
    await fetchSectionsToCache();
  }, []);

  // Função para invalidar cache
  const invalidateSectionsCache = useCallback(() => {
    console.log('[SectionsCache] 🗑️ Cache de seções invalidado');
    globalSectionsCache.lastFetch = null;
    globalSectionsCache.productSections = [];
    globalSectionsCache.specialSections = [];
    globalSectionsCache.error = null;
    notifySectionsSubscribers();
  }, []);

  // Subscribir para mudanças
  useEffect(() => {
    const subscriber = (cache: GlobalSectionsCacheState) => {
      setCacheState({ ...cache });
    };

    subscriberRef.current = subscriber;
    sectionsSubscribers.add(subscriber);

    return () => {
      if (subscriberRef.current) {
        sectionsSubscribers.delete(subscriberRef.current);
      }
    };
  }, []);

  // Carregar automaticamente se necessário
  useEffect(() => {
    if (!isSectionsCacheValid() && globalSectionsCache.productSections.length === 0 && !globalSectionsCache.loading) {
      console.log('[SectionsCache] 🚀 Carregamento automático de seções iniciado');
      fetchSectionsToCache();
    }
  }, []);

  // Toast de erro
  useEffect(() => {
    if (cacheState.error) {
      toast({
        title: "Erro ao carregar seções",
        description: cacheState.error,
        variant: "destructive",
      });
    }
  }, [cacheState.error, toast]);

  return {
    // Estado das seções de produtos
    sections: cacheState.productSections,
    loading: cacheState.loading,
    error: cacheState.error,
    
    // Funções
    fetchSections: refreshSections,
    refreshSections,
    invalidateSectionsCache,
    
    // Info do cache
    isCacheValid: isSectionsCacheValid(),
    cacheAge: cacheState.lastFetch ? Date.now() - cacheState.lastFetch : null,
  };
};

/**
 * Hook para cache global de seções especiais
 */
export const useGlobalSpecialSectionsCache = () => {
  const [cacheState, setCacheState] = useState<GlobalSectionsCacheState>(() => ({ ...globalSectionsCache }));
  const { toast } = useToast();
  const subscriberRef = useRef<(cache: GlobalSectionsCacheState) => void>();

  // Subscribir para mudanças
  useEffect(() => {
    const subscriber = (cache: GlobalSectionsCacheState) => {
      setCacheState({ ...cache });
    };

    subscriberRef.current = subscriber;
    sectionsSubscribers.add(subscriber);

    return () => {
      if (subscriberRef.current) {
        sectionsSubscribers.delete(subscriberRef.current);
      }
    };
  }, []);

  // Carregar automaticamente se necessário
  useEffect(() => {
    if (!isSectionsCacheValid() && globalSectionsCache.specialSections.length === 0 && !globalSectionsCache.loading) {
      console.log('[SectionsCache] 🚀 Carregamento automático de seções especiais iniciado');
      fetchSectionsToCache();
    }
  }, []);

  return {
    // Estado das seções especiais
    sections: cacheState.specialSections,
    specialSections: cacheState.specialSections,
    loading: cacheState.loading,
    error: cacheState.error,
    total: cacheState.specialSections.length,
    
    // Funções (compatibilidade com useSpecialSections)
    refetch: async () => {
      globalSectionsCache.lastFetch = null;
      await fetchSectionsToCache();
    },
    
    // Info do cache
    isCacheValid: isSectionsCacheValid(),
  };
};

export default useGlobalProductSectionsCache;
