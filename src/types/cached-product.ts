import { Product } from '@/hooks/useProducts/types';

export interface CachedProduct extends Product {
  cached_at?: Date;
  ttl?: number;
}

// Helper to convert Product to CachedProduct
export const toCachedProduct = (product: Product): CachedProduct => ({
  ...product,
  cached_at: new Date(),
  ttl: 300000 // 5 minutes
});

// Helper to convert CachedProduct to Product
export const toProduct = (cachedProduct: CachedProduct): Product => {
  const { cached_at, ttl, ...product } = cachedProduct;
  return {
    ...product,
    created_at: product.created_at || new Date().toISOString(),
    updated_at: product.updated_at || new Date().toISOString()
  };
};