import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ProductSection, ProductSectionInput } from '@/types/productSections';

interface ProductSectionItem {
  id: string;
  section_id: string;
  item_type: 'product' | 'banner';
  item_id: string;
  display_order: number;
}

const fetchSectionsFromDatabase = async (): Promise<ProductSection[]> => {
  try {
    const { data, error } = await supabase
      .from('product_sections')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching product sections:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchSectionsFromDatabase:', error);
    throw error;
  }
};

const fetchSectionItemsFromDatabase = async (sectionId: string): Promise<ProductSectionItem[]> => {
  try {
    const { data, error } = await supabase
      .from('product_section_items')
      .select('*')
      .eq('section_id', sectionId)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching product section items:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchSectionItemsFromDatabase:', error);
    throw error;
  }
};

export const useProductSections = () => {
  const [sections, setSections] = useState<ProductSection[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSections = async () => {
    try {
      setLoading(true);
      const sectionsData = await fetchSectionsFromDatabase();
      setSections(sectionsData);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar seções",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSectionItems = async (sectionId: string) => {
    try {
      return await fetchSectionItemsFromDatabase(sectionId);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar itens da seção",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }
  };

  const createSection = async (sectionData: ProductSectionInput) => {
    try {
      const { items, ...sectionInfo } = sectionData;
      
      const { data: section, error: sectionError } = await supabase
        .from('product_sections')
        .insert([sectionInfo])
        .select()
        .single();

      if (sectionError) throw sectionError;

      // Add items if provided
      if (items && items.length > 0 && section) {
        const itemsToInsert = items.map(item => ({
          section_id: section.id,
          item_type: item.item_type,
          item_id: item.item_id,
          display_order: item.display_order
        }));

        const { error: itemsError } = await supabase
          .from('product_section_items')
          .insert(itemsToInsert);

        if (itemsError) throw itemsError;
      }

      await fetchSections();
      return { data: section, error: null };
    } catch (error: any) {
      console.error('Error creating section:', error);
      return { data: null, error };
    }
  };

  const updateSection = async (id: string, updates: Partial<ProductSectionInput>) => {
    try {
      const { items, ...sectionUpdates } = updates;
      
      const { error: sectionError } = await supabase
        .from('product_sections')
        .update(sectionUpdates)
        .eq('id', id);

      if (sectionError) throw sectionError;

      // Update items if provided
      if (items !== undefined) {
        // Remove existing items
        const { error: deleteError } = await supabase
          .from('product_section_items')
          .delete()
          .eq('section_id', id);

        if (deleteError) throw deleteError;

        // Add new items
        if (items.length > 0) {
          const itemsToInsert = items.map(item => ({
            section_id: id,
            item_type: item.item_type,
            item_id: item.item_id,
            display_order: item.display_order
          }));

          const { error: insertError } = await supabase
            .from('product_section_items')
            .insert(itemsToInsert);

          if (insertError) throw insertError;
        }
      }

      await fetchSections();
      return { data: { id, ...sectionUpdates }, error: null };
    } catch (error: any) {
      console.error('Error updating section:', error);
      return { data: null, error };
    }
  };

  const deleteSection = async (id: string) => {
    try {
      // Delete section items first
      const { error: itemsError } = await supabase
        .from('product_section_items')
        .delete()
        .eq('section_id', id);

      if (itemsError) throw itemsError;

      // Then delete the section
      const { error: sectionError } = await supabase
        .from('product_sections')
        .delete()
        .eq('id', id);

      if (sectionError) throw sectionError;

      await fetchSections();
      return { data: { success: true }, error: null };
    } catch (error: any) {
      console.error('Error deleting section:', error);
      return { data: null, error };
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  return {
    sections,
    loading,
    createSection,
    updateSection,
    deleteSection,
    getSectionItems,
    refetch: fetchSections,
  };
};
