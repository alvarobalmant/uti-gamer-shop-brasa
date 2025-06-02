import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType, NavigationType } from 'react-router-dom';
import scrollManager from '@/lib/scrollRestorationManager'; // Assuming default export

/**
 * Hook para gerenciar a restauração da posição de scroll entre navegações.
 * Implementado com base nas melhores práticas e guias fornecidos.
 */
export const useScrollRestoration = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const lastPathRef = useRef<string>(location.pathname + location.search);

  // Desabilita a restauração nativa do navegador
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
      console.log('[ScrollRestoration] Native scroll restoration disabled.');
    }
  }, []);

  // Efeito principal para salvar e restaurar posição
  useEffect(() => {
    const currentPathKey = location.pathname + location.search;
    const previousPathKey = lastPathRef.current;

    console.log(`[ScrollRestoration] Navigating. Type: ${navigationType}, From: ${previousPathKey}, To: ${currentPathKey}`);

    // Salva a posição da página anterior ANTES de navegar para a nova
    // Isso é feito no cleanup do effect anterior ou antes da mudança de estado
    // A lógica do manager já inclui debounce/visibility checks para salvar durante o uso

    // Lógica de restauração/scroll para a NOVA página
    if (navigationType === NavigationType.Pop) {
      // Tentativa de restaurar a posição salva para esta página
      console.log(`[ScrollRestoration] POP detected. Attempting restore for: ${currentPathKey}`);
      // Adiciona um pequeno delay para garantir que o DOM esteja pronto
      const restoreTimer = setTimeout(async () => {
        const restored = await scrollManager.restorePosition(currentPathKey, 'POP navigation');
        if (!restored) {
          console.log(`[ScrollRestoration] Restore failed or no position saved for ${currentPathKey}. Scrolling top.`);
          window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
        }
      }, 100); // Delay pode precisar de ajuste
      return () => clearTimeout(restoreTimer);

    } else {
      // Nova navegação (PUSH ou REPLACE), rolar para o topo
      console.log(`[ScrollRestoration] ${navigationType} detected. Scrolling top for: ${currentPathKey}`);
      // Remove qualquer posição salva para o caminho atual, pois é uma nova visita
      scrollManager.removePosition(currentPathKey);
      window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
    }

    // Atualiza a referência do último caminho *após* o processamento
    lastPathRef.current = currentPathKey;

  }, [location.pathname, location.search, navigationType]); // Depende do pathname e search para identificar a página única

  // Efeito para salvar a posição durante o scroll (usa o manager interno)
  useEffect(() => {
    const currentPathKey = location.pathname + location.search;
    let scrollDebounceTimer: number | null = null;

    const handleScroll = () => {
      if (scrollManager.getIsRestoring()) return; // Não salva enquanto restaura

      if (scrollDebounceTimer) {
        clearTimeout(scrollDebounceTimer);
      }
      scrollDebounceTimer = window.setTimeout(() => {
        scrollManager.savePosition(currentPathKey, 'scroll debounce');
      }, 300); // Ajuste o debounce conforme necessário
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    console.log(`[ScrollRestoration] Scroll listener added for: ${currentPathKey}`);

    return () => {
      if (scrollDebounceTimer) {
        clearTimeout(scrollDebounceTimer);
      }
      window.removeEventListener('scroll', handleScroll);
      // Salva uma última vez ao desmontar/mudar de rota
      scrollManager.savePosition(currentPathKey, 'listener cleanup');
      console.log(`[ScrollRestoration] Scroll listener removed for: ${currentPathKey}`);
    };
  }, [location.pathname, location.search]);

  // Efeito para salvar ao sair da página/mudar visibilidade
  useEffect(() => {
    const currentPathKey = location.pathname + location.search;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !scrollManager.getIsRestoring()) {
        scrollManager.savePosition(currentPathKey, 'visibility hidden');
      }
    };

    const handleBeforeUnload = () => {
       if (!scrollManager.getIsRestoring()) {
         scrollManager.savePosition(currentPathKey, 'before unload');
       }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    console.log(`[ScrollRestoration] Visibility/Unload listeners added for: ${currentPathKey}`);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      console.log(`[ScrollRestoration] Visibility/Unload listeners removed for: ${currentPathKey}`);
    };
  }, [location.pathname, location.search]);

};


