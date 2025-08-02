
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

// Hooks otimizados - usando hooks existentes como fallback
import { useOptimizedHomepageLayout } from '@/hooks/useOptimizedHomepageLayout';
import { useProducts } from '@/hooks/useProducts';

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
  const { user, loading: authLoading } = useAuth();
  const { items: cartItems, cart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Fallback para useScrollCoins se não existir
  let coins = 0;
  try {
    const scrollCoinsResult = useScrollCoins();
    coins = scrollCoinsResult?.coins || 0;
  } catch (error) {
    console.log('useScrollCoins não encontrado, usando valor padrão');
  }

  // Usar layout otimizado com fallback
  let layoutItems: any[] = [];
  let layoutLoading = false;
  let layoutError: any = null;
  let isOptimized = false;

  try {
    const layoutResult = useOptimizedHomepageLayout();
    layoutItems = layoutResult.layoutItems || [];
    layoutLoading = layoutResult.isLoading || false;
    layoutError = layoutResult.error || null;
    isOptimized = layoutResult.isOptimized || false;
  } catch (error) {
    console.log('Layout otimizado não encontrado, usando componentes padrão');
    layoutLoading = false;
  }

  // Usar produtos como fallback
  const { data: products, isLoading: productsLoading, error: productsError } = useProducts();

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
          onAuthClick={() => openAuthModal('login')}
          cartItemsCount={(cartItems || cart || []).length}
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
      <PageErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          <div className="p-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Erro no layout</h1>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Recarregar página
            </button>
          </div>
        </div>
      </PageErrorBoundary>
    );
  }

  return (
    <PageErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <ProfessionalHeader 
          onAuthClick={() => openAuthModal('login')}
          cartItemsCount={(cartItems || cart || []).length}
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
