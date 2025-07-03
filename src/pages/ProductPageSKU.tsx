import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useProductDetail } from '@/hooks/useProductDetail';
import useSKUs from '@/hooks/useSKUs';
import { saveScrollPosition } from '@/lib/scrollRestorationManager';
import ProfessionalHeader from '@/components/Header/ProfessionalHeader';
import { AuthModal } from '@/components/Auth/AuthModal';
import Cart from '@/components/Cart';
import ProductCTABottom from '@/components/Product/ProductCTABottom';
import ProductSEO from '@/components/Product/ProductSEO';
import ProductPageSKULoading from '@/components/ProductPage/ProductPageSKU/ProductPageSKULoading';
import ProductPageSKUError from '@/components/ProductPage/ProductPageSKU/ProductPageSKUError';
import ProductPageSKUHeader from '@/components/ProductPage/ProductPageSKU/ProductPageSKUHeader';
import ProductPageSKUContent from '@/components/ProductPage/ProductPageSKU/ProductPageSKUContent';
import { SKUNavigation } from '@/hooks/useProducts/types';

const ProductPageSKU = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { product, loading, error } = useProductDetail(id);
  const { fetchSKUNavigation } = useSKUs();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const [viewingCount, setViewingCount] = useState(0);
  const [showCart, setShowCart] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [skuNavigation, setSKUNavigation] = useState<SKUNavigation | null>(null);
  const [skuLoading, setSKULoading] = useState(false);

  // Carregar navegação de SKUs quando o produto for carregado
  useEffect(() => {
    if (!product?.id || (product.product_type !== 'master' && product.product_type !== 'sku')) {
      return;
    }
    
    let isMounted = true;
    setSKULoading(true);
    
    fetchSKUNavigation(product.id)
      .then(navigation => {
        if (isMounted) {
          setSKUNavigation(navigation);
        }
      })
      .catch(() => {
        // Silenciar erro para não afetar performance
      })
      .finally(() => {
        if (isMounted) {
          setSKULoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [product?.id, product?.product_type, fetchSKUNavigation]);

  // Implementar scroll restoration
  useEffect(() => {
    return () => saveScrollPosition(location.pathname, 'product-page-exit');
  }, [location.pathname]);

  // Simular contador de visualizações - otimizado
  useEffect(() => {
    setViewingCount(Math.floor(Math.random() * 15) + 3);
    const interval = setInterval(() => {
      setViewingCount(prev => Math.max(1, Math.min(20, prev + (Math.floor(Math.random() * 3) - 1))));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Memoizar callbacks para evitar re-renders
  const handleBack = useCallback(() => {
    saveScrollPosition(location.pathname, 'product-back-button');
    navigate(-1);
  }, [location.pathname, navigate]);

  const handleCartOpen = useCallback(() => setShowCart(true), []);
  const handleAuthOpen = useCallback(() => setShowAuthModal(true), []);

  const handleAddToCart = useCallback(async (product: any) => {
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
  }, [addToCart, toast]);

  // Memoizar se deve mostrar componentes de SKU
  const shouldShowSKUComponents = useMemo(() => {
    if (!product) return false;
    return product.product_type === 'master' || product.product_type === 'sku';
  }, [product]);

  if (loading || skuLoading) {
    return <ProductPageSKULoading onCartOpen={handleCartOpen} onAuthOpen={handleAuthOpen} />;
  }

  if (error || !product) {
    return <ProductPageSKUError onCartOpen={handleCartOpen} onAuthOpen={handleAuthOpen} onBack={handleBack} />;
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
          <ProductPageSKUHeader 
            shouldShowSKUComponents={shouldShowSKUComponents}
            skuNavigation={skuNavigation}
            onBack={handleBack}
          />
          
          <ProductPageSKUContent 
            product={product}
            viewingCount={viewingCount}
            shouldShowSKUComponents={shouldShowSKUComponents}
            skuNavigation={skuNavigation}
            onAddToCart={handleAddToCart}
          />
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

