
import React from 'react';
import { Product } from '@/hooks/useProducts';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface RelatedProductsProps {
  relatedProducts: Product[];
  currentProductId: string | null;
  onRelatedProductClick: (productId: string) => void;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  relatedProducts,
  currentProductId,
  onRelatedProductClick
}) => {
  if (relatedProducts.length === 0) return null;

  return (
    <>
      <Separator className="my-6" />
      <div className="mb-2">
        <h3 className="text-lg font-semibold mb-4">Produtos Relacionados</h3>
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-4 min-w-max">
            {relatedProducts.map((relatedProduct) => (
              <div 
                key={relatedProduct.id}
                onClick={() => onRelatedProductClick(relatedProduct.id)}
                className={cn(
                  "w-36 sm:w-40 flex-shrink-0 cursor-pointer",
                  "transition-all duration-200 hover:scale-105",
                  "border rounded-lg overflow-hidden",
                  relatedProduct.id === currentProductId ? "ring-2 ring-primary" : "hover:shadow-md"
                )}
              >
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={relatedProduct.image || '/placeholder-product.png'} 
                    alt={relatedProduct.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-2">
                  <p className="text-sm font-medium line-clamp-1">{relatedProduct.name}</p>
                  <p className="text-sm text-primary font-semibold">
                    {relatedProduct.price ? `R$ ${relatedProduct.price.toFixed(2)}` : 'Preço indisponível'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default RelatedProducts;
