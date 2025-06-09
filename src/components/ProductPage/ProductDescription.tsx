
import React from 'react';
import { Product } from '@/hooks/useProducts';
import { Separator } from '@/components/ui/separator';

interface ProductDescriptionProps {
  product: Product;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ product }) => {
  // Use product.description with proper fallback
  const description = product.description || 'Nenhuma descrição detalhada disponível para este produto.';

  return (
    <div className="space-y-6">
      <h2 className="text-xl lg:text-2xl font-semibold text-foreground border-b border-border pb-2 mb-4">
        Descrição do Produto
      </h2>
      
      {/* Product Description */}
      <div className="prose prose-sm sm:prose-base max-w-none text-muted-foreground">
        {/* Convert line breaks to proper HTML */}
        <div
          dangerouslySetInnerHTML={{
            __html: description.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          }}
        />
      </div>

      {/* Specifications Section */}
      {product.specifications && product.specifications.length > 0 && (
        <>
          <Separator className="my-6" />
          <h3 className="text-lg font-semibold text-foreground mb-3">Especificações Técnicas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {product.specifications.map((spec, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-secondary/20 rounded-md">
                <span className="font-medium text-foreground">{spec.label}:</span>
                <span className="text-muted-foreground text-sm">{spec.value}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductDescription;
