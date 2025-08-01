import React, { useState, useCallback, useMemo, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from '@/components/Auth/AuthModal';
import Cart from '@/components/Cart';
import ProfessionalHeader from '@/components/Header/ProfessionalHeader';
import { useCart } from '@/contexts/CartContext';
import Footer from '@/components/Footer';
import { FloatingActionButton } from '@/components/Retention/FloatingActionButton';
import { useScrollCoins } from '@/hooks/useScrollCoins';

// Hooks otimizados
import { useOptimizedHomepageLayout } from '@/hooks/useOptimizedHomepageLayout';
import { useOptimizedProducts } from '@/hooks/useOptimizedProducts';

// Componentes otimizados
import { HomepageSkeleton } from '@/components/skeletons/AdvancedSkeletons';
import { PageErrorBoundary } from '@/components/ErrorBoundaries/AdvancedErrorBoundary';

// Componentes existentes
import SectionRenderer from '@/components/HomePage/SectionRenderer';
import SpecialSectionRenderer from '@/components/SpecialSections/SpecialSectionRenderer';

// Lazy load AdminPanel para reduzir bundle inicial
const AdminPanel = lazy(() => import('./Admin'));

const IndexOptimized = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { cartItems, isCartOpen, setIsCartOpen } = useCart();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { coins } = useScrollCoins();

  // Usar layout otimizado com view unificada
  const { 
    layoutItems, 
    isLoading: layoutLoading, 
    error: layoutError,
    isOptimized 
  } = useOptimizedHomepageLayout();

  // Usar produtos otimizados
  const { 
    data: products, 
    isLoading: productsLoading, 
    error: productsError 
  } = useOptimizedProducts();

  // Handlers
  const handleAuthSuccess = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const openAuthModal = useCallback((mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  }, []);

  // Verificar se é admin
  const isAdmin = useMemo(() => {
    return user?.email === 'admin@utigames.com.br';
  }, [user?.email]);

  // Loading state otimizado
  if (authLoading || layoutLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <ProfessionalHeader 
          onAuthClick={openAuthModal}
          cartItemsCount={cartItems.length}
          onCartClick={() => setIsCartOpen(true)}
          coins={coins}
        />
        <HomepageSkeleton />
        <Footer />
      </div>
    );
  }

  // Error state otimizado
  if (layoutError) {
    return (
      <PageErrorBoundary 
        error={layoutError}
        resetError={() => window.location.reload()}
        context="homepage_layout"
      />
    );
  }

  return (
    <PageErrorBoundary context="homepage">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <ProfessionalHeader 
          onAuthClick={openAuthModal}
          cartItemsCount={cartItems.length}
          onCartClick={() => setIsCartOpen(true)}
          coins={coins}
        />

        {/* Indicador de otimização (apenas em dev) */}
        {process.env.NODE_ENV === 'development' && isOptimized && (
          <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-3 py-1 rounded text-xs">
            🚀 Otimizado (View Unificada)
          </div>
        )}

        <main className="relative">
          {/* Renderizar seções do layout otimizado */}
          {layoutItems.map((layoutItem) => {
            // Seções fixas (hero, banners, etc.)
            if (!layoutItem.section_key.startsWith('product_section_') && 
                !layoutItem.section_key.startsWith('special_section_')) {
              return (
                <SectionRenderer
                  key={layoutItem.id}
                  sectionKey={layoutItem.section_key}
                  displayOrder={layoutItem.display_order}
                  isVisible={layoutItem.is_visible}
                />
              );
            }

            // Seções de produtos
            if (layoutItem.section_key.startsWith('product_section_') && layoutItem.section_data) {
              return (
                <SectionRenderer
                  key={layoutItem.id}
                  sectionKey={layoutItem.section_key}
                  displayOrder={layoutItem.display_order}
                  isVisible={layoutItem.is_visible}
                  sectionData={layoutItem.section_data}
                />
              );
            }

            // Seções especiais
            if (layoutItem.section_key.startsWith('special_section_') && layoutItem.section_data) {
              return (
                <SpecialSectionRenderer
                  key={layoutItem.id}
                  sectionId={layoutItem.section_data.id}
                  sectionData={layoutItem.section_data}
                  displayOrder={layoutItem.display_order}
                />
              );
            }

            return null;
          })}
        </main>

        {/* Admin Panel (lazy loaded) */}
        {isAdmin && (
          <Suspense fallback={<div className="fixed bottom-4 right-4 p-4 bg-gray-800 rounded">Carregando Admin...</div>}>
            <AdminPanel />
          </Suspense>
        )}

        {/* Floating Action Button */}
        <FloatingActionButton />

        {/* Footer */}
        <Footer />

        {/* Modais */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          mode={authMode}
          onSuccess={handleAuthSuccess}
        />

        <Cart 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
        />
      </div>
    </PageErrorBoundary>
  );
};

export default IndexOptimized;

