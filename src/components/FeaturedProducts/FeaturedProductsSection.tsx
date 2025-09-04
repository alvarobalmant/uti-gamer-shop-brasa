import React from 'react';
import { Product } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';

interface FeaturedProductsSectionProps {
  products: Product[];
  title?: string;
  className?: string;
}

const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  products,
  title = "Produtos em Destaque",
  className
}) => {
  if (!products.length) return null;

  return (
    <section className={className}>
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProductsSection;