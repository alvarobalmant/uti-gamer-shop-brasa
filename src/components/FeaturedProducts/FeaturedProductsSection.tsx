
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/hooks/useProducts"; // Updated import
import SectionTitle from "@/components/SectionTitle";
import { cn } from "@/lib/utils";
import ProductModal from "@/components/ProductModal"; // Import the modal component

interface FeaturedProductsSectionProps {
  products: Product[];
  loading: boolean;
  onAddToCart: (product: Product) => void;
  title: string;
  viewAllLink?: string;
  onCardClick?: (productId: string) => void; // Make this optional with default behavior
  reduceTopSpacing?: boolean;
}

const FeaturedProductsSection = ({
  products,
  loading,
  onAddToCart,
  title,
  viewAllLink = "/categoria/inicio",
  onCardClick,
  reduceTopSpacing = false,
}: FeaturedProductsSectionProps) => {
  const navigate = useNavigate();
  const [animateProducts, setAnimateProducts] = useState(true);

  // State for managing the product modal (only if onCardClick is not provided)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const handleViewAllClick = () => {
    navigate(viewAllLink);
  };

  // Function to handle opening the modal
  const handleProductCardClick = (productId: string) => {
    if (onCardClick) {
      onCardClick(productId);
    } else {
      setSelectedProductId(productId);
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    setAnimateProducts(false);
    const timer = setTimeout(() => setAnimateProducts(true), 50);
    return () => clearTimeout(timer);
  }, [products]);

<<<<<<< HEAD
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
      // Initial check
      checkScrollButtons();
      return () => container.removeEventListener('scroll', checkScrollButtons);
    }
  }, [products]);

=======
>>>>>>> b1aecab4c65a0281d07579c8840a9247db6e56bb
  if (loading) {
    // Render loading state if needed
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
          <div className="relative">
            <div
              className={cn(
                "w-full overflow-x-auto overflow-y-hidden pb-4 pt-2", // Added pt-2 for top padding
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
<<<<<<< HEAD
              <div 
                className="flex gap-3 min-w-max px-1 py-1"
                style={{
                  // Force the last card to be partially cut by making the container slightly smaller
                  width: 'calc(100% + 100px)', // Extend beyond container to force cutting
                  paddingRight: '120px' // Ensure last card is partially visible
                }}
              >
                {products.map((product, index) => (
=======
              <div className="flex gap-3 min-w-max px-1 py-1"> {/* Added py-1 for vertical padding */}
                {displayedProducts.map((product, index) => (
>>>>>>> b1aecab4c65a0281d07579c8840a9247db6e56bb
                  <div
                    key={product.id}
                    className={cn(
                      "w-[200px] flex-shrink-0", // GameStop card width
                      "transition-all duration-300 ease-in-out",
                      animateProducts
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    )}
                    style={{
                      transitionDelay: animateProducts ? `${index * 75}ms` : '0ms'
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

      {/* Render the Product Modal only if no external onCardClick handler is provided */}
      {!onCardClick && selectedProductId && (
        <ProductModal
          product={products.find(p => p.id === selectedProductId) || null}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      )}
    </section>
  );
};

export default FeaturedProductsSection;
