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
}

const FeaturedProductsSection = ({
  products,
  loading,
  onAddToCart,
  title,
  viewAllLink = "/categoria/inicio",
  onCardClick,
}: FeaturedProductsSectionProps) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [animateProducts, setAnimateProducts] = useState(true);

  // State for managing the product modal (only if onCardClick is not provided)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Define categories
  const categories = [
    { id: "todos", label: "Todos" },
    { id: "playstation", label: "PlayStation" },
    { id: "xbox", label: "Xbox" },
    { id: "nintendo", label: "Nintendo" },
    { id: "pc", label: "PC Games" },
  ];

  // Filter products
  const filterProductsByCategory = (category: string) => {
    if (category === "todos") return products;
    return products.filter((product) =>
      product.tags?.some((tag) =>
        tag.name.toLowerCase().includes(category.toLowerCase())
      )
    );
  };

  const displayedProducts = filterProductsByCategory(selectedCategory);

  const handleViewAllClick = () => {
    navigate(viewAllLink);
  };

  // Handle category change with animation logic
  const handleCategoryChange = (category: string) => {
    if (category === selectedCategory) return;
    setAnimateProducts(false);
    setTimeout(() => {
      setSelectedCategory(category);
      setTimeout(() => {
        setAnimateProducts(true);
      }, 50);
    }, 150);
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
  }, [displayedProducts]);

  if (loading) {
    // Render loading state if needed
    return (
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 text-muted-foreground">
            Carregando produtos...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-12 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
          <SectionTitle title={title} className="mb-0" />
          <Button
            onClick={handleViewAllClick}
            variant="outline"
            size="sm"
            className="text-primary border-primary hover:bg-primary/10 flex-shrink-0 w-full sm:w-auto"
          >
            Ver Todos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Category Filters */}
        <div className="mb-6 md:mb-8 flex justify-center">
          <Tabs
            value={selectedCategory}
            onValueChange={handleCategoryChange}
            className="w-full max-w-lg"
          >
            <TabsList className="grid w-full grid-cols-5 bg-muted p-1 rounded-lg h-auto">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="text-xs sm:text-sm"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Products Grid / Scroll Container */}
        {displayedProducts.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            Nenhum produto encontrado nesta categoria.
          </div>
        ) : (
          <div className="relative">
            <div
              className={cn(
                "w-full overflow-x-auto overflow-y-hidden pb-4",
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
              <div className="flex gap-0 md:gap-0.5 min-w-max px-1"> {/* Reduzindo ainda mais o gap entre os cards para ficar como na GameStop */}
                {displayedProducts.map((product, index) => (
                  <div
                    key={`${selectedCategory}-${product.id}`}
                    className={cn(
                      "w-60 sm:w-64 flex-shrink-0",
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
                      onAddToCart={onAddToCart}
                      onCardClick={handleProductCardClick} // Pass the handler here
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Render the Product Modal only if no external onCardClick handler is provided */}
      {!onCardClick && (
        <ProductModal
          productId={selectedProductId}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      )}
    </section>
  );
};

export default FeaturedProductsSection;


