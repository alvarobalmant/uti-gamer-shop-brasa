
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
      <section className="py-xl bg-white">
        <div className="container-premium">
          <div className="text-center py-2xl">
            <div className="loading-shimmer w-12 h-12 rounded-full mx-auto mb-md"></div>
            <div className="text-display-sm text-neutral-gray">Carregando produtos...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="produtos" className="py-xl bg-white">
      <div className="container-premium">
        {/* Section Header - Sistema Tipográfico Premium */}
        <div className="mb-2xl">
          {/* Title and View All Link - Perfect Responsive Alignment */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-md mb-xl">
            <div className="flex-1">
              <h2 className="text-display-md text-neutral-dark mb-sm">
                🎮 Produtos em Destaque
              </h2>
              <p className="text-body-md text-neutral-gray hidden sm:block">
                Descubra os jogos e acessórios mais populares
              </p>
            </div>
            <div className="flex-shrink-0">
              <Button 
                onClick={() => navigate('/categoria/inicio')} 
                className="btn-secondary-premium flex items-center gap-sm w-full sm:w-auto"
              >
                Ver Todos
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 quick-transition" />
              </Button>
            </div>
          </div>

          {/* Category Navigation - Sistema Responsivo Premium */}
          {isMobile ? (
            // Mobile: Horizontal scrollable com touch otimizado
            <div className="overflow-x-auto scrollbar-premium pb-sm -mx-1">
              <div className="flex gap-sm px-1 min-w-max">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`touch-friendly touch-feedback px-md py-sm rounded-xl 
                               text-sm font-semibold whitespace-nowrap quick-transition
                               ${selectedCategory === category.id
                                 ? 'bg-primary text-white shadow-lg scale-105'
                                 : 'bg-neutral-light text-neutral-dark hover:bg-gray-200'
                               }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Desktop: Tabs centralizadas com micro-interações
            <div className="flex justify-center">
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full max-w-4xl">
                <TabsList className="grid w-full grid-cols-5 bg-neutral-light p-2 rounded-2xl h-auto gap-1">
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className="px-md py-sm text-sm font-semibold rounded-xl 
                                 data-[state=active]:bg-primary data-[state=active]:text-white 
                                 data-[state=active]:shadow-lg data-[state=active]:scale-105
                                 data-[state=inactive]:text-neutral-dark 
                                 data-[state=inactive]:hover:bg-gray-200 
                                 quick-transition border-0"
                    >
                      {category.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          )}
        </div>

        {/* Products Grid - Sistema Grid Flexível Premium */}
        {featuredProducts.length === 0 ? (
          <div className="text-center py-2xl">
            <div className="text-display-sm text-neutral-gray mb-sm">
              Nenhum produto disponível
            </div>
            <p className="text-body-md text-neutral-gray">
              Produtos serão adicionados em breve
            </p>
          </div>
        ) : (
          <div className="grid-products w-full">
            {featuredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards] w-full"
                style={{ 
                  animationDelay: `${index * 100}ms`
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
