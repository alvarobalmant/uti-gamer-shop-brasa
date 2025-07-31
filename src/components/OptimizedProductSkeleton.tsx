import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedProductSkeletonProps {
  count?: number;
  maxTimeout?: number; // Timeout máximo em ms
  onForceHide?: () => void;
}

/**
 * Skeleton otimizado com timeout máximo
 * Força esconder skeleton após tempo limite para melhorar UX
 */
export const OptimizedProductSkeleton: React.FC<OptimizedProductSkeletonProps> = ({
  count = 5,
  maxTimeout = 2000, // 2 segundos MAX
  onForceHide
}) => {
  const [forceHide, setForceHide] = useState(false);

  useEffect(() => {
    // Forçar esconder skeleton após timeout máximo
    const timer = setTimeout(() => {
      setForceHide(true);
      onForceHide?.();
      console.log('⏰ Skeleton timeout - forcing hide after', maxTimeout, 'ms');
    }, maxTimeout);

    return () => clearTimeout(timer);
  }, [maxTimeout, onForceHide]);

  // Se forçou esconder, mostrar mensagem simples
  if (forceHide) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center space-y-2">
          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-sm text-muted-foreground">Produtos carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-3">
          {/* Imagem do produto */}
          <Skeleton className="aspect-square w-full rounded-lg" />
          
          {/* Nome do produto */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          
          {/* Preço */}
          <Skeleton className="h-6 w-1/2" />
          
          {/* Botão */}
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
      ))}
    </div>
  );
};

/**
 * Skeleton para carrossel de produtos
 * Versão horizontal otimizada
 */
export const OptimizedProductCarouselSkeleton: React.FC<OptimizedProductSkeletonProps> = ({
  count = 5,
  maxTimeout = 2000,
  onForceHide
}) => {
  const [forceHide, setForceHide] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setForceHide(true);
      onForceHide?.();
      console.log('⏰ Carousel skeleton timeout - forcing hide after', maxTimeout, 'ms');
    }, maxTimeout);

    return () => clearTimeout(timer);
  }, [maxTimeout, onForceHide]);

  if (forceHide) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-3">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Carregando produtos em destaque...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 overflow-hidden">
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index} 
          className="flex-shrink-0 space-y-3"
          style={{ width: '200px' }} // Mesma largura dos cards reais
        >
          {/* Imagem do produto */}
          <Skeleton className="aspect-square w-full rounded-lg" />
          
          {/* Nome do produto */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          
          {/* Preço */}
          <Skeleton className="h-5 w-1/2" />
          
          {/* Botão */}
          <Skeleton className="h-8 w-full rounded-md" />
        </div>
      ))}
    </div>
  );
};

export default OptimizedProductSkeleton;