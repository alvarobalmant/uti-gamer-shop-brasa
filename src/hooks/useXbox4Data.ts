
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/hooks/useProducts';

interface Xbox4Section {
  id: string;
  section_key: string;
  title: string;
  sectionConfig: any;
  is_visible: boolean;
}

interface Xbox4Data {
  consoles: Product[];
  games: Product[];
  accessories: Product[];
  deals: Product[];
  newsArticles: any[];
  loading: boolean;
  error: string | null;
}

export const useXbox4Data = (): Xbox4Data => {
  const [data, setData] = useState<Xbox4Data>({
    consoles: [],
    games: [],
    accessories: [],
    deals: [],
    newsArticles: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const loadXbox4Data = async () => {
      try {
        // Buscar a página Xbox4 e suas seções
        const { data: page, error: pageError } = await supabase
          .from('pages')
          .select('*')
          .eq('slug', 'xbox4')
          .single();

        if (pageError || !page) {
          console.log('Página Xbox4 não encontrada, usando dados fallback');
          setData(prev => ({ ...prev, loading: false }));
          return;
        }

        // Buscar seções da página
        const { data: sections, error: sectionsError } = await supabase
          .from('page_layout_items')
          .select('*')
          .eq('page_id', page.id)
          .eq('is_visible', true)
          .order('display_order');

        if (sectionsError) {
          console.error('Erro ao carregar seções:', sectionsError);
          setData(prev => ({ ...prev, loading: false, error: 'Erro ao carregar seções' }));
          return;
        }

        // Buscar todos os produtos
        const { data: allProducts, error: productsError } = await supabase
          .from('view_product_with_tags')
          .select('*');

        if (productsError) {
          console.error('Erro ao carregar produtos:', productsError);
          setData(prev => ({ ...prev, loading: false, error: 'Erro ao carregar produtos' }));
          return;
        }

        // Processar produtos (remover duplicatas e converter formato)
        const productsMap = new Map<string, Product>();
        
        allProducts?.forEach((row: any) => {
          const productId = row.product_id;
          
          if (!productsMap.has(productId)) {
            productsMap.set(productId, {
              id: productId,
              name: row.product_name || '',
              description: row.product_description || '',
              price: Number(row.product_price) || 0,
              image: row.product_image || '',
              stock: row.product_stock || 0,
              badge_text: row.badge_text || '',
              badge_color: row.badge_color || '#22c55e',
              badge_visible: row.badge_visible || false,
              specifications: row.product_specifications || [],
              images: row.product_images || [],
              tags: [],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              is_active: true,
              is_featured: false
            });
          }
          
          // Adicionar tag se existir
          if (row.tag_id && row.tag_name) {
            const product = productsMap.get(productId)!;
            const tagExists = product.tags?.some(tag => tag.id === row.tag_id);
            
            if (!tagExists) {
              product.tags = product.tags || [];
              product.tags.push({
                id: row.tag_id,
                name: row.tag_name
              });
            }
          }
        });

        const products = Array.from(productsMap.values());

        // Processar cada seção para extrair produtos específicos
        let consoles: Product[] = [];
        let games: Product[] = [];
        let accessories: Product[] = [];
        let deals: Product[] = [];
        let newsArticles: any[] = [];

        sections?.forEach((section: any) => {
          const config = section.section_config || {};
          
          switch (section.section_key) {
            case 'xbox4_consoles':
              consoles = getProductsForSection(products, config);
              break;
            case 'xbox4_games':
              games = getProductsForSection(products, config);
              break;
            case 'xbox4_accessories':
              accessories = getProductsForSection(products, config);
              break;
            case 'xbox4_deals':
              deals = getProductsForSection(products, config);
              break;
            case 'xbox4_news':
              newsArticles = config.articles || [];
              break;
          }
        });

        setData({
          consoles,
          games,
          accessories,
          deals,
          newsArticles,
          loading: false,
          error: null
        });

      } catch (error) {
        console.error('Erro ao carregar dados Xbox4:', error);
        setData(prev => ({ 
          ...prev, 
          loading: false, 
          error: 'Erro ao carregar dados' 
        }));
      }
    };

    loadXbox4Data();
  }, []);

  return data;
};

// Função auxiliar para extrair produtos de uma seção
const getProductsForSection = (allProducts: Product[], config: any): Product[] => {
  if (!config) return [];

  // Se há produtos específicos configurados
  if (config.products && config.products.length > 0) {
    return config.products
      .map((specificProduct: any) => {
        const baseProduct = allProducts.find(p => p.id === specificProduct.productId);
        if (!baseProduct) return null;
        
        // Aplicar overrides se fornecidos
        return {
          ...baseProduct,
          name: specificProduct.title || baseProduct.name,
          image: specificProduct.imageUrl || baseProduct.image,
          badge_text: specificProduct.badge?.text || baseProduct.badge_text,
          badge_color: specificProduct.badge?.color || baseProduct.badge_color,
          // Adicionar propriedades para ofertas - use is_featured instead of isOnSale/isFeatured
          is_featured: specificProduct.isFeatured || specificProduct.isOnSale || baseProduct.is_featured,
          originalPrice: specificProduct.originalPrice || undefined,
          discount: specificProduct.discount || undefined
        };
      })
      .filter(Boolean);
  }

  // Fallback: filtrar por tags
  const { tagIds, limit = 10 } = config.filter || {};
  
  let filtered = allProducts;
  
  if (tagIds && tagIds.length > 0) {
    filtered = filtered.filter(product => 
      product.tags?.some(tag => 
        tagIds.includes(tag.id) || tagIds.includes(tag.name.toLowerCase())
      )
    );
  }
  
  return filtered.slice(0, limit);
};
