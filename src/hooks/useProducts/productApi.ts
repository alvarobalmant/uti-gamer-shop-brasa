import { supabase } from '@/integrations/supabase/client';
import { Product } from './types';

export interface ProductApiResponse {
  data: Product[];
  error: string | null;
  total: number;
  hasMore: boolean;
}

export interface ProductFilters {
  category?: string;
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
  searchTerm?: string;
  sortBy?: 'name' | 'price' | 'created_at';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export const productApi = {
  async getProducts(filters: ProductFilters = {}): Promise<ProductApiResponse> {
    try {
      let query = supabase.from('products').select('*');

      // Apply filters
      if (filters.category) {
        query = query.eq('category_id', filters.category);
      }

      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice);
      }

      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }

      if (filters.searchTerm) {
        query = query.ilike('name', `%${filters.searchTerm}%`);
      }

      // Sorting
      const sortBy = filters.sortBy || 'created_at';
      const sortOrder = filters.sortOrder || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Pagination
      const limit = filters.limit || 20;
      const offset = filters.offset || 0;
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching products:', error);
        return {
          data: [],
          error: error.message,
          total: 0,
          hasMore: false
        };
      }

      return {
        data: data || [],
        error: null,
        total: count || 0,
        hasMore: (data?.length || 0) === limit
      };
    } catch (error) {
      console.error('Error in productApi.getProducts:', error);
      return {
        data: [],
        error: 'Failed to fetch products',
        total: 0,
        hasMore: false
      };
    }
  },

  async getProduct(id: string): Promise<{ data: Product | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        return {
          data: null,
          error: error.message
        };
      }

      return {
        data,
        error: null
      };
    } catch (error) {
      console.error('Error in productApi.getProduct:', error);
      return {
        data: null,
        error: 'Failed to fetch product'
      };
    }
  }
};

export default productApi;