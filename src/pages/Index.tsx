import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from '@/components/Auth/AuthModal';
import Cart from '@/components/Cart';
import ProfessionalHeader from '@/components/Header/ProfessionalHeader';
import { useCart } from '@/contexts/CartContext';
import Footer from '@/components/Footer';
import { useIndexPage } from '@/hooks/useIndexPage';
import SectionRenderer from '@/components/HomePage/SectionRenderer';
import SpecialSectionRenderer from '@/components/SpecialSections/SpecialSectionRenderer';
import LoadingState from '@/components/HomePage/LoadingState';
import ErrorState from '@/components/HomePage/ErrorState';
import ProductModal from '@/components/ProductModal'; // Import ProductModal
import { Product } from '@/hooks/useProducts'; // Import Product type

const Index = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { items, addToCart, updateQuantity, getCartTotal, getCartItemsCount, sendToWhatsApp } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false); // State for product modal visibility
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // State for selected product

  const {
    products,
    productsLoading,
    layoutItems,
    sections,
    specialSections,
    bannerData,
    isLoading,
    showErrorState,
    sectionsLoading,
    specialSectionsLoading,
    handleRetryProducts
  } = useIndexPage();

  const handleAddToCart = (product: any, size?: string, color?: string) => {
    addToCart(product, size, color);
  };

  const findSpecialSection = (key: string) => {
    if (!key.startsWith('special_section_')) return null;
    const id = key.replace('special_section_', '');
    return specialSections.find(s => s.id === id);
  };

  // Function to handle product card click and open modal
  const handleProductCardClick = (productId: string) => {
    const productToDisplay = products.find(p => p.id === productId);
    if (productToDisplay) {
      setSelectedProduct(productToDisplay);
      setShowProductModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden flex flex-col">
      <ProfessionalHeader
        onCartOpen={() => setShowCart(true)}
        onAuthOpen={() => setShowAuthModal(true)}
      />

      <main className="flex-grow">
        {isLoading ? (
          <LoadingState />
        ) : showErrorState ? (
          <ErrorState onRetry={handleRetryProducts} />
        ) : (
          layoutItems
            .filter(item => item.is_visible)
            .map(item => {
              const sectionKey = item.section_key;

              if (sectionKey.startsWith('special_section_')) {
                const specialSectionData = findSpecialSection(sectionKey);
                if (specialSectionData && !specialSectionsLoading) {
                  return (
                    <SpecialSectionRenderer 
                      key={sectionKey} 
                      section={specialSectionData} 
                      onProductCardClick={handleProductCardClick} // Pass the handler
                    />
                  );
                } else if (specialSectionsLoading) {
                  return <div key={sectionKey} className="text-center py-10 text-gray-400">Carregando seção especial...</div>;
                } else {
                  console.warn(`Special section data not found for key: ${sectionKey}`);
                  return null;
                }
              }
              
              return (
                <SectionRenderer
                  key={sectionKey}
                  sectionKey={sectionKey}
                  bannerData={bannerData}
                  products={products}
                  sections={sections}
                  productsLoading={productsLoading}
                  sectionsLoading={sectionsLoading}
                  onAddToCart={handleAddToCart}
                />
              );
            })
            .filter(Boolean)
        )}
      </main>

      <Footer />

      <Cart
        showCart={showCart}
        setShowCart={setShowCart}
      />

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* Product Modal */}
      <ProductModal 
        isOpen={showProductModal} 
        onClose={() => setShowProductModal(false)}
        productId={selectedProduct?.id || null}
        products={products}
      />
    </div>
  );
};

export default Index;
