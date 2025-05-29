import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/hooks/useProducts';
import { useIsMobile } from '@/hooks/use-mobile';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel" // Import shadcn Carousel
import { cn } from '@/lib/utils';

interface FeaturedProductsSectionProps {
  products: Product[];
  loading: boolean;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  title: string; // Added title prop for flexibility
  // getPlatformColor might be removed if ProductCard handles its own logic
}

// **Radical Redesign - Implementing Horizontal Carousel for Mobile**
const FeaturedProductsSection = ({
  products,
  loading,
  onAddToCart,
  title = "Produtos em Destaque" // Default title
}: FeaturedProductsSectionProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { saveScrollPosition } = useScrollPosition();
  const [selectedCategory, setSelectedCategory] = useState('todos');

  // Keep categories simple for this example section
  const categories = [
    { id: 'todos', label: 'Todos', path: '/categoria/inicio' },
    { id: 'playstation', label: 'PlayStation', path: '/categoria/playstation' },
    { id: 'xbox', label: 'Xbox', path: '/categoria/xbox' },
    { id: 'nintendo', label: 'Nintendo', path: '/categoria/nintendo' },
    { id: 'pc', label: 'PC Games', path: '/categoria/pc' }
  ];

  const filterProductsByCategory = (category: string) => {
    // Limit the number of products shown in the carousel/grid
    const productLimit = isMobile ? 8 : 8; // Show more on desktop grid if desired
    if (category === 'todos') return products.slice(0, productLimit);
    
    return products.filter(product => 
      product.tags?.some(tag => 
        tag.name.toLowerCase().includes(category.toLowerCase())
      )
    ).slice(0, productLimit);
  };

  const featuredProducts = filterProductsByCategory(selectedCategory);

  const handleViewAllClick = () => {
    saveScrollPosition();
    // Navigate based on selected category or a general 'all products' page
    const categoryPath = categories.find(c => c.id === selectedCategory)?.path || '/categoria/inicio';
    navigate(categoryPath);
  };

  if (loading) {
    // Simple loading state for the section
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-6 w-48 bg-gray-200 rounded mb-8 animate-pulse"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="produtos-destaque" className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Refined Alignment and Style */}
        <div className="mb-8 md:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
            {/* Title - GameStop Style */}
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              <span className="font-extrabold tracking-tight">{title.split(' ')[0]}</span> {/* First word boldest */}
              <span className="text-gray-600 font-semibold ml-2">{title.split(' ').slice(1).join(' ')}</span> {/* Rest of title lighter */}
            </h2>
            {/* View All Button */}
            <Button 
              onClick={handleViewAllClick} 
              variant="link" // Use link variant for less emphasis
              className="text-uti-red hover:text-uti-red/80 px-0 h-auto py-1 self-start sm:self-end"
            >
              Ver Todos
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {/* Category Navigation - Tabs for Desktop, Scrollable Pills for Mobile */}
          {isMobile ? (
            <div className="overflow-x-auto pb-2 -mx-1">
              <div className="flex gap-2 px-1 min-w-max">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200 border",
                      selectedCategory === category.id
                        ? 'bg-uti-red text-white border-uti-red'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    )}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="border-b border-gray-200">
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-auto inline-block">
                <TabsList className="bg-transparent p-0 h-auto">
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-uti-red data-[state=active]:text-uti-red data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-uti-red rounded-none bg-transparent data-[state=active]:bg-transparent"
                    >
                      {category.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          )}
        </div>

        {/* Products Display: Carousel on Mobile, Grid on Desktop */}
        {featuredProducts.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            Nenhum produto encontrado nesta categoria.
          </div>
        ) : (
          <div className={cn(
            "w-full",
            isMobile ? "" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          )}>
            {isMobile ? (
              <Carousel 
                opts={{ 
                  align: "start", 
                  loop: false, // Loop might not be ideal for product lists
                  dragFree: true, // Allows for more natural scrolling
                }}
                className="-ml-4 pl-4" // Adjust margins to allow full bleed peek
              >
                <CarouselContent className="">
                  {featuredProducts.map((product, index) => (
                    <CarouselItem key={product.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 pl-4">
                      <div 
                        className="h-full animate-fade-in-up opacity-0"
                        style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
                      >
                        <ProductCard
                          product={product}
                          onAddToCart={onAddToCart}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {/* Optional: Add Previous/Next buttons if needed, styled for mobile */}
                {/* <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 ..." /> */}
                {/* <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 ..." /> */}
              </Carousel>
            ) : (
              // Desktop Grid Rendering
              featuredProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className="animate-fade-in-up opacity-0"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={onAddToCart}
                  />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProductsSection;

