
import React from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductModal from '@/components/ProductModal';
import PlatformProductCard from '@/components/Platform/PlatformProductCard';

const XboxPage6: React.FC = () => {
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
    <div className="min-h-screen bg-black">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative h-[90vh] flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'linear-gradient(45deg, #107C10, #0E6B0E, #0C5A0C)',
            }}
          />
          <div className="absolute inset-0 bg-black/30" />
          
          <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4">
            <div className="mb-8">
              <div className="inline-block bg-gradient-to-r from-green-400 to-green-600 text-black px-6 py-2 rounded-full text-sm font-bold mb-4">
                XBOX SERIES X|S
              </div>
              <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
                THE FASTEST,<br />
                MOST POWERFUL<br />
                <span className="text-green-400">XBOX EVER</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
                Jogue milhares de títulos de quatro gerações do Xbox. Tenha jogos que carregam mais rápido e parecem melhores.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-black px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition-colors">
                Comprar Xbox Series X
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-lg text-lg font-bold transition-colors">
                Comprar Xbox Series S
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-white">4K</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Gaming em 4K</h3>
                <p className="text-gray-400">
                  Experimente jogos com qualidade visual incrível em resolução 4K nativa.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">120</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">120 FPS</h3>
                <p className="text-gray-400">
                  Jogabilidade ultra-suave com até 120 quadros por segundo.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-xl font-bold text-white">SSD</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">SSD Personalizado</h3>
                <p className="text-gray-400">
                  Carregamento ultra-rápido e Quick Resume para múltiplos jogos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-white mb-6">
                Jogos <span className="text-green-400">Exclusivos</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Descubra os melhores jogos disponíveis para Xbox
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
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
        <section className="py-20 bg-gradient-to-r from-green-600 via-green-500 to-blue-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-5xl font-bold text-white mb-8">
              Xbox Game Pass Ultimate
            </h2>
            <p className="text-xl text-white/90 mb-12 max-w-4xl mx-auto">
              Jogue centenas de jogos de alta qualidade no console, PC, nuvem e dispositivos móveis. 
              Inclui Xbox Live Gold e EA Play.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-2xl font-bold text-white mb-4">Console</h3>
                <p className="text-white/80">Centenas de jogos no seu Xbox</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-2xl font-bold text-white mb-4">PC</h3>
                <p className="text-white/80">Jogue no Windows 10/11</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-2xl font-bold text-white mb-4">Nuvem</h3>
                <p className="text-white/80">Streaming em qualquer lugar</p>
              </div>
            </div>
            
            <button className="bg-white text-green-600 px-12 py-4 rounded-lg text-xl font-bold hover:bg-gray-100 transition-colors">
              Assinar Game Pass
            </button>
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

export default XboxPage6;
