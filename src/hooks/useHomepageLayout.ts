
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
<<<<<<< HEAD
      console.log("[useHomepageLayout] Iniciando busca de layout...");
=======
>>>>>>> 112f740a79595fc063ed369e4d53e6bfc044da5f
      const { data: layoutData, error: layoutError } = await supabase
        .from('homepage_layout')
        .select('*')
        .order('display_order', { ascending: true });

      if (layoutError) throw layoutError;
<<<<<<< HEAD
      console.log("[useHomepageLayout] Raw layoutData:", layoutData, "count:", layoutData?.length || 0); // DEBUG LOG
      
      // Se não houver dados, criar layout padrão para garantir renderização
      if (!layoutData || layoutData.length === 0) {
        console.log("[useHomepageLayout] Nenhum dado de layout encontrado, usando layout padrão");
        const defaultLayout = [
          { id: 1, section_key: 'hero_banner', display_order: 1, is_visible: true },
          { id: 2, section_key: 'hero_quick_links', display_order: 2, is_visible: true },
          { id: 3, section_key: 'promo_banner', display_order: 3, is_visible: true },
          { id: 4, section_key: 'product_section_novidades', display_order: 4, is_visible: true },
          { id: 5, section_key: 'product_section_mais_vendidos', display_order: 5, is_visible: true },
          { id: 6, section_key: 'specialized_services', display_order: 6, is_visible: true },
          { id: 7, section_key: 'why_choose_us', display_order: 7, is_visible: true },
          { id: 8, section_key: 'contact_help', display_order: 8, is_visible: true }
        ];
        return setLayoutItems(defaultLayout.map(item => ({
          ...item,
          title: getSectionTitle(item.section_key)
        })));
      }
=======
>>>>>>> 112f740a79595fc063ed369e4d53e6bfc044da5f

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

<<<<<<< HEAD
  // Initial fetch with forced delay
=======
>>>>>>> 112f740a79595fc063ed369e4d53e6bfc044da5f
  useEffect(() => {
    console.log("[useHomepageLayout] Iniciando efeito de carregamento inicial");
    const timer = setTimeout(() => {
      console.log("[useHomepageLayout] Executando fetchLayout após delay");
      fetchLayout();
    }, 700); // Slightly longer delay than other hooks
    
    return () => clearTimeout(timer);
  }, [fetchLayout]);

  return { layoutItems, setLayoutItems, loading, error, fetchLayout, updateLayout };
};
