
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/useProducts';
import ProductCard, { Product } from '@/components/ProductCard';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/contexts/CartContext';

const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const getCategoryTitle = (cat: string) => {
    const categoryMap: { [key: string]: string } = {
      'inicio': 'Início',
      'playstation': 'PlayStation',
      'nintendo': 'Nintendo',
      'xbox': 'Xbox',
      'pc': 'PC',
      'colecionaveis': 'Colecionáveis',
      'acessorios': 'Acessórios',
      'jogos-fisicos': 'Jogos Físicos',
      'jogos-digitais': 'Jogos Digitais',
      'ofertas': 'Ofertas',
      'novidades': 'Novidades'
    };
    return categoryMap[cat] || cat;
  };

  const filteredProducts = products.filter(product => {
    if (category === 'inicio') return true;
    
    const categoryLower = category?.toLowerCase() || '';
    
    // Verificar se alguma das tags do produto contém a categoria
    return product.tags?.some(tag => 
      tag.name.toLowerCase().includes(categoryLower) ||
      categoryLower.includes(tag.name.toLowerCase())
    );
  });

  const getPlatformColor = (product: Product) => {
    // Verificar tags para determinar a cor
    const tags = product.tags?.map(tag => tag.name.toLowerCase()) || [];
    
    if (tags.some(tag => tag.includes('playstation'))) {
      return 'bg-blue-600';
    }
    if (tags.some(tag => tag.includes('xbox'))) {
      return 'bg-green-600';
    }
    if (tags.some(tag => tag.includes('nintendo'))) {
      return 'bg-red-500';
    }
    if (tags.some(tag => tag.includes('pc'))) {
      return 'bg-orange-600';
    }
    return 'bg-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full max-w-full overflow-x-hidden">
      {/* Header fixo */}
      <header className="bg-white shadow-lg sticky top-0 z-40 w-full max-w-full">
        <div className="px-3 sm:px-4 py-3 flex items-center gap-2 sm:gap-3 w-full max-w-full overflow-x-hidden">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 sm:gap-2 flex-shrink-0 min-w-[44px] min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Voltar</span>
          </Button>
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <img 
              src="/lovable-uploads/a514a032-d79a-4bc4-a10e-3c9f0f9cde73.png" 
              alt="UTI DOS GAMES" 
              className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0"
            />
            <h1 className="text-sm sm:text-lg font-bold text-gray-900 truncate">UTI DOS GAMES</h1>
          </div>
        </div>
      </header>

      {/* Produtos da categoria */}
      <section className="py-4 sm:py-6 w-full max-w-full overflow-x-hidden">
        <div className="px-3 sm:px-4 w-full max-w-full">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 truncate">
              {getCategoryTitle(category || '')}
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              {loading ? 'Carregando...' : `${filteredProducts.length} produtos encontrados`}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin w-10 h-10 sm:w-12 sm:h-12 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <div className="text-lg sm:text-xl text-gray-500">Carregando produtos...</div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="text-xl sm:text-2xl text-gray-400 mb-2">
                Nenhum produto encontrado
              </div>
              <p className="text-sm sm:text-base text-gray-500 mb-4 max-w-md mx-auto">
                Tente navegar por outras categorias
              </p>
              <Button
                onClick={() => navigate('/')}
                className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
              >
                Ver Todos os Produtos
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-full">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={(product, size, color) => addToCart(product, size, color)}
                  getPlatformColor={() => getPlatformColor(product)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;
