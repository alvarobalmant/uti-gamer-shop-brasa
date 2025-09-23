/**
 * ProgressiveProductGrid - Grid de Produtos com Renderização Progressiva
 * 
 * Este componente renderiza uma grade de produtos que:
 * - Aparece imediatamente com dados essenciais
 * - Carrega imagens em background
 * - Mostra skeleton apenas para produtos ainda não carregados
 * - Suporta paginação e lazy loading
 */

import React, { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Product } from '@/hooks/useProducts/types';
import ProgressiveProductCard from './ProgressiveProductCard';
import { Button } from '@/components/ui/button';
import { Loader2, Grid, List } from 'lucide-react';

interface ProgressiveProductGridProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
  onProductClick?: (productId: string) => void;
  onAddToCart?: (product: Product, size?: string, color?: string) => void;
  className?: string;
  showDebug?: boolean;
  
  // Configurações de layout
  columns?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  
  // Configurações de paginação
  itemsPerPage?: number;
  showLoadMore?: boolean;
  
  // Configurações de renderização
  priorityCount?: number; // Quantos produtos carregar com prioridade
  skeletonCount?: number; // Quantos skeletons mostrar durante loading
}

export const ProgressiveProductGrid: React.FC<ProgressiveProductGridProps> = ({
  products,
  loading = false,
  error = null,
  onProductClick,
  onAddToCart,
  className,
  showDebug = false,
  columns = {
    mobile: 2,
    tablet: 3,
    desktop: 4
  },
  itemsPerPage = 20,
  showLoadMore = false,
  priorityCount = 6,
  skeletonCount = 8
}) => {
  const [displayedCount, setDisplayedCount] = useState(itemsPerPage);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Produtos a serem exibidos (com paginação)
  const displayedProducts = useMemo(() => {
    return products.slice(0, displayedCount);
  }, [products, displayedCount]);

  // Verificar se há mais produtos para carregar
  const hasMore = products.length > displayedCount;

  // Handler para carregar mais produtos
  const handleLoadMore = () => {
    setDisplayedCount(prev => Math.min(prev + itemsPerPage, products.length));
  };

  // Classes CSS para o grid responsivo
  const gridClasses = cn(
    'grid gap-3 md:gap-4',
    {
      // Grid mode
      'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5': 
        viewMode === 'grid' && columns.desktop === 5,
      'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4': 
        viewMode === 'grid' && columns.desktop === 4,
      'grid-cols-2 sm:grid-cols-2 md:grid-cols-3': 
        viewMode === 'grid' && columns.desktop === 3,
      
      // List mode
      'grid-cols-1 gap-2': viewMode === 'list'
    }
  );

  // Componente de skeleton para loading
  const ProductSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="aspect-square bg-gray-200 animate-pulse" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
        <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse" />
      </div>
    </div>
  );

  // Renderizar estado de erro
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar produtos</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header com controles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Carregando produtos...</span>
            </div>
          ) : (
            <span>
              {displayedProducts.length} de {products.length} produtos
            </span>
          )}
        </div>

        {/* Controles de visualização */}
        <div className="flex items-center gap-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="p-2"
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="p-2"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Grid de produtos */}
      <div className={gridClasses}>
        {/* Produtos reais */}
        {displayedProducts.map((product, index) => (
          <ProgressiveProductCard
            key={product.id}
            product={product}
            onCardClick={onProductClick}
            onAddToCart={onAddToCart}
            showDebug={showDebug}
            priority={index < priorityCount} // Prioridade para os primeiros produtos
            className={viewMode === 'list' ? 'flex flex-row' : ''}
          />
        ))}

        {/* Skeletons durante loading inicial */}
        {loading && displayedProducts.length === 0 && (
          Array.from({ length: skeletonCount }).map((_, index) => (
            <ProductSkeleton key={`skeleton-${index}`} />
          ))
        )}
      </div>

      {/* Estado vazio */}
      {!loading && products.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum produto encontrado</h3>
          <p className="text-gray-600">
            Não há produtos disponíveis no momento ou que correspondam aos filtros aplicados.
          </p>
        </div>
      )}

      {/* Botão "Carregar mais" */}
      {showLoadMore && hasMore && !loading && (
        <div className="text-center pt-6">
          <Button
            onClick={handleLoadMore}
            variant="outline"
            size="lg"
            className="min-w-[200px]"
          >
            Carregar mais produtos
          </Button>
        </div>
      )}

      {/* Loading indicator para "carregar mais" */}
      {loading && displayedProducts.length > 0 && (
        <div className="text-center py-4">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Carregando mais produtos...</span>
          </div>
        </div>
      )}

      {/* Debug info */}
      {showDebug && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm">
          <h4 className="font-semibold mb-2">Debug Info:</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p>Total produtos: {products.length}</p>
              <p>Exibidos: {displayedProducts.length}</p>
              <p>Com prioridade: {priorityCount}</p>
            </div>
            <div>
              <p>Modo: {viewMode}</p>
              <p>Loading: {loading ? 'Sim' : 'Não'}</p>
              <p>Tem mais: {hasMore ? 'Sim' : 'Não'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressiveProductGrid;
