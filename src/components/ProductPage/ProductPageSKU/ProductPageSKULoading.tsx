import React, { memo } from 'react';
import ProfessionalHeader from '@/components/Header/ProfessionalHeader';

interface ProductPageSKULoadingProps {
  onCartOpen: () => void;
  onAuthOpen: () => void;
}

const ProductPageSKULoading = memo(({ onCartOpen, onAuthOpen }: ProductPageSKULoadingProps) => {
  return (
    <div className="min-h-screen bg-white">
      <ProfessionalHeader 
        onCartOpen={onCartOpen}
        onAuthOpen={onAuthOpen}
      />
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full"></div>
      </div>
    </div>
  );
});

ProductPageSKULoading.displayName = 'ProductPageSKULoading';

export default ProductPageSKULoading;