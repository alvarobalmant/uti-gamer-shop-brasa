import React, { useState, useCallback, useMemo, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
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

// Lazy load AdminPanel para reduzir bundle inicial
const AdminPanel = lazy(() => import('./Admin'));

const Index = React.memo(() => {
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();
  const { items, addToCart, updateQuantity, getCartTotal, getCartItemsCount, sendToWhatsApp } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

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

  const handleAddToCart = useCallback((product: any, size?: string, color?: string) => {
    addToCart(product, size, color);
  }, [addToCart]);

  const findSpecialSection = useCallback((key: string) => {
    if (!key.startsWith('special_section_')) return null;
    const id = key.replace('special_section_', '');
    return specialSections.find(s => s.id === id);
  }, [specialSections]);

  const handleProductCardClick = useCallback((productId: string) => {
    navigate(`/produto/${productId}`);
  }, [navigate]);

  const handleCartOpen = useCallback(() => setShowCart(true), []);
  const handleAuthOpen = useCallback(() => setShowAuthModal(true), []);
  const handleAuthClose = useCallback(() => setShowAuthModal(false), []);

  // Memoizar filtro de layout items visíveis
  const visibleLayoutItems = useMemo(() => 
    layoutItems.filter(item => item.is_visible), 
    [layoutItems]
  );

  // Função para verificar se uma seção especial tem fundo desabilitado
  const isSpecialSectionWithoutBackground = useCallback((sectionKey: string) => {
    if (!sectionKey.startsWith('special_section_')) return false;
    const specialSectionData = findSpecialSection(sectionKey);
    if (!specialSectionData) return false;
    
    const config = specialSectionData.content_config as any;
    const layoutSettings = config?.layout_settings || { show_background: true };
    
    return !layoutSettings.show_background;
  }, [findSpecialSection]);

  // Função para determinar se deve aplicar espaçamento reduzido
  const shouldReduceSpacing = useCallback((currentIndex: number, items: typeof visibleLayoutItems) => {
    if (currentIndex === 0) return false; // Primeira seção nunca reduz espaçamento superior
    
    const currentItem = items[currentIndex];
    const previousItem = items[currentIndex - 1];
    
    if (!currentItem || !previousItem) return false;
    
    const currentIsSpecialWithoutBg = isSpecialSectionWithoutBackground(currentItem.section_key);
    const previousIsSpecialWithoutBg = isSpecialSectionWithoutBackground(previousItem.section_key);
    
    // Aplicar espaçamento reduzido quando:
    // 1. Seção atual é normal E anterior é seção especial sem fundo
    // 2. Seção atual é seção especial sem fundo E anterior é seção especial sem fundo
    // 3. Seção atual é seção especial sem fundo E anterior é seção normal
    
    if (!currentIsSpecialWithoutBg && previousIsSpecialWithoutBg) {
      // Seção normal após seção especial sem fundo
      return true;
    }
    
    if (currentIsSpecialWithoutBg && previousIsSpecialWithoutBg) {
      // Seção especial sem fundo após outra seção especial sem fundo
      return true;
    }
    
    if (currentIsSpecialWithoutBg && !previousIsSpecialWithoutBg) {
      // Seção especial sem fundo após seção normal
      return true;
    }
    
    return false;
  }, [isSpecialSectionWithoutBackground]);

  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden flex flex-col">
      <ProfessionalHeader
        onCartOpen={handleCartOpen}
        onAuthOpen={handleAuthOpen}
      />

      <main className="flex-grow">
        {isLoading ? (
          <LoadingState />
        ) : showErrorState ? (
          <ErrorState onRetry={handleRetryProducts} />
        ) : (
          visibleLayoutItems
            .map((item, index) => {
              const sectionKey = item.section_key;
              const reduceSpacing = shouldReduceSpacing(index, visibleLayoutItems);

              if (sectionKey.startsWith('special_section_')) {
                const specialSectionData = findSpecialSection(sectionKey);
                if (specialSectionData && !specialSectionsLoading) {
                  return (
                    <SpecialSectionRenderer 
                      key={sectionKey} 
                      section={specialSectionData} 
                      onProductCardClick={handleProductCardClick}
                      reduceTopSpacing={reduceSpacing}
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
                  reduceTopSpacing={reduceSpacing}
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

      <AuthModal isOpen={showAuthModal} onClose={handleAuthClose} />
    </div>
  );
});

export default Index;
