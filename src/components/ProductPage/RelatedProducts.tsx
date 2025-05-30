import React, { useEffect, useState } from 'react';
import { Product, useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard'; // Use the redesigned ProductCard
import { Skeleton } from '@/components/ui/skeleton';

interface RelatedProductsProps {
  product: Product;
}

// **New Component - Basic Structure based on GameStop reference**
const RelatedProducts: React.FC<RelatedProductsProps> = ({ product }) => {
  const { products: allProducts, loading } = useProducts();
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (allProducts.length > 0 && product) {
      // Simple related logic: find products with at least one common tag (excluding self)
      // More sophisticated logic could be based on category, brand, etc.
      const currentProductTags = product.tags?.map(t => t.id) || [];
      const related = allProducts.filter(p => 
        p.id !== product.id && 
        p.tags?.some(tag => currentProductTags.includes(tag.id))
      ).slice(0, 4); // Limit to 4 related products for display
      
      // If not enough tag-related products, fill with others from the same category (if category exists)
      if (related.length < 4 && product.category_id) {
          const categoryProducts = allProducts.filter(p => 
              p.id !== product.id && 
              p.category_id === product.category_id && 
              !related.some(r => r.id === p.id) // Avoid duplicates
          );
          related.push(...categoryProducts.slice(0, 4 - related.length));
      }

      // If still not enough, fill with any other products (excluding self)
      if (related.length < 4) {
          const otherProducts = allProducts.filter(p => 
              p.id !== product.id && 
              !related.some(r => r.id === p.id)
          );
          related.push(...otherProducts.slice(0, 4 - related.length));
      }

      setRelatedProducts(related);
    }
  }, [allProducts, product]);

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
              // Pass necessary props like onAddToCart if needed, or handle within ProductCard
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

