
import React from 'react';
import { CarouselRowConfig } from '@/types/specialSections';
import { useProducts, Product } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface CarouselRowRendererProps {
  carouselRow: CarouselRowConfig;
  onProductCardClick: (productId: string) => void;
}

const CarouselRowRenderer: React.FC<CarouselRowRendererProps> = ({ 
  carouselRow, 
  onProductCardClick 
}) => {
  const { products, loading: productsLoading } = useProducts();

  const getProductsByIds = (ids: string[] = []): Product[] => {
    if (!ids || ids.length === 0) return [];
    if (productsLoading || !products || !Array.isArray(products)) return [];
    return products.filter(product => product && ids.includes(product.id));
  };

  const carouselProducts = getProductsByIds(carouselRow.product_ids || []);

  const getTitleAlignment = () => {
    switch (carouselRow.titleAlignment) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  return (
    <div className="mb-8">
      {carouselRow.showTitle && carouselRow.title && (
        <div className={cn("mb-4", getTitleAlignment())}>
          <h3 className="text-lg md:text-xl font-bold text-white">
            {carouselRow.title}
          </h3>
        </div>
      )}
      
      {/* Carrossel horizontal com scroll - estilo GameStop */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-3 md:gap-4" style={{ minWidth: 'max-content' }}>
          {productsLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div 
                key={`${carouselRow.row_id}-skel-${index}`} 
                className="flex-shrink-0 bg-white rounded-md overflow-hidden border border-gray-200"
                style={{ width: '160px', height: '280px' }}
              >
                <Skeleton className="w-full h-32 bg-gray-300" />
                <div className="p-2">
                  <Skeleton className="h-3 w-3/4 mb-2 bg-gray-300" />
                  <Skeleton className="h-4 w-1/2 bg-gray-300" />
                </div>
              </div>
            ))
          ) : carouselProducts.length > 0 ? (
            carouselProducts.map(product => (
              <div 
                key={`${carouselRow.row_id}-${product.id}`}
                className="flex-shrink-0"
                style={{ width: '160px' }} // Largura fixa estilo GameStop
              >
                <ProductCard 
                  product={product} 
                  onCardClick={onProductCardClick}
                />
              </div>
            ))
          ) : (
            <div className="flex-shrink-0 w-full">
              <p className="text-gray-200 text-center py-5">
                Nenhum produto encontrado para este carrossel.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarouselRowRenderer;
