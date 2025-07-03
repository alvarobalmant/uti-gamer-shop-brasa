import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import SKUBreadcrumb from '@/components/SKU/SKUBreadcrumb';
import { SKUNavigation } from '@/hooks/useProducts/types';

interface ProductPageSKUHeaderProps {
  shouldShowSKUComponents: boolean;
  skuNavigation: SKUNavigation | null;
  onBack: () => void;
}

const ProductPageSKUHeader = memo(({ 
  shouldShowSKUComponents, 
  skuNavigation, 
  onBack 
}: ProductPageSKUHeaderProps) => {
  return (
    <div className="mb-4">
      {shouldShowSKUComponents && skuNavigation ? (
        <SKUBreadcrumb skuNavigation={skuNavigation} />
      ) : (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-0 h-auto font-normal hover:text-red-600"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Voltar
          </Button>
        </div>
      )}
    </div>
  );
});

ProductPageSKUHeader.displayName = 'ProductPageSKUHeader';

export default ProductPageSKUHeader;