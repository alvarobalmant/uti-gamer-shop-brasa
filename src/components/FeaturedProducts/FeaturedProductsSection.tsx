
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/hooks/useProducts";
import SectionTitle from "@/components/SectionTitle";
import { cn } from "@/lib/utils";
import { useHorizontalScrollTracking } from "@/hooks/useHorizontalScrollTracking";

interface FeaturedProductsSectionProps {
  products: Product[];
  loading: boolean;
  onAddToCart: (product: Product) => void;
  title: string;
  viewAllLink?: string;
  reduceTopSpacing?: boolean;
}

const FeaturedProductsSection = ({
  products,
  loading,
  onAddToCart,
  title,
  viewAllLink = "/categoria/inicio",
  reduceTopSpacing = false,
}: FeaturedProductsSectionProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollContainerRef = useHorizontalScrollTracking('featured-products', true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Estados para controle dos gradientes com níveis de intensidade (sistema adaptativo)
  const [leftGradientLevel, setLeftGradientLevel] = useState<'none' | 'subtle' | 'intense'>('none');
  const [rightGradientLevel, setRightGradientLevel] = useState<'none' | 'subtle' | 'intense'>('none');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleViewAllClick = () => {
    navigate(viewAllLink);
  };

  // Função para converter cor hex para rgba com transparência (sistema adaptativo)
  const hexToRgba = (hex: string, alpha: number) => {
    // Background padrão das seções normais (branco puro para naturalidade)
    if (!hex || hex.trim() === '') {
      return `rgba(255, 255, 255, ${alpha})`; // Branco puro como o site
    }
    
    const cleanHex = hex.replace('#', '').toLowerCase().trim();
    
    if (!/^[0-9a-f]{3}$|^[0-9a-f]{6}$/i.test(cleanHex)) {
      return `rgba(255, 255, 255, ${alpha})`; // Branco puro como fallback
    }
    
    let r, g, b;
    
    if (cleanHex.length === 3) {
      r = parseInt(cleanHex[0] + cleanHex[0], 16);
      g = parseInt(cleanHex[1] + cleanHex[1], 16);
      b = parseInt(cleanHex[2] + cleanHex[2], 16);
    } else {
      r = parseInt(cleanHex.substring(0, 2), 16);
      g = parseInt(cleanHex.substring(2, 4), 16);
      b = parseInt(cleanHex.substring(4, 6), 16);
    }
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Função para detectar cards cortados com sistema adaptativo
  const checkForCutOffCards = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    
    // Obter o primeiro card para medir o tamanho real
    const firstCard = container.querySelector('[data-card]') as HTMLElement;
    if (!firstCard) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[FeaturedProductsSection] Nenhum card encontrado');
      }
      return;
    }
    
    // Medir largura real do card
    const cardRect = firstCard.getBoundingClientRect();
    const cardWidth = cardRect.width;
    
    // Thresholds mais naturais baseados no tamanho real do card
    const subtleThreshold = cardWidth * 0.15; // 15% - mais natural
    const intenseThreshold = cardWidth * 0.25; // 25% - menos agressivo
    
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
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[FeaturedProductsSection] Detecção de gradientes:', {
        scrollLeft,
        clientWidth,
        scrollWidth,
        remainingWidth,
        cardWidth,
        subtleThreshold: `${subtleThreshold.toFixed(1)}px`,
        intenseThreshold: `${intenseThreshold.toFixed(1)}px`,
        leftLevel: newLeftLevel,
        rightLevel: newRightLevel
      });
    }
    
    // Atualizar estados apenas se houver mudança
    if (leftGradientLevel !== newLeftLevel) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[FeaturedProductsSection] Mudança gradiente esquerdo: ${leftGradientLevel} → ${newLeftLevel}`);
      }
      setLeftGradientLevel(newLeftLevel);
    }
    
    if (rightGradientLevel !== newRightLevel) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[FeaturedProductsSection] Mudança gradiente direito: ${rightGradientLevel} → ${newRightLevel}`);
      }
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

  // Function to handle product click - always navigate to product page
  const handleProductCardClick = useCallback(async (productId: string) => {
    // Salvar posição atual antes de navegar
    console.log('[FeaturedProducts] Salvando posição antes de navegar para produto:', productId);
    const scrollManager = (await import('@/lib/scrollRestorationManager')).default;
    scrollManager.savePosition(location.pathname, 'featured-product-navigation');
    navigate(`/produto/${productId}`);
  }, [navigate, location.pathname]);

  // Check scroll position and update button states
  const checkScrollButtons = useCallback(() => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    
    // Tolerância de 1px para evitar problemas de arredondamento
    const tolerance = 1;
    
    const newCanScrollLeft = scrollLeft > tolerance;
    const newCanScrollRight = scrollLeft < (scrollWidth - clientWidth - tolerance);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[FeaturedProductsSection] Check scroll buttons:', {
        scrollLeft,
        scrollWidth,
        clientWidth,
        maxScroll: scrollWidth - clientWidth,
        canScrollLeft: newCanScrollLeft,
        canScrollRight: newCanScrollRight
      });
    }
    
    setCanScrollLeft(newCanScrollLeft);
    setCanScrollRight(newCanScrollRight);
  }, []);

  // Função ultra-otimizada para scroll suave sem travamentos
  const handleScrollOptimized = useCallback(() => {
    // Botões atualizados imediatamente (operação leve)
    requestAnimationFrame(() => {
      checkScrollButtons();
    });
    
    // Gradientes só após scroll parar (operação pesada)
    debouncedCheckForCutOffCards();
  }, [checkScrollButtons, debouncedCheckForCutOffCards]);

  // Scroll functions
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

  // Check scroll buttons when products change or component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      checkScrollButtons();
      checkForCutOffCards();
    }, 150);
    return () => clearTimeout(timer);
  }, [products, checkScrollButtons, checkForCutOffCards]);

  // Add scroll event listener (otimizado)
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
  }, [handleScrollOptimized, checkScrollButtons, checkForCutOffCards, products]);

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

  // Effect para detectar quando a animação de scroll termina
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScrollEnd = () => {
      // Verifica novamente quando o scroll termina
      setTimeout(checkForCutOffCards, 100);
    };

    // Detecta quando o scroll termina usando um timer
    let scrollTimer: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(handleScrollEnd, 150);
    };

    container.addEventListener('scroll', handleScroll);
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
    };
  }, [checkForCutOffCards]);

  if (loading) {
    // Render loading state if needed
    return (
      <section className={reduceTopSpacing ? "py-4 md:py-6 bg-background" : "py-12 md:py-16 bg-background"}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 text-muted-foreground">
            Carregando produtos...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={reduceTopSpacing ? "py-4 md:py-6 bg-background" : "py-8 md:py-12 bg-background"}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
          <SectionTitle title={title} className="mb-0" />
          <Button
            onClick={handleViewAllClick}
            variant="default"
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white border-0 flex-shrink-0 w-full sm:w-auto font-medium"
          >
            Ver Todos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Products Grid / Scroll Container */}
        {products.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            Nenhum produto encontrado nesta categoria.
          </div>
        ) : (
          <div className="relative group">
            {/* Gradientes ultra-fortes - eliminam linha de corte completamente */}
            <div className="absolute inset-0 pointer-events-none z-20">
              {/* Gradiente esquerdo (ultra-forte para eliminar linha) */}
              <div 
                className={`absolute left-0 top-0 bottom-0 w-16 transition-all ease-out ${
                  leftGradientLevel === 'intense' 
                    ? 'opacity-95 duration-300' 
                    : leftGradientLevel === 'subtle'
                    ? 'opacity-85 duration-500'
                    : 'opacity-0 duration-200'
                }`}
                style={{ 
                  background: leftGradientLevel === 'intense'
                    ? `linear-gradient(to right, ${hexToRgba('#ffffff', 1.0)} 0%, ${hexToRgba('#ffffff', 1.0)} 20%, ${hexToRgba('#ffffff', 0.95)} 40%, ${hexToRgba('#ffffff', 0.8)} 60%, ${hexToRgba('#ffffff', 0.5)} 80%, transparent 100%)`
                    : `linear-gradient(to right, ${hexToRgba('#ffffff', 1.0)} 0%, ${hexToRgba('#ffffff', 0.98)} 20%, ${hexToRgba('#ffffff', 0.9)} 40%, ${hexToRgba('#ffffff', 0.7)} 60%, ${hexToRgba('#ffffff', 0.4)} 80%, transparent 100%)`
                }}
              />
              
              {/* Gradiente direito (ultra-forte para eliminar linha) */}
              <div 
                className={`absolute right-0 top-0 bottom-0 w-16 transition-all ease-out ${
                  rightGradientLevel === 'intense' 
                    ? 'opacity-95 duration-300' 
                    : rightGradientLevel === 'subtle'
                    ? 'opacity-85 duration-500'
                    : 'opacity-0 duration-200'
                }`}
                style={{ 
                  background: rightGradientLevel === 'intense'
                    ? `linear-gradient(to left, ${hexToRgba('#ffffff', 1.0)} 0%, ${hexToRgba('#ffffff', 1.0)} 20%, ${hexToRgba('#ffffff', 0.95)} 40%, ${hexToRgba('#ffffff', 0.8)} 60%, ${hexToRgba('#ffffff', 0.5)} 80%, transparent 100%)`
                    : `linear-gradient(to left, ${hexToRgba('#ffffff', 1.0)} 0%, ${hexToRgba('#ffffff', 0.98)} 20%, ${hexToRgba('#ffffff', 0.9)} 40%, ${hexToRgba('#ffffff', 0.7)} 60%, ${hexToRgba('#ffffff', 0.4)} 80%, transparent 100%)`
                }}
              />
            </div>

            {/* Left Navigation Button */}
            {canScrollLeft && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-30 h-10 w-10 rounded-full bg-white/90 text-gray-700 hover:bg-white hover:text-gray-900 shadow-lg border border-gray-200 transition-opacity duration-200"
                onClick={scrollLeft}
                aria-label="Produtos anteriores"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}

            {/* Right Navigation Button */}
            {canScrollRight && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-30 h-10 w-10 rounded-full bg-white/90 text-gray-700 hover:bg-white hover:text-gray-900 shadow-lg border border-gray-200 transition-opacity duration-200"
                onClick={scrollRight}
                aria-label="Próximos produtos"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            )}

            <div
              ref={scrollContainerRef}
              className={cn(
                "w-full overflow-x-auto overflow-y-hidden pb-4 pt-2", // Restored overflow-x-auto for scrolling
                "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300",
                "overscroll-behavior-x-contain"
              )}
              style={{
                scrollbarWidth: "thin",
                WebkitOverflowScrolling: "touch",
                scrollBehavior: "smooth",
                touchAction: "pan-x pan-y"
              } as React.CSSProperties}
            >
              <div 
                className="flex gap-3 min-w-max px-1 py-1"
                style={{
                  // FORÇA O CORTE DO ÚLTIMO CARD - CARACTERÍSTICAS ESPECÍFICAS DA VERSÃO
                  width: 'calc(100% + 100px)', // Estende além do container para forçar corte
                  paddingRight: '120px' // Garante que último card seja parcialmente visível
                }}
              >
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    data-card
                    className="flex-shrink-0"
                    style={{
                      width: "200px", // Fixed width for consistent card sizing
                      flexShrink: 0 // Prevent cards from shrinking
                    }}
                  >
                    <ProductCard
                      product={product}
                      onCardClick={handleProductCardClick}
                      onAddToCart={onAddToCart}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProductsSection;
