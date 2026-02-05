// Stub: Use productApi.ts for integra_products
import { Product } from './types';
import { fetchProductsFromDatabase, fetchSingleProductFromDatabase } from './productApi';

// Type for lightweight product data
export interface ProductLight {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
}

export const fetchProductsOptimized = fetchProductsFromDatabase;
export const fetchSingleProductOptimized = fetchSingleProductFromDatabase;

export const fetchProductsByCriteria = async (criteria: any): Promise<Product[]> => {
  return fetchProductsFromDatabase(true);
};

export const fetchProductsByCriteriaOptimized = fetchProductsByCriteria;

export const fetchProductBySlug = async (slug: string): Promise<Product | null> => {
  return fetchSingleProductFromDatabase(slug);
};

export const fetchProductsFromDatabaseCached = fetchProductsFromDatabase;

export const fetchProductsLightPaginated = async (page: number = 1, limit: number = 20): Promise<{ products: ProductLight[], hasMore: boolean, total: number }> => {
  const products = await fetchProductsFromDatabase(true);
  const start = (page - 1) * limit;
  const slice = products.slice(start, start + limit);
  return {
    products: slice.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
      slug: p.slug || p.id
    })),
    hasMore: start + limit < products.length,
    total: products.length
  };
};

export const fetchProductDetails = fetchSingleProductFromDatabase;

export const invalidateProductCache = () => {
  console.log('[productApiOptimized] Cache invalidation stub');
};

export const preloadCriticalImages = (products: Product[]) => {
  // No-op stub
};