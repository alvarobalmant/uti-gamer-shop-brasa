
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProducts, Product } from '@/hooks/useProducts'; // Updated import
import ProductCard from '@/components/ProductCard';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/contexts/CartContext';
import { searchProducts } from '@/utils/fuzzySearch';
import ProductModal from '@/components/ProductModal';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const { products, loading } = useProducts();
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  // State for managing the product modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Usar busca fuzzy para filtrar produtos
  const filteredProducts = searchProducts(products, query);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
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

      {/* Resultados da busca */}
      <section className="py-6">
        <div className="px-4">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Resultados para "{query}"
            </h2>
            <p className="text-gray-600">
              {loading ? 'Buscando...' : `${filteredProducts.length} produtos encontrados`}
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
                Tente buscar por outro termo ou verifique a ortografia
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
                  onCardClick={handleProductClick}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Product Modal */}
      <ProductModal
        product={products.find(p => p.id === selectedProductId) || null}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
};

export default SearchResults;
