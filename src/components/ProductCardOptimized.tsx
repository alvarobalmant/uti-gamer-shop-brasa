import React, { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProductImage } from './OptimizedImage';
import { useProductPrefetch } from '@/hooks/useProductsOptimized';
import { Product } from '@/hooks/useProducts/types';

interface ProductCardOptimizedProps {
  product: Product;
  priority?: boolean;
  className?: string;
  onFavoriteClick?: (productId: string) => void;
  isFavorite?: boolean;
}

export const ProductCardOptimized: React.FC<ProductCardOptimizedProps> = ({
  product,
  priority = false,
  className,
  onFavoriteClick,
  isFavorite = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { handleProductHover } = useProductPrefetch();

  // Memoizar cálculos de preço
  const priceInfo = useMemo(() => {
    const currentPrice = product.price || 0;
    const originalPrice = product.original_price || currentPrice;
    const discount = originalPrice > currentPrice 
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;
    
    return {
      currentPrice,
      originalPrice,
      discount,
      hasDiscount: discount > 0,
    };
  }, [product.price, product.original_price]);

  // Memoizar rating
  const ratingInfo = useMemo(() => {
    const rating = product.rating || 0;
    const reviewCount = product.review_count || 0;
    
    return {
      rating,
      reviewCount,
      stars: Math.round(rating),
    };
  }, [product.rating, product.review_count]);

  // Handler para hover com prefetch
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    const cleanup = handleProductHover(product.id);
    
    // Cleanup será chamado automaticamente pelo timeout interno
    return cleanup;
  }, [product.id, handleProductHover]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  // Handler para favoritos
  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavoriteClick?.(product.id);
  }, [product.id, onFavoriteClick]);

  // Formatação de preço
  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  }, []);

  return (
    <Link
      to={`/produto/${product.id}`}
      className={cn(
        'group block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden',
        'hover:shadow-md hover:border-gray-200 transition-all duration-200',
        'transform hover:-translate-y-1',
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Container da imagem */}
      <div className="relative aspect-square overflow-hidden">
        <ProductImage
          src={product.image_url || ''}
          alt={product.name || 'Produto'}
          priority={priority}
          variant="card"
          className="w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badge de desconto */}
        {priceInfo.hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{priceInfo.discount}%
          </div>
        )}
        
        {/* Badge de estoque */}
        {product.stock_quantity !== undefined && product.stock_quantity < 5 && (
          <div className="absolute top-2 right-12 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Últimas {product.stock_quantity}
          </div>
        )}
        
        {/* Botão de favorito */}
        <button
          onClick={handleFavoriteClick}
          className={cn(
            'absolute top-2 right-2 p-2 rounded-full transition-all duration-200',
            'bg-white/80 hover:bg-white shadow-sm hover:shadow-md',
            'opacity-0 group-hover:opacity-100',
            isHovered && 'opacity-100'
          )}
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart
            className={cn(
              'w-4 h-4 transition-colors duration-200',
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'
            )}
          />
        </button>
        
        {/* Overlay de hover */}
        <div className={cn(
          'absolute inset-0 bg-black/5 transition-opacity duration-200',
          isHovered ? 'opacity-100' : 'opacity-0'
        )} />
      </div>
      
      {/* Conteúdo do card */}
      <div className="p-4 space-y-3">
        {/* Título do produto */}
        <h3 className="font-medium text-gray-900 line-clamp-2 text-sm leading-tight group-hover:text-blue-600 transition-colors duration-200">
          {product.name}
        </h3>
        
        {/* Rating */}
        {ratingInfo.rating > 0 && (
          <div className="flex items-center space-x-1">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={cn(
                    'w-3 h-3',
                    index < ratingInfo.stars
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">
              {ratingInfo.rating.toFixed(1)}
            </span>
            {ratingInfo.reviewCount > 0 && (
              <span className="text-xs text-gray-400">
                ({ratingInfo.reviewCount})
              </span>
            )}
          </div>
        )}
        
        {/* Preços */}
        <div className="space-y-1">
          {priceInfo.hasDiscount && (
            <div className="text-xs text-gray-500 line-through">
              {formatPrice(priceInfo.originalPrice)}
            </div>
          )}
          <div className="text-lg font-bold text-gray-900">
            {formatPrice(priceInfo.currentPrice)}
          </div>
          {product.installments && (
            <div className="text-xs text-gray-600">
              ou {product.installments.count}x de {formatPrice(product.installments.value)} sem juros
            </div>
          )}
        </div>
        
        {/* Badges de pagamento */}
        <div className="flex flex-wrap gap-1">
          {product.payment_methods?.includes('pix') && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              PIX
            </span>
          )}
          {product.payment_methods?.includes('credit') && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              12x
            </span>
          )}
          {product.free_shipping && (
            <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
              Frete Grátis
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

// Componente para grid de produtos otimizado
export const ProductGridOptimized: React.FC<{
  products: Product[];
  loading?: boolean;
  className?: string;
  onFavoriteClick?: (productId: string) => void;
  favoriteIds?: Set<string>;
}> = ({
  products,
  loading = false,
  className,
  onFavoriteClick,
  favoriteIds = new Set(),
}) => {
  if (loading) {
    return (
      <div className={cn(
        'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4',
        className
      )}>
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-lg mb-3" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-5 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn(
      'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4',
      className
    )}>
      {products.map((product, index) => (
        <ProductCardOptimized
          key={product.id}
          product={product}
          priority={index < 4} // Primeiros 4 produtos são priority
          onFavoriteClick={onFavoriteClick}
          isFavorite={favoriteIds.has(product.id)}
        />
      ))}
    </div>
  );
};

