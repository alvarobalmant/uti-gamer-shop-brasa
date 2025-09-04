import React from 'react';
import { Product } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';

interface FeaturedProductsSectionProps {
  products: Product[];
  title?: string;
  titlePart1?: string;
  titlePart2?: string;
  titleColor1?: string;
  titleColor2?: string;
  viewAllLink?: string;
  sectionKey?: string;
  loading?: boolean;
  reduceTopSpacing?: boolean;
  className?: string;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
}

const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  products,
  title = "Produtos em Destaque",
  titlePart1,
  titlePart2,
  titleColor1,
  titleColor2,
  viewAllLink,
  sectionKey,
  loading = false,
  reduceTopSpacing = false,
  className,
  onAddToCart
}) => {
  
  const handleCardClick = (productId: string) => {
    // Navigate to product page or handle click
    console.log('Product clicked:', productId);
  };
  if (!products.length) return null;

  return (
    <section className={className}>
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onCardClick={handleCardClick}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProductsSection;