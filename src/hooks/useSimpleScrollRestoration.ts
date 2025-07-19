import { useEffect } from 'react';
import { useLocation, useNavigationType, NavigationType } from 'react-router-dom';
import simpleScrollManager from '@/lib/simpleScrollManager';

/**
 * Hook simples e robusto para restauração de scroll
 * - Salva posição a cada 20ms automaticamente
 * - Restaura posição após 500ms do carregamento
 * - Sistema obrigatório de restauração
 */
export const useSimpleScrollRestoration = () => {
  const location = useLocation();
  const navigationType = useNavigationType();

  // Desabilita restauração nativa do navegador
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Gerencia mudanças de página
  useEffect(() => {
    const currentPath = location.pathname + location.search;
    
    console.log(`[SimpleScrollRestoration] 🚀 NOVA PÁGINA: ${currentPath} (${navigationType})`);
    
    // Define a página atual no manager
    simpleScrollManager.setCurrentPage(currentPath);
    
    // Lógica baseada no tipo de navegação
    if (navigationType === NavigationType.Pop) {
      // VOLTAR - restaura posição obrigatoriamente
      console.log(`[SimpleScrollRestoration] ⬅️ VOLTAR detectado - restaurando posição`);
      simpleScrollManager.restoreCurrentPagePosition();
    } else {
      // NOVA NAVEGAÇÃO - limpa posição e vai para topo
      console.log(`[SimpleScrollRestoration] ➡️ NOVA navegação - indo para topo`);
      simpleScrollManager.clearPagePosition(currentPath);
      window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
    }
    
  }, [location.pathname, location.search, navigationType]);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      // Não destrói o manager pois é global, apenas limpa listeners se necessário
    };
  }, []);
};