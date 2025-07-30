import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { ProductCard } from '@/components/ProductCard';
import { ProductCardSkeleton } from '@/components/ProductCardSkeleton';
import { Product } from '@/types/product';
import { useIntelligentLazyLoading } from '@/hooks/usePerformanceOptimizer';

interface VirtualizedProductGridProps {
  products: Product[];
  loading?: boolean;
  onProductClick?: (productId: string) => void;
  onAddToCart?: (product: Product) => void;
  itemsPerRow?: number;
  itemHeight?: number;
}

export const VirtualizedProductGrid: React.FC<VirtualizedProductGridProps> = ({
  products,
  loading = false,
  onProductClick,
  onAddToCart,
  itemsPerRow = 4,
  itemHeight = 350
}) => {
  const { shouldLazyLoad } = useIntelligentLazyLoading();

  // Dividir produtos em rows para virtualização
  const productRows = useMemo(() => {
    const rows: Product[][] = [];
    for (let i = 0; i < products.length; i += itemsPerRow) {
      rows.push(products.slice(i, i + itemsPerRow));
    }
    return rows;
  }, [products, itemsPerRow]);

  // Renderizar cada row
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const rowProducts = productRows[index];
    
    return (
      <div style={style} className="flex gap-4 px-4">
        {rowProducts.map((product) => (
          <div key={product.id} className="flex-1 min-w-0">
            <ProductCard
              product={product}
              onAddToCart={onAddToCart}
              onCardClick={onProductClick}
              lazy={shouldLazyLoad}
            />
          </div>
        ))}
        {/* Preencher espaços vazios na última row */}
        {rowProducts.length < itemsPerRow && 
          Array.from({ length: itemsPerRow - rowProducts.length }).map((_, idx) => (
            <div key={`empty-${idx}`} className="flex-1 min-w-0" />
          ))
        }
      </div>
    );
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Nenhum produto encontrado</p>
      </div>
    );
  }

  // Usar virtualização apenas para listas grandes
  if (products.length > 20) {
    return (
      <div className="w-full">
        <List
          height={600} // Altura fixa para viewport
          itemCount={productRows.length}
          itemSize={itemHeight}
          width="100%"
        >
          {Row}
        </List>
      </div>
    );
  }

  // Grid normal para listas pequenas
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onCardClick={onProductClick}
          lazy={shouldLazyLoad}
        />
      ))}
    </div>
  );
};