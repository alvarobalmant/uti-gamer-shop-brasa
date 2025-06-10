
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PageLayoutItem } from '@/hooks/usePages/types';
import { useToast } from '@/components/ui/use-toast';

// Hook específico para gerenciar layouts de página com invalidação automática
export const usePageLayouts = () => {
  const [layouts, setLayouts] = useState<Record<string, PageLayoutItem[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Cache timestamp para controle de invalidação
  const [cacheTimestamp, setCacheTimestamp] = useState(Date.now());

  // Função para invalidar cache e forçar reload
  const invalidateCache = useCallback(() => {
    console.log('[usePageLayouts] Invalidating cache...');
    setLayouts({});
    setCacheTimestamp(Date.now());
  }, []);

  // Função para buscar layout específico
  const fetchLayout = useCallback(async (pageId: string, forceReload = false) => {
    console.log(`[usePageLayouts] Fetching layout for page ${pageId}, forceReload: ${forceReload}`);
    
    // Se não é force reload e já temos os dados em cache
    if (!forceReload && layouts[pageId]) {
      console.log(`[usePageLayouts] Returning cached layout for page ${pageId}`);
      return layouts[pageId];
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('page_layout_items')
        .select('*')
        .eq('page_id', pageId)
        .order('display_order', { ascending: true });

      if (fetchError) {
        console.error('[usePageLayouts] Database error:', fetchError);
        throw fetchError;
      }

      console.log(`[usePageLayouts] Fetched ${data?.length || 0} items for page ${pageId}:`, data);

      const mappedData: PageLayoutItem[] = (data || []).map(item => ({
        id: item.id,
        page_id: item.page_id,
        section_key: item.section_key,
        title: item.title,
        display_order: item.display_order,
        is_visible: item.is_visible,
        section_type: item.section_type,
        sectionConfig: item.section_config,
        // Helper properties for backwards compatibility
        pageId: item.page_id,
        sectionKey: item.section_key,
        displayOrder: item.display_order,
        isVisible: item.is_visible,
        sectionType: item.section_type,
      }));

      setLayouts(prev => ({
        ...prev,
        [pageId]: mappedData
      }));

      return mappedData;
    } catch (err: any) {
      console.error('[usePageLayouts] Error fetching layout:', err);
      setError(err.message || 'Erro ao carregar layout');
      return [];
    } finally {
      setLoading(false);
    }
  }, [layouts]);

  // Função para atualizar layout com invalidação imediata
  const updateLayout = useCallback(async (pageId: string, items: Partial<PageLayoutItem>[]) => {
    console.log(`[usePageLayouts] Updating layout for page ${pageId}:`, items);
    
    try {
      setLoading(true);
      
      // Mapear para formato do banco
      const updates = items.map(item => ({
        id: item.id,
        page_id: pageId,
        section_key: item.section_key || item.sectionKey,
        title: item.title,
        display_order: item.display_order ?? item.displayOrder,
        is_visible: item.is_visible ?? item.isVisible,
        section_type: item.section_type || item.sectionType,
        section_config: item.sectionConfig,
      }));

      console.log('[usePageLayouts] Sending updates to database:', updates);

      const { error: updateError } = await supabase
        .from('page_layout_items')
        .upsert(updates, { onConflict: 'id' });

      if (updateError) {
        console.error('[usePageLayouts] Update error:', updateError);
        throw updateError;
      }

      console.log('[usePageLayouts] Layout updated successfully');

      // Invalidar cache e recarregar imediatamente
      invalidateCache();
      await fetchLayout(pageId, true);

      toast({
        title: "Layout atualizado",
        description: "As alterações foram salvas com sucesso."
      });

      return true;
    } catch (err: any) {
      console.error('[usePageLayouts] Error updating layout:', err);
      setError(err.message || 'Erro ao atualizar layout');
      
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive"
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchLayout, invalidateCache, toast]);

  // Configurar realtime para mudanças automáticas
  useEffect(() => {
    console.log('[usePageLayouts] Setting up realtime subscription...');
    
    const channel = supabase
      .channel('page-layout-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'page_layout_items'
        },
        (payload) => {
          console.log('[usePageLayouts] Realtime change detected:', payload);
          
          // Invalidar cache quando há mudanças
          invalidateCache();
          
          // Se temos o page_id, recarregar especificamente essa página
          if (payload.new && typeof payload.new === 'object' && 'page_id' in payload.new) {
            const pageId = (payload.new as any).page_id;
            if (pageId) {
              setTimeout(() => fetchLayout(pageId, true), 100);
            }
          }
        }
      )
      .subscribe();

    return () => {
      console.log('[usePageLayouts] Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [fetchLayout, invalidateCache]);

  // Periodically refresh para garantir sincronia
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('[usePageLayouts] Periodic cache invalidation');
      invalidateCache();
    }, 10000); // A cada 10 segundos

    return () => clearInterval(interval);
  }, [invalidateCache]);

  return {
    layouts,
    loading,
    error,
    fetchLayout,
    updateLayout,
    invalidateCache,
    cacheTimestamp
  };
};
