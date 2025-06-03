import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

// Interface para os itens dentro de uma seção
export interface ProductSectionItem {
  id: number;
  section_id: string;
  item_id: string; // Pode ser ID do produto ou ID/nome da tag
  item_type: 'product' | 'tag';
  display_order: number;
}

// Interface atualizada para ProductSection incluindo os itens
export interface ProductSection {
  id: string;
  title: string;
  view_all_link?: string;
  created_at?: string;
  updated_at?: string;
  items?: ProductSectionItem[]; // Adicionado campo para itens
}

export const useProductSections = () => {
  const [sections, setSections] = useState<ProductSection[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProductSections = useCallback(async () => {
    console.log('[useProductSections] 🚀 Iniciando busca de seções...');
    setLoading(true);
    setError(null);
    
    try {
      // 1. Buscar dados básicos das seções
      console.log('[useProductSections] 📡 Buscando seções de produtos...');
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('product_sections')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('[useProductSections] 📦 Resposta das seções:', { 
        data: sectionsData, 
        error: sectionsError, 
        count: sectionsData?.length 
      });
      
      if (sectionsError) {
        console.error('[useProductSections] ❌ Erro ao buscar seções:', sectionsError);
        throw sectionsError;
      }
      
      if (!sectionsData || sectionsData.length === 0) {
        console.log('[useProductSections] ⚠️ Nenhuma seção encontrada');
        setSections([]);
        return;
      }

      // 2. Buscar todos os itens de todas as seções de uma vez
      console.log('[useProductSections] 📡 Buscando itens das seções...');
      const { data: itemsData, error: itemsError } = await supabase
        .from('product_section_items')
        .select('*')
        .order('display_order', { ascending: true });
        
      console.log('[useProductSections] 📦 Resposta dos itens:', { 
        data: itemsData, 
        error: itemsError, 
        count: itemsData?.length 
      });

      if (itemsError) {
        console.error('[useProductSections] ⚠️ Erro ao buscar itens das seções:', itemsError);
        // Continuar sem itens em caso de erro
        toast({ 
          title: 'Aviso', 
          description: 'Não foi possível carregar os itens das seções de produtos.', 
          variant: 'default' 
        });
      }

      // 3. Agrupar itens por section_id
      const itemsBySection: { [key: string]: ProductSectionItem[] } = {};
      if (itemsData) {
        for (const item of itemsData) {
          if (!itemsBySection[item.section_id]) {
            itemsBySection[item.section_id] = [];
          }
          itemsBySection[item.section_id].push(item);
        }
      }

      // 4. Combinar dados das seções com seus itens
      const combinedSections = sectionsData.map(section => ({
        ...section,
        items: itemsBySection[section.id] || [],
        title: section.title || 'Seção sem título',
        view_all_link: section.view_all_link || `/categoria/${section.id}`
      }));

      console.log('[useProductSections] ✅ Seções processadas:', combinedSections.length);
      console.log('[useProductSections] 🏷️ Exemplo de seção:', combinedSections[0]);
      setSections(combinedSections);

    } catch (err: any) {
      console.error('[useProductSections] 💥 Erro ao carregar seções:', err);
      setError('Falha ao carregar seções de produtos.');
      setSections([]);
      toast({ 
        title: 'Erro', 
        description: 'Não foi possível carregar as seções de produtos.', 
        variant: 'destructive' 
      });
    } finally {
      console.log('[useProductSections] 🏁 Finalizando busca de seções');
      setLoading(false);
    }
  }, [toast]);

  const fetchProductSectionById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Buscar dados da seção específica
      const { data: sectionData, error: sectionError } = await supabase
        .from('product_sections')
        .select('*')
        .eq('id', id)
        .single();

      if (sectionError) throw sectionError;
      if (!sectionData) return null;

      // 2. Buscar itens para esta seção específica
      const { data: itemsData, error: itemsError } = await supabase
        .from('product_section_items')
        .select('*')
        .eq('section_id', id)
        .order('display_order', { ascending: true });

      if (itemsError) {
        console.error(`Error fetching items for section ${id}:`, itemsError);
        // Retorna a seção sem itens em caso de erro nos itens
        return { ...sectionData, items: [] }; 
      }

      // 3. Combinar seção e itens
      return { ...sectionData, items: itemsData || [] };

    } catch (err: any) {
      console.error(`Error fetching product section with ID ${id}:`, err);
      setError(`Falha ao carregar seção de produtos com ID ${id}.`);
      toast({ title: 'Erro', description: `Não foi possível buscar a seção ${id}.`, variant: 'destructive' });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Initial fetch
  useEffect(() => {
    console.log("[useProductSections] 🎬 Iniciando efeito de carregamento inicial");
    const timer = setTimeout(() => {
      console.log("[useProductSections] ⏰ Executando fetchProductSections após delay");
      fetchProductSections();
    }, 200); // Short delay after RLS policies are in place
    
    return () => clearTimeout(timer);
  }, [fetchProductSections]);

  return { sections, loading, error, fetchProductSections, fetchProductSectionById }; 
};
