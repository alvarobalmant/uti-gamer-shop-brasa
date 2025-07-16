import React, { useState, useEffect } from 'react';
import { Product } from '@/hooks/useProducts';
import { Star, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/utils/formatPrice';
import { supabase } from '@/integrations/supabase/client';

interface RelatedProductsMobileProps {
  product: Product;
}

const RelatedProductsMobile: React.FC<RelatedProductsMobileProps> = ({ product }) => {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        // Buscar produtos relacionados baseados na categoria ou tags similares
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .neq('id', product.id)
          .eq('is_active', true)
          .limit(6);

        if (!error && data) {
          setRelatedProducts(data as Product[]);
        }
      } catch (err) {
        console.error('Erro ao buscar produtos relacionados:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [product.id]);

  if (loading) {
    return (
      <div className="bg-white p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Produtos relacionados</h3>
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">
          Produtos relacionados
        </h3>
        <Button variant="ghost" size="sm" className="text-red-600">
          Ver todos
        </Button>
      </div>

      {/* Horizontal Scroll para mobile */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
        {relatedProducts.map((relatedProduct) => (
          <div 
            key={relatedProduct.id} 
            className="flex-shrink-0 w-40 border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => window.location.href = `/produto/${relatedProduct.id}`}
          >
            {/* Product Image */}
            <div className="aspect-square bg-gray-100 relative">
              <img
                src={relatedProduct.image}
                alt={relatedProduct.name}
                className="w-full h-full object-contain"
              />
              
              {/* Badge */}
              {relatedProduct.badge_visible && relatedProduct.badge_text && (
                <Badge 
                  className="absolute top-2 left-2 text-xs"
                  style={{ backgroundColor: relatedProduct.badge_color }}
                >
                  {relatedProduct.badge_text}
                </Badge>
              )}

              {/* Quick View */}
              <div className="absolute top-2 right-2">
                <button className="w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Eye className="w-3 h-3 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-3">
              <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 leading-tight">
                {relatedProduct.name}
              </h4>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">(4.0)</span>
              </div>

              {/* Price */}
              <div className="space-y-1">
                <div className="text-sm font-bold text-red-600">
                  {formatPrice(relatedProduct.price)}
                </div>
                <div className="text-xs text-gray-500">
                  ou 12x {formatPrice(relatedProduct.price / 12)}
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button 
                size="sm" 
                className="w-full mt-3 bg-orange-500 hover:bg-orange-600 text-white text-xs h-8"
              >
                Adicionar
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center mt-4 gap-1">
        {[...Array(Math.ceil(relatedProducts.length / 2))].map((_, i) => (
          <div key={i} className="w-2 h-2 bg-gray-300 rounded-full"></div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProductsMobile;