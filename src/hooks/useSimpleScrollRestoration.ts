import { useEffect } from 'react';
import { useLocation, useNavigationType, NavigationType } from 'react-router-dom';
import simpleScrollManager from '@/lib/simpleScrollManager';

/**
 * Hook simples e robusto para restauração de scroll
 * - Salva posição vertical a cada 20ms automaticamente
 * - Salva posições horizontais de seções a cada 20ms
 * - Restaura posições após 500ms do carregamento
 * - Sistema obrigatório de restauração para ambos os eixos
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
    
    console.log(`[SimpleScrollRestoration] 🚀 PÁGINA: ${currentPath} (${navigationType})`);
    
    // Define a página atual no manager unificado
    simpleScrollManager.setCurrentPage(currentPath);
    
    // PÁGINA DE BUSCA - SEMPRE vai para o topo, independente do tipo de navegação
    if (location.pathname.startsWith('/busca')) {
      console.log(`[SimpleScrollRestoration] 🔍 BUSCA - sempre topo`);
      // Limpa posição salva da página de busca
      simpleScrollManager.clearPagePosition(currentPath);
      
      // Scroll instantâneo para o topo
      window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
      
      return; // Sai da função sem fazer mais nada
    }
    
    // Lógica baseada no tipo de navegação para outras páginas
    if (navigationType === NavigationType.Pop) {
      // VOLTAR - restaura posição vertical
      console.log(`[SimpleScrollRestoration] ⬅️ VOLTAR - restaurando posição`);
      
      // Aguarda DOM + restauração robusta
      setTimeout(() => {
        simpleScrollManager.restoreCurrentPagePosition();
      }, 100);
      
    } else {
      // NOVA NAVEGAÇÃO - vai para topo mas mantém posições salvas
      console.log(`[SimpleScrollRestoration] ➡️ NOVA navegação - topo`);
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