 import { supabase } from '@/integrations/supabase/client';
 import { Product } from './types';
 import { CarouselConfig } from '@/types/specialSections';
 
 // Mapper para integra_products -> Product
 const mapIntegraRowToProduct = (row: any, tags: any[] = []): Product => {
   const price = Number(row.preco_venda) || 0;
   const promoPrice = Number(row.preco_promocao) || 0;
   const isOnSale = promoPrice > 0 && promoPrice < price;
 
   return {
     id: row.id,
     name: row.descricao || '',
     brand: '',
     category: row.category || row.grupo || '',
     description: row.descricao || '',
     price: isOnSale ? promoPrice : price,
     list_price: isOnSale ? price : undefined,
     pro_price: row.uti_pro_price ? Number(row.uti_pro_price) : undefined,
     image: row.foto || '',
     additional_images: [],
     sizes: [],
     colors: [],
     stock: Number(row.saldo_atual) || 0,
     badge_text: row.badge_text || '',
     badge_color: row.badge_color || '#22c55e',
     badge_visible: row.badge_visible || false,
     specifications: [],
     technical_specs: {},
     product_features: {},
     free_shipping: false,
     meta_title: '',
     meta_description: '',
     slug: row.slug || '',
     is_active: row.is_active !== false && row.suspensa !== 'S',
     is_featured: row.is_featured || false,
     uti_coins_cashback_percentage: row.uti_coins_cashback_percentage ? Number(row.uti_coins_cashback_percentage) : undefined,
     uti_coins_discount_percentage: row.uti_coins_discount_percentage ? Number(row.uti_coins_discount_percentage) : undefined,
     sku_code: row.referencia || row.codigo_barra || undefined,
     product_type: 'simple',
     tags: tags,
     created_at: row.created_at || new Date().toISOString(),
     updated_at: row.updated_at || new Date().toISOString()
   };
 };
 
 export const fetchProductsFromDatabase = async (includeAdmin: boolean = false): Promise<Product[]> => {
   console.log(`[fetchProductsFromDatabase] Fetching from integra_products (includeAdmin: ${includeAdmin})`);
 
   try {
     // Query integra_products com tags
     let query = supabase
       .from('integra_products')
       .select(`
         *,
         integra_product_tags!left(
           tag_id,
           integra_tags!left(id, name, category)
         )
       `);
 
     // Aplicar filtros
     if (!includeAdmin) {
       query = query.eq('is_active', true).neq('suspensa', 'S');
     }
 
     const { data, error } = await query;
 
     if (error) {
       console.error('[fetchProductsFromDatabase] Error:', error);
       throw error;
     }
 
     if (!data || data.length === 0) {
       console.warn('[fetchProductsFromDatabase] No products found');
       return [];
     }
 
     // Processar produtos com tags
     const productsMap = new Map<string, Product>();
 
     data.forEach((row: any) => {
       if (!row.id) return;
 
       // Extrair tags do JOIN
       const tags: any[] = [];
       if (row.integra_product_tags && Array.isArray(row.integra_product_tags)) {
         row.integra_product_tags.forEach((pt: any) => {
           if (pt.integra_tags) {
             tags.push({
               id: pt.integra_tags.id,
               name: pt.integra_tags.name,
               weight: 1,
               category: pt.integra_tags.category || 'generic'
             });
           }
         });
       }
 
       productsMap.set(row.id, mapIntegraRowToProduct(row, tags));
     });
 
     const finalProducts = Array.from(productsMap.values());
     console.log(`[fetchProductsFromDatabase] Loaded ${finalProducts.length} products from integra_products`);
     return finalProducts;
   } catch (error) {
     console.error('[fetchProductsFromDatabase] Error:', error);
     throw error;
   }
 };
 
 export const fetchProductsByCriteria = async (config: CarouselConfig, includeAdmin: boolean = false): Promise<Product[]> => {
   try {
     let query = supabase
       .from('integra_products')
       .select(`
         *,
         integra_product_tags!left(
           tag_id,
           integra_tags!left(id, name, category)
         )
       `);
 
     if (!includeAdmin) {
       query = query.eq('is_active', true).neq('suspensa', 'S');
     }
 
     if (config.product_ids && config.product_ids.length > 0) {
       query = query.in('id', config.product_ids);
     }
     if (config.limit) {
       query = query.limit(config.limit);
     }
 
     const { data, error } = await query;
 
     if (error) {
       console.error('Error fetching products by criteria:', error);
       throw error;
     }
 
     const productsMap = new Map<string, Product>();
 
     data?.forEach((row: any) => {
       if (!row.id) return;
 
       const tags: any[] = [];
       if (row.integra_product_tags && Array.isArray(row.integra_product_tags)) {
         row.integra_product_tags.forEach((pt: any) => {
           if (pt.integra_tags) {
             tags.push({
               id: pt.integra_tags.id,
               name: pt.integra_tags.name,
               weight: 1,
               category: pt.integra_tags.category || 'generic'
             });
           }
         });
       }
       productsMap.set(row.id, mapIntegraRowToProduct(row, tags));
     });
 
     console.log(`[fetchProductsByCriteria] Loaded ${productsMap.size} products by criteria`);
     return Array.from(productsMap.values());
   } catch (error) {
     console.error('Error in fetchProductsByCriteria:', error);
     throw error;
   }
 };
 
 export const fetchSingleProductFromDatabase = async (id: string): Promise<Product | null> => {
   try {
     console.log(`[fetchSingleProductFromDatabase] Fetching product: ${id}`);
 
     // Buscar por ID primeiro
     let { data, error } = await supabase
       .from('integra_products')
       .select(`
         *,
         integra_product_tags!left(
           tag_id,
           integra_tags!left(id, name, category)
         )
       `)
       .eq('id', id)
       .single();
 
     if (error || !data) {
       // Tentar por slug
       const { data: slugData, error: slugError } = await supabase
         .from('integra_products')
         .select(`
           *,
           integra_product_tags!left(
             tag_id,
             integra_tags!left(id, name, category)
           )
         `)
         .eq('slug', id)
         .single();
 
       if (slugError || !slugData) {
         console.warn(`[fetchSingleProductFromDatabase] Product not found: ${id}`);
         return null;
       }
       data = slugData;
     }
 
     // Extrair tags
     const tags: any[] = [];
     if (data.integra_product_tags && Array.isArray(data.integra_product_tags)) {
       data.integra_product_tags.forEach((pt: any) => {
         if (pt.integra_tags) {
           tags.push({
             id: pt.integra_tags.id,
             name: pt.integra_tags.name,
             weight: 1,
             category: pt.integra_tags.category || 'generic'
           });
         }
       });
     }
 
     const product = mapIntegraRowToProduct(data, tags);
     console.log(`[fetchSingleProductFromDatabase] Found product: ${product.name}`);
     return product;
   } catch (error) {
     console.error('[fetchSingleProductFromDatabase] Error:', error);
     throw error;
   }
 };
 
// Stub functions for legacy compatibility
export const addProductToDatabase = async (productData: any) => {
  console.warn('[addProductToDatabase] Not implemented for integra_products - use ERP sync');
  throw new Error('Use ERP sync to add products');
};

export const updateProductInDatabase = async (id: string, updates: any) => {
  console.warn('[updateProductInDatabase] Not implemented for integra_products - use ERP sync');
  throw new Error('Use ERP sync to update products');
};

export const deleteProductFromDatabase = async (id: string) => {
  console.warn('[deleteProductFromDatabase] Not implemented for integra_products - use ERP sync');
  throw new Error('Use ERP sync to delete products');
};

// Stub for weighted search - returns object with products array
export const searchProductsWithWeights = async (query: string, options?: any): Promise<{ products: Product[] }> => {
  const products = await fetchProductsFromDatabase(true);
  // Simple filter by name
  const filtered = query 
    ? products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    : products;
  return { products: filtered };
};