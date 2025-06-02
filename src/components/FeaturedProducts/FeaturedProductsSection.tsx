import { useState, useEffect } from "react"; // Import useEffect
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/hooks/useProducts";
import { useIsMobile } from "@/hooks/use-mobile";
// Removed import { useScrollPosition } from "@/hooks/useScrollPosition";
import SectionTitle from "@/components/SectionTitle"; // Use the new SectionTitle component
import { cn } from "@/lib/utils";

interface FeaturedProductsSectionProps {
  products: Product[];
  loading: boolean;
  onAddToCart: (product: Product) => void; // Simplified prop
  title: string; // Add title prop
  viewAllLink?: string; // Optional link for "View All"
}

const FeaturedProductsSection = ({
  products,
  loading,
  onAddToCart,
  title,
  viewAllLink = "/categoria/inicio", // Default link
}: FeaturedProductsSectionProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  // Removed const { saveScrollPosition } = useScrollPosition();
  const [selectedCategory, setSelectedCategory] = useState("todos");
  // Start with animation enabled for initial load
  const [animateProducts, setAnimateProducts] = useState(true); 

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
    // Removed saveScrollPosition(); - useScrollRestoration handles this globally
    navigate(viewAllLink);
  };

  // Handle category change with animation logic
  const handleCategoryChange = (category: string) => {
    if (category === selectedCategory) return; // Do nothing if the category is the same

    // 1. Trigger exit animation (set state to false)
    setAnimateProducts(false);

    // 2. Wait for exit animation to start, then change category
    setTimeout(() => {
      setSelectedCategory(category);
      // 3. Trigger enter animation for new items (set state back to true)
      // Use useEffect based on displayedProducts or a small timeout
      // Using a small timeout here for simplicity
      setTimeout(() => {
        setAnimateProducts(true);
      }, 50); // Small delay to allow React to update the list before animating in
    }, 150); // Delay should be slightly less than transition duration (300ms)
  };

  // Ensure animation state is true when products initially load or change
  // This useEffect might cause re-animation on initial load if displayedProducts changes reference
  // Let's keep it simple for now, assuming initial load animation is desired.
  useEffect(() => {
    setAnimateProducts(true);
  }, [displayedProducts]);

  if (loading) {
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
            onValueChange={handleCategoryChange} // Use the new handler
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
                "flex space-x-4 md:space-x-6 overflow-x-auto pb-4",
                "-mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
              )}
              style={{ scrollbarWidth: "none" }}
            >
              {displayedProducts.map((product, index) => (
                <div
                  key={`${selectedCategory}-${product.id}`} // Change key to help React differentiate elements between renders
                  className={cn(
                    "w-60 sm:w-64 flex-shrink-0",
                    "transition-all duration-300 ease-in-out", // Animation duration
                    // Apply animation classes based on state
                    animateProducts
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  )}
                  style={{
                    // Apply staggered delay only for the enter animation
                    transitionDelay: animateProducts ? `${index * 75}ms` : '0ms' // Increased delay slightly
                  }}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={onAddToCart}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProductsSection;

