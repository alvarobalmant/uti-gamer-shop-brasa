export interface ProductApiResponse {
  data: any[];
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
    // Mock implementation to avoid type recursion issues
    return {
      data: [],
      error: null,
      total: 0,
      hasMore: false
    };
  },

  async getProduct(id: string): Promise<{ data: any | null; error: string | null }> {
    // Mock implementation to avoid type recursion issues
    return {
      data: null,
      error: null
    };
  }
};

export default productApi;