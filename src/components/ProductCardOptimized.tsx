
import React, { useCallback, useState, memo } from 'react';
import { ProductLight } from '@/hooks/useProducts/productApiOptimized';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import FavoriteButton from '@/components/FavoriteButton';

import ProductCardImageOptimized from './ProductCard/ProductCardImageOptimized';
import ProductCardInfo from './ProductCard/ProductCardInfo';
import ProductCardPrice from './ProductCard/ProductCardPrice';
import ProductCardBadge from './ProductCard/ProductCardBadge';

interface ProductCardOptimizedProps {
  product: ProductLight;
  onCardClick: (productId: string) => void;
  onAddToCart?: (product: ProductLight) => void;
  priority?: boolean;
  index?: number;
}

const ProductCardOptimized = memo<ProductCardOptimizedProps>(({ 
  product, 
  onCardClick, 
  onAddToCart,
  priority = false,
  index = 0
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[data-action="true"]')) {
      return;
    }
    onCardClick(product.id);
  }, [onCardClick, product.id]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  // Converter ProductLight para Product para compatibilidade com componentes existentes
  const productForComponents = {
    ...product,
    description: '',
    additional_images: [],
    sizes: [],
    colors: [],
    stock: 0,
    specifications: [],
    technical_specs: {},
    product_features: {},
    shipping_weight: undefined,
    free_shipping: false,
    meta_title: '',
    meta_description: '',
    parent_product_id: undefined,
    is_master_product: false,
    product_type: 'simple' as const,
    sku_code: undefined,
    variant_attributes: {},
    sort_order: 0,
    available_variants: {},
    master_slug: undefined,
    inherit_from_master: {},
    product_videos: [],
    product_faqs: [],
    product_highlights: [],
    reviews_config: {
      enabled: true,
      show_rating: true,
      show_count: true,
      allow_reviews: true,
      custom_rating: { value: 0, count: 0, use_custom: false }
    },
    trust_indicators: [],
    manual_related_products: [],
    breadcrumb_config: {
      custom_path: [],
      use_custom: false,
      show_breadcrumb: true
    },
    product_descriptions: {
      short: '',
      detailed: '',
      technical: '',
      marketing: ''
    },
    delivery_config: {
      custom_shipping_time: '',
      shipping_regions: [],
      express_available: false,
      pickup_locations: [],
      shipping_notes: ''
    },
    display_config: {
      show_stock_counter: true,
      show_view_counter: false,
      custom_view_count: 0,
      show_urgency_banner: false,
      urgency_text: '',
      show_social_proof: false,
      social_proof_text: ''
    },
    tags: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    // Fix the uti_pro_type typing issue
    uti_pro_type: (product.uti_pro_type === 'fixed' || product.uti_pro_type === 'percentage') 
      ? product.uti_pro_type 
      : 'percentage' as const
  };

  return (
    <Card
      className={cn(
        "relative flex flex-col bg-white overflow-hidden",
        "border border-gray-200",
        "rounded-lg",
        "shadow-none",
        "transition-all duration-200 ease-in-out",
        "cursor-pointer",
        "w-[200px] h-[320px]",
        "p-0",
        "hover:shadow-md hover:border-gray-300",
        isHovered && "transform scale-[1.02]"
      )}
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-product-id={product.id}
      data-index={index}
    >
      {/* Badge */}
      {product.badge_visible && product.badge_text && (
        <ProductCardBadge 
          text={product.badge_text}
          color={product.badge_color || '#22c55e'}
          isVisible={product.badge_visible}
        />
      )}

      {/* Favorite Button */}
      <div className="absolute top-2 right-2 z-10">
        <FavoriteButton 
          productId={product.id} 
          size="sm"
        />
      </div>

      {/* Image */}
      <ProductCardImageOptimized 
        product={productForComponents}
        isHovered={isHovered}
        priority={priority}
      />

      {/* Product Info */}
      <div className="flex-1 flex flex-col p-3">
        <ProductCardInfo 
          product={productForComponents}
        />
        
        <div className="mt-auto">
          <ProductCardPrice 
            product={productForComponents}
          />
        </div>
      </div>
    </Card>
  );
});

ProductCardOptimized.displayName = 'ProductCardOptimized';

export default ProductCardOptimized;
