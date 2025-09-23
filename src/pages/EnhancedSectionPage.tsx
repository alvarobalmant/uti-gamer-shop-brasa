/**
 * EnhancedSectionPage - Página de Seção com Cache Inteligente
 * 
 * Melhorias implementadas:
 * - Usa useEnhancedProducts() em vez de useProducts()
 * - Renderização progressiva sem esperar imagens
 * - Cache persistente de 15+ minutos
 * - Loading instantâneo na maioria das navegações
 * - Fallback inteligente para dados offline
 */

import React, { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEnhancedProducts } from '@/hooks/useEnhancedProducts';
import { useProductSections } from '@/hooks/useProductSections';
import ProfessionalHeader from '@/components/Header/ProfessionalHeader';
import ProgressiveProductGrid from '@/components/ProgressiveProductGrid';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from '@/components/Auth/AuthModal';
import Cart from '@/components/Cart';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';

const EnhancedSectionPage: React.FC = () => {
  const { sectionKey } = useParams<{ sectionKey: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, addToCart, updateQuantity, getCartTotal, getCartItemsCount, sendToWhatsApp } = useCart();
  
  // Estados da UI
  const [showCart, setShowCart] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'price_asc' | 'price_desc' | 'name'>('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [promotionFilter, setPromotionFilter] = useState('all');

  // Hooks para buscar dados - USANDO CACHE INTELIGENTE
  const { 
    products, 
    loading: productsLoading, 
    fromCache, 
    cacheStats 
  } = useEnhancedProducts();
  
  const { sections, loading: sectionsLoading } = useProductSections();

  // Debug info para desenvolvimento
  const isAdmin = user?.email === 'admin@utidosgames.com';
  const showDebug = isAdmin && process.env.NODE_ENV === 'development';

  // Encontrar a seção atual
  const currentSection = useMemo(() => {
    if (!sectionKey || !sections) return null;
    
    // Se sectionKey é do formato "product_section_ID", extrair o ID
    if (sectionKey.startsWith('product_section_')) {
      const sectionId = sectionKey.replace('product_section_', '');
      return sections.find(section => section.id === sectionId);
    }
    
    // Caso contrário, buscar por id diretamente
    return sections.find(section => section.id === sectionKey);
  }, [sectionKey, sections]);

  // Filtrar produtos da seção - OTIMIZADO
  const sectionProducts = useMemo(() => {
    if (!currentSection || !products.length) return [];
    
    console.log(`[EnhancedSectionPage] 🔍 Filtrando produtos para seção ${currentSection.title}`);
    
    // Usar Map para evitar duplicatas e melhor performance
    const productMap = new Map<string, any>();
    
    if (currentSection.items) {
      for (const item of currentSection.items) {
        if (item.item_type === 'product') {
          // Encontrar produto específico por ID
          const product = products.find(p => p.id === item.item_id);
          if (product && product.product_type !== 'master' && !productMap.has(product.id)) {
            productMap.set(product.id, product);
          }
        } else if (item.item_type === 'tag') {
          // Encontrar produtos com esta tag
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
    
    const result = Array.from(productMap.values());
    console.log(`[EnhancedSectionPage] ✅ ${result.length} produtos encontrados na seção`);
    return result;
  }, [currentSection, products]);

  // Aplicar filtros de preço, disponibilidade e promoções
  const filteredProducts = useMemo(() => {
    let filtered = [...sectionProducts];
    
    // Filtro de preço
    if (priceRange.min || priceRange.max) {
      filtered = filtered.filter(product => {
        const price = product.price;
        const min = priceRange.min ? parseFloat(priceRange.min) : 0;
        const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
        return price >= min && price <= max;
      });
    }
    
    // Filtro de disponibilidade
    if (availabilityFilter !== 'all') {
      filtered = filtered.filter(product => {
        if (availabilityFilter === 'in_stock') {
          return product.stock > 0;
        } else if (availabilityFilter === 'out_of_stock') {
          return product.stock === 0;
        }
        return true;
      });
    }
    
    // Filtro de promoções
    if (promotionFilter !== 'all') {
      filtered = filtered.filter(product => {
        if (promotionFilter === 'on_sale') {
          return product.list_price && product.list_price > product.price;
        } else if (promotionFilter === 'featured') {
          return product.is_featured;
        } else if (promotionFilter === 'new') {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return new Date(product.created_at || '') > thirtyDaysAgo;
        }
        return true;
      });
    }
    
    return filtered;
  }, [sectionProducts, priceRange, availabilityFilter, promotionFilter]);

  // Ordenar produtos
  const sortedProducts = useMemo(() => {
    if (!filteredProducts.length) return [];
    
    const sorted = [...filteredProducts];
    
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
  }, [filteredProducts, sortBy]);

  // Handlers
  const handleAddToCart = useCallback((product: any, size?: string, color?: string) => {
    addToCart(product, size, color);
  }, [addToCart]);

  const handleProductCardClick = useCallback((productId: string) => {
    navigate(`/produto/${productId}`);
  }, [navigate]);

  const handleCartToggle = useCallback(() => {
    setShowCart(!showCart);
  }, [showCart]);

  const handleAuthModalToggle = useCallback(() => {
    setShowAuthModal(!showAuthModal);
  }, [showAuthModal]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Loading state - MUITO MAIS RÁPIDO com cache
  const isLoading = productsLoading || sectionsLoading;
  
  if (isLoading && !fromCache) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ProfessionalHeader
          user={user}
          cartItemsCount={getCartItemsCount()}
          onCartOpen={() => setShowCart(true)}
          onAuthOpen={handleAuthModalToggle}
          showNavigation={false}
        />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16 text-muted-foreground">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              <span>Carregando produtos...</span>
            </div>
            {showDebug && (
              <div className="text-xs text-gray-400">
                Cache: {fromCache ? 'HIT' : 'MISS'} | 
                Hit Rate: {cacheStats.hitRate.toFixed(1)}%
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Seção não encontrada
  if (!currentSection && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ProfessionalHeader
          user={user}
          cartItemsCount={getCartItemsCount()}
          onCartOpen={() => setShowCart(true)}
          onAuthOpen={handleAuthModalToggle}
          showNavigation={false}
        />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Seção não encontrada</h1>
            <p className="text-muted-foreground mb-6">A seção que você está procurando não existe.</p>
            <Button
              onClick={() => navigate('/')}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Voltar ao Início
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const sectionTitle = currentSection?.title || 'Produtos';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header oficial */}
      <ProfessionalHeader
        user={user}
        cartItemsCount={getCartItemsCount()}
        onCartClick={handleCartToggle}
        onAuthClick={handleAuthModalToggle}
        showNavigation={false}
      />

      {/* Conteúdo principal */}
      <main className="container mx-auto px-4 py-6">
        {/* Botão de voltar */}
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

        {/* Título da seção com indicador de cache */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Seção: {sectionTitle}
            </h1>
            
            {/* Indicador de cache para debug */}
            {showDebug && (
              <Badge variant={fromCache ? "default" : "secondary"} className="text-xs">
                {fromCache ? '⚡ Cache' : '🌐 API'}
              </Badge>
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
                Cache Size: {cacheStats.cacheSize} | 
                Incremental: +{cacheStats.incrementalAdds}
              </div>
            )}
          </div>
        </div>

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
          </div>
          
          {/* Painel de filtros expandido */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              {/* Filtro de Preço */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Faixa de Preço
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Mín"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <span className="text-gray-500 self-center">até</span>
                  <input
                    type="number"
                    placeholder="Máx"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              
              {/* Filtro de Disponibilidade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Disponibilidade
                </label>
                <select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">Todos</option>
                  <option value="in_stock">Em Estoque</option>
                  <option value="out_of_stock">Fora de Estoque</option>
                </select>
              </div>
              
              {/* Filtro de Promoções */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promoções
                </label>
                <select
                  value={promotionFilter}
                  onChange={(e) => setPromotionFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">Todos</option>
                  <option value="on_sale">Em Promoção</option>
                  <option value="featured">Produtos em Destaque</option>
                  <option value="new">Novos Produtos</option>
                </select>
              </div>
              
              {/* Botões de Ação */}
              <div className="flex flex-col gap-2">
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => {
                    // Filtros já aplicados automaticamente via useMemo
                  }}
                >
                  Aplicar Filtros
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setPriceRange({ min: '', max: '' });
                    setAvailabilityFilter('all');
                    setPromotionFilter('all');
                  }}
                >
                  Limpar Tudo
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
          onProductClick={handleProductCardClick}
          onAddToCart={handleAddToCart}
          showDebug={showDebug}
          priorityCount={8} // Primeiros 8 produtos com prioridade
          itemsPerPage={20}
          showLoadMore={true}
        />
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
          onClose={handleAuthModalToggle}
        />
      )}
    </div>
  );
};

export default EnhancedSectionPage;
