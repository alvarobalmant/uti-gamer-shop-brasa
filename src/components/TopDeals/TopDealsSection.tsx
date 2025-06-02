import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "@/components/TopDeals/TopDealProductCard";
import { Product } from "@/hooks/useProducts";
import { useIsMobile } from "@/hooks/use-mobile";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { cn } from "@/lib/utils";

interface TopDealsBannerProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  isProExclusive?: boolean;
}

interface TopDealsSectionProps {
  products: Product[];
  loading: boolean;
  onAddToCart: (product: Product) => void;
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  banner?: TopDealsBannerProps;
  categories?: { id: string; label: string }[];
}

const TopDealsSection = ({
  products,
  loading,
  onAddToCart,
  title,
  subtitle = "Save Big On Stuff You Love",
  viewAllLink = "/categoria/ofertas",
  banner,
  categories = [
    { id: "todos", label: "Todos" },
    { id: "playstation", label: "PlayStation" },
    { id: "xbox", label: "Xbox" },
    { id: "nintendo", label: "Nintendo" },
    { id: "pc", label: "PC Games" },
  ],
}: TopDealsSectionProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [animateProducts, setAnimateProducts] = useState(true);

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

  // Ensure animation state is true when products initially load or change
  useEffect(() => {
    setAnimateProducts(true);
  }, [displayedProducts]);

  if (loading) {
    return (
      <section className="py-8 md:py-12 bg-gray-100 rounded-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 text-muted-foreground">
            Carregando ofertas...
          </div>
        </div>
      </section>
    );
  }

  // Mobile-specific layout
  if (isMobile) {
    return (
      <section className="py-6 bg-gray-100">
        <div className="px-4">
          {/* Mobile Header */}
          <div className="flex flex-col gap-2 mb-4">
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
            <Button
              onClick={handleViewAllClick}
              variant="outline"
              size="sm"
              className="text-primary border-primary hover:bg-primary/10 w-full mt-1"
            >
              Shop All Deals
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Category Tabs - Horizontal Scrollable */}
          <div className="mb-4 -mx-4 px-4 overflow-x-auto">
            <Tabs
              value={selectedCategory}
              onValueChange={handleCategoryChange}
              className="w-auto inline-flex"
            >
              <TabsList className="bg-white p-1 rounded-lg h-auto flex space-x-1 w-auto">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="text-xs whitespace-nowrap px-3"
                  >
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Mobile Products - Vertical Stack */}
          {displayedProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma oferta encontrada nesta categoria.
            </div>
          ) : (
            <div className="space-y-4">
              {displayedProducts.slice(0, 4).map((product, index) => (
                <div
                  key={`${selectedCategory}-${product.id}`}
                  className={cn(
                    "w-full",
                    "transition-all duration-300 ease-in-out",
                    animateProducts
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  )}
                  style={{
                    transitionDelay: animateProducts ? `${index * 75}ms` : "0ms",
                  }}
                >
                  {/* Mobile-optimized card layout */}
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="flex">
                      {/* Product image on the left */}
                      <div className="w-1/3 relative">
                        <img
                          src={product.image_url || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover aspect-square"
                        />
                        {/* Deal label */}
                        <div className="absolute top-1 left-1 z-10 bg-red-600">
                          <span className="text-white text-xs font-medium px-1.5 py-0.5 block">
                            {product.tags?.find((tag) =>
                              tag.name.toLowerCase().includes("deal")
                            )?.name || "RIG DEAL"}
                          </span>
                        </div>
                      </div>
                      
                      {/* Product details on the right */}
                      <div className="w-2/3 p-3 flex flex-col justify-between">
                        <div>
                          <h3 className="font-medium text-sm mb-1 line-clamp-2">
                            {product.name}
                          </h3>
                          
                          {/* Pricing */}
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-base font-bold">
                              R${product.price.toFixed(2)}
                            </span>
                            {product.compare_at_price && product.compare_at_price > product.price && (
                              <span className="text-xs text-muted-foreground line-through">
                                R${product.compare_at_price.toFixed(2)}
                              </span>
                            )}
                          </div>
                          
                          {/* Pro Price */}
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-medium text-purple-700">
                              R${(product.price * 0.95).toFixed(2)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              for Pros
                            </span>
                          </div>
                        </div>
                        
                        {/* Add to Cart Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 w-full border-primary text-primary hover:bg-primary/10 text-xs h-8"
                          onClick={() => onAddToCart(product)}
                        >
                          Adicionar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* "View More" button if there are more than 4 products */}
              {displayedProducts.length > 4 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={handleViewAllClick}
                >
                  Ver mais {displayedProducts.length - 4} ofertas
                </Button>
              )}
            </div>
          )}

          {/* Mobile Banner - Full Width */}
          {banner && (
            <div className="mt-6 bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="relative">
                {/* Banner Image */}
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Banner Content Overlay */}
                <div className="p-4 bg-white">
                  {banner.isProExclusive && (
                    <span className="inline-block bg-purple-600 text-white text-xs font-medium px-2 py-0.5 rounded mb-2">
                      Pro Exclusive
                    </span>
                  )}
                  <h3 className="text-xl font-bold mb-1">{banner.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {banner.subtitle}
                  </p>
                  <Button
                    onClick={() => navigate(banner.buttonLink)}
                    variant="default"
                    size="sm"
                    className="w-full"
                  >
                    {banner.buttonText}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Desktop layout
  return (
    <section className="py-8 md:py-12 bg-gray-100 rounded-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            {subtitle && (
              <p className="text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <Button
            onClick={handleViewAllClick}
            variant="outline"
            size="sm"
            className="text-primary border-primary hover:bg-primary/10 flex-shrink-0 w-full sm:w-auto"
          >
            Shop All Deals
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
            <TabsList className="grid w-full grid-cols-5 bg-white p-1 rounded-lg h-auto">
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
            Nenhuma oferta encontrada nesta categoria.
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
                  key={`${selectedCategory}-${product.id}`}
                  className={cn(
                    "w-60 sm:w-64 flex-shrink-0",
                    "transition-all duration-300 ease-in-out",
                    animateProducts
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  )}
                  style={{
                    transitionDelay: animateProducts ? `${index * 75}ms` : "0ms",
                  }}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={onAddToCart}
                    dealLabel={
                      product.tags?.find((tag) =>
                        tag.name.toLowerCase().includes("deal")
                      )?.name || "RIG DEAL"
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Promotional Banner */}
        {banner && (
          <div className="mt-8 md:mt-12 bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="flex flex-col md:flex-row items-center">
              <div className="p-6 md:p-8 flex-1">
                {banner.isProExclusive && (
                  <span className="inline-block bg-purple-600 text-white text-xs font-medium px-2.5 py-1 rounded-md mb-3">
                    Pro Exclusive
                  </span>
                )}
                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                  {banner.title}
                </h3>
                <p className="text-muted-foreground mb-4">{banner.subtitle}</p>
                <Button
                  onClick={() => navigate(banner.buttonLink)}
                  variant="default"
                  className="w-full md:w-auto"
                >
                  {banner.buttonText}
                </Button>
              </div>
              <div className="w-full md:w-1/3 flex-shrink-0">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TopDealsSection;
