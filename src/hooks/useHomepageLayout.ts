
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

// Define the structure for a layout item from the DB
export interface HomepageLayoutItem {
  id: number;
  section_key: string; // e.g., 'hero_banner', 'promo_banner', 'product_section_uuid'
  display_order: number;
  is_visible: boolean;
  // Add title/description for display in admin panel if needed, fetched separately or joined
  title?: string; // Example: Fetched from product_sections or hardcoded for fixed sections
}

// Define the structure for updating layout items - include section_key for upsert
interface LayoutUpdatePayload {
  id: number;
  section_key: string; // Required for upsert
  display_order: number;
  is_visible: boolean;
}

export const useHomepageLayout = () => {
  const [layoutItems, setLayoutItems] = useState<HomepageLayoutItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Hardcoded titles for fixed sections (can be improved)
  const getSectionTitle = (key: string): string => {
    switch (key) {
      case 'hero_banner': return 'Carrossel de Banners Principal';
      case 'promo_banner': return 'Banner Promocional (UTI PRO)';
      case 'service_cards': return 'Cartões de Serviço/Contato';
      // Product sections title will be fetched separately
      default: return key; // Fallback to key
    }
  };

  const fetchLayout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch layout order
      const { data: layoutData, error: layoutError } = await supabase
        .from('homepage_layout')
        .select('*')
        .order('display_order', { ascending: true });

      if (layoutError) throw layoutError;

      // Fetch product section details to get titles
      const productSectionKeys = layoutData
        .map(item => item.section_key)
        .filter(key => key.startsWith('product_section_'));
      
      let productSectionsData: { id: string, title: string }[] = [];
      if (productSectionKeys.length > 0) {
        const sectionIds = productSectionKeys.map(key => key.replace('product_section_', ''));
        const { data: sections, error: sectionsError } = await supabase
          .from('product_sections')
          .select('id, title')
          .in('id', sectionIds);
        
        if (sectionsError) {
          console.warn('Could not fetch product section titles:', sectionsError.message);
        } else {
          productSectionsData = sections || [];
        }
      }

      // Combine layout data with titles
      const enrichedLayoutData = layoutData.map(item => {
        let title = getSectionTitle(item.section_key);
        if (item.section_key.startsWith('product_section_')) {
          const sectionId = item.section_key.replace('product_section_', '');
          const productSection = productSectionsData.find(sec => sec.id === sectionId);
          if (productSection) {
            title = productSection.title; // Use fetched title
          }
        }
        return { ...item, title }; // Add title to the item
      });

      setLayoutItems(enrichedLayoutData);

    } catch (err: any) {
      console.error('Error fetching homepage layout:', err);
      setError('Falha ao carregar o layout da página inicial.');
      toast({ title: 'Erro', description: 'Não foi possível carregar a configuração do layout.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateLayout = useCallback(async (updates: LayoutUpdatePayload[]) => {
    setLoading(true);
    setError(null);
    try {
      // Use bulk update (upsert might be safer if items could be deleted/re-added)
      const { error: updateError } = await supabase
        .from('homepage_layout')
        .upsert(updates, { onConflict: 'id' }); // Assumes 'id' is the primary key to match on

      if (updateError) throw updateError;

      // Refetch layout to confirm changes and get updated state
      await fetchLayout(); 
      toast({ title: 'Sucesso', description: 'Layout da página inicial atualizado.' });

    } catch (err: any) {
      console.error('Error updating homepage layout:', err);
      setError('Falha ao atualizar o layout da página inicial.');
      toast({ title: 'Erro', description: 'Não foi possível salvar as alterações no layout.', variant: 'destructive' });
      // Optionally refetch even on error to revert optimistic updates if any
      await fetchLayout(); 
    } finally {
      setLoading(false);
    }
  }, [toast, fetchLayout]);

  // Initial fetch
  useEffect(() => {
    fetchLayout();
  }, [fetchLayout]);

  return { layoutItems, setLayoutItems, loading, error, fetchLayout, updateLayout };
};
