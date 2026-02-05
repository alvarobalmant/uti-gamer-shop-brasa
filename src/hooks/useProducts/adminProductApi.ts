// Admin Product API - uses integra_products table
import { supabase } from '@/integrations/supabase/client';
import { Product } from './types';
import { mapIntegraRowToProduct } from './integraMapper';

// Stub: Master products feature disabled with IntegraAPI
export const fetchMasterProductsForAdmin = async (): Promise<Product[]> => {
  console.log('[fetchMasterProductsForAdmin] Feature disabled - use integra_products');
  return [];
};

// Fetch all products for admin from integra_products
export const fetchAllProductsForAdmin = async (): Promise<Product[]> => {
  try {
    console.log('[fetchAllProductsForAdmin] Fetching from integra_products...');
    
    const { data, error } = await supabase
      .from('integra_products')
      .select(`
        *,
        integra_product_tags (
          tag_id,
          integra_tags (
            id,
            name,
            category
          )
        )
      `)
      .eq('suspensa', 'N')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[fetchAllProductsForAdmin] Error:', error);
      throw error;
    }

    const products = (data || []).map((row: any) => {
      const product = mapIntegraRowToProduct(row);
      
      // Extract tags from joined data
      if (row.integra_product_tags) {
        product.tags = row.integra_product_tags
          .filter((pt: any) => pt.integra_tags)
          .map((pt: any) => ({
            id: pt.integra_tags.id,
            name: pt.integra_tags.name,
            category: pt.integra_tags.category
          }));
      }
      
      return product;
    });

    console.log('[fetchAllProductsForAdmin] Fetched:', products.length, 'products');
    return products;
  } catch (error) {
    console.error('[fetchAllProductsForAdmin] Error:', error);
    throw error;
  }
};