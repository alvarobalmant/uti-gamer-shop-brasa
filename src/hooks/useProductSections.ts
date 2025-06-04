import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

// Interface para os itens dentro de uma seção
export interface ProductSectionItem {
  id: number;
  section_id: string;
  item_id: string; // ID do produto ou ID/nome da tag
  item_type: 'product' | 'tag';
  display_order: number;
  created_at?: string; // Adicionado para consistência
}

// Tipo para input de seção de produto (sem id, timestamps e items)
export type ProductSectionInput = Omit<ProductSection, 'id' | 'created_at' | 'updated_at' | 'items'>;

// Tipo para tipos de item
export type SectionItemType = 'product' | 'tag';

// Interface atualizada para ProductSection incluindo os itens
export interface ProductSection {
  id: string;
  title: string;
  view_all_link?: string;
  created_at?: string;
  updated_at?: string;
  items?: ProductSectionItem[]; // Array de itens
}

// Tipo para input de itens (omitir id, section_id, created_at)
export type SectionItemInput = Omit<ProductSectionItem, 'id' | 'section_id' | 'created_at'>;

// Tipo para input de seção (omitir id, created_at, updated_at, items)
// Incluir 'items' como array de SectionItemInput para criação/atualização
export type ProductSectionInput = Omit<ProductSection, 'id' | 'created_at' | 'updated_at' | 'items'> & {
  items?: SectionItemInput[];
};

// Exportar SectionItemType (embora seja apenas 'product' | 'tag', exportar explicitamente)
export type SectionItemType = 'product' | 'tag';

export const useProductSections = () => {
  const [sections, setSections] = useState<ProductSection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProductSections = useCallback(async () => {
    // ... (fetchProductSections implementation remains the same) ...
    setLoading(true);
    setError(null);
    try {
      console.log('[useProductSections] Iniciando busca de seções...');
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('product_sections')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('[useProductSections] Resposta da busca de seções:', { data: sectionsData, error: sectionsError });
      if (sectionsError) throw sectionsError;
      if (!sectionsData) {
        setSections([]);
        return;
      }

      console.log('[useProductSections] Buscando itens das seções...');
      const { data: itemsData, error: itemsError } = await supabase
        .from('product_section_items')
        .select('*')
        .order('display_order', { ascending: true });

      console.log('[useProductSections] Resposta da busca de itens:', { data: itemsData, error: itemsError });
      if (itemsError) {
        console.error('Error fetching product section items:', itemsError);
        toast({ title: 'Aviso', description: 'Não foi possível carregar os itens das seções de produtos.', variant: 'default' });
      }

      const itemsBySection: { [key: string]: ProductSectionItem[] } = {};
      if (itemsData) {
        for (const item of itemsData) {
          if (!itemsBySection[item.section_id]) {
            itemsBySection[item.section_id] = [];
          }
          itemsBySection[item.section_id].push(item);
        }
      }

      const combinedSections = sectionsData.map(section => ({
        ...section,
        items: itemsBySection[section.id] || [],
        title: section.title || 'Seção sem título',
        view_all_link: section.view_all_link || `/categoria/${section.id}`
      }));

      console.log('[useProductSections] Seções combinadas com itens:', combinedSections);
      setSections(combinedSections);

    } catch (err: any) {
      console.error('Error fetching product sections:', err);
      setError('Falha ao carregar seções de produtos.');
      setSections([]);
      toast({ title: 'Erro', description: 'Não foi possível carregar as seções de produtos.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchProductSectionById = useCallback(async (id: string): Promise<ProductSection | null> => {
    // ... (fetchProductSectionById implementation remains the same) ...
    setLoading(true);
    setError(null);
    try {
      const { data: sectionData, error: sectionError } = await supabase
        .from('product_sections')
        .select('*')
        .eq('id', id)
        .single();

      if (sectionError) throw sectionError;
      if (!sectionData) return null;

      const { data: itemsData, error: itemsError } = await supabase
        .from('product_section_items')
        .select('*')
        .eq('section_id', id)
        .order('display_order', { ascending: true });

      if (itemsError) {
        console.error(`Error fetching items for section ${id}:`, itemsError);
        return { ...sectionData, items: [] };
      }

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

<<<<<<< HEAD
  // --- Funções CRUD Adicionadas --- 

  const createSection = useCallback(async (sectionData: ProductSectionInput) => {
    console.log('[useProductSections] Criando nova seção:', sectionData);
    setLoading(true);
    setError(null);
    try {
      const { items, ...sectionPayload } = sectionData;

      // 1. Inserir a seção principal
      const { data: insertedSection, error: insertError } = await supabase
        .from('product_sections')
        .insert(sectionPayload as any)
=======
  const createSection = useCallback(async (sectionData: ProductSectionInput) => {
    try {
      const { data, error: insertError } = await supabase
        .from('product_sections')
        .insert([sectionData])
>>>>>>> d9e7072385b2fd1de8d1c790dab60f58904b15df
        .select()
        .single();

      if (insertError) throw insertError;
<<<<<<< HEAD
      if (!insertedSection) throw new Error('Falha ao retornar dados da seção inserida.');

      console.log('[useProductSections] Seção base inserida:', insertedSection.id);

      // 2. Inserir os itens da seção (se houver)
      if (items && items.length > 0) {
        const itemsPayload = items.map(item => ({ ...item, section_id: insertedSection.id }));
        console.log('[useProductSections] Inserindo itens:', itemsPayload);
        const { error: itemsError } = await supabase.from('product_section_items').insert(itemsPayload);
        if (itemsError) {
          console.warn('[useProductSections] Erro ao inserir itens da seção:', itemsError);
          toast({ title: 'Aviso', description: 'Seção criada, mas houve erro ao adicionar itens.', variant: 'default' });
        } else {
          console.log('[useProductSections] Itens da seção inseridos com sucesso.');
        }
      }

      await fetchProductSections();
      toast({ title: 'Sucesso', description: 'Seção de produtos criada com sucesso.' });
      return insertedSection;

    } catch (err: any) {
      console.error('Error creating product section:', err);
      setError('Falha ao criar seção de produtos.');
      toast({ title: 'Erro', description: err.message || 'Não foi possível criar a seção.', variant: 'destructive' });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast, fetchProductSections]);

  const updateSection = useCallback(async (id: string, sectionData: ProductSectionInput) => {
    console.log(`[useProductSections] Atualizando seção ID: ${id}`, sectionData);
    setLoading(true);
    setError(null);
    try {
      const { items, ...sectionPayload } = sectionData;

      // 1. Atualizar a seção principal
      const { data: updatedSection, error: updateError } = await supabase
        .from('product_sections')
        .update(sectionPayload as any)
=======

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

  const updateSection = useCallback(async (id: string, sectionData: Partial<ProductSectionInput>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('product_sections')
        .update(sectionData)
>>>>>>> d9e7072385b2fd1de8d1c790dab60f58904b15df
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
<<<<<<< HEAD
      if (!updatedSection) throw new Error('Falha ao retornar dados da seção atualizada.');

      console.log('[useProductSections] Seção base atualizada:', updatedSection.id);

      // 2. Atualizar itens (ex: deletar antigos e inserir novos)
      if (items !== undefined) { // Permitir atualizar itens mesmo se for array vazio
        console.log('[useProductSections] Atualizando itens da seção:', items);
        // Deletar itens antigos
        const { error: deleteItemsError } = await supabase.from('product_section_items').delete().eq('section_id', id);
        if (deleteItemsError) console.warn('[useProductSections] Erro ao deletar itens antigos:', deleteItemsError);

        // Inserir itens novos (se houver)
        if (items.length > 0) {
          const itemsPayload = items.map(item => ({ ...item, section_id: id }));
          const { error: itemsError } = await supabase.from('product_section_items').insert(itemsPayload);
          if (itemsError) {
            console.warn('[useProductSections] Erro ao inserir novos itens:', itemsError);
            toast({ title: 'Aviso', description: 'Seção atualizada, mas houve erro ao atualizar itens.', variant: 'default' });
          } else {
            console.log('[useProductSections] Itens da seção atualizados com sucesso.');
          }
        }
      }

      await fetchProductSections();
      toast({ title: 'Sucesso', description: 'Seção de produtos atualizada com sucesso.' });
      return updatedSection;

    } catch (err: any) {
      console.error('Error updating product section:', err);
      setError('Falha ao atualizar seção de produtos.');
      toast({ title: 'Erro', description: err.message || 'Não foi possível atualizar a seção.', variant: 'destructive' });
      return null;
    } finally {
      setLoading(false);
=======

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
>>>>>>> d9e7072385b2fd1de8d1c790dab60f58904b15df
    }
  }, [toast, fetchProductSections]);

  const deleteSection = useCallback(async (id: string) => {
<<<<<<< HEAD
    console.log(`[useProductSections] Deletando seção ID: ${id}`);
    setLoading(true);
    setError(null);
    try {
      // 1. Deletar itens associados primeiro
      const { error: deleteItemsError } = await supabase.from('product_section_items').delete().eq('section_id', id);
      if (deleteItemsError) console.warn('[useProductSections] Erro ao deletar itens da seção:', deleteItemsError);

      // 2. Deletar a seção principal
=======
    try {
>>>>>>> d9e7072385b2fd1de8d1c790dab60f58904b15df
      const { error: deleteError } = await supabase
        .from('product_sections')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

<<<<<<< HEAD
      console.log('[useProductSections] Seção deletada com sucesso.');
      await fetchProductSections();
      toast({ title: 'Sucesso', description: 'Seção de produtos excluída com sucesso.' });
      return true;

    } catch (err: any) {
      console.error('Error deleting product section:', err);
      setError('Falha ao excluir seção de produtos.');
      toast({ title: 'Erro', description: err.message || 'Não foi possível excluir a seção.', variant: 'destructive' });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast, fetchProductSections]);

  // --- Fim Funções CRUD --- 

=======
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
>>>>>>> d9e7072385b2fd1de8d1c790dab60f58904b15df
  useEffect(() => {
    fetchProductSections();
  }, [fetchProductSections]);

<<<<<<< HEAD
  // Retornar todas as funções, incluindo CRUD
  return {
    sections,
    loading,
    error,
    fetchProductSections,
    fetchProductSectionById,
    createSection,
    updateSection,
    deleteSection
  };
=======
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
>>>>>>> d9e7072385b2fd1de8d1c790dab60f58904b15df
};
