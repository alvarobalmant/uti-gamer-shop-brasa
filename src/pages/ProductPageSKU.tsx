import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useProductDetail } from '@/hooks/useProductDetail';
import useSKUs from '@/hooks/useSKUs';
import { saveScrollPosition, restoreScrollPosition } from '@/lib/scrollRestorationManager';
import ProfessionalHeader from '@/components/Header/ProfessionalHeader';
import { AuthModal } from '@/components/Auth/AuthModal';
import Cart from '@/components/Cart';
import ProductHero from '@/components/Product/ProductHero';
import ProductTabsEnhanced from '@/components/Product/ProductTabsEnhanced';
import RelatedProductsSection from '@/components/Product/RelatedProductsSection';
import ProductFAQ from '@/components/Product/ProductFAQ';
import ProductGuarantees from '@/components/Product/ProductGuarantees';
import ProductCTABottom from '@/components/Product/ProductCTABottom';
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
  
  const { product, loading, error } = useProductDetail(id);
  const { fetchSKUNavigation } = useSKUs();
  const { addToCart, items, updateQuantity, getCartTotal, getCartItemsCount } = useCart();
  const { toast } = useToast();
  
  console.log('[ProductPageSKU] Product:', product);
  console.log('[ProductPageSKU] Loading:', loading);
  console.log('[ProductPageSKU] Error:', error);
  
  const [viewingCount, setViewingCount] = useState(0);
  const [showCart, setShowCart] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [skuNavigation, setSKUNavigation] = useState<SKUNavigation | null>(null);
  const [skuLoading, setSKULoading] = useState(false);

  // Carregar navegação de SKUs quando o produto for carregado
  useEffect(() => {
    const loadSKUNavigation = async () => {
      if (!product?.id || !product?.product_type) {
        return;
      }
      
      // Só carregar se for um produto com SKUs
      if (product.product_type !== 'master' && product.product_type !== 'sku') {
        return;
      }
      
      setSKULoading(true);
      try {
        const navigation = await fetchSKUNavigation(product.id);
        setSKUNavigation(navigation);
      } catch (error) {
        console.error('Erro ao carregar navegação de SKUs:', error);
      } finally {
        setSKULoading(false);
      }
    };

    loadSKUNavigation();
  }, [product?.id, product?.product_type]); // Removido fetchSKUNavigation da dependência

  // Implementar scroll restoration
  useEffect(() => {
    return () => {
      const currentPath = location.pathname;
      saveScrollPosition(currentPath, 'product-page-exit');
    };
  }, [location.pathname]);

  useEffect(() => {
    // Simular contador de pessoas visualizando
    setViewingCount(Math.floor(Math.random() * 15) + 3);
    
    const interval = setInterval(() => {
      setViewingCount(prev => {
        const change = Math.floor(Math.random() * 3) - 1;
        return Math.max(1, Math.min(20, prev + change));
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleBack = () => {
    saveScrollPosition(location.pathname, 'product-back-button');
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

  if (loading || skuLoading) {
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
      />

      <main className="pt-4">
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

          {/* Hero do Produto */}
          <ProductHero 
            product={product}
            viewingCount={viewingCount}
            onAddToCart={handleAddToCart}
          />

          {/* Seletor de Plataforma (apenas para produtos com SKUs) */}
          {shouldShowSKUComponents() && skuNavigation && (
            <div className="mb-6">
              <PlatformSelector skuNavigation={skuNavigation} />
            </div>
          )}

          {/* Comparação de Preços (apenas para produtos com múltiplos SKUs) */}
          {shouldShowSKUComponents() && skuNavigation && skuNavigation.availableSKUs && skuNavigation.availableSKUs.length > 1 && (
            <div className="mb-6">
              <SKUPriceComparison skuNavigation={skuNavigation} />
            </div>
          )}

          {/* Abas do Produto */}
          <ProductTabsEnhanced product={product} />

          {/* Produtos Relacionados */}
          <RelatedProductsSection product={product} />

          {/* FAQ */}
          <ProductFAQ product={product} />

          {/* Garantias */}
          <ProductGuarantees />
        </div>
      </main>

      {/* CTA Bottom */}
      <ProductCTABottom 
        product={product}
        onAddToCart={handleAddToCart}
      />

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

