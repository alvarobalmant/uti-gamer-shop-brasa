
import { Product } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';

interface FeaturedProductsSectionProps {
  products: Product[];
  loading: boolean;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  getPlatformColor: (product: Product) => string;
}

const FeaturedProductsSection = ({ 
  products, 
  loading, 
  onAddToCart, 
  getPlatformColor 
}: FeaturedProductsSectionProps) => {
  if (loading) {
    return (
      <section className="w-full py-12 bg-white">
        <div className="container-professional">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Produtos em Destaque
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-80"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-8 lg:py-12 bg-white">
      <div className="container-professional">
        <h2 className="text-2xl lg:text-3xl font-bold text-center mb-6 lg:mb-8 text-gray-900">
          Produtos em Destaque
        </h2>
        
        {/* Responsive Grid - Mobile First */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
          {products.slice(0, 10).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              getPlatformColor={getPlatformColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsSection;
