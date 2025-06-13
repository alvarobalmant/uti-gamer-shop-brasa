
import React from 'react';
import { Product } from '@/hooks/useProducts';
import { PlatformTheme, ProductShowcase } from '@/types/platformPages';
import PlatformProductCard from './PlatformProductCard';

interface PlatformProductSectionProps {
  config: ProductShowcase;
  theme: PlatformTheme;
  products: Product[];
  onAddToCart: (product: Product) => void;
  onProductClick: (productId: string) => void;
}

const PlatformProductSection: React.FC<PlatformProductSectionProps> = ({
  config,
  theme,
  products,
  onAddToCart,
  onProductClick
}) => {
  // Filter products based on configuration
  const filteredProducts = products.filter(product => {
    if (config.filter.featured && !product.is_featured) return false;
    if (config.filter.newReleases && !product.badge_text?.toLowerCase().includes('novo')) return false;
    if (config.filter.onSale && !product.list_price) return false;
    
    // Filter by tags
    if (config.filter.tagIds && config.filter.tagIds.length > 0) {
      const hasMatchingTag = product.tags?.some(tag => 
        config.filter.tagIds?.includes(tag.id) || 
        config.filter.tagIds?.includes(tag.name.toLowerCase())
      );
      if (!hasMatchingTag) return false;
    }
    
    // Filter by categories
    if (config.filter.categoryIds && config.filter.categoryIds.length > 0) {
      if (!product.category_id || !config.filter.categoryIds.includes(product.category_id)) {
        return false;
      }
    }
    
    return true;
  }).slice(0, config.filter.limit || 6);

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-5',
    6: 'grid-cols-3 md:grid-cols-6'
  }[config.columns] || 'grid-cols-2 md:grid-cols-3';

  return (
    <section 
      className="py-12"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {config.title && (
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {config.title}
            </h2>
            {config.subtitle && (
              <p className="text-xl opacity-80 max-w-3xl mx-auto">
                {config.subtitle}
              </p>
            )}
          </div>
        )}
        
        {filteredProducts.length > 0 ? (
          <div className={`grid ${gridCols} gap-6`}>
            {filteredProducts.map(product => (
              <PlatformProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onProductClick={onProductClick}
                variant={config.cardStyle as any}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg opacity-60">
              Nenhum produto encontrado para esta seção.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PlatformProductSection;
