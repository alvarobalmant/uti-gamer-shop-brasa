import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface ProductSection {
  id: string;
  title: string;
  description?: string;
  filter_type?: 'category' | 'platform' | 'tag' | 'featured' | 'discount';
  filter_value?: string;
  display_limit?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  items?: { item_type: 'product' | 'tag'; item_id: string }[]; // Added items for mock data compatibility
  view_all_link?: string; // Added view_all_link for mock data compatibility
}

// Mock data for offline mode - Now includes 'items' and 'view_all_link'
const MOCK_PRODUCT_SECTIONS: ProductSection[] = [
  {
    id: 'novidades',
    title: 'Novidades',
    description: 'Os produtos mais recentes da UTI DOS GAMES',
    filter_type: 'featured',
    filter_value: 'true',
    display_limit: 8,
    is_active: true,
    items: [
      { item_type: 'product', item_id: '1' }, 
      { item_type: 'product', item_id: '2' }, 
      { item_type: 'product', item_id: '3' }, 
      { item_type: 'product', item_id: '4' }, 
      { item_type: 'product', item_id: '5' }, 
      { item_type: 'product', item_id: '6' },
      { item_type: 'product', item_id: '12' },
      { item_type: 'product', item_id: '13' },
      { item_type: 'product', item_id: '14' },
      { item_type: 'product', item_id: '16' },
      { item_type: 'product', item_id: '17' },
      { item_type: 'product', item_id: '18' },
      { item_type: 'product', item_id: '19' },
      { item_type: 'product', item_id: '20' },
    ],
    view_all_link: '/novidades'
  },
  {
    id: 'mais_vendidos',
    title: 'Mais Vendidos',
    description: 'Os produtos favoritos dos nossos clientes',
    filter_type: 'featured', // Assuming featured are best sellers for mock
    filter_value: 'true',
    display_limit: 8,
    is_active: true,
    items: [
      { item_type: 'product', item_id: '1' }, 
      { item_type: 'product', item_id: '4' }, 
      { item_type: 'product', item_id: '6' }, 
      { item_type: 'product', item_id: '12' },
      { item_type: 'product', item_id: '17' },
      { item_type: 'product', item_id: '18' },
      { item_type: 'product', item_id: '19' },
      { item_type: 'product', item_id: '20' },
    ],
    view_all_link: '/mais-vendidos'
  },
  {
    id: 'ofertas',
    title: 'Ofertas Especiais',
    description: 'Produtos com descontos imperdíveis',
    filter_type: 'discount',
    filter_value: 'true',
    display_limit: 8,
    is_active: true,
    items: [
      { item_type: 'product', item_id: '1' }, 
      { item_type: 'product', item_id: '2' }, 
      { item_type: 'product', item_id: '3' }, 
      { item_type: 'product', item_id: '4' }, 
      { item_type: 'product', item_id: '5' }, 
      { item_type: 'product', item_id: '6' },
      { item_type: 'product', item_id: '7' },
      { item_type: 'product', item_id: '8' },
      { item_type: 'product', item_id: '9' },
      { item_type: 'product', item_id: '10' },
      { item_type: 'product', item_id: '11' },
      { item_type: 'product', item_id: '12' },
      { item_type: 'product', item_id: '13' },
      { item_type: 'product', item_id: '14' },
      { item_type: 'product', item_id: '15' },
      { item_type: 'product', item_id: '16' },
      { item_type: 'product', item_id: '17' },
      { item_type: 'product', item_id: '18' },
      { item_type: 'product', item_id: '19' },
      { item_type: 'product', item_id: '20' },
    ],
    view_all_link: '/ofertas'
  },
  {
    id: 'playstation',
    title: 'PlayStation',
    description: 'Consoles, jogos e acessórios PlayStation',
    filter_type: 'platform',
    filter_value: 'playstation',
    display_limit: 8,
    is_active: true,
    items: [
      { item_type: 'product', item_id: '1' }, 
      { item_type: 'product', item_id: '4' }, 
      { item_type: 'product', item_id: '7' }, 
      { item_type: 'product', item_id: '10' },
      { item_type: 'product', item_id: '13' },
      { item_type: 'product', item_id: '16' },
      { item_type: 'product', item_id: '19' },
    ],
    view_all_link: '/playstation'
  },
  {
    id: 'xbox',
    title: 'Xbox',
    description: 'Consoles, jogos e acessórios Xbox',
    filter_type: 'platform',
    filter_value: 'xbox',
    display_limit: 8,
    is_active: true,
    items: [
      { item_type: 'product', item_id: '2' }, 
      { item_type: 'product', item_id: '5' }, 
      { item_type: 'product', item_id: '8' }, 
      { item_type: 'product', item_id: '11' },
      { item_type: 'product', item_id: '14' },
      { item_type: 'product', item_id: '17' },
    ],
    view_all_link: '/xbox'
  },
  {
    id: 'nintendo',
    title: 'Nintendo',
    description: 'Consoles, jogos e acessórios Nintendo',
    filter_type: 'platform',
    filter_value: 'nintendo',
    display_limit: 8,
    is_active: true,
    items: [
      { item_type: 'product', item_id: '3' }, 
      { item_type: 'product', item_id: '6' }, 
      { item_type: 'product', item_id: '9' }, 
      { item_type: 'product', item_id: '15' },
      { item_type: 'product', item_id: '18' },
    ],
    view_all_link: '/nintendo'
  },
  {
    id: 'colecionaveis',
    title: 'Colecionáveis',
    description: 'Figuras e itens colecionáveis dos seus personagens favoritos',
    filter_type: 'category',
    filter_value: 'colecionaveis',
    display_limit: 8,
    is_active: true,
    items: [
      { item_type: 'product', item_id: '12' },
      { item_type: 'product', item_id: '20' },
    ],
    view_all_link: '/categoria/colecionaveis'
  }
];

export const useProductSections = () => {
  const [productSections, setProductSections] = useState<ProductSection[]>(MOCK_PRODUCT_SECTIONS);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProductSections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('product_sections')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setProductSections(data || []);
    } catch (err: any) {
      console.error('Error fetching product sections:', err);
      setError('Falha ao carregar seções de produtos.');
      
      // Use mock product sections on error
      setProductSections(MOCK_PRODUCT_SECTIONS);
      
      toast({ 
        title: 'Aviso', 
        description: 'Usando seções de produtos locais devido a um problema de conexão.', 
        variant: 'default' 
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchProductSectionById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('product_sections')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      return data;
    } catch (err: any) {
      console.error(`Error fetching product section with ID ${id}:`, err);
      setError(`Falha ao carregar seção de produtos com ID ${id}.`);
      
      // Return mock product section with matching ID
      const mockSection = MOCK_PRODUCT_SECTIONS.find(s => s.id === id);
      
      if (!mockSection) {
        toast({ 
          title: 'Erro', 
          description: 'Seção de produtos não encontrada.', 
          variant: 'destructive' 
        });
        return null;
      }
      
      toast({ 
        title: 'Aviso', 
        description: 'Usando dados locais devido a um problema de conexão.', 
        variant: 'default' 
      });
      
      return mockSection;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Initial fetch
  useEffect(() => {
    fetchProductSections();
  }, [fetchProductSections]);

  return { productSections, loading, error, fetchProductSections, fetchProductSectionById };
};
