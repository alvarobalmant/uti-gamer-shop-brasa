
import React, { useEffect, useState } from 'react';
import { Product, useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';

interface RelatedProductsSectionProps {
  product: Product;
}

const RelatedProductsSection: React.FC<RelatedProductsSectionProps> = ({ product }) => {
  const { products: allProducts, loading } = useProducts();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (allProducts.length > 0 && product) {
      // Lógica para produtos relacionados baseada em tags
      const currentProductTags = product.tags?.map(t => t.id) || [];
      const related = allProducts
        .filter(p => 
          p.id !== product.id && 
          p.tags?.some(tag => currentProductTags.includes(tag.id))
        )
        .slice(0, 8);
      
      // Se não houver produtos relacionados por tag, pegar produtos aleatórios
      if (related.length < 4) {
        const others = allProducts
          .filter(p => p.id !== product.id && !related.some(r => r.id === p.id))
          .slice(0, 8 - related.length);
        related.push(...others);
      }

      setRelatedProducts(related);
    }
  }, [allProducts, product]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/produto/${productId}`);
  };

  const nextProducts = () => {
    setCurrentIndex((prev) => 
      prev + 4 >= relatedProducts.length ? 0 : prev + 4
    );
  };

  const prevProducts = () => {
    setCurrentIndex((prev) => 
      prev - 4 < 0 ? Math.max(0, relatedProducts.length - 4) : prev - 4
    );
  };

  if (loading || relatedProducts.length === 0) {
    return null;
  }

  const visibleProducts = relatedProducts.slice(currentIndex, currentIndex + 4);

  return (
    <div className="bg-white py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Produtos Relacionados
            </h2>
            <p className="text-gray-600">
              Outros produtos que você pode gostar
            </p>
          </div>
          
          {relatedProducts.length > 4 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prevProducts}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextProducts}
                disabled={currentIndex + 4 >= relatedProducts.length}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {visibleProducts.map((relatedProduct) => (
            <ProductCard
              key={relatedProduct.id}
              product={relatedProduct}
              onAddToCart={handleAddToCart}
              onCardClick={handleProductClick}
            />
          ))}
        </div>

        {relatedProducts.length > 4 && (
          <div className="flex justify-center mt-6">
            <div className="flex gap-2">
              {Array.from({ length: Math.ceil(relatedProducts.length / 4) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index * 4)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    Math.floor(currentIndex / 4) === index
                      ? 'bg-red-600'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RelatedProductsSection;
