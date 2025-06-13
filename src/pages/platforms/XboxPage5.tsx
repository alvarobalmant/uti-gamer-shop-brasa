
import React from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductModal from '@/components/ProductModal';
import PlatformProductCard from '@/components/Platform/PlatformProductCard';

const XboxPage5: React.FC = () => {
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
  ).slice(0, 8);

  const handleProductCardClick = (productId: string) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  };

  const handleAddToCart = (product: any) => {
    addToCart(product);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <video 
            autoPlay 
            muted 
            loop 
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          >
            <source src="/xbox-hero-video.mp4" type="video/mp4" />
          </video>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          
          <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              XBOX
            </h1>
            <p className="text-2xl md:text-3xl mb-8 text-gray-300">
              Power Your Dreams
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105">
                Explorar Jogos
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-black px-10 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105">
                Xbox Game Pass
              </button>
            </div>
          </div>
        </section>

        {/* Product Showcase */}
        <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                Jogos em Destaque
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Descubra os títulos mais incríveis do universo Xbox
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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

export default XboxPage5;
