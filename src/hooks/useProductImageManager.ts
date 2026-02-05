// Stub: products table removed - image management disabled
import { useState } from 'react';

export const useProductImageManager = () => {
  const [loading] = useState(false);
  
  return {
    loading,
    updateProductImage: async () => { console.log('Image management disabled - use ERP'); return null; },
    deleteProductImage: async () => { console.log('Image management disabled - use ERP'); return false; },
  };
};