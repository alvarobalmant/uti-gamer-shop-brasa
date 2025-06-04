
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from '@/components/Auth/AuthModal';
import Cart from '@/components/Cart';
import ProfessionalHeader from '@/components/Header/ProfessionalHeader';
import { useCart } from '@/contexts/CartContext';
import Footer from '@/components/Footer';
import { useIndexPage } from '@/hooks/useIndexPage';
import HomePageContent from '@/components/HomePage/HomePageContent';

// Dynamic Homepage Layout based on database configuration
const Index = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { items, addToCart, updateQuantity, getCartTotal, getCartItemsCount, sendToWhatsApp } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Use the custom hook for page logic
  const {
    products,
    productsLoading,
    layoutItems,
    sections,
    bannerData,
    isLoading,
    showErrorState,
    sectionsLoading,
    handleRetryProducts
  } = useIndexPage();

  const handleAddToCart = (product: any, size?: string, color?: string) => {
    addToCart(product, size, color);
  };

  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden flex flex-col">
      {/* Header */}
      <ProfessionalHeader
        onCartOpen={() => setShowCart(true)}
        onAuthOpen={() => setShowAuthModal(true)}
      />

      <main className="flex-grow">
        <HomePageContent
          layoutItems={layoutItems}
          products={products}
          sections={sections}
          bannerData={bannerData}
          isLoading={isLoading}
          showErrorState={showErrorState}
          productsLoading={productsLoading}
          sectionsLoading={sectionsLoading}
          onAddToCart={handleAddToCart}
          onRetryProducts={handleRetryProducts}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Cart Component */}
      <Cart
        showCart={showCart}
        setShowCart={setShowCart}
      />

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default Index;
