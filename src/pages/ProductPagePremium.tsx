
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useProductDetail } from '@/hooks/useProductDetail';
import { saveScrollPosition, restoreScrollPosition } from '@/lib/scrollRestorationManager';
import ProductPageHeader from '@/components/ProductPage/ProductPageHeader';
import ProductHero from '@/components/Product/ProductHero';
import ProductTabsEnhanced from '@/components/Product/ProductTabsEnhanced';
import RelatedProductsSection from '@/components/Product/RelatedProductsSection';
import ProductFAQ from '@/components/Product/ProductFAQ';
import ProductGuarantees from '@/components/Product/ProductGuarantees';
import ProductCTABottom from '@/components/Product/ProductCTABottom';
import ProductSEO from '@/components/Product/ProductSEO';

const ProductPagePremium = () => {
  console.log('🔍 DIAGNÓSTICO: ProductPagePremium INICIALIZANDO');
  
  const { id } = useParams<{ id: string }>();
  console.log('🔍 DIAGNÓSTICO: ID capturado do useParams:', id);
  console.log('🔍 DIAGNÓSTICO: Tipo do ID:', typeof id);
  console.log('🔍 DIAGNÓSTICO: ID é válido?', !!id);
  
  const navigate = useNavigate();
  const location = useLocation();
  console.log('🔍 DIAGNÓSTICO: Location atual:', location.pathname);
  
  console.log('🔍 DIAGNÓSTICO: Chamando useProductDetail com ID:', id);
  const { product, loading, error } = useProductDetail(id);
  console.log('🔍 DIAGNÓSTICO: Resultado do useProductDetail:', {
    product: product?.name || 'null',
    loading,
    error
  });
  
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [viewingCount, setViewingCount] = useState(0);

  // Debug log para verificar se a página está carregando
  console.log('ProductPagePremium carregada - ID:', id, 'Product:', product?.name);

  // Implementar scroll restoration
  useEffect(() => {
    // Salvar posição da página anterior ao entrar na página de produto
    return () => {
      // Salvar posição atual antes de sair
      const currentPath = location.pathname;
      saveScrollPosition(currentPath, 'product-page-exit');
    };
  }, [location.pathname]);

  useEffect(() => {
    // Simular contador de pessoas visualizando (em produção viria do backend)
    setViewingCount(Math.floor(Math.random() * 15) + 3);
    
    // Atualizar contador periodicamente
    const interval = setInterval(() => {
      setViewingCount(prev => {
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, ou +1
        return Math.max(1, Math.min(20, prev + change));
      });
    }, 30000); // A cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  const handleBack = () => {
    // Salvar a posição atual antes de voltar
    saveScrollPosition(location.pathname, 'product-back-button');
    navigate(-1);
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ProductPageHeader onBackClick={handleBack} isLoading={true} />
        <div className="animate-pulse">
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Skeleton loading */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded-lg"></div>
                <div className="flex gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-16 h-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Produto não encontrado</h1>
          <p className="text-gray-600 mb-6">
            {error || 'O produto que você está procurando não existe ou foi removido.'}
          </p>
          <button
            onClick={handleBack}
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar à loja
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Component */}
      <ProductSEO product={product} />
      
      <ProductPageHeader 
        onBackClick={handleBack} 
        product={product}
      />
      
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <button onClick={() => navigate('/')} className="hover:text-red-600 transition-colors">
                Início
              </button>
            </li>
            <li>
              <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li>
              <span className="text-gray-700">Games</span>
            </li>
            <li>
              <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            {product.tags && product.tags.length > 0 && (
              <>
                <li>
                  <span className="text-gray-700">{product.tags[0].name}</span>
                </li>
                <li>
                  <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </li>
              </>
            )}
            <li>
              <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
            </li>
          </ol>
        </div>
      </nav>

      {/* Seção Principal do Produto */}
      <ProductHero 
        product={product} 
        viewingCount={viewingCount}
        onAddToCart={handleAddToCart}
      />

      {/* Abas de Informações */}
      <ProductTabsEnhanced product={product} />

      {/* Produtos Relacionados */}
      <RelatedProductsSection product={product} />

      {/* FAQ */}
      <ProductFAQ product={product} />

      {/* Garantias e Políticas */}
      <ProductGuarantees />

      {/* CTA Final */}
      <ProductCTABottom product={product} onAddToCart={handleAddToCart} />
    </div>
  );
};

export default ProductPagePremium;
