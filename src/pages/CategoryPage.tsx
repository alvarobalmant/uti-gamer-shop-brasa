
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/useProducts';
import ProductCard, { Product } from '@/components/ProductCard';

interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const [cart, setCart] = useState<CartItem[]>([]);

  const categoryName = category?.replace('-', ' ') || '';
  
  const filteredProducts = products.filter(product => {
    if (category === 'inicio') return true;
    
    const categoryLower = categoryName.toLowerCase();
    return product.platform?.toLowerCase().includes(categoryLower) ||
           product.category?.toLowerCase().includes(categoryLower) ||
           (category === 'ofertas' && product.price < 100) ||
           (category === 'novidades' && new Date(product.created_at || '').getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000);
  });

  const addToCart = (product: Product, size: string, color: string) => {
    const existingItem = cart.find(
      item => item.product.id === product.id && item.size === size && item.color === color
    );

    if (existingItem) {
      setCart(cart.map(item =>
        item === existingItem
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, size, color, quantity: 1 }]);
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform?.toLowerCase()) {
      case 'ps5':
      case 'ps4/ps5':
      case 'playstation':
        return 'bg-blue-600';
      case 'xbox series x':
      case 'xbox':
        return 'bg-red-600';
      case 'nintendo switch':
      case 'nintendo':
        return 'bg-red-500';
      case 'pc':
        return 'bg-orange-600';
      default:
        return 'bg-gray-600';
    }
  };

  const handleProductClick = (product: Product) => {
    console.log('Produto clicado:', product);
  };

  const getDisplayName = () => {
    switch (category) {
      case 'inicio': return 'Início';
      case 'playstation': return 'PlayStation';
      case 'nintendo': return 'Nintendo';
      case 'xbox': return 'Xbox';
      case 'pc': return 'PC';
      case 'colecionaveis': return 'Colecionáveis';
      case 'acessorios': return 'Acessórios';
      case 'jogos-fisicos': return 'Jogos Físicos';
      case 'jogos-digitais': return 'Jogos Digitais';
      case 'ofertas': return 'Ofertas';
      case 'novidades': return 'Novidades';
      default: return categoryName;
    }
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
              {getDisplayName()}
            </h2>
            <p className="text-gray-600">
              {loading ? 'Carregando...' : `${filteredProducts.length} produtos disponíveis`}
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
                Nenhum produto disponível
              </div>
              <p className="text-gray-500 mb-4">
                Produtos desta categoria serão adicionados em breve
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
                  onAddToCart={addToCart}
                  getPlatformColor={getPlatformColor}
                  onProductClick={handleProductClick}
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
