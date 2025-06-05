
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from '@/components/Auth/AuthModal';
import Cart from '@/components/Cart';
import ProfessionalHeader from '@/components/Header/ProfessionalHeader';
import { useCart } from '@/contexts/CartContext';
import Footer from '@/components/Footer';
import { useIndexPage } from '@/hooks/useIndexPage';
import SectionRenderer from '@/components/HomePage/SectionRenderer'; // Use the existing SectionRenderer
import SpecialSectionRenderer from '@/components/SpecialSections/SpecialSectionRenderer';
import LoadingState from '@/components/HomePage/LoadingState';
import ErrorState from '@/components/HomePage/ErrorState';

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
    sections, // Normal product sections data
    specialSections, // Special sections data
    bannerData,
    isLoading, // Combined loading state
    showErrorState,
    sectionsLoading, // Loading state for normal sections
    specialSectionsLoading, // Loading state for special sections
    handleRetryProducts
  } = useIndexPage();

  const handleAddToCart = (product: any, size?: string, color?: string) => {
    addToCart(product, size, color);
  };

  // Helper function to find special section data by ID
  const findSpecialSection = (key: string) => {
    if (!key.startsWith('special_section_')) return null;
    const id = key.replace('special_section_', '');
    return specialSections.find(s => s.id === id);
  };

  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden flex flex-col">
      {/* Header */}
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
          // Unified rendering loop based on layoutItems
          layoutItems
            .filter(item => item.is_visible) // Filter visible items
            // No need to sort here, layoutItems should already be sorted by useHomepageLayout
            .map(item => {
              const sectionKey = item.section_key;

              // Render Special Section if key matches
              if (sectionKey.startsWith('special_section_')) {
                const specialSectionData = findSpecialSection(sectionKey);
                if (specialSectionData && !specialSectionsLoading) {
                  // Pass necessary props, potentially including products if needed inside
                  return <SpecialSectionRenderer key={sectionKey} section={specialSectionData} />;
                } else if (specialSectionsLoading) {
                  // Optionally show a placeholder while special section data loads
                  return <div key={sectionKey} className="text-center py-10 text-gray-400">Carregando seção especial...</div>;
                } else {
                  console.warn(`Special section data not found for key: ${sectionKey}`);
                  return null; // Don't render if data not found
                }
              }
              
              // Render Normal Sections (including product sections) using existing SectionRenderer
              // SectionRenderer handles fixed sections and product sections based on key
              return (
                <SectionRenderer
                  key={sectionKey}
                  sectionKey={sectionKey}
                  bannerData={bannerData} // Pass banner data if needed by any section type
                  products={products}
                  sections={sections} // Pass normal product sections data
                  productsLoading={productsLoading}
                  sectionsLoading={sectionsLoading}
                  onAddToCart={handleAddToCart}
                />
              );
            })
            .filter(Boolean) // Remove null entries (e.g., sections without data)
        )}
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

