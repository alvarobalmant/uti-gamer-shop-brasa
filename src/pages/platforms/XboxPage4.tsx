
import React from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductModal from '@/components/ProductModal';
import PlatformProductCard from '@/components/Platform/PlatformProductCard';

const XboxPage4: React.FC = () => {
  const { products } = useProducts();
  const { addToCart } = useCart();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedProductId, setSelectedProductId] = React.useState<string | null>(null);

  // Filter products for Xbox
  const xboxProducts = products.filter(product => 
    product.platform?.toLowerCase().includes('xbox') ||
    product.category?.toLowerCase().includes('xbox') ||
    product.name.toLowerCase().includes('xbox')
  );

  // Featured and sale products
  const featuredProducts = xboxProducts.filter(product => 
    product.is_featured || product.list_price
  ).slice(0, 6);

  const handleProductCardClick = (productId: string) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  };

  const handleAddToCart = (product: any) => {
    addToCart(product);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-black to-green-800">
      <Header />
      
      <main className="relative">
        {/* Hero Banner */}
        <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(/lovable-uploads/xbox-hero-bg.jpg)',
            }}
          />
          <div className="absolute inset-0 bg-black/50" />
          
          <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Xbox Gaming
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Descubra o universo Xbox com os melhores jogos e acessórios
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
                Ver Jogos
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
                Acessórios
              </button>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Produtos em Destaque
              </h2>
              <p className="text-xl text-gray-300">
                Os melhores jogos e acessórios Xbox
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map(product => (
                <PlatformProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onProductClick={handleProductCardClick}
                  variant="featured"
                />
              ))}
            </div>
          </div>
        </section>

        {/* Game Pass Section */}
        <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Xbox Game Pass
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Acesse centenas de jogos de alta qualidade no console, PC e dispositivos móveis
            </p>
            <button className="bg-white text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
              Saiba Mais
            </button>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-16 bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              Categorias Xbox
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Jogos Xbox Series X|S', image: '/lovable-uploads/xbox-series-games.jpg' },
                { title: 'Controles', image: '/lovable-uploads/xbox-controllers.jpg' },
                { title: 'Acessórios', image: '/lovable-uploads/xbox-accessories.jpg' },
                { title: 'Game Pass', image: '/lovable-uploads/xbox-gamepass.jpg' }
              ].map((category, index) => (
                <div key={index} className="relative group cursor-pointer overflow-hidden rounded-lg">
                  <div className="aspect-w-1 aspect-h-1 bg-gray-700">
                    <img
                      src={category.image}
                      alt={category.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-lg font-semibold">
                      {category.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Product Modal */}
      <ProductModal
        product={products.find(p => p.id === selectedProductId) || null}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
};

export default XboxPage4;
