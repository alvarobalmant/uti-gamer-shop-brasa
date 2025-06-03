
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface HomepageLayoutItem {
  id: number;
  section_key: string;
  display_order: number;
  is_visible: boolean;
  title?: string;
}

interface LayoutUpdatePayload {
  id: number;
  section_key: string;
  display_order: number;
  is_visible: boolean;
}

export const useHomepageLayout = () => {
  const [layoutItems, setLayoutItems] = useState<HomepageLayoutItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const getSectionTitle = (key: string): string => {
    switch (key) {
      case 'hero_banner': return 'Carrossel de Banners Principal';
      case 'hero_quick_links': return 'Links Rápidos (Categorias)';
      case 'promo_banner': return 'Banner Promocional (UTI PRO)';
      case 'specialized_services': return 'Seção: Nossos Serviços Especializados';
      case 'why_choose_us': return 'Seção: Por que escolher a UTI DOS GAMES?';
      case 'contact_help': return 'Seção: Precisa de Ajuda/Contato';
      default:
        if (key.startsWith('product_section_')) {
          return `Seção de Produtos (${key.replace('product_section_', '').substring(0, 8)}...)`;
        }
        return key;
    }
  };

  const fetchLayout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: layoutData, error: layoutError } = await supabase
        .from('homepage_layout')
        .select('*')
        .order('display_order', { ascending: true });

      if (layoutError) throw layoutError;

      const productSectionKeys = layoutData
        ?.map(item => item.section_key)
        .filter(key => key.startsWith('product_section_')) || [];
      
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

      const enrichedLayoutData = layoutData?.map(item => {
        let title = getSectionTitle(item.section_key);
        if (item.section_key.startsWith('product_section_')) {
          const sectionId = item.section_key.replace('product_section_', '');
          const productSection = productSectionsData.find(sec => sec.id === sectionId);
          if (productSection) {
            title = productSection.title;
          }
        }
        return { ...item, title };
      }) || [];

      setLayoutItems(enrichedLayoutData);
    } catch (err: any) {
      console.error('Error fetching homepage layout:', err);
      setError('Falha ao carregar o layout da página inicial.');
      setLayoutItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateLayout = useCallback(async (updates: LayoutUpdatePayload[]) => {
    setLoading(true);
    setError(null);
    try {
      const { error: updateError } = await supabase
        .from('homepage_layout')
        .upsert(updates, { onConflict: 'id' });

      if (updateError) throw updateError;

      await fetchLayout();
      toast({ title: 'Sucesso', description: 'Layout da página inicial atualizado.' });
    } catch (err: any) {
      console.error('Error updating homepage layout:', err);
      setError('Falha ao atualizar o layout da página inicial.');
      toast({ title: 'Erro', description: 'Não foi possível salvar as alterações no layout.', variant: 'destructive' });
      await fetchLayout();
    } finally {
      setLoading(false);
    }
  }, [toast, fetchLayout]);

  useEffect(() => {
    fetchLayout();
  }, [fetchLayout]);

  return { layoutItems, setLayoutItems, loading, error, fetchLayout, updateLayout };
};
