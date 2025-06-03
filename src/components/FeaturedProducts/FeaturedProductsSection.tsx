
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/hooks/useProducts";
import { useIsMobile } from "@/hooks/use-mobile";
import SectionTitle from "@/components/SectionTitle";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"; // Import Carousel components

interface FeaturedProductsSectionProps {
  products: Product[];
  loading: boolean;
  onAddToCart: (product: Product) => void;
  title: string;
  viewAllLink?: string;
}

const FeaturedProductsSection = ({
  products,
  loading,
  onAddToCart,
  title,
  viewAllLink = "/categoria/inicio",
}: FeaturedProductsSectionProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [selectedCategory, setSelectedCategory] = useState("todos");
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

  useEffect(() => {
    // Reset animation state when products change
    setAnimateProducts(false);
    const timer = setTimeout(() => setAnimateProducts(true), 50); // Trigger animation shortly after update
    return () => clearTimeout(timer);
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

<<<<<<< HEAD
        {/* Products Grid / Scroll Container - Attempting fix for mobile horizontal scroll */}
=======
        {/* Products Carousel */}
>>>>>>> 989b50147339e1ab3b250f9f4de65d797b3aa034
        {displayedProducts.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            Nenhum produto encontrado nesta categoria.
          </div>
        ) : (
<<<<<<< HEAD
          <div className="relative">
            {/* Container de scroll horizontal */}
            <div
              className={cn(
                // Container base
                "w-full overflow-x-auto overflow-y-hidden pb-4", // Permite scroll X, esconde scroll Y
                // Scrollbar styling (opcional, mas bom para desktop)
                "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300",
                // Scroll behavior otimizado
                "overscroll-behavior-x-contain" // Evita scroll da página inteira ao chegar no fim do container
              )}
              style={{
                scrollbarWidth: "thin", // Para Firefox
                WebkitOverflowScrolling: "touch", // Scroll suave no iOS
                scrollBehavior: "smooth",
                // *** NOVA TENTATIVA: Permitir pan-x (horizontal) e pan-y (vertical) ***
                // O navegador deve priorizar pan-x para este container com overflow-x
                // e deixar pan-y para a rolagem da página.
                touchAction: "pan-x pan-y"
              } as React.CSSProperties}
            >
              {/* Inner flex container (mantém layout original) */}
              <div className="flex gap-4 md:gap-6 min-w-max px-1">
                {displayedProducts.map((product, index) => (
                  <div
                    key={`${selectedCategory}-${product.id}`}
                    className={cn(
                      // Estilo original do card (mantido)
                      "w-60 sm:w-64 flex-shrink-0",
                      // Animation
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
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
=======
          <Carousel
            opts={{
              align: "start",
              loop: false, // Or true, depending on desired behavior
              dragFree: true, // Allows free scrolling without snapping
              // Ensure touch actions allow vertical page scroll
              watchDrag: (emblaApi, event) => {
                // Basic check for vertical drag dominance
                if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
                  return false; // Prevent Embla from handling vertical drags
                }
                return true; // Allow Embla to handle horizontal drags
              }
            }}
            className="relative w-full"
          >
            <CarouselContent className="-ml-4">
              {displayedProducts.map((product, index) => (
                <CarouselItem
                  key={`${selectedCategory}-${product.id}`}
                  className={cn(
                    // Adjust basis for desired number of items visible
                    "basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6",
                    "pl-4", // Padding for spacing
                    // Animation
                    "transition-opacity duration-300 ease-in-out",
                    animateProducts ? "opacity-100" : "opacity-0"
                  )}
                  style={{
                    transitionDelay: animateProducts ? `${index * 75}ms` : '0ms'
                  }}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={onAddToCart}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {!isMobile && (
              <>
                <CarouselPrevious className="absolute left-[-10px] top-1/2 -translate-y-1/2 z-10" />
                <CarouselNext className="absolute right-[-10px] top-1/2 -translate-y-1/2 z-10" />
              </>
            )}
          </Carousel>
>>>>>>> 989b50147339e1ab3b250f9f4de65d797b3aa034
        )}
      </div>
    </section>
  );
};

export default FeaturedProductsSection;

