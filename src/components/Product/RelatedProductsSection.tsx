
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Product, useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
<<<<<<< HEAD
import { Card } from '@/components/ui/card';
import SectionTitle from '@/components/SectionTitle';
import { cn } from '@/lib/utils';
import { useHorizontalScrollTracking } from '@/hooks/useHorizontalScrollTracking';
import FavoriteButton from '@/components/FavoriteButton';
import ProductCardImage from '@/components/ProductCard/ProductCardImage';
import ProductCardInfo from '@/components/ProductCard/ProductCardInfo';
import ProductCardPrice from '@/components/ProductCard/ProductCardPrice';
import ProductCardBadge from '@/components/ProductCard/ProductCardBadge';
=======
import { ProductCardOptimized } from '@/components/ProductCardOptimized';
import SectionTitle from '@/components/SectionTitle';
import { cn } from '@/lib/utils';
>>>>>>> bcff5293fc382e6fb40a7d4caaf51555e939f67a

interface RelatedProductsSectionProps {
  product: Product;
}

const RelatedProductsSection: React.FC<RelatedProductsSectionProps> = ({ product }) => {
  const { products: allProducts, loading } = useProducts();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [animateProducts, setAnimateProducts] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(5);

  // Calcular itens por visualização baseado no tamanho da tela
  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width < 640) setItemsPerView(2);
      else if (width < 768) setItemsPerView(3);
      else if (width < 1024) setItemsPerView(4);
      else setItemsPerView(5);
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  useEffect(() => {
    if (allProducts.length > 0 && product) {
      // Lógica para produtos relacionados baseada em tags
      const currentProductTags = product.tags?.map(t => t.id) || [];
      const related = allProducts
        .filter(p => 
          p.id !== product.id && 
          p.tags?.some(tag => currentProductTags.includes(tag.id))
        )
        .slice(0, 12);
      
      // Se não houver produtos relacionados por tag, pegar produtos aleatórios
      if (related.length < 4) {
        const others = allProducts
          .filter(p => p.id !== product.id && !related.some(r => r.id === p.id))
          .slice(0, 12 - related.length);
        related.push(...others);
      }

      setRelatedProducts(related);
      setCurrentIndex(0); // Reset index when products change
    }
  }, [allProducts, product]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const handleProductClick = useCallback(async (productId: string) => {
    // Salvar posição atual antes de navegar para produto relacionado
    console.log('[RelatedProducts] Salvando posição antes de navegar para produto relacionado:', productId);
    const scrollManager = (await import('@/lib/scrollRestorationManager')).default;
    scrollManager.savePosition(location.pathname, 'related-product-navigation');
    navigate(`/produto/${productId}`);
  }, [navigate, location.pathname]);

  const handleViewAllClick = () => {
    navigate('/categoria/inicio');
  };

  // Navigation functions similar to ProductCarouselOptimized
  const canNavigateLeft = currentIndex > 0;
  const canNavigateRight = currentIndex < relatedProducts.length - itemsPerView;

  const scrollLeft = useCallback(() => {
    if (canNavigateLeft) {
      setCurrentIndex(prev => Math.max(0, prev - itemsPerView));
    }
  }, [canNavigateLeft, itemsPerView]);

  const scrollRight = useCallback(() => {
    if (canNavigateRight) {
      setCurrentIndex(prev => Math.min(relatedProducts.length - itemsPerView, prev + itemsPerView));
    }
  }, [canNavigateRight, itemsPerView, relatedProducts.length]);

  // Get visible products based on current index
  const visibleProducts = relatedProducts.slice(currentIndex, currentIndex + itemsPerView);

  useEffect(() => {
    setAnimateProducts(false);
    const timer = setTimeout(() => setAnimateProducts(true), 50);
    return () => clearTimeout(timer);
  }, [relatedProducts]);

  if (loading) {
    return (
      <section className="py-8 md:py-12 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 text-muted-foreground">
            Carregando produtos...
          </div>
        </div>
      </section>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-8 md:py-12 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
          <SectionTitle title="Produtos Relacionados" className="mb-0" />
          <Button
            onClick={handleViewAllClick}
            variant="default"
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white border-0 flex-shrink-0 w-full sm:w-auto font-medium"
          >
            Ver Todos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          {relatedProducts.length > itemsPerView && (
            <>
              <Button
                onClick={scrollLeft}
                disabled={!canNavigateLeft}
                variant="outline"
                size="icon"
                className={cn(
                  "absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg",
                  !canNavigateLeft && "opacity-50 cursor-not-allowed"
                )}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                onClick={scrollRight}
                disabled={!canNavigateRight}
                variant="outline"
                size="icon"
                className={cn(
                  "absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg",
                  !canNavigateRight && "opacity-50 cursor-not-allowed"
                )}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-12">
            {visibleProducts.map((relatedProduct, index) => (
              <div
                key={relatedProduct.id}
                className={cn(
                  "transition-all duration-300 ease-in-out",
                  animateProducts
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                )}
                style={{
                  transitionDelay: animateProducts ? `${index * 75}ms` : "0ms"
                }}
              >
                <ProductCardOptimized
                  product={relatedProduct}
                  onFavoriteClick={() => {}}
                  isFavorite={false}
                />
              </div>
            ))}
          </div>

          {/* Indicators */}
          {relatedProducts.length > itemsPerView && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ 
                length: Math.ceil(relatedProducts.length / itemsPerView) 
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index * itemsPerView)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    Math.floor(currentIndex / itemsPerView) === index
                      ? "bg-red-600"
                      : "bg-gray-300"
                  )}
<<<<<<< HEAD
                  style={{
                    transitionDelay: animateProducts ? `${index * 75}ms` : "0ms",
                    width: "200px",
                    flexShrink: 0
                  }}
                >
                  {/* Card no padrão da homepage */}
                  <Card
                    className={cn(
                      "relative flex flex-col bg-white overflow-hidden",
                      "border border-gray-200",
                      "rounded-lg",
                      "shadow-none",
                      "transition-all duration-200 ease-in-out",
                      "cursor-pointer",
                      "w-[200px] h-[320px]",
                      "p-0",
                      "product-card",
                      "hover:shadow-md hover:-translate-y-1"
                    )}
                    onClick={() => handleProductClick(relatedProduct.id)}
                    data-testid="product-card"
                  >
                    <ProductCardBadge 
                      text={relatedProduct.badge_text || ''} 
                      color={relatedProduct.badge_color || '#22c55e'} 
                      isVisible={relatedProduct.badge_visible || false} 
                    />

                    {/* Favorite Button */}
                    <div className="absolute top-2 right-2 z-10">
                      <FavoriteButton productId={relatedProduct.id} size="sm" />
                    </div>
                    
                    <ProductCardImage product={relatedProduct} isHovered={false} />

                    <div className="flex flex-1 flex-col justify-between p-3">
                      <div className="space-y-2">
                        <ProductCardInfo product={relatedProduct} />
                        <ProductCardPrice product={relatedProduct} />
                      </div>
                    </div>
                  </Card>
                </div>
=======
                />
>>>>>>> bcff5293fc382e6fb40a7d4caaf51555e939f67a
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RelatedProductsSection;
