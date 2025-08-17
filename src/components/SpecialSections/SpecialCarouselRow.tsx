import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SpecialCarouselCard from './SpecialCarouselCard';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/hooks/useProducts';

interface CarouselRowConfig {
  title?: string;
  titlePart1?: string; // Primeira parte do título (ex: "Most Popular")
  titlePart2?: string; // Segunda parte do título (ex: "Trading Cards")
  titleColor1?: string; // Cor da primeira parte
  titleColor2?: string; // Cor da segunda parte
  products: Array<{
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    platform?: string;
    isOnSale?: boolean;
    discount?: number;
  }>;
  showTitle?: boolean;
  titleAlignment?: 'left' | 'center' | 'right';
}

interface SpecialCarouselRowProps {
  config: CarouselRowConfig;
  sectionBackgroundColor?: string; // Cor de fundo da seção para gradiente adaptativo
  onCardClick?: (productId: string) => void;
}

const SpecialCarouselRow: React.FC<SpecialCarouselRowProps> = React.memo(({
  config,
  sectionBackgroundColor = '#f3f4f6', // Default para cinza claro
  onCardClick,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Estados para controle dos botões de scroll (igual às seções normais)
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Estados para controle dos gradientes com níveis de intensidade
  const [leftGradientLevel, setLeftGradientLevel] = useState<'none' | 'subtle' | 'intense'>('none');
  const [rightGradientLevel, setRightGradientLevel] = useState<'none' | 'subtle' | 'intense'>('none');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Função para converter cor hex para rgba com transparência
  const hexToRgba = (hex: string, alpha: number) => {
    // Se não há cor ou é string vazia, usa fallback baseado na cor da seção
    if (!hex || hex.trim() === '') {
      return `rgba(243, 244, 246, ${alpha})`; // Fallback cinza claro
    }
    
    // Remove # se presente e converte para lowercase
    const cleanHex = hex.replace('#', '').toLowerCase().trim();
    
    // Verifica se é uma cor hex válida (3 ou 6 caracteres)
    if (!/^[0-9a-f]{3}$|^[0-9a-f]{6}$/i.test(cleanHex)) {
      return `rgba(243, 244, 246, ${alpha})`; // Fallback cinza claro
    }
    
    let r, g, b;
    
    if (cleanHex.length === 3) {
      // Formato #RGB -> #RRGGBB
      r = parseInt(cleanHex[0] + cleanHex[0], 16);
      g = parseInt(cleanHex[1] + cleanHex[1], 16);
      b = parseInt(cleanHex[2] + cleanHex[2], 16);
    } else {
      // Formato #RRGGBB
      r = parseInt(cleanHex.substring(0, 2), 16);
      g = parseInt(cleanHex.substring(2, 4), 16);
      b = parseInt(cleanHex.substring(4, 6), 16);
    }
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Função para verificar posição do scroll e atualizar estados dos botões
  const checkScrollButtons = useCallback(() => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    
    // Tolerância de 1px para evitar problemas de arredondamento
    const tolerance = 1;
    
    const newCanScrollLeft = scrollLeft > tolerance;
    const newCanScrollRight = scrollLeft < (scrollWidth - clientWidth - tolerance);
    
    // Debug info removido para produção
    
    setCanScrollLeft(newCanScrollLeft);
    setCanScrollRight(newCanScrollRight);
  }, []);

  // Função para detectar cards cortados com sistema adaptativo
  const checkForCutOffCards = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    
    // Obter o primeiro card para medir o tamanho real
    const firstCard = container.querySelector('[data-card]') as HTMLElement;
    if (!firstCard) {
      // Nenhum card encontrado
      return;
    }
    
    // Medir largura real do card
    const cardRect = firstCard.getBoundingClientRect();
    const cardWidth = cardRect.width;
    
    // Thresholds baseados no tamanho real do card
    const subtleThreshold = cardWidth * 0.05; // 5%
    const intenseThreshold = cardWidth * 0.10; // 10%
    
    // Verificar gradiente esquerdo (baseado no scroll)
    let newLeftLevel: 'none' | 'subtle' | 'intense' = 'none';
    if (scrollLeft > intenseThreshold) {
      newLeftLevel = 'intense';
    } else if (scrollLeft > subtleThreshold) {
      newLeftLevel = 'subtle';
    }
    
    // Verificar gradiente direito (baseado no conteúdo restante)
    const remainingWidth = scrollWidth - (scrollLeft + clientWidth);
    let newRightLevel: 'none' | 'subtle' | 'intense' = 'none';
    
    if (remainingWidth > intenseThreshold) {
      newRightLevel = 'intense';
    } else if (remainingWidth > subtleThreshold) {
      newRightLevel = 'subtle';
    }
    
    // Detecção de gradientes otimizada
    
    // Atualizar estados apenas se houver mudança
    if (leftGradientLevel !== newLeftLevel) {
      setLeftGradientLevel(newLeftLevel);
    }
    
    if (rightGradientLevel !== newRightLevel) {
      setRightGradientLevel(newRightLevel);
    }
  }, [leftGradientLevel, rightGradientLevel]);

  // Função com debounce ultra-otimizado (só executa após scroll parar)
  const debouncedCheckForCutOffCards = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      // Usar requestAnimationFrame para suavidade máxima
      requestAnimationFrame(() => {
        checkForCutOffCards();
      });
    }, 500); // 500ms - só executa quando scroll parar completamente
  }, [checkForCutOffCards]);

  // Função ultra-otimizada para scroll suave sem travamentos
  const handleScrollOptimized = useCallback(() => {
    // Botões atualizados imediatamente (operação leve)
    requestAnimationFrame(() => {
      checkScrollButtons();
    });
    
    // Gradientes só após scroll parar (operação pesada)
    debouncedCheckForCutOffCards();
  }, [checkScrollButtons, debouncedCheckForCutOffCards]);

  // Função de scroll otimizada (baseada nas seções normais)
  // Funções de scroll idênticas às seções normais
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollBy({
        left: -containerWidth,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollBy({
        left: containerWidth,
        behavior: 'smooth'
      });
    }
  };

  // Effects corrigidos para funcionar corretamente
  useEffect(() => {
    const timer = setTimeout(() => {
      checkForCutOffCards();
      checkScrollButtons();
    }, 150);

    return () => clearTimeout(timer);
  }, [checkForCutOffCards, checkScrollButtons, config.products]);

  // Effect para detectar mudanças no scroll (otimizado)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Usar a função otimizada
    container.addEventListener('scroll', handleScrollOptimized, { passive: true });
    
    // Verificação inicial (sem debounce)
    checkScrollButtons();
    checkForCutOffCards();
    
    return () => {
      container.removeEventListener('scroll', handleScrollOptimized);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [handleScrollOptimized, checkScrollButtons, checkForCutOffCards]);

  // Effect para detectar mudanças no tamanho da janela
  useEffect(() => {
    const handleResize = () => {
      setTimeout(() => {
        checkScrollButtons();
        checkForCutOffCards();
      }, 200);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [checkForCutOffCards, checkScrollButtons]);

  // Listener de scroll duplicado removido - otimização de performance

  // Função para renderizar o título estilo GameStop (bicolor ou monocolor)
  const renderGameStopTitle = () => {
    if (!config.showTitle) {
      return null;
    }

    // Verifica se deve usar sistema bicolor ou título simples
    const useBicolorTitle = config.titlePart1 || config.titlePart2;
    const useSimpleTitle = config.title && !useBicolorTitle;

    if (!useBicolorTitle && !useSimpleTitle) {
      return null;
    }

    const alignment = config.titleAlignment || 'left';
    const alignmentClass = 
      alignment === 'center' ? 'justify-center text-center' :
      alignment === 'right' ? 'justify-end text-right' : 'justify-start text-left';

    return (
      <div className={`flex items-center ${alignmentClass} mb-6`}>
        <div className="flex-1">
          {useBicolorTitle ? (
            // Sistema bicolor estilo GameStop
            <h2 className="text-3xl font-bold leading-tight tracking-tight">
              {config.titlePart1 && (
                <span style={{ color: config.titleColor1 || '#000000' }}>
                  {config.titlePart1}
                </span>
              )}
              {config.titlePart1 && config.titlePart2 && ' '}
              {config.titlePart2 && (
                <span style={{ color: config.titleColor2 || '#9ca3af' }}>
                  {config.titlePart2}
                </span>
              )}
            </h2>
          ) : (
            // Título simples (compatibilidade com versão anterior)
            <h2 className="text-3xl font-bold text-white leading-tight tracking-tight">
              {config.title}
            </h2>
          )}
        </div>
      </div>
    );
  };

  if (!config.products || config.products.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {/* GameStop Style Title */}
      {renderGameStopTitle()}

      {/* Carousel Container */}
      <div className="relative group">
        {/* Gradientes dinâmicos adaptativos - mais sutis e menos expansivos */}
        <div className="absolute inset-0 pointer-events-none z-20">
          {/* Gradiente esquerdo (sutil e compacto) */}
          <div 
            className={`absolute left-0 top-0 bottom-0 w-8 transition-all ease-in-out transform ${
              leftGradientLevel === 'intense' 
                ? 'opacity-60 scale-x-100 duration-700' 
                : leftGradientLevel === 'subtle'
                ? 'opacity-30 scale-x-100 duration-1000'
                : 'opacity-0 scale-x-75 duration-500'
            }`}
            style={{ 
              background: leftGradientLevel === 'intense'
                ? `linear-gradient(to right, ${hexToRgba(sectionBackgroundColor, 0.8)} 0%, ${hexToRgba(sectionBackgroundColor, 0.4)} 70%, transparent 100%)`
                : `linear-gradient(to right, ${hexToRgba(sectionBackgroundColor, 0.5)} 0%, ${hexToRgba(sectionBackgroundColor, 0.2)} 70%, transparent 100%)`,
              transformOrigin: 'left center'
            }}
          />
          
          {/* Gradiente direito (sutil e compacto) */}
          <div 
            className={`absolute right-0 top-0 bottom-0 w-8 transition-all ease-in-out transform ${
              rightGradientLevel === 'intense' 
                ? 'opacity-60 scale-x-100 duration-700' 
                : rightGradientLevel === 'subtle'
                ? 'opacity-30 scale-x-100 duration-1000'
                : 'opacity-0 scale-x-75 duration-500'
            }`}
            style={{ 
              background: rightGradientLevel === 'intense'
                ? `linear-gradient(to left, ${hexToRgba(sectionBackgroundColor, 0.8)} 0%, ${hexToRgba(sectionBackgroundColor, 0.4)} 70%, transparent 100%)`
                : `linear-gradient(to left, ${hexToRgba(sectionBackgroundColor, 0.5)} 0%, ${hexToRgba(sectionBackgroundColor, 0.2)} 70%, transparent 100%)`,
              transformOrigin: 'right center'
            }}
          />
        </div>
        
        {/* Left Navigation Button (igual às seções normais) */}
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 h-10 w-10 rounded-full bg-white/90 text-gray-700 hover:bg-white hover:text-gray-900 shadow-lg border border-gray-200 transition-opacity duration-200 flex items-center justify-center"
            aria-label="Produtos anteriores"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        {/* Right Navigation Button (igual às seções normais) */}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 h-10 w-10 rounded-full bg-white/90 text-gray-700 hover:bg-white hover:text-gray-900 shadow-lg border border-gray-200 transition-opacity duration-200 flex items-center justify-center"
            aria-label="Próximos produtos"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}

        {/* Products Scroll Container (otimizado para performance) */}
        <div
          ref={scrollContainerRef}
          className="w-full overflow-x-auto overflow-y-hidden pb-4 pt-2 overscroll-behavior-x-contain"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
            scrollBehavior: "smooth"
          } as React.CSSProperties}
        >
          <style>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div className="flex gap-2 md:gap-3 min-w-max px-1 py-1">
            {(config.products || []).map((product, index) => (
              <div 
                key={`${product.id}-${index}`} 
                data-card
                className="flex-shrink-0 w-[170px] md:w-[200px]"
              >
                <SpecialCarouselCard
                  product={product}
                  onCardClick={onCardClick}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default SpecialCarouselRow;

