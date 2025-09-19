import { useEffect } from 'react';
import { useLocation, useNavigationType, NavigationType } from 'react-router-dom';
import simpleHorizontalScroll from '@/lib/simpleHorizontalScroll';

/**
 * Hook para integrar o sistema simples de scroll horizontal com a navegação
 * Controla o scroll restoration de forma granular por página
 */
export const usePageScrollRestoration = () => {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    const currentPage = location.pathname + location.search;
    
    // Páginas problemáticas que devem ter scroll restoration nativo desabilitado
    const problematicPages = ['/busca', '/secao'];
    const isProblematicPage = problematicPages.some(page => location.pathname.startsWith(page));
    
    // Controle granular do scroll restoration nativo
    if ('scrollRestoration' in window.history) {
      if (isProblematicPage) {
        // Desabilita scroll restoration nativo para páginas problemáticas
        window.history.scrollRestoration = 'manual';
        console.log(`[PageScrollRestoration] 🚫 Página problemática: ${currentPage} - scroll restoration nativo DESABILITADO`);
        
        // Para páginas problemáticas, força scroll para o topo
        if (navigationType === NavigationType.Pop) {
          // Pequeno delay para garantir que a página carregou
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'instant' });
            console.log(`[PageScrollRestoration] ⬆️ Forçou scroll para o topo: ${currentPage}`);
          }, 100);
        }
        
        // Não executa sistema horizontal para páginas problemáticas
        return;
      } else {
        // Habilita scroll restoration nativo para páginas normais
        window.history.scrollRestoration = 'auto';
        console.log(`[PageScrollRestoration] ✅ Página normal: ${currentPage} - scroll restoration nativo HABILITADO`);
      }
    }
    
    // Define página atual no sistema horizontal (apenas para páginas normais)
    simpleHorizontalScroll.setCurrentPage(currentPage);
    
    // Se for navegação POP (voltar), restaura posições horizontais após delay
    if (navigationType === NavigationType.Pop) {
      console.log(`[PageScrollRestoration] 🔄 Voltando para página normal: ${currentPage}`);
      
      // Aguarda elementos carregarem e restaura posições horizontais
      setTimeout(() => {
        simpleHorizontalScroll.restoreAllPositions();
      }, 300);
    } else {
      console.log(`[PageScrollRestoration] ➡️ Nova navegação para página normal: ${currentPage}`);
    }
  }, [location.pathname, location.search, navigationType]);
};

