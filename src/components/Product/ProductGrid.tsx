
import { Product } from '@/hooks/useProducts';
import PremiumProductCard from './PremiumProductCard';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  getPlatformColor: (product: Product) => string;
  loading?: boolean;
  variant?: 'default' | 'compact';
}

const ProductGrid = ({ 
  products, 
  onAddToCart, 
  getPlatformColor, 
  loading = false,
  variant = 'default'
}: ProductGridProps) => {
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
            <div className="aspect-square bg-gray-200"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 lg:py-20">
        <div className="text-6xl mb-6">🎮</div>
        <div className="text-xl lg:text-2xl text-gray-500 mb-4">
          Nenhum produto encontrado
        </div>
        <p className="text-gray-400">
          Produtos serão adicionados em breve
        </p>
      </div>
    );
  }

  return (
    <div className={`grid gap-4 lg:gap-6 ${
      variant === 'compact' 
        ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
    }`}>
      {products.map((product, index) => (
        <PremiumProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          getPlatformColor={getPlatformColor}
          priority={index < 4}
          variant={variant}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
