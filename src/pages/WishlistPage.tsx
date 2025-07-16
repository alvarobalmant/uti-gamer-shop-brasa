import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';

const WishlistPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirecionar se não estiver logado
  React.useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  // Produtos favoritos estáticos para demonstração
  const favoriteProducts = [
    {
      id: '1',
      name: 'Assassin\'s Creed Shadows - PlayStation 5',
      price: 299.99,
      promotional_price: 249.99,
      uti_pro_price: 224.99,
      image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&h=300&fit=crop',
      slug: 'assassins-creed-shadows-ps5'
    },
    {
      id: '2',
      name: 'Resident Evil 4 Remake - PlayStation 5',
      price: 199.99,
      promotional_price: 149.99,
      uti_pro_price: 134.99,
      image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=300&h=300&fit=crop',
      slug: 'resident-evil-4-remake-ps5'
    },
    {
      id: '3',
      name: 'Spider-Man 2 - PlayStation 5',
      price: 349.99,
      promotional_price: 299.99,
      uti_pro_price: 269.99,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
      slug: 'spider-man-2-ps5'
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Heart className="h-8 w-8 text-red-500" />
            Lista de Desejos
          </h1>
          <p className="text-gray-600">
            {favoriteProducts.length} {favoriteProducts.length === 1 ? 'produto' : 'produtos'} na sua lista
          </p>
        </div>

        {/* Lista de Produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                
                <div className="space-y-1 mb-4">
                  {product.promotional_price && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-lg font-bold text-red-600">
                        {formatPrice(product.promotional_price)}
                      </span>
                    </div>
                  )}
                  
                  {product.uti_pro_price && (
                    <div className="text-sm text-blue-600 font-medium">
                      UTI PRO: {formatPrice(product.uti_pro_price)}
                    </div>
                  )}
                  
                  {!product.promotional_price && (
                    <div className="text-lg font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Adicionar ao Carrinho
                  </Button>
                  
                  <Link to={`/produto/${product.slug}`}>
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;

