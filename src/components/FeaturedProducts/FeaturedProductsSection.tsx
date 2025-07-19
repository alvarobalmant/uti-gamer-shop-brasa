
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/hooks/useProducts";
import SectionTitle from "@/components/SectionTitle";
import { useHorizontalScrollRestoration } from "@/hooks/useHorizontalScrollRestoration";
import { cn } from "@/lib/utils";

interface FeaturedProductsSectionProps {
  products: Product[];
  loading: boolean;
  onAddToCart: (product: Product) => void;
  title: string;
  viewAllLink?: string;
  reduceTopSpacing?: boolean;
}

const FeaturedProductsSection = ({
  products,
  loading,
  onAddToCart,
  title,
  viewAllLink = "/categoria/inicio",
  reduceTopSpacing = false,
}: FeaturedProductsSectionProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [animateProducts, setAnimateProducts] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Generate unique section ID based on title
  const sectionId = `featured-${title.toLowerCase().replace(/\s+/g, '-')}`;
  const { elementRef: scrollContainerRef, debugScrollPositions } = useHorizontalScrollRestoration(sectionId);

  const handleViewAllClick = () => {
    navigate(viewAllLink);
  };

  // Function to handle product click - always navigate to product page
  const handleProductCardClick = useCallback(async (productId: string) => {
    console.log('[FeaturedProducts] Navigating to product:', productId);
    navigate(`/produto/${productId}`);
  }, [navigate]);

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
  }, [products]);

  // Check scroll buttons when products change or component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      checkScrollButtons();
    }, 100);
    return () => clearTimeout(timer);
  }, [products]);

  // Add scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      checkScrollButtons();
      return () => container.removeEventListener('scroll', checkScrollButtons);
    }
  }, [products]);

  // Debug function for development
  useEffect(() => {
    // Add debug function to window for development
    if (typeof window !== 'undefined') {
      (window as any).debugHorizontalScroll = debugScrollPositions;
    }
  }, [debugScrollPositions]);

  if (loading) {
    return (
      <section className={reduceTopSpacing ? "py-4 md:py-6 bg-background" : "py-12 md:py-16 bg-background"}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 text-muted-foreground">
            Carregando produtos...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={reduceTopSpacing ? "py-4 md:py-6 bg-background" : "py-8 md:py-12 bg-background"}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
          <SectionTitle title={title} className="mb-0" />
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
        {products.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            Nenhum produto encontrado nesta categoria.
          </div>
        ) : (
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
                {products.map((product, index) => (
                  <div
                    key={product.id}
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
                      product={product}
                      onCardClick={handleProductCardClick}
                      onAddToCart={onAddToCart}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProductsSection;
