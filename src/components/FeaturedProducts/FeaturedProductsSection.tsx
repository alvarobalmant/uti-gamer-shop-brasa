
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard, { Product } from '@/components/ProductCard';
import { useIsMobile } from '@/hooks/use-mobile';

interface FeaturedProductsSectionProps {
  products: Product[];
  loading: boolean;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  getPlatformColor: (product: Product) => string;
}

const FeaturedProductsSection = ({
  products,
  loading,
  onAddToCart,
  getPlatformColor
}: FeaturedProductsSectionProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [selectedCategory, setSelectedCategory] = useState('todos');

  const categories = [
    { id: 'todos', label: 'Todos', path: '/categoria/inicio' },
    { id: 'playstation', label: 'PlayStation', path: '/categoria/playstation' },
    { id: 'xbox', label: 'Xbox', path: '/categoria/xbox' },
    { id: 'nintendo', label: 'Nintendo', path: '/categoria/nintendo' },
    { id: 'pc', label: 'PC Games', path: '/categoria/pc' }
  ];

  const filterProductsByCategory = (category: string) => {
    if (category === 'todos') return products.slice(0, 8);
    
    return products.filter(product => 
      product.tags?.some(tag => 
        tag.name.toLowerCase().includes(category.toLowerCase())
      )
    ).slice(0, 8);
  };

  const featuredProducts = filterProductsByCategory(selectedCategory);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="animate-spin w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <div className="text-xl text-gray-500">Carregando produtos...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="produtos" className="py-16 bg-white">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Perfect Alignment */}
        <div className="mb-12">
          {/* Title and View All Link - Same Visual Line */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                🎮 Produtos em Destaque
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 hidden sm:block">
                Descubra os jogos e acessórios mais populares
              </p>
            </div>
            <div className="flex-shrink-0">
              <Button 
                onClick={() => navigate('/categoria/inicio')} 
                variant="outline" 
                className="text-red-600 border-red-600 hover:bg-red-50 flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold min-h-[44px] w-full sm:w-auto justify-center"
              >
                Ver Todos
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </div>

          {/* Category Navigation - Refined Style and Perfect Alignment */}
          {isMobile ? (
            // Mobile: Horizontal scrollable pills with refined style
            <div className="overflow-x-auto pb-2 -mx-1">
              <div className="flex gap-3 px-1 min-w-max">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-300 min-h-[44px] border-0 ${
                      selectedCategory === category.id
                        ? 'bg-red-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Desktop: Centered refined tabs
            <div className="flex justify-center">
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full max-w-3xl">
                <TabsList className="grid w-full grid-cols-5 bg-gray-100 p-1.5 rounded-xl h-auto">
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className="px-4 py-3 text-sm font-semibold rounded-lg data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-200 transition-all duration-300 border-0"
                    >
                      {category.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          )}
        </div>

        {/* Products Grid - Perfect Layout and Spacing */}
        {featuredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-2xl text-gray-400 mb-2">
              Nenhum produto disponível
            </div>
            <p className="text-gray-500">
              Produtos serão adicionados em breve
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 w-full">
            {featuredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="animate-fade-in-up opacity-0 w-full"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'forwards'
                }}
              >
                <ProductCard
                  product={product}
                  onAddToCart={(product, size, color) => onAddToCart(product, size, color)}
                  getPlatformColor={() => getPlatformColor(product)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProductsSection;
