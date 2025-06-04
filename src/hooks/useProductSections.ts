
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
  // Renomeado para sections para clareza
  const [sections, setSections] = useState<ProductSection[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Função fetch atualizada para buscar seções E seus itens
  const fetchProductSections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('[useProductSections] Iniciando busca de seções...');
      
      // 1. Buscar dados básicos das seções
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('product_sections')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('[useProductSections] Resposta da busca de seções:', { data: sectionsData, error: sectionsError });
      
      if (sectionsError) throw sectionsError;
      if (!sectionsData) {
        console.log('[useProductSections] Nenhuma seção encontrada');
        setSections([]);
        return;
      }

      // 2. Buscar todos os itens de todas as seções de uma vez
      console.log('[useProductSections] Buscando itens das seções...');
      const { data: itemsData, error: itemsError } = await supabase
        .from('product_section_items')
        .select('*')
        .order('display_order', { ascending: true });
        
      console.log('[useProductSections] Resposta da busca de itens:', { data: itemsData, error: itemsError });

      if (itemsError) {
        // Logar o erro, mas continuar com as seções (sem itens)
        console.error('Error fetching product section items:', itemsError);
        toast({ title: 'Aviso', description: 'Não foi possível carregar os itens das seções de produtos.', variant: 'default' });
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
        items: itemsBySection[section.id] || [], // Adiciona array de itens (ou vazio se não houver)
        // Garantir que campos obrigatórios existam
        title: section.title || 'Seção sem título',
        view_all_link: section.view_all_link || `/categoria/${section.id}`
      }));

      console.log('[useProductSections] Seções combinadas com itens:', combinedSections);
      setSections(combinedSections);

    } catch (err: any) {
      console.error('Error fetching product sections:', err);
      setError('Falha ao carregar seções de produtos.');
      setSections([]); // Limpa em caso de erro
      toast({ title: 'Erro', description: 'Não foi possível carregar as seções de produtos.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // fetchProductSectionById também precisa ser atualizado para buscar itens
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

  const createSection = useCallback(async (sectionData: Omit<ProductSection, 'id' | 'created_at' | 'updated_at' | 'items'>) => {
    try {
      const { data, error: insertError } = await supabase
        .from('product_sections')
        .insert([sectionData])
        .select()
        .single();

      if (insertError) throw insertError;

      toast({ 
        title: 'Sucesso', 
        description: 'Seção criada com sucesso.' 
      });

      await fetchProductSections();
      return data;
    } catch (err: any) {
      console.error('Error creating section:', err);
      toast({ 
        title: 'Erro', 
        description: 'Falha ao criar seção.', 
        variant: 'destructive' 
      });
      throw err;
    }
  }, [toast, fetchProductSections]);

  const updateSection = useCallback(async (id: string, sectionData: Partial<Omit<ProductSection, 'id' | 'created_at' | 'updated_at' | 'items'>>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('product_sections')
        .update(sectionData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      toast({ 
        title: 'Sucesso', 
        description: 'Seção atualizada com sucesso.' 
      });

      await fetchProductSections();
      return data;
    } catch (err: any) {
      console.error('Error updating section:', err);
      toast({ 
        title: 'Erro', 
        description: 'Falha ao atualizar seção.', 
        variant: 'destructive' 
      });
      throw err;
    }
  }, [toast, fetchProductSections]);

  const deleteSection = useCallback(async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('product_sections')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      toast({ 
        title: 'Sucesso', 
        description: 'Seção removida com sucesso.' 
      });

      await fetchProductSections();
    } catch (err: any) {
      console.error('Error deleting section:', err);
      toast({ 
        title: 'Erro', 
        description: 'Falha ao remover seção.', 
        variant: 'destructive' 
      });
      throw err;
    }
  }, [toast, fetchProductSections]);

  // Initial fetch with forced delay
  useEffect(() => {
    console.log("[useProductSections] Iniciando efeito de carregamento inicial");
    const timer = setTimeout(() => {
      console.log("[useProductSections] Executando fetchProductSections após delay");
      fetchProductSections();
    }, 600); // Slightly longer delay than useProducts
    
    return () => clearTimeout(timer);
  }, [fetchProductSections]);

  // Retorna 'sections' em vez de 'productSections'
  return { 
    sections, 
    loading, 
    error, 
    fetchProductSections, 
    fetchProductSectionById,
    createSection,
    updateSection,
    deleteSection,
    fetchSections: fetchProductSections // Alias for backward compatibility
  }; 
};
