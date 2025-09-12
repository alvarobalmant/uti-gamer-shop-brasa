
import React, { useEffect, useState } from 'react';
import { Product, useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAnalytics } from '@/contexts/AnalyticsContext';

interface RelatedProductsProps {
  product: Product;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ product }) => {
  const { products: allProducts, loading } = useProducts();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { trackProductView } = useAnalytics();
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (allProducts.length > 0 && product) {
      const currentProductTags = product.tags?.map(t => t.id) || [];

      const scoredProducts = allProducts
        .filter(p => p.id !== product.id) // Excluir o próprio produto
        .map(p => {
          const commonTags = p.tags?.filter(tag => currentProductTags.includes(tag.id)) || [];
          const tagScore = commonTags.length; // Pontuação baseada no número de tags em comum
          const priceDifference = Math.abs(p.price - product.price); // Diferença de preço
          return { product: p, tagScore, priceDifference };
        });

      // Ordenar os produtos:
      // 1. Pelo número de tags em comum (descendente)
      // 2. Pela diferença de preço (ascendente)
      // 3. Alfabeticamente pelo nome (ascendente)
      scoredProducts.sort((a, b) => {
        if (a.tagScore !== b.tagScore) {
          return b.tagScore - a.tagScore; // Mais tags em comum primeiro
        }
        if (a.priceDifference !== b.priceDifference) {
          return a.priceDifference - b.priceDifference; // Preço mais próximo primeiro
        }
        return a.product.name.localeCompare(b.product.name); // Ordem alfabética
      });

      // Limitar a 8 produtos
      const related = scoredProducts.slice(0, 8).map(item => item.product);

      setRelatedProducts(related);
    }
  }, [allProducts, product]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const handleProductClick = (productId: string) => {
    // Find the product to get its data for analytics
    const clickedProduct = relatedProducts.find(p => p.id === productId);
    if (clickedProduct) {
      trackProductView(productId, { name: clickedProduct.name, price: clickedProduct.price });
    }
    navigate(`/produto/${productId}`);
  };

  return (
    <div>
      <h2 className="text-xl lg:text-2xl font-semibold text-foreground mb-4">
        Produtos Relacionados
      </h2>
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="aspect-[3/4] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4 rounded" />
              <Skeleton className="h-6 w-1/2 rounded" />
            </div>
          ))}
        </div>
      ) : relatedProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {relatedProducts.map((relatedProduct) => (
            <ProductCard 
              key={relatedProduct.id} 
              product={relatedProduct} 
              onAddToCart={handleAddToCart}
              onCardClick={handleProductClick}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Nenhum produto relacionado encontrado.</p>
      )}
    </div>
  );
};

export default RelatedProducts;
