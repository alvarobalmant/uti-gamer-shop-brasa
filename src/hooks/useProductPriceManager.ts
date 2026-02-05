// Stub: products table removed - price management disabled
import { useState } from 'react';

export const useProductPriceManager = () => {
  const [loading] = useState(false);
  return {
    loading,
    updatePrice: async () => { console.log('Price management disabled - use ERP'); return null; },
  };
};