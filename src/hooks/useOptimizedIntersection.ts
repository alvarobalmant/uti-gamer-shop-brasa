import { useEffect, useState, useRef } from 'react';

interface UseOptimizedIntersectionOptions {
  rootMargin?: string;
  threshold?: number;
  triggerOnce?: boolean;
}

/**
 * Hook de intersection observer otimizado
 * Para seções críticas, bypassa o intersection observer e retorna imediatamente visível
 */
export const useOptimizedIntersection = (
  isCritical: boolean = false,
  options: UseOptimizedIntersectionOptions = {}
) => {
  const [isVisible, setIsVisible] = useState(isCritical); // Seções críticas são visíveis imediatamente
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Se é crítico, não usar intersection observer
    if (isCritical) {
      setIsVisible(true);
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    // Para seções não críticas, usar intersection observer otimizado
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          
          // Se triggerOnce, parar de observar após primeira interseção
          if (options.triggerOnce !== false) {
            observer.unobserve(element);
          }
        } else if (options.triggerOnce === false) {
          setIsVisible(false);
        }
      },
      {
        rootMargin: options.rootMargin || '50px', // Carrega 50px antes de entrar na tela
        threshold: options.threshold || 0.1,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [isCritical, options.rootMargin, options.threshold, options.triggerOnce]);

  return {
    isVisible,
    elementRef
  };
};

/**
 * Hook para determinar se uma seção é crítica baseado na posição
 */
export const useCriticalSectionDetection = (sectionKey: string) => {
  // Seções que devem carregar IMEDIATAMENTE (primeira tela da homepage)
  const criticalSections = [
    'hero_banner',
    'hero_quick_links',
    'product_section_featured', // Primeiro carrossel de produtos
    'special_section_featured', // Primeira seção especial
  ];

  // Verifica se é uma seção de produtos em destaque ou crítica
  const isCritical = criticalSections.includes(sectionKey) ||
    sectionKey.includes('featured') ||
    sectionKey.includes('destaque') ||
    sectionKey.includes('lancamento');

  return { isCritical };
};

export default useOptimizedIntersection;