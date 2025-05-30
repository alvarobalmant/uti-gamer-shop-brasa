import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/hooks/useProducts";
import { useIsMobile } from "@/hooks/use-mobile";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import SectionTitle from "@/components/SectionTitle"; // Use the new SectionTitle component
import { cn } from "@/lib/utils";

// Import Swiper components (assuming installed)
// import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import { Navigation } from 'swiper/modules';

interface FeaturedProductsSectionProps {
  products: Product[];
  loading: boolean;
  onAddToCart: (product: Product) => void; // Simplified prop
  title: string; // Add title prop
  viewAllLink?: string; // Optional link for "View All"
  // getPlatformColor removed as it's likely handled within ProductCard
}

// **Redesign based on GameStop and user feedback, including horizontal scroll**
const FeaturedProductsSection = ({
  products,
  loading,
  onAddToCart,
  title,
  viewAllLink = "/categoria/inicio", // Default link
}: FeaturedProductsSectionProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { saveScrollPosition } = useScrollPosition();
  const [selectedCategory, setSelectedCategory] = useState("todos");

  // Define categories (can be fetched dynamically later)
  const categories = [
    { id: "todos", label: "Todos" },
    { id: "playstation", label: "PlayStation" },
    { id: "xbox", label: "Xbox" },
    { id: "nintendo", label: "Nintendo" },
    { id: "pc", label: "PC Games" },
  ];

  // Filter products (example logic, adjust as needed)
  const filterProductsByCategory = (category: string) => {
    if (category === "todos") return products; // Show all for "Todos"
    return products.filter((product) =>
      product.tags?.some((tag) =>
        tag.name.toLowerCase().includes(category.toLowerCase())
      )
    );
  };

  const displayedProducts = filterProductsByCategory(selectedCategory);

  const handleViewAllClick = () => {
    saveScrollPosition();
    navigate(viewAllLink);
  };

  if (loading) {
    // Simple loading state
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
    <section className="py-8 md:py-12 bg-background"> {/* Adjusted padding */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
          <SectionTitle title={title} className="mb-0" /> {/* Use SectionTitle */}
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

        {/* Category Filters - Simplified for horizontal scroll focus */}
        <div className="mb-6 md:mb-8 flex justify-center">
          <Tabs
            value={selectedCategory}
            onValueChange={setSelectedCategory}
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
          // **Horizontal Scroll Container**
          <div className="relative">
            {/* Use overflow-x-auto for basic horizontal scroll */}
            <div
              className={cn(
                "flex space-x-4 md:space-x-6 overflow-x-auto pb-4", // Enable horizontal scroll
                "-mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8" // Adjust padding for edge-to-edge feel
              )}
              style={{ scrollbarWidth: "none" }} // Hide scrollbar for cleaner look (optional)
            >
              {displayedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="w-60 sm:w-64 flex-shrink-0" // Set fixed width for items
                >
                  <ProductCard
                    product={product}
                    onAddToCart={onAddToCart}
                    // getPlatformColor is removed
                  />
                </div>
              ))}
            </div>
            {/* Optional: Add custom arrow buttons for navigation if not using Swiper */}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProductsSection;

