
import { Star } from 'lucide-react';
import { Product } from '@/hooks/useProducts';

interface ProductInfoProps {
  product: Product;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div>
      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
        {product.name}
      </h1>
      
      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {product.tags.map((tag) => (
            <span key={tag.id} className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star} 
              className="w-5 h-5 fill-yellow-400 text-yellow-400" 
            />
          ))}
        </div>
        <span className="text-gray-600">4.8 (124 avaliações)</span>
      </div>
    </div>
  );
};

export default ProductInfo;
