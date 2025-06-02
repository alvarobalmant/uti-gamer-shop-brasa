
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/hooks/useProducts';
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

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fixo */}
      <header className="bg-white shadow-lg sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center gap-3">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </Button>
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/a514a032-d79a-4bc4-a10e-3c9f0f9cde73.png" 
              alt="UTI DOS GAMES" 
              className="h-8 w-8"
            />
            <h1 className="text-lg font-bold text-gray-900">UTI DOS GAMES</h1>
          </div>
        </div>
      </header>

      {/* Produtos da categoria */}
      <section className="py-6">
        <div className="px-4">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {getCategoryTitle(category || '')}
            </h2>
            <p className="text-gray-600">
              {loading ? 'Carregando...' : `${filteredProducts.length} produtos encontrados`}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <div className="text-xl text-gray-500">Carregando produtos...</div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-2xl text-gray-400 mb-2">
                Nenhum produto encontrado
              </div>
              <p className="text-gray-500 mb-4">
                Tente navegar por outras categorias
              </p>
              <Button
                onClick={() => navigate('/')}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Ver Todos os Produtos
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
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
