import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook para forçar scroll para o topo em páginas específicas
 * Usado principalmente para páginas com conteúdo dinâmico
 */
export const useScrollToTop = (enabled: boolean = true) => {
  const location = useLocation();

  useEffect(() => {
    if (!enabled) return;

    // Força scroll para o topo quando a página muda
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    // Executa imediatamente
    scrollToTop();

    // Executa novamente após um pequeno delay para garantir
    const timeoutId = setTimeout(scrollToTop, 50);

    return () => clearTimeout(timeoutId);
  }, [location.pathname, location.search, enabled]);
};

/**
 * Hook específico para páginas de busca e seção
 * Garante que sempre comecem no topo
 */
export const useScrollToTopForDynamicPages = () => {
  const location = useLocation();
  
  const isDynamicPage = location.pathname.startsWith('/busca') || 
                       location.pathname.startsWith('/secao');
  
  useScrollToTop(isDynamicPage);
};
