
import React, { useEffect, useState, useCallback } from 'react';
import { Product, useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import SectionTitle from '@/components/SectionTitle';
import { useHorizontalScrollRestoration } from '@/hooks/useHorizontalScrollRestoration';
import { cn } from '@/lib/utils';

interface RelatedProductsSectionProps {
  product: Product;
}

const RelatedProductsSection: React.FC<RelatedProductsSectionProps> = ({ product }) => {
  const { products: allProducts, loading } = useProducts();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [animateProducts, setAnimateProducts] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Use horizontal scroll restoration for related products
  const { elementRef: scrollContainerRef } = useHorizontalScrollRestoration('related-products');

  useEffect(() => {
    if (allProducts.length > 0 && product) {
      // Logic for related products based on tags
      const currentProductTags = product.tags?.map(t => t.id) || [];
      const related = allProducts
        .filter(p => 
          p.id !== product.id && 
          p.tags?.some(tag => currentProductTags.includes(tag.id))
        )
        .slice(0, 8);
      
      // If there are no tag-related products, get random products
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

  const handleProductClick = useCallback(async (productId: string) => {
    console.log('[RelatedProducts] Navigating to related product:', productId);
    navigate(`/produto/${productId}`);
  }, [navigate]);

  const handleViewAllClick = () => {
    navigate('/categoria/inicio');
  };

  // Check scroll position and update button states
  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollBy({
        left: -containerWidth,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollBy({
        left: containerWidth,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    setAnimateProducts(false);
    const timer = setTimeout(() => setAnimateProducts(true), 50);
    return () => clearTimeout(timer);
  }, [relatedProducts]);

  // Check scroll buttons when products change or component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      checkScrollButtons();
    }, 100);
    return () => clearTimeout(timer);
  }, [relatedProducts]);

  // Add scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      checkScrollButtons();
      return () => container.removeEventListener('scroll', checkScrollButtons);
    }
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

        {/* Products Grid / Scroll Container */}
        <div className="relative group">
          {/* Left Navigation Button */}
          {canScrollLeft && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/90 text-gray-700 hover:bg-white hover:text-gray-900 shadow-lg border border-gray-200 transition-opacity duration-200"
              onClick={scrollLeft}
              aria-label="Produtos anteriores"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}

          {/* Right Navigation Button */}
          {canScrollRight && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/90 text-gray-700 hover:bg-white hover:text-gray-900 shadow-lg border border-gray-200 transition-opacity duration-200"
              onClick={scrollRight}
              aria-label="Próximos produtos"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}

          <div
            ref={scrollContainerRef}
            className={cn(
              "w-full overflow-x-auto overflow-y-hidden pb-4 pt-2",
              "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300",
              "overscroll-behavior-x-contain"
            )}
            style={{
              scrollbarWidth: "thin",
              WebkitOverflowScrolling: "touch",
              scrollBehavior: "smooth",
              touchAction: "pan-x pan-y"
            } as React.CSSProperties}
          >
            <div 
              className="flex gap-3 min-w-max px-1 py-1"
              style={{
                width: 'calc(100% + 100px)',
                paddingRight: '120px'
              }}
            >
              {relatedProducts.map((relatedProduct, index) => (
                <div
                  key={relatedProduct.id}
                  className={cn(
                    "flex-shrink-0",
                    "transition-all duration-300 ease-in-out",
                    animateProducts
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  )}
                  style={{
                    transitionDelay: animateProducts ? `${index * 75}ms` : "0ms",
                    width: "200px",
                    flexShrink: 0
                  }}
                >
                  <ProductCard
                    product={relatedProduct}
                    onCardClick={handleProductClick}
                    onAddToCart={handleAddToCart}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RelatedProductsSection;
