
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogClose } from "@/components/ui/dialog";
import { SheetClose } from "@/components/ui/sheet";
import { X } from 'lucide-react';
import { Product } from '@/hooks/useProducts';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProductModalHeaderProps {
  product: Product | null;
  shouldShowLoading: boolean;
}

const ProductModalHeader: React.FC<ProductModalHeaderProps> = ({ 
  product, 
  shouldShowLoading 
}) => {
  const isMobile = useIsMobile();
  
  const CloseComponent = isMobile ? SheetClose : DialogClose;

  return (
    <div className="flex items-center justify-between p-2 border-b sticky top-0 bg-background z-10">
      <h2 className="text-base font-medium truncate pr-4 ml-2">
        {product ? product.name : shouldShowLoading ? 'Carregando...' : 'Produto'}
      </h2>
      <CloseComponent asChild>
        <Button variant="ghost" size="sm" className="rounded-full">
          <X className="h-4 w-4" />
          <span className="sr-only">Fechar</span>
        </Button>
      </CloseComponent>
    </div>
  );
};

export default ProductModalHeader;
