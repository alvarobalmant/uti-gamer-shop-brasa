import React, { Suspense, useEffect } from 'react';
import { useOptimizedProducts } from '@/hooks/useOptimizedProducts';
import { useHomepageLayout } from '@/hooks/useHomepageLayout';
import { useSectionPrefetch } from '@/hooks/useAdvancedPrefetch';
import { SectionErrorBoundary, SectionErrorFallback } from '@/components/ErrorBoundaries/AdvancedErrorBoundary';
import { HomepageSkeleton, ProductSectionSkeleton } from '@/components/skeletons/AdvancedSkeletons';
import { OptimizedProductCard } from './OptimizedProductCard';
import { useLazyLoading } from '@/hooks/useAdvancedPrefetch';

// Componente de seção de produtos otimizada
const OptimizedProductSection: React.FC<{
  title: string;
  products: any[];
  sectionId?: string;
  columns?: number;
  showViewAll?: boolean;
}> = ({ title, products, sectionId, columns = 5, showViewAll = true }) => {
  const { elementRef, hasIntersected } = useLazyLoading(() => {
    console.log(`📍 Seção "${title}" entrou na viewport`);
  });

  return (
    <section ref={elementRef} className="py-8">
      <SectionErrorBoundary
        fallback={SectionErrorFallback}
        maxRetries={2}
      >
        <div className="container mx-auto px-4">
          {/* Header da seção */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">{title}</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full" />
          </div>

          {/* Grid de produtos */}
          {hasIntersected ? (
            <Suspense fallback={<ProductSectionSkeleton productCount={columns} />}>
              <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-${columns} gap-4 mb-6`}>
                {products.slice(0, columns).map((product) => (
                  <OptimizedProductCard
                    key={product.id}
                    product={product}
                    showQuickActions={true}
                    showBadge={true}
                    showProPrice={true}
                  />
                ))}
              </div>
            </Suspense>
          ) : (
            <ProductSectionSkeleton productCount={columns} />
          )}

          {/* Botão Ver Todos */}
          {showViewAll && products.length > columns && (
            <div className="text-center">
              <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                Ver Todos ({products.length})
              </button>
            </div>
          )}
        </div>
      </SectionErrorBoundary>
    </section>
  );
};

// Componente de banner hero otimizado
const OptimizedHeroBanner: React.FC = () => {
  const { elementRef, hasIntersected } = useLazyLoading(() => {
    console.log('🎯 Hero banner carregado');
  });

  return (
    <section ref={elementRef} className="relative h-96 bg-gradient-to-r from-blue-600 to-purple-700 overflow-hidden">
      {hasIntersected ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white space-y-4 animate-fade-in">
            <h1 className="text-5xl font-bold">UTI dos Games</h1>
            <p className="text-xl opacity-90">Sua loja de games favorita</p>
            <button className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              Explorar Produtos
            </button>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-[length:200%_100%]" />
      )}
    </section>
  );
};

// Componente de links rápidos otimizado
const OptimizedQuickLinks: React.FC = () => {
  const categories = [
    { name: 'PlayStation', icon: '🎮', color: 'from-blue-500 to-blue-600' },
    { name: 'Xbox', icon: '🎯', color: 'from-green-500 to-green-600' },
    { name: 'Nintendo', icon: '🍄', color: 'from-red-500 to-red-600' },
    { name: 'PC Gaming', icon: '💻', color: 'from-purple-500 to-purple-600' },
    { name: 'Acessórios', icon: '🎧', color: 'from-orange-500 to-orange-600' },
    { name: 'Ofertas', icon: '🏷️', color: 'from-pink-500 to-pink-600' },
  ];

  const { elementRef, hasIntersected } = useLazyLoading(() => {
    console.log('🔗 Quick links carregados');
  });

  return (
    <section ref={elementRef} className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        {hasIntersected ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <div
                key={category.name}
                className="text-center group cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {category.icon}
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto rounded-full animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]" />
                <div className="h-3 w-full animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// Homepage principal otimizada
export const OptimizedHomepage: React.FC = () => {
  const { data: products = [], isLoading: productsLoading } = useOptimizedProducts();
  const { layoutItems, loading: layoutLoading } = useHomepageLayout();
  const { prefetchLayout, prefetchSection } = useSectionPrefetch();

  // Prefetch de dados críticos
  useEffect(() => {
    // Prefetch do layout após componente montar
    const timer = setTimeout(() => {
      prefetchLayout();
    }, 1000);

    return () => clearTimeout(timer);
  }, [prefetchLayout]);

  // Produtos por categoria (otimizado com useMemo implícito)
  const featuredProducts = products.filter(p => p.is_featured).slice(0, 5);
  const playstationProducts = products.filter(p => p.category?.toLowerCase().includes('playstation')).slice(0, 4);
  const xboxProducts = products.filter(p => p.category?.toLowerCase().includes('xbox')).slice(0, 4);
  const newProducts = products.slice(0, 6); // Assumindo que os mais recentes vêm primeiro

  // Loading state
  if (productsLoading || layoutLoading) {
    return <HomepageSkeleton />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <OptimizedHeroBanner />

      {/* Quick Links */}
      <OptimizedQuickLinks />

      {/* Seções de Produtos */}
      <div className="space-y-12">
        {/* Lançamentos Exclusivos */}
        <OptimizedProductSection
          title="Lançamentos Exclusivos"
          products={featuredProducts}
          columns={5}
          sectionId="featured"
        />

        {/* PlayStation */}
        <OptimizedProductSection
          title="PlayStation"
          products={playstationProducts}
          columns={4}
          sectionId="playstation"
        />

        {/* Xbox */}
        <OptimizedProductSection
          title="Xbox"
          products={xboxProducts}
          columns={4}
          sectionId="xbox"
        />

        {/* Novidades */}
        <OptimizedProductSection
          title="Novidades"
          products={newProducts}
          columns={6}
          sectionId="new"
        />
      </div>

      {/* Banner Promocional */}
      <section className="py-12 bg-gradient-to-r from-orange-500 to-red-600">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">UTI PRO</h2>
          <p className="text-xl mb-6 opacity-90">
            Descontos exclusivos e frete grátis para membros
          </p>
          <button className="px-8 py-3 bg-white text-orange-600 rounded-full font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            Saiba Mais
          </button>
        </div>
      </section>

      {/* Footer placeholder */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">UTI dos Games</h3>
          <p className="text-gray-400">
            A loja de games mais tradicional de Colatina
          </p>
        </div>
      </footer>
    </div>
  );
};

