
import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType, NavigationType } from 'react-router-dom';
import scrollManager from '@/lib/scrollRestorationManager';

/**
 * Hook para gerenciar a restauração da posição de scroll entre navegações.
 * Versão simplificada e otimizada para Safari mobile.
 */
export const useScrollRestoration = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const lastPathRef = useRef<string>(location.pathname + location.search);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isSafariMobile = isSafari && isMobile;

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

    console.log(`[ScrollRestoration] Navigation: ${navigationType}, From: ${previousPathKey}, To: ${currentPathKey}`);

    if (navigationType === NavigationType.Pop) {
      console.log(`[ScrollRestoration] POP detected. Attempting restore for: ${currentPathKey}`);
      
      const restoreDelay = isSafariMobile ? 400 : 200;
      
      const restoreTimer = setTimeout(async () => {
        const restored = await scrollManager.restorePosition(currentPathKey, 'POP navigation');
        if (!restored) {
          console.log(`[ScrollRestoration] Restore failed for ${currentPathKey}. Scrolling top.`);
          window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
        }
      }, restoreDelay);
      
      return () => clearTimeout(restoreTimer);

    } else {
      // Nova navegação (PUSH ou REPLACE), rolar para o topo
      console.log(`[ScrollRestoration] ${navigationType} detected. Scrolling top for: ${currentPathKey}`);
      
      scrollManager.removePosition(currentPathKey);
      window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
    }

    lastPathRef.current = currentPathKey;

  }, [location.pathname, location.search, navigationType, isSafariMobile]);

  // Efeito para salvar a posição durante o scroll
  useEffect(() => {
    const currentPathKey = location.pathname + location.search;
    let scrollDebounceTimer: number | null = null;

    const handleScroll = () => {
      if (scrollManager.getIsRestoring()) return;

      if (scrollDebounceTimer) {
        clearTimeout(scrollDebounceTimer);
      }
      
      const debounceTime = isSafariMobile ? 200 : 300;
      
      scrollDebounceTimer = window.setTimeout(() => {
        scrollManager.savePosition(currentPathKey, 'scroll');
      }, debounceTime);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    console.log(`[ScrollRestoration] Scroll listener added for: ${currentPathKey}`);

    return () => {
      if (scrollDebounceTimer) {
        clearTimeout(scrollDebounceTimer);
      }
      window.removeEventListener('scroll', handleScroll);
      
      // Salva uma última vez ao desmontar
      if (!scrollManager.getIsRestoring()) {
        scrollManager.savePosition(currentPathKey, 'cleanup');
      }
      
      console.log(`[ScrollRestoration] Scroll listener removed for: ${currentPathKey}`);
    };
  }, [location.pathname, location.search, isSafariMobile]);

  // Efeito para salvar ao sair da página
  useEffect(() => {
    const currentPathKey = location.pathname + location.search;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !scrollManager.getIsRestoring()) {
        scrollManager.savePosition(currentPathKey, 'visibility hidden');
        if (isSafariMobile) {
          scrollManager.forceSave(currentPathKey);
        }
      }
    };

    const handleBeforeUnload = () => {
       if (!scrollManager.getIsRestoring()) {
         scrollManager.savePosition(currentPathKey, 'before unload');
         if (isSafariMobile) {
           scrollManager.forceSave(currentPathKey);
         }
       }
    };

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

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      if (isSafari) {
        window.removeEventListener('pagehide', handlePageHide);
      }
    };
  }, [location.pathname, location.search, isSafari, isSafariMobile]);

  // Efeito especial para Safari Mobile - salva posição antes de cliques de navegação
  useEffect(() => {
    if (!isSafariMobile) return;
    
    const currentPathKey = location.pathname + location.search;
    
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickableElement = target.closest('a, button');
      
      if (clickableElement) {
        const href = (clickableElement as HTMLAnchorElement).href;
        
        if (href && new URL(href, window.location.origin).pathname !== location.pathname) {
          console.log(`[ScrollRestoration] Safari Mobile: Navigation click detected. Force saving.`);
          scrollManager.forceSave(currentPathKey);
        }
      }
    };
    
    document.addEventListener('click', handleClick, true);
    
    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [location.pathname, location.search, isSafariMobile]);
};
