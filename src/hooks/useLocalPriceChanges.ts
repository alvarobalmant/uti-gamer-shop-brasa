import { useState, useMemo } from 'react';
import { Product } from '@/hooks/useProducts/types';

export interface PriceChange {
  productId: string;
  price: number;
  originalPrice: number;
}

export interface ProductWithPriceChanges extends Product {
  localPrice?: number;
  hasPriceChange?: boolean;
}

export const useLocalPriceChanges = (products: Product[]) => {
  const [priceChanges, setPriceChanges] = useState<Map<string, PriceChange>>(new Map());

  const addPriceChange = (productId: string, newPrice: number, originalPrice: number) => {
    setPriceChanges(prev => {
      const newChanges = new Map(prev);
      if (newPrice === originalPrice) {
        // Se o preço voltou ao original, remove a mudança
        newChanges.delete(productId);
      } else {
        newChanges.set(productId, {
          productId,
          price: newPrice,
          originalPrice
        });
      }
      return newChanges;
    });
  };

  const removePriceChange = (productId: string) => {
    setPriceChanges(prev => {
      const newChanges = new Map(prev);
      newChanges.delete(productId);
      return newChanges;
    });
  };

  const clearAllPriceChanges = () => {
    setPriceChanges(new Map());
  };

  const productsWithPriceChanges: ProductWithPriceChanges[] = useMemo(() => {
    return products.map(product => {
      const priceChange = priceChanges.get(product.id);
      return {
        ...product,
        localPrice: priceChange?.price,
        hasPriceChange: !!priceChange
      };
    });
  }, [products, priceChanges]);

  const pendingPriceChanges = Array.from(priceChanges.values());
  const hasPriceChanges = priceChanges.size > 0;
  const changedProductsCount = priceChanges.size;

  return {
    productsWithPriceChanges,
    pendingPriceChanges,
    addPriceChange,
    removePriceChange,
    clearAllPriceChanges,
    hasPriceChanges,
    changedProductsCount
  };
};