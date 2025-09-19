/**
 * ProgressiveProductCard - Renderização Progressiva de Produtos
 * 
 * Este componente renderiza imediatamente com dados essenciais,
 * sem esperar o carregamento das imagens. As imagens são carregadas
 * em background e aparecem quando prontas.
 */

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { Product } from '@/hooks/useProducts/types';

interface ProgressiveProductCardProps {
  product: Product;
  onCardClick?: (productId: string) => void;
  onAddToCart?: (product: Product, size?: string, color?: string) => void;
  className?: string;
  showDebug?: boolean;
  priority?: boolean;
}

export const ProgressiveProductCard: React.FC<ProgressiveProductCardProps> = ({
  product,
  onCardClick,
  onAddToCart,
  className,
  showDebug = false,
  priority = false
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Preload da imagem em background
  useEffect(() => {
    if (!product.image) return;

    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
      setImageError(false);
    };
    img.onerror = () => {
      setImageError(true);
      setImageLoaded(false);
    };
    
    // Delay pequeno para não bloquear renderização inicial
    const timer = setTimeout(() => {
      img.src = product.image;
    }, priority ? 0 : 100);

    return () => clearTimeout(timer);
  }, [product.image, priority]);

  // Calcular preço com desconto
  const hasDiscount = product.list_price && product.list_price > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.list_price! - product.price) / product.list_price!) * 100)
    : 0;

  // Verificar se tem UTI Pro
  const hasUtiPro = product.uti_pro_enabled && product.pro_price;
  const utiProDiscount = hasUtiPro 
    ? Math.round(((product.price - product.pro_price!) / product.price) * 100)
    : 0;

  // Handlers
  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(product.id);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        'group relative bg-white rounded-lg shadow-sm border border-gray-200',
        'hover:shadow-md hover:border-gray-300 transition-all duration-200',
        'cursor-pointer overflow-hidden',
        className
      )}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Container da imagem com placeholder */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {/* Skeleton placeholder - aparece imediatamente */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-2 border-gray-300 border-t-gray-400 rounded-full animate-spin opacity-50" />
            </div>
          </div>
        )}

        {/* Imagem real - aparece quando carregada */}
        {imageLoaded && !imageError && (
          <img
            ref={imageRef}
            src={product.image}
            alt={product.name}
            className={cn(
              'absolute inset-0 w-full h-full object-cover transition-all duration-300',
              'group-hover:scale-105',
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            loading={priority ? 'eager' : 'lazy'}
          />
        )}

        {/* Fallback para erro de imagem */}
        {imageError && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Eye className="w-8 h-8 mx-auto mb-2" />
              <span className="text-xs">Imagem indisponível</span>
            </div>
          </div>
        )}

        {/* Badges - aparecem imediatamente */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {hasDiscount && (
            <Badge variant="destructive" className="text-xs font-bold">
              -{discountPercentage}%
            </Badge>
          )}
          
          {product.is_featured && (
            <Badge variant="secondary" className="text-xs">
              Destaque
            </Badge>
          )}
          
          {product.badge_visible && product.badge_text && (
            <Badge 
              className="text-xs"
              style={{ backgroundColor: product.badge_color }}
            >
              {product.badge_text}
            </Badge>
          )}
          
          {product.stock === 0 && (
            <Badge variant="outline" className="text-xs bg-white">
              Esgotado
            </Badge>
          )}
        </div>

        {/* Botões de ação - aparecem no hover */}
        <div className={cn(
          'absolute top-2 right-2 flex flex-col gap-1 transition-opacity duration-200',
          isHovered ? 'opacity-100' : 'opacity-0'
        )}>
          <Button
            size="sm"
            variant="secondary"
            className="w-8 h-8 p-0 bg-white/90 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              // Implementar favoritos
            }}
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>

        {/* Botão de adicionar ao carrinho - aparece no hover */}
        {product.stock > 0 && (
          <div className={cn(
            'absolute bottom-2 right-2 transition-all duration-200',
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          )}>
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              Comprar
            </Button>
          </div>
        )}
      </div>

      {/* Informações do produto - aparecem imediatamente */}
      <div className="p-3">
        {/* Nome do produto */}
        <h3 className="font-medium text-sm text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Plataforma/Categoria */}
        {product.platform && (
          <p className="text-xs text-gray-500 mb-2">
            {product.platform}
          </p>
        )}

        {/* Preços - aparecem imediatamente */}
        <div className="space-y-1">
          {/* Preço original riscado */}
          {hasDiscount && (
            <p className="text-xs text-gray-400 line-through">
              R$ {product.list_price!.toFixed(2).replace('.', ',')}
            </p>
          )}

          {/* Preço atual */}
          <p className="text-lg font-bold text-gray-900">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </p>

          {/* Preço UTI Pro */}
          {hasUtiPro && (
            <div className="bg-yellow-50 border border-yellow-200 rounded px-2 py-1">
              <p className="text-xs text-yellow-800 font-medium">
                UTI Pro: R$ {product.pro_price!.toFixed(2).replace('.', ',')}
              </p>
              <p className="text-xs text-yellow-600">
                Economize {utiProDiscount}%
              </p>
            </div>
          )}
        </div>

        {/* Parcelamento */}
        <p className="text-xs text-gray-500 mt-2">
          ou 12x de R$ {(product.price / 12).toFixed(2).replace('.', ',')}
        </p>

        {/* Debug info - apenas para desenvolvimento */}
        {showDebug && (
          <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
            <p>ID: {product.id}</p>
            <p>Imagem: {imageLoaded ? '✅' : imageError ? '❌' : '⏳'}</p>
            <p>Cache: {(product as any).source || 'unknown'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressiveProductCard;
