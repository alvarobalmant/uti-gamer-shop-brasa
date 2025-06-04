
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogClose } from "@/components/ui/dialog";
import { X } from 'lucide-react';
import { Product } from '@/hooks/useProducts';

interface ProductModalHeaderProps {
  product: Product | null;
  shouldShowLoading: boolean;
}

const ProductModalHeader: React.FC<ProductModalHeaderProps> = ({ 
  product, 
  shouldShowLoading 
}) => {
  return (
    <div className="flex items-center justify-between p-2 border-b sticky top-0 bg-background z-10">
      <h2 className="text-base font-medium truncate pr-4 ml-2">
        {product ? product.name : shouldShowLoading ? 'Carregando...' : 'Produto'}
      </h2>
      <DialogClose asChild>
        <Button variant="ghost" size="sm" className="rounded-full">
          <X className="h-4 w-4" />
          <span className="sr-only">Fechar</span>
        </Button>
      </DialogClose>
    </div>
  );
};

export default ProductModalHeader;
