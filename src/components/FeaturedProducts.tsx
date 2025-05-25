
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star, Eye, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FeaturedProducts = () => {
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const featuredProducts = products.slice(0, 8);

  const handleAddToCart = (product: any) => {
    addToCart(product);
    toast({
      title: "🛒 Produto adicionado!",
      description: `${product.name} foi adicionado ao seu carrinho`,
      duration: 3000,
    });
  };

  const getPlatformColor = (product: any) => {
    const tags = product.tags?.map((tag: any) => tag.name.toLowerCase()) || [];
    
    if (tags.some((tag: string) => tag.includes('playstation'))) {
      return 'bg-blue-600';
    }
    if (tags.some((tag: string) => tag.includes('xbox'))) {
      return 'bg-green-600';
    }
    if (tags.some((tag: string) => tag.includes('nintendo'))) {
      return 'bg-red-600';
    }
    if (tags.some((tag: string) => tag.includes('pc'))) {
      return 'bg-orange-600';
    }
    return 'bg-gray-600';
  };

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando produtos em destaque...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              🔥 Principais Ofertas
            </h2>
            <p className="text-lg text-gray-600 mb-4 md:mb-0">
              Economize muito em coisas que você adora
            </p>
          </div>
          <Button 
            onClick={() => navigate('/categoria/ofertas')}
            className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-medium"
          >
            Ver Todas as Ofertas
          </Button>
        </div>

        {/* Products Grid */}
        {featuredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-xl text-gray-600 mb-2">Nenhum produto disponível</h3>
            <p className="text-gray-500">Produtos serão adicionados em breve</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {featuredProducts.map((product) => {
              const originalPrice = product.price * 1.2;
              const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);
              const proPrice = product.price * 0.95;

              return (
                <div 
                  key={product.id} 
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => navigate(`/produto/${product.id}`)}
                >
                  {/* Badge */}
                  {discount > 0 && (
                    <div className="absolute top-2 left-2 z-10">
                      <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                        OFERTA ESPECIAL
                      </span>
                    </div>
                  )}

                  {/* Image */}
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop';
                      }}
                    />
                    
                    {/* Quick Actions Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/produto/${product.id}`);
                        }}
                        size="sm"
                        className="bg-white text-gray-900 hover:bg-gray-100 mr-2"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3">
                    {/* Platform Tag */}
                    {product.tags && product.tags.length > 0 && (
                      <div className="mb-2">
                        <span className={`text-xs text-white px-2 py-1 rounded font-medium ${getPlatformColor(product)}`}>
                          {product.tags[0].name}
                        </span>
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-1">(4.8)</span>
                    </div>

                    {/* Pricing */}
                    <div className="mb-3">
                      {/* Current Price */}
                      <div className="text-lg font-bold text-gray-900">
                        R$ {product.price.toFixed(2)}
                      </div>
                      
                      {/* Original Price */}
                      {discount > 0 && (
                        <div className="text-sm text-gray-500 line-through">
                          R$ {originalPrice.toFixed(2)}
                        </div>
                      )}
                      
                      {/* Pro Price */}
                      <div className="text-sm font-medium text-purple-600">
                        R$ {proPrice.toFixed(2)} para Membros Pro
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      size="sm"
                      className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-medium py-2"
                    >
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Banner */}
        <div className="mt-12">
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-6 md:p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl md:text-2xl font-bold mb-2">
                  💰 ECONOMIA RÁPIDA
                </h3>
                <p className="text-lg">
                  Preços Pequenos. Jogos Grandes.
                </p>
                <p className="text-sm opacity-90">
                  Marque enormes economias em centenas de jogos!
                </p>
              </div>
              
              <Button
                onClick={() => navigate('/categoria/ofertas')}
                className="bg-white text-red-600 hover:bg-gray-100 font-bold px-8 py-3 rounded-lg"
              >
                Comprar Agora
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
