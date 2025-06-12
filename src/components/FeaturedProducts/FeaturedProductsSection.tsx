
import React, { useState } from 'react';
import { Product } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import ProductCard from '@/components/ProductCard';
import SectionTitle from '@/components/SectionTitle';
import ProductModal from '@/components/ProductModal';

interface FeaturedProductsSectionProps {
  products: Product[];
  loading: boolean;
  onAddToCart: (product: Product) => void;
  title?: string;
  subtitle?: string;
  onCardClick?: (productId: string) => void;
  viewAllLink?: string;
}

const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  products,
  loading,
  onAddToCart,
  title = "Produtos em Destaque",
  subtitle = "Os melhores produtos selecionados para você",
  onCardClick,
  viewAllLink
}) => {
  const { addToCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const handleProductClick = (productId: string) => {
    if (onCardClick) {
      onCardClick(productId);
    } else {
      setSelectedProductId(productId);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProductId(null);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    onAddToCart(product);
  };

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionTitle title={title} subtitle={subtitle} />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-8">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="animate-pulse bg-gray-200 rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!products?.length) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionTitle title={title} subtitle={subtitle} />
          <div className="text-center py-16">
            <p className="text-gray-500">Nenhum produto encontrado</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionTitle title={title} subtitle={subtitle} />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onCardClick={handleProductClick}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Product Modal - only render if we're handling our own modal */}
      {!onCardClick && selectedProductId && (
        <ProductModal
          product={products.find(p => p.id === selectedProductId) || null}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          onClose={handleCloseModal}
          relatedProducts={products.filter(p => p.id !== selectedProductId).slice(0, 4)}
          onRelatedProductClick={handleProductClick}
        />
      )}
    </>
  );
};

export default FeaturedProductsSection;
