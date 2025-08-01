import React, { useState, useCallback, useMemo, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from '@/components/Auth/AuthModal';
import Cart from '@/components/Cart';
import ProfessionalHeader from '@/components/Header/ProfessionalHeader';
import { useCart } from '@/contexts/CartContext';
import ProductSkeleton from '@/components/ProductSkeleton';

import Footer from '@/components/Footer';
import { useIndexPage } from '@/hooks/useIndexPage';
import SectionRenderer from '@/components/HomePage/SectionRenderer';
import SpecialSectionRenderer from '@/components/SpecialSections/SpecialSectionRenderer';
import LoadingState from '@/components/HomePage/LoadingState';
import ErrorState from '@/components/HomePage/ErrorState';
import { FloatingActionButton } from '@/components/Retention/FloatingActionButton';
import { useScrollCoins } from '@/hooks/useScrollCoins';

// Lazy load AdminPanel para reduzir bundle inicial
const AdminPanel = lazy(() => import('./Admin'));

const Index = React.memo(() => {
  const navigate = useNavigate();
  const { user, isAdmin, signOut, loading: authLoading } = useAuth();
  const { items, addToCart, updateQuantity, getCartTotal, getCartItemsCount, sendToWhatsApp } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Show loading screen while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

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

  // Ativar sistema de ganho de moedas por scroll
  useScrollCoins();

  const handleAddToCart = useCallback((product: any, size?: string, color?: string) => {
    addToCart(product, size, color);
  }, [addToCart]);

  const findSpecialSection = useCallback((key: string) => {
    if (!key.startsWith('special_section_')) return null;
    const id = key.replace('special_section_', '');
    return specialSections.find(s => s.id === id);
  }, [specialSections]);

  const handleProductCardClick = useCallback(async (productId: string) => {
    // Salvar posição atual antes de navegar
    console.log('[Index] Salvando posição antes de navegar para produto:', productId);
    const currentScrollY = window.scrollY;
    console.log('[Index] Posição atual do scroll:', currentScrollY);
    
    // Salvar usando o manager diretamente para garantir que seja salvo
    const scrollManager = (await import('@/lib/scrollRestorationManager')).default;
    scrollManager.savePosition('/', 'product-navigation');
    
    // Encontrar o produto clicado para verificar se é SKU
    const clickedProduct = products.find(p => p.id === productId);
    
    if (clickedProduct) {
      // Se é um produto SKU, navegar para a página de produto SKU
      if (clickedProduct.product_type === 'sku' || clickedProduct.parent_product_id) {
        navigate(`/produto/${productId}`);
      }
      // Se é um produto mestre, navegar para o primeiro SKU disponível ou para a página do mestre
      else if (clickedProduct.product_type === 'master' || clickedProduct.is_master_product) {
        navigate(`/produto/${productId}`);
      }
      // Produto simples (padrão)
      else {
        navigate(`/produto/${productId}`);
      }
    } else {
      // Fallback para produtos não encontrados
      navigate(`/produto/${productId}`);
    }
  }, [navigate, products]);

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
                      section={specialSectionData as any} 
                      onProductCardClick={handleProductCardClick}
                      reduceTopSpacing={reduceSpacing}
                    />
                  );
                } else if (specialSectionsLoading) {
                  return (
                    <div key={sectionKey} className="py-8 bg-background">
                      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse relative overflow-hidden mb-6">
                          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"></div>
                        </div>
                        <div className="overflow-hidden">
                          <ProductSkeleton count={4} />
                        </div>
                      </div>
                    </div>
                  );
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

      {/* Floating Action Button */}
      <FloatingActionButton />

      <Cart
        showCart={showCart}
        setShowCart={setShowCart}
      />

      <AuthModal isOpen={showAuthModal} onClose={handleAuthClose} />
    </div>
  );
});

export default Index;
