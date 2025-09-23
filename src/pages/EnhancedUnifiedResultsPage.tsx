/**
 * EnhancedUnifiedResultsPage - Página Unificada com Cache Inteligente
 * 
 * Substitui UnifiedResultsPage com melhorias:
 * - Cache persistente para busca e seções
 * - Renderização progressiva
 * - Loading instantâneo na maioria dos casos
 * - Fallback inteligente offline
 */

import React, { useState, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useEnhancedProducts } from '@/hooks/useEnhancedProducts';
import { useProductSections } from '@/hooks/useProductSections';
import { useSpecialSections } from '@/hooks/useSpecialSections';
import { useWeightedSearch } from '@/hooks/useWeightedSearch';
import { useScrollToTopForDynamicPages } from '@/hooks/useScrollToTop';
import ProfessionalHeader from '@/components/Header/ProfessionalHeader';
import ProgressiveProductGrid from '@/components/ProgressiveProductGrid';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from '@/components/Auth/AuthModal';
import Cart from '@/components/Cart';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import SearchDebugPanel from '@/components/Debug/SearchDebugPanel';

type PageMode = 'search' | 'section';

const EnhancedUnifiedResultsPage: React.FC<{ mode: PageMode }> = ({ mode }) => {
  const { sectionKey } = useParams<{ sectionKey: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get('q') || '';
  
  // Hook para garantir scroll no topo
  useScrollToTopForDynamicPages();
  
  const { user } = useAuth();
  const { items, addToCart, updateQuantity, getCartTotal, getCartItemsCount, sendToWhatsApp } = useCart();
  
  // Estados da UI
  const [showCart, setShowCart] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'price_asc' | 'price_desc' | 'name'>('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showCardDebug, setShowCardDebug] = useState(false);

  // Verificar se é admin para debug
  const isAdmin = user?.email === 'admin@utidosgames.com';
  const showDebug = isAdmin && process.env.NODE_ENV === 'development';

  // Hooks para buscar dados - USANDO CACHE INTELIGENTE
  const { 
    products, 
    loading: productsLoading, 
    fromCache: productsFromCache,
    cacheStats 
  } = useEnhancedProducts();
  
  const { sections, loading: sectionsLoading } = useProductSections();
  const { specialSections, loading: specialSectionsLoading } = useSpecialSections();
  
  // Hook para busca com pesos (apenas usado no modo search)
  const { 
    exactMatches: backendMatches, 
    relatedProducts: backendRelated, 
    tagSuggestions, 
    isLoading: searchLoading, 
    debug 
  } = useWeightedSearch(
    mode === 'search' ? searchQuery : '', 
    mode === 'search'
  );

  // Encontrar a seção atual (apenas no modo section)
  const { currentSection, isSpecialSection } = useMemo(() => {
    if (mode !== 'section' || !sectionKey) return { currentSection: null, isSpecialSection: false };
    
    // Verificar se é seção especial
    if (sectionKey.startsWith('special_section_')) {
      const sectionId = sectionKey.replace('special_section_', '');
      const specialSection = specialSections?.find(section => section.id === sectionId);
      return { currentSection: specialSection, isSpecialSection: true };
    }
    
    // Verificar se é seção de produto normal
    if (sectionKey.startsWith('product_section_')) {
      const sectionId = sectionKey.replace('product_section_', '');
      const productSection = sections?.find(section => section.id === sectionId);
      return { currentSection: productSection, isSpecialSection: false };
    }
    
    // Buscar por ID diretamente (compatibilidade)
    const productSection = sections?.find(section => section.id === sectionKey);
    if (productSection) {
      return { currentSection: productSection, isSpecialSection: false };
    }
    
    const specialSection = specialSections?.find(section => section.id === sectionKey);
    return { currentSection: specialSection, isSpecialSection: true };
  }, [mode, sectionKey, sections, specialSections]);

  // Filtrar produtos baseado no modo
  const filteredProducts = useMemo(() => {
    if (mode === 'search') {
      // Modo busca: usar resultados do backend + fallback frontend
      if (backendMatches && backendMatches.length > 0) {
        console.log(`[EnhancedUnified] 🔍 Usando ${backendMatches.length} resultados do backend`);
        return backendMatches;
      }
      
      // Fallback: busca frontend no cache
      if (searchQuery && products.length > 0) {
        const query = searchQuery.toLowerCase();
        const frontendResults = products.filter(product => 
          product.name.toLowerCase().includes(query) ||
          product.category?.toLowerCase().includes(query) ||
          product.platform?.toLowerCase().includes(query) ||
          product.tags?.some(tag => tag.name.toLowerCase().includes(query))
        );
        console.log(`[EnhancedUnified] 🔍 Fallback frontend: ${frontendResults.length} resultados`);
        return frontendResults;
      }
      
      return [];
    } else {
      // Modo seção: filtrar produtos da seção
      if (!currentSection || !products.length) return [];
      
      if (isSpecialSection) {
        // Seção especial - implementar lógica específica se necessário
        return [];
      } else {
        // Seção de produto normal
        const productMap = new Map<string, any>();
        
        if (currentSection.items) {
          for (const item of currentSection.items) {
            if (item.item_type === 'product') {
              const product = products.find(p => p.id === item.item_id);
              if (product && product.product_type !== 'master' && !productMap.has(product.id)) {
                productMap.set(product.id, product);
              }
            } else if (item.item_type === 'tag') {
              const tagProducts = products.filter(p => 
                p.product_type !== 'master' && 
                p.tags?.some(tag => 
                  tag.name.toLowerCase() === item.item_id.toLowerCase() || 
                  tag.id === item.item_id
                )
              );
              tagProducts.forEach(product => {
                if (!productMap.has(product.id)) {
                  productMap.set(product.id, product);
                }
              });
            }
          }
        }
        
        return Array.from(productMap.values());
      }
    }
  }, [mode, searchQuery, backendMatches, products, currentSection, isSpecialSection]);

  // Aplicar filtros de preço
  const priceFilteredProducts = useMemo(() => {
    if (!priceRange.min && !priceRange.max) return filteredProducts;
    
    return filteredProducts.filter(product => {
      const price = product.price;
      const min = priceRange.min ? parseFloat(priceRange.min) : 0;
      const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
      return price >= min && price <= max;
    });
  }, [filteredProducts, priceRange]);

  // Ordenar produtos
  const sortedProducts = useMemo(() => {
    if (!priceFilteredProducts.length) return [];
    
    const sorted = [...priceFilteredProducts];
    
    switch (sortBy) {
      case 'price_asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'relevance':
      default:
        return sorted;
    }
  }, [priceFilteredProducts, sortBy]);

  // Handlers
  const handleProductClick = (productId: string) => {
    navigate(`/produto/${productId}`);
  };

  const handleAddToCart = (product: any, size?: string, color?: string) => {
    addToCart(product, size, color);
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Estados de loading
  const isLoading = productsLoading || sectionsLoading || specialSectionsLoading || searchLoading;
  const hasData = products.length > 0 || productsFromCache;

  // Determinar título da página
  const pageTitle = useMemo(() => {
    if (mode === 'search') {
      return searchQuery ? `Resultados para "${searchQuery}"` : 'Busca';
    } else {
      return currentSection?.title || 'Seção';
    }
  }, [mode, searchQuery, currentSection]);

  // Loading state - muito mais rápido com cache
  if (isLoading && !hasData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ProfessionalHeader
          user={user}
          cartItemsCount={getCartItemsCount()}
          onCartOpen={() => setShowCart(true)}
          onAuthOpen={() => setShowAuthModal(true)}
          showNavigation={false}
        />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16 text-muted-foreground">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              <span>Carregando...</span>
            </div>
            {showDebug && (
              <div className="text-xs text-gray-400">
                Cache: {productsFromCache ? 'HIT' : 'MISS'} | 
                Hit Rate: {cacheStats.hitRate.toFixed(1)}%
              </div>
            )}
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
        onCartClick={() => setShowCart(true)}
        onAuthClick={() => setShowAuthModal(true)}
        showNavigation={false}
      />

      {/* Conteúdo principal */}
      <main className="container mx-auto px-4 py-6">
        {/* Navegação */}
        <div className="mb-4">
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

        {/* Título com indicadores de cache */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {pageTitle}
            </h1>
            
            {/* Indicadores de debug */}
            {showDebug && (
              <div className="flex gap-2">
                <Badge variant={productsFromCache ? "default" : "secondary"} className="text-xs">
                  {productsFromCache ? '⚡ Cache' : '🌐 API'}
                </Badge>
                {mode === 'search' && backendMatches && (
                  <Badge variant="outline" className="text-xs">
                    Backend: {backendMatches.length}
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-gray-600">
            <p>
              {sortedProducts.length} {sortedProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
            </p>
            
            {/* Stats de cache para debug */}
            {showDebug && (
              <div className="text-xs">
                Hit Rate: {cacheStats.hitRate.toFixed(1)}% | 
                Cache Size: {cacheStats.cacheSize}
              </div>
            )}
          </div>
        </div>

        {/* Sugestões de tags (apenas para busca) */}
        {mode === 'search' && tagSuggestions && tagSuggestions.length > 0 && (
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">Você também pode estar procurando por:</p>
            <div className="flex flex-wrap gap-2">
              {tagSuggestions.slice(0, 5).map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => navigate(`/busca?q=${encodeURIComponent(tag)}`)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Filtros e ordenação */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Ordenar:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="relevance">Melhores Resultados</option>
                <option value="price_asc">Menor Preço</option>
                <option value="price_desc">Maior Preço</option>
                <option value="name">Nome A-Z</option>
              </select>
            </div>
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filtros
            </Button>

            {/* Toggle debug para admin */}
            {showDebug && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCardDebug(!showCardDebug)}
              >
                Debug Cards
              </Button>
            )}
          </div>
          
          {/* Painel de filtros */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Faixa de Preço
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Mín"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="text-sm"
                  />
                  <span className="text-gray-500 self-center">até</span>
                  <Input
                    type="number"
                    placeholder="Máx"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="text-sm"
                  />
                </div>
              </div>
              
              <div className="flex items-end">
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white mr-2"
                  onClick={() => {
                    // Filtros aplicados automaticamente
                  }}
                >
                  Aplicar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setPriceRange({ min: '', max: '' });
                  }}
                >
                  Limpar
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Grid de produtos com renderização progressiva */}
        <ProgressiveProductGrid
          products={sortedProducts}
          loading={isLoading}
          error={null}
          onProductClick={handleProductClick}
          onAddToCart={handleAddToCart}
          showDebug={showCardDebug}
          priorityCount={mode === 'search' ? 4 : 8}
          itemsPerPage={20}
          showLoadMore={true}
        />

        {/* Debug panel para busca */}
        {showDebug && mode === 'search' && debug && (
          <SearchDebugPanel debug={debug} />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modais */}
      <Cart
        showCart={showCart}
        setShowCart={setShowCart}
        onSendToWhatsApp={sendToWhatsApp}
      />

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
};

export default EnhancedUnifiedResultsPage;
