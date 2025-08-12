import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useProductDetail } from '@/hooks/useProductDetail';
import { useAnalytics } from '@/contexts/AnalyticsContext';

import { saveScrollPosition, restoreScrollPosition } from '@/lib/scrollRestorationManager';
import ProfessionalHeader from '@/components/Header/ProfessionalHeader';
import { AuthModal } from '@/components/Auth/AuthModal';
import Cart from '@/components/Cart';
import ProductHero from '@/components/Product/ProductHero';
import ProductLayout from '@/components/Product/Layout/ProductLayout';
import ProductTabsEnhanced from '@/components/Product/ProductTabsEnhanced';
import RelatedProductsSection from '@/components/Product/RelatedProductsSection';
import ProductGuarantees from '@/components/Product/ProductGuarantees';
import ProductCTABottom from '@/components/Product/ProductCTABottom';

// Mobile Components
import ProductHeroMobile from '@/components/Product/Mobile/ProductHeroMobile';
import ProductTabsMobile from '@/components/Product/Mobile/ProductTabsMobile';
import RelatedProductsMobile from '@/components/Product/Mobile/RelatedProductsMobile';

// New Mercado Livre Style Mobile Components
import ProductPageMobileMercadoLivre from '@/components/Product/Mobile/ProductPageMobileMercadoLivre';
import ProductSEO from '@/components/Product/ProductSEO';
import PlatformSelector from '@/components/SKU/PlatformSelector';
import SKUBreadcrumb from '@/components/SKU/SKUBreadcrumb';
import SKUPriceComparison from '@/components/SKU/SKUPriceComparison';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { SKUNavigation } from '@/hooks/useProducts/types';

const ProductPageSKU = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  console.log('[ProductPageSKU] Iniciando com ID:', id);
  console.log('[ProductPageSKU] Location:', location.pathname);
  
  const { product, skuNavigation, loading, error } = useProductDetail(id);
  
  console.log('[ProductPageSKU] Debug dados:', {
    product: !!product,
    skuNavigation: !!skuNavigation,
    platforms: skuNavigation?.platforms?.length,
    loading,
    error
  });
  const { addToCart, items, updateQuantity, getCartTotal, getCartItemsCount } = useCart();
  const { toast } = useToast();
  const { trackProductView } = useAnalytics();
  
  const [showCart, setShowCart] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Implementar scroll restoration
  useEffect(() => {
    return () => {
      const currentPath = location.pathname;
      saveScrollPosition(currentPath, 'product-page-exit');
    };
  }, [location.pathname]);

  // Track product view when product loads
  useEffect(() => {
    if (product && id) {
      trackProductView(id, product.name, product.price);
    }
  }, [product, id, trackProductView]);



  const handleBack = async () => {
    console.log('[ProductPageSKU] Botão voltar clicado');
    // NÃO salvar a posição atual da página de produto - queremos manter a posição da página anterior
    // Usar navigate(-1) para voltar no histórico, que vai acionar o sistema de restauração
    navigate(-1);
  };

  const handleCartOpen = () => setShowCart(true);
  const handleAuthOpen = () => setShowAuthModal(true);

  const handleAddToCart = async (product: any) => {
    try {
      await addToCart(product);
      toast({
        title: "Produto adicionado!",
        description: `${product.name} foi adicionado ao seu carrinho.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao adicionar",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  };

  // Determinar se deve mostrar componentes de SKU
  const shouldShowSKUComponents = () => {
    if (!product) return false;
    return product.product_type === 'master' || product.product_type === 'sku';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <ProfessionalHeader 
          onCartOpen={handleCartOpen}
          onAuthOpen={handleAuthOpen}
        />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <ProfessionalHeader 
          onCartOpen={handleCartOpen}
          onAuthOpen={handleAuthOpen}
          showNavigation={false}
        />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Produto não encontrado</h1>
          <p className="text-gray-600 mb-6 text-center">
            O produto que você está procurando não existe ou foi removido.
          </p>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <ProductSEO product={product} />
      
      <ProfessionalHeader 
        onCartOpen={handleCartOpen}
        onAuthOpen={handleAuthOpen}
        showNavigation={false}
      />

      <main className="pt-20 md:pt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb com suporte a SKUs */}
          <div className="mb-4">
            {shouldShowSKUComponents() && skuNavigation ? (
              <SKUBreadcrumb skuNavigation={skuNavigation} />
            ) : (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="p-0 h-auto font-normal hover:text-red-600"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Voltar
                </Button>
              </div>
            )}
          </div>

           {/* Desktop Version - Novo Layout */}
          <div className="hidden md:block">
            <ProductLayout
              product={product}
              skuNavigation={skuNavigation}
              onAddToCart={handleAddToCart}
            />
          </div>

          {/* Mobile Version - Mercado Livre Style */}
          <div className="block md:hidden">
            <ProductPageMobileMercadoLivre 
              product={product}
              skuNavigation={skuNavigation}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>
      </main>

      {/* CTA Bottom - Desktop */}
      <div className="hidden md:block">
        <ProductCTABottom 
          product={product}
          onAddToCart={handleAddToCart}
        />
      </div>

      {/* Modais */}
      <Cart 
        showCart={showCart}
        setShowCart={setShowCart}
      />

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default ProductPageSKU;

