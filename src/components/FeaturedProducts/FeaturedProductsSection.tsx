
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
        <div className="container mx-auto px-4 max-w-7xl">
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
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="mb-12">
          {/* Title and View All Link */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                🎮 Produtos em Destaque
              </h2>
              <p className="text-lg text-gray-600 hidden lg:block">
                Descubra os jogos e acessórios mais populares
              </p>
            </div>
            <Button 
              onClick={() => navigate('/categoria/inicio')} 
              variant="outline" 
              className="text-red-600 border-red-600 hover:bg-red-50 flex items-center gap-2 px-6 py-3 text-base font-semibold"
            >
              Ver Todos
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Category Navigation */}
          {isMobile ? (
            // Mobile: Horizontal scrollable pills
            <div className="overflow-x-auto pb-2">
              <div className="flex gap-3 min-w-max">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-6 py-3 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 min-h-[44px] ${
                      selectedCategory === category.id
                        ? 'bg-red-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Desktop: Centered tabs
            <div className="flex justify-center">
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full max-w-2xl">
                <TabsList className="grid w-full grid-cols-5 bg-gray-100 p-1 rounded-xl">
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className="px-6 py-3 text-sm font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm transition-all duration-300"
                    >
                      {category.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          )}
        </div>

        {/* Products Grid */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {featuredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="animate-fade-in-up opacity-0"
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
