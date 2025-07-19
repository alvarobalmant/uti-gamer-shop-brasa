import { useEffect } from 'react';
import { useLocation, useNavigationType, NavigationType } from 'react-router-dom';
import simpleScrollManager from '@/lib/simpleScrollManager';
import preLoadHorizontalScrollManager from '@/lib/preLoadHorizontalScrollManager';

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
    
    console.log(`[SimpleScrollRestoration] 🚀 NOVA PÁGINA: ${currentPath} (${navigationType})`);
    
    // Define a página atual em ambos os managers
    simpleScrollManager.setCurrentPage(currentPath);
    preLoadHorizontalScrollManager.setCurrentPage(currentPath);
    
    // Lógica baseada no tipo de navegação
    if (navigationType === NavigationType.Pop) {
      // VOLTAR - restaura apenas posição vertical (horizontal já é pré-carregado)
      console.log(`[SimpleScrollRestoration] ⬅️ VOLTAR detectado - restaurando posição vertical`);
      
      // Restaura apenas scroll vertical (horizontal é automático via preLoad)
      simpleScrollManager.restoreCurrentPagePosition().then(() => {
        console.log(`[SimpleScrollRestoration] ✅ Restauração vertical finalizada para ${currentPath}`);
      });
      
    } else {
      // NOVA NAVEGAÇÃO - limpa posições e vai para topo
      console.log(`[SimpleScrollRestoration] ➡️ NOVA navegação - limpando posições e indo para topo`);
      simpleScrollManager.clearPagePosition(currentPath);
      preLoadHorizontalScrollManager.clearPagePositions(currentPath);
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