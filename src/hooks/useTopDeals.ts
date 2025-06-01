import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

// Define the structure for a top deals section
export interface TopDealSection {
  id: string; // UUID
  title: string;
  subtitle?: string | null;
  view_all_link?: string | null;
  banner_title?: string | null;
  banner_subtitle?: string | null;
  banner_image_url?: string | null;
  banner_button_text?: string | null;
  banner_button_link?: string | null;
  is_pro_exclusive?: boolean;
  created_at?: string;
  updated_at?: string;
  items?: TopDealItem[]; // Populated after fetch
}

// Define the structure for a top deal item
export interface TopDealItem {
  id?: number; // Optional for creation
  section_id: string; // UUID
  product_id: string; // Product UUID
  deal_label: string; // e.g., "RIG DEAL", "PRE-OWNED BUNDLE", etc.
  display_order?: number;
}

// Type for creating/updating a top deals section with its items
export interface TopDealSectionInput {
  id?: string; // Required for update, absent for create
  title: string;
  subtitle?: string | null;
  view_all_link?: string | null;
  banner_title?: string | null;
  banner_subtitle?: string | null;
  banner_image_url?: string | null;
  banner_button_text?: string | null;
  banner_button_link?: string | null;
  is_pro_exclusive?: boolean;
  items: { product_id: string; deal_label: string }[]; // Simplified item structure for input
}

export const useTopDeals = () => {
  const [sections, setSections] = useState<TopDealSection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch sections
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('top_deal_sections')
        .select('*')
        .order('created_at', { ascending: false });

      if (sectionsError) throw sectionsError;

      // Fetch items for each section
      const sectionIds = sectionsData.map(s => s.id);
      let allItems: TopDealItem[] = [];
      if (sectionIds.length > 0) {
        const { data: itemsData, error: itemsError } = await supabase
          .from('top_deal_items')
          .select('*')
          .in('section_id', sectionIds)
          .order('display_order', { ascending: true });
        if (itemsError) throw itemsError;
        allItems = itemsData || [];
      }

      // Combine sections with their items
      const combinedSections = sectionsData.map(section => ({
        ...section,
        items: allItems.filter(item => item.section_id === section.id),
      }));

      setSections(combinedSections);

    } catch (err: any) {
      console.error('Error fetching top deal sections:', err);
      setError('Falha ao carregar as seções de ofertas especiais.');
      toast({ title: 'Erro', description: 'Não foi possível carregar as seções de ofertas especiais.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createSection = useCallback(async (sectionInput: TopDealSectionInput): Promise<TopDealSection | null> => {
    setLoading(true);
    setError(null);
    let newSectionId: string | null = null;
    try {
      // 1. Create the section entry
      const { data: newSectionData, error: sectionError } = await supabase
        .from('top_deal_sections')
        .insert({
          title: sectionInput.title,
          subtitle: sectionInput.subtitle,
          view_all_link: sectionInput.view_all_link,
          banner_title: sectionInput.banner_title,
          banner_subtitle: sectionInput.banner_subtitle,
          banner_image_url: sectionInput.banner_image_url,
          banner_button_text: sectionInput.banner_button_text,
          banner_button_link: sectionInput.banner_button_link,
          is_pro_exclusive: sectionInput.is_pro_exclusive || false,
        })
        .select()
        .single();

      if (sectionError) throw sectionError;
      if (!newSectionData) throw new Error('Failed to create section, no data returned.');
      
      newSectionId = newSectionData.id;

      // 2. Create the section items
      if (sectionInput.items && sectionInput.items.length > 0) {
        const itemsToInsert = sectionInput.items.map((item, index) => ({
          section_id: newSectionId,
          product_id: item.product_id,
          deal_label: item.deal_label,
          display_order: index, // Simple order based on input array
        }));
        const { error: itemsError } = await supabase
          .from('top_deal_items')
          .insert(itemsToInsert);
        if (itemsError) throw itemsError;
      }

      // 3. Add to homepage_layout (find the last order and add 1)
      const { data: lastOrderItem, error: orderError } = await supabase
        .from('homepage_layout')
        .select('display_order')
        .order('display_order', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (orderError && orderError.code !== 'PGRST116') { // Ignore 'No rows found' error
         throw orderError;
      }

      const nextOrder = lastOrderItem ? lastOrderItem.display_order + 1 : 1;
      const sectionKey = `top_deal_section_${newSectionId}`;

      const { error: layoutError } = await supabase
        .from('homepage_layout')
        .insert({
          section_key: sectionKey,
          display_order: nextOrder,
          is_visible: true, // Default to visible
        });

      if (layoutError) {
        console.error('Failed to add section to layout:', layoutError);
        toast({ title: 'Aviso', description: 'Seção criada, mas falha ao adicionar ao layout da home.', variant: 'destructive' });
      } else {
         toast({ title: 'Sucesso', description: 'Seção de ofertas especiais criada e adicionada ao layout.' });
      }

      // Refetch sections to update the list
      await fetchSections();
      
      // Return the created section with properly mapped items
      const mappedItems: TopDealItem[] = sectionInput.items.map((item, index) => ({
        section_id: newSectionId!,
        product_id: item.product_id,
        deal_label: item.deal_label,
        display_order: index
      }));
      
      return { ...newSectionData, items: mappedItems };

    } catch (err: any) {
      console.error('Error creating top deal section:', err);
      setError('Falha ao criar a seção de ofertas especiais.');
      toast({ title: 'Erro', description: 'Falha ao criar a seção de ofertas especiais.', variant: 'destructive' });
      setLoading(false);
      return null;
    }
  }, [toast, fetchSections]);

  const updateSection = useCallback(async (sectionInput: TopDealSectionInput): Promise<TopDealSection | null> => {
    if (!sectionInput.id) {
      toast({ title: 'Erro', description: 'ID da seção é necessário para atualização.', variant: 'destructive' });
      return null;
    }
    setLoading(true);
    setError(null);
    const sectionId = sectionInput.id;

    try {
      // 1. Update section details
      const { error: sectionUpdateError } = await supabase
        .from('top_deal_sections')
        .update({
          title: sectionInput.title,
          subtitle: sectionInput.subtitle,
          view_all_link: sectionInput.view_all_link,
          banner_title: sectionInput.banner_title,
          banner_subtitle: sectionInput.banner_subtitle,
          banner_image_url: sectionInput.banner_image_url,
          banner_button_text: sectionInput.banner_button_text,
          banner_button_link: sectionInput.banner_button_link,
          is_pro_exclusive: sectionInput.is_pro_exclusive || false,
          updated_at: new Date().toISOString(), // Manually update timestamp
        })
        .eq('id', sectionId);

      if (sectionUpdateError) throw sectionUpdateError;

      // 2. Replace section items (delete old, insert new)
      const { error: deleteError } = await supabase
        .from('top_deal_items')
        .delete()
        .eq('section_id', sectionId);

      if (deleteError) throw deleteError;

      if (sectionInput.items && sectionInput.items.length > 0) {
        const itemsToInsert = sectionInput.items.map((item, index) => ({
          section_id: sectionId,
          product_id: item.product_id,
          deal_label: item.deal_label,
          display_order: index,
        }));
        const { error: itemsInsertError } = await supabase
          .from('top_deal_items')
          .insert(itemsToInsert);
        if (itemsInsertError) throw itemsInsertError;
      }

      toast({ title: 'Sucesso', description: 'Seção de ofertas especiais atualizada.' });
      await fetchSections(); // Refetch
      // Find the updated section in the newly fetched list
      const updatedSection = sections.find(s => s.id === sectionId);
      return updatedSection || null; // Return updated data

    } catch (err: any) {
      console.error('Error updating top deal section:', err);
      setError('Falha ao atualizar a seção de ofertas especiais.');
      toast({ title: 'Erro', description: 'Falha ao atualizar a seção de ofertas especiais.', variant: 'destructive' });
      setLoading(false);
      return null;
    }
  }, [toast, fetchSections, sections]);

  const deleteSection = useCallback(async (sectionId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      // 1. Delete from homepage_layout first
      const sectionKey = `top_deal_section_${sectionId}`;
      const { error: layoutDeleteError } = await supabase
        .from('homepage_layout')
        .delete()
        .eq('section_key', sectionKey);

      // Log error but continue, maybe it was already removed
      if (layoutDeleteError) {
         console.warn('Could not delete section from layout:', layoutDeleteError.message);
      }

      // 2. Delete the section (should cascade to items)
      const { error: sectionDeleteError } = await supabase
        .from('top_deal_sections')
        .delete()
        .eq('id', sectionId);

      if (sectionDeleteError) throw sectionDeleteError;

      toast({ title: 'Sucesso', description: 'Seção de ofertas especiais removida.' });
      await fetchSections(); // Refetch
      return true;

    } catch (err: any) {
      console.error('Error deleting top deal section:', err);
      setError('Falha ao remover a seção de ofertas especiais.');
      toast({ title: 'Erro', description: 'Falha ao remover a seção de ofertas especiais.', variant: 'destructive' });
      setLoading(false);
      return false;
    }
  }, [toast, fetchSections]);

  // Initial fetch
  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  return { sections, loading, error, fetchSections, createSection, updateSection, deleteSection };
};
