
import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType, NavigationType } from 'react-router-dom';
import scrollManager from '@/lib/scrollRestorationManager';

/**
 * Hook para gerenciar a restauração da posição de scroll entre navegações.
 * Versão otimizada para Safari mobile.
 */
export const useScrollRestoration = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const lastPathRef = useRef<string>(location.pathname + location.search);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

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

    console.log(`[ScrollRestoration] Navigating. Type: ${navigationType}, From: ${previousPathKey}, To: ${currentPathKey}, Safari: ${isSafari}`);

    // Lógica de restauração/scroll para a NOVA página
    if (navigationType === NavigationType.Pop) {
      // Safari: força salvamento da página anterior antes de restaurar
      if (isSafari && previousPathKey !== currentPathKey) {
        scrollManager.forceSave(previousPathKey);
      }
      
      console.log(`[ScrollRestoration] POP detected. Attempting restore for: ${currentPathKey}`);
      
      // Safari: delay maior e uso de requestAnimationFrame
      const restoreDelay = isSafari ? 200 : 100;
      
      const restoreTimer = setTimeout(async () => {
        if (isSafari) {
          // Safari: usa requestAnimationFrame para garantir que o DOM está pronto
          requestAnimationFrame(async () => {
            const restored = await scrollManager.restorePosition(currentPathKey, 'POP navigation');
            if (!restored) {
              console.log(`[ScrollRestoration] Restore failed for ${currentPathKey}. Scrolling top.`);
              window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
            }
          });
        } else {
          const restored = await scrollManager.restorePosition(currentPathKey, 'POP navigation');
          if (!restored) {
            console.log(`[ScrollRestoration] Restore failed for ${currentPathKey}. Scrolling top.`);
            window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
          }
        }
      }, restoreDelay);
      
      return () => clearTimeout(restoreTimer);

    } else {
      // Nova navegação (PUSH ou REPLACE), rolar para o topo
      console.log(`[ScrollRestoration] ${navigationType} detected. Scrolling top for: ${currentPathKey}`);
      
      // Remove qualquer posição salva para o caminho atual
      scrollManager.removePosition(currentPathKey);
      
      // Safari: scroll sempre com behavior 'auto'
      window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
    }

    // Atualiza a referência do último caminho
    lastPathRef.current = currentPathKey;

  }, [location.pathname, location.search, navigationType, isSafari]);

  // Efeito para salvar a posição durante o scroll
  useEffect(() => {
    const currentPathKey = location.pathname + location.search;
    let scrollDebounceTimer: number | null = null;

    const handleScroll = () => {
      if (scrollManager.getIsRestoring()) return;

      if (scrollDebounceTimer) {
        clearTimeout(scrollDebounceTimer);
      }
      
      // Safari: debounce menor para capturar melhor as posições
      const debounceTime = isSafari ? 200 : 300;
      
      scrollDebounceTimer = window.setTimeout(() => {
        scrollManager.savePosition(currentPathKey, 'scroll debounce');
      }, debounceTime);
    };

    // Safari: usa passive listener sempre
    window.addEventListener('scroll', handleScroll, { passive: true });
    console.log(`[ScrollRestoration] Scroll listener added for: ${currentPathKey}`);

    return () => {
      if (scrollDebounceTimer) {
        clearTimeout(scrollDebounceTimer);
      }
      window.removeEventListener('scroll', handleScroll);
      
      // Salva uma última vez ao desmontar, especialmente importante no Safari
      if (!scrollManager.getIsRestoring()) {
        scrollManager.savePosition(currentPathKey, 'listener cleanup');
        
        // Safari: força salvamento adicional
        if (isSafari) {
          scrollManager.forceSave(currentPathKey);
        }
      }
      
      console.log(`[ScrollRestoration] Scroll listener removed for: ${currentPathKey}`);
    };
  }, [location.pathname, location.search, isSafari]);

  // Efeito para salvar ao sair da página/mudar visibilidade
  useEffect(() => {
    const currentPathKey = location.pathname + location.search;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !scrollManager.getIsRestoring()) {
        scrollManager.savePosition(currentPathKey, 'visibility hidden');
        
        // Safari: força salvamento adicional
        if (isSafari) {
          scrollManager.forceSave(currentPathKey);
        }
      }
    };

    const handleBeforeUnload = () => {
       if (!scrollManager.getIsRestoring()) {
         scrollManager.savePosition(currentPathKey, 'before unload');
         
         // Safari: força salvamento adicional
         if (isSafari) {
           scrollManager.forceSave(currentPathKey);
         }
       }
    };

    // Safari: adiciona listener adicional para pageshow/pagehide
    const handlePageHide = () => {
      if (!scrollManager.getIsRestoring()) {
        scrollManager.savePosition(currentPathKey, 'page hide');
        scrollManager.forceSave(currentPathKey);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    if (isSafari) {
      window.addEventListener('pagehide', handlePageHide);
    }
    
    console.log(`[ScrollRestoration] Visibility/Unload listeners added for: ${currentPathKey}`);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      if (isSafari) {
        window.removeEventListener('pagehide', handlePageHide);
      }
      
      console.log(`[ScrollRestoration] Visibility/Unload listeners removed for: ${currentPathKey}`);
    };
  }, [location.pathname, location.search, isSafari]);

};
