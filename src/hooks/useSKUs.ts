// Stub: SKU system disabled - IntegraAPI products are simple
import { useState } from 'react';
import { Product } from './useProducts/types';

export interface SKU extends Product {
  parent_product_id: string;
  sku_code: string;
  variant_attributes: Record<string, any>;
}

export const useSKUs = (masterProductId?: string) => {
  const [skus] = useState<SKU[]>([]);
  const [loading] = useState(false);

  return {
    skus,
    loading,
    fetchSKUs: async () => {},
    fetchSKUsForMaster: async () => {},
    addSKU: async () => null,
    createSKU: async () => null,
    updateSKU: async () => null,
    deleteSKU: async () => false,
    createMasterProduct: async () => null,
    deleteMasterProductCascade: async () => false,
  };
};

export const useMasterProducts = () => {
  const [masterProducts] = useState<Product[]>([]);
  const [loading] = useState(false);

  return {
    masterProducts,
    loading,
    fetchMasterProducts: async () => {},
  };
};

// Default export for backward compatibility
export default useSKUs;