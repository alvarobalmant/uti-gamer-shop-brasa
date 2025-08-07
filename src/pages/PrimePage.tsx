import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePrimePages, PrimePageWithLayout } from '@/hooks/usePrimePages';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import ProfessionalHeader from '@/components/Header/ProfessionalHeader';
import Footer from '@/components/Footer';
import Cart from '@/components/Cart';
import { AuthModal } from '@/components/Auth/AuthModal';
import PrimePageRenderer from '@/components/PrimePages/PrimePageRenderer';
import LoadingState from '@/components/HomePage/LoadingState';
import ErrorState from '@/components/HomePage/ErrorState';

const PrimePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, addToCart, updateQuantity, getCartTotal, getCartItemsCount, sendToWhatsApp } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState<PrimePageWithLayout | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  // Hook otimizado - apenas para buscar página
  const { fetchPageBySlug } = usePrimePages();

  // Estados dinâmicos para dados carregados conforme necessário
  const [products, setProducts] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [specialSections, setSpecialSections] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Função simplificada para carregar dados mínimos
  const loadMinimalData = async () => {
    if (!currentPage?.layout_items?.length) return;
    
    setDataLoading(true);
    try {
      // Carregar apenas dados essenciais diretamente do Supabase
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Carregar produtos se necessário
      const needsProducts = currentPage.layout_items.some(item => 
        item.section_type === 'products' || item.section_key.includes('product')
      );
      
      if (needsProducts) {
        const { data: productsData } = await supabase
          .from('products')
          .select('id, name, price, image_url, category, platform, is_active')
          .eq('is_active', true)
          .limit(20); // Limitar para performance
        
        setProducts(productsData || []);
      }
    } catch (error) {
      console.error('Error loading minimal data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  // Buscar página por slug - ultra otimizado com timeout
  useEffect(() => {
    const loadPage = async () => {
      if (!slug) {
        setPageError('Slug da página não fornecido');
        setPageLoading(false);
        return;
      }

      setPageLoading(true);
      setPageError(null);

      // Timeout para evitar carregamento infinito
      const timeoutId = setTimeout(() => {
        setPageError('Timeout: A página demorou muito para carregar');
        setPageLoading(false);
      }, 10000); // 10 segundos

      try {
        const page = await fetchPageBySlug(slug);
        clearTimeout(timeoutId);
        
        if (page) {
          setCurrentPage(page);
        } else {
          setPageError('Página não encontrada');
        }
      } catch (error) {
        clearTimeout(timeoutId);
        console.error('Error loading page:', error);
        setPageError('Erro ao carregar a página');
      } finally {
        setPageLoading(false);
      }
    };

    loadPage();
  }, [slug, fetchPageBySlug]);

  // Carregar dados após página carregar (separado para melhor UX)
  useEffect(() => {
    if (currentPage && !pageLoading) {
      // Timeout para dados também
      const timeoutId = setTimeout(() => {
        console.warn('Data loading timeout, stopping...');
        setDataLoading(false);
      }, 5000);

      loadMinimalData().finally(() => {
        clearTimeout(timeoutId);
      });

      return () => clearTimeout(timeoutId);
    }
  }, [currentPage, pageLoading]);

  // Handlers
  const handleAddToCart = (product: any, size?: string, color?: string) => {
    addToCart(product, size, color);
  };

  const handleCartToggle = () => {
    setShowCart(!showCart);
  };

  const handleAuthModalToggle = () => {
    setShowAuthModal(!showAuthModal);
  };

  // Loading state - otimizado
  const isLoading = pageLoading || dataLoading;

  // Error state
  if (pageError && !pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ProfessionalHeader
          user={user}
          cartItemsCount={getCartItemsCount()}
          onCartClick={handleCartToggle}
          onAuthClick={handleAuthModalToggle}
        />
        <div className="container mx-auto px-4 py-8">
          <ErrorState 
            title="Página não encontrada"
            message={pageError}
            onRetry={() => window.location.reload()}
            showRetry={false}
          />
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/')}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ProfessionalHeader
          user={user}
          cartItemsCount={getCartItemsCount()}
          onCartClick={handleCartToggle}
          onAuthClick={handleAuthModalToggle}
        />
        <LoadingState />
        <Footer />
      </div>
    );
  }

  // Página não encontrada
  if (!currentPage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ProfessionalHeader
          user={user}
          cartItemsCount={getCartItemsCount()}
          onCartClick={handleCartToggle}
          onAuthClick={handleAuthModalToggle}
        />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Página não encontrada</h1>
            <p className="text-gray-600 mb-6">A página que você está procurando não existe ou foi removida.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ProfessionalHeader
        user={user}
        cartItemsCount={getCartItemsCount()}
        onCartClick={handleCartToggle}
        onAuthClick={handleAuthModalToggle}
      />

      {/* Conteúdo principal */}
      <main className="min-h-screen">
        {currentPage.layout_items && currentPage.layout_items.length > 0 ? (
          currentPage.layout_items.map((layoutItem, index) => (
            <PrimePageRenderer
              key={`${layoutItem.section_key}-${index}`}
              layoutItem={layoutItem}
              products={products}
              sections={sections}
              specialSections={specialSections}
              productsLoading={dataLoading}
              sectionsLoading={dataLoading}
              onAddToCart={handleAddToCart}
              reduceTopSpacing={index > 0}
            />
          ))
        ) : (
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{currentPage.title}</h1>
            {currentPage.description && (
              <p className="text-gray-600 mb-8">{currentPage.description}</p>
            )}
            <p className="text-gray-500">Esta página ainda não possui conteúdo configurado.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modais */}
      {showCart && (
        <Cart
          items={items}
          onUpdateQuantity={updateQuantity}
          onClose={handleCartToggle}
          onSendToWhatsApp={sendToWhatsApp}
          total={getCartTotal()}
        />
      )}

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={handleAuthModalToggle}
        />
      )}
    </div>
  );
};

export default PrimePage;

