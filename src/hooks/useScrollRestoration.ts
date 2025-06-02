
import { useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import scrollManager, { 
  saveScrollPosition, 
  restoreScrollPosition,
  getIsRestoring 
} from '@/lib/scrollRestorationManager';

/**
 * Hook robusto para restauração de scroll
 */
export const useScrollRestoration = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const lastPathRef = useRef<string>('');
  const initialRenderRef = useRef(true);

  // Desabilita o scroll restoration nativo do browser
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  // Efeito principal para lidar com mudanças de rota
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Pula a primeira renderização
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      lastPathRef.current = currentPath;
      console.log(`[useScrollRestoration] Initial render for ${currentPath}`);
      return;
    }

    const previousPath = lastPathRef.current;
    console.log(`[useScrollRestoration] Navigation: ${previousPath} -> ${currentPath}, type: ${navigationType}`);

    // Salva a posição da página anterior
    if (previousPath && previousPath !== currentPath) {
      saveScrollPosition(previousPath, 'route change');
    }

    // Restaura posição apenas em navegação POP (voltar/avançar)
    if (navigationType === 'POP') {
      const isFromProduct = previousPath.includes('/produto/');
      const isToHome = currentPath === '/';
      
      if (isFromProduct && isToHome) {
        // Força ir para o topo quando volta de produto para home
        console.log(`[useScrollRestoration] Forcing top scroll (product to home)`);
        setTimeout(() => {
          window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
        }, 100);
      } else {
        // Tenta restaurar posição salva
        setTimeout(async () => {
          const restored = await restoreScrollPosition(currentPath, 'POP navigation');
          if (!restored) {
            console.log(`[useScrollRestoration] Failed to restore, going to top`);
            window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
          }
        }, 200);
      }
    } else {
      // Para navegação PUSH/REPLACE, vai para o topo
      console.log(`[useScrollRestoration] New navigation (${navigationType}), going to top`);
      setTimeout(() => {
        window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
      }, 50);
    }

    lastPathRef.current = currentPath;
  }, [location, navigationType]);

  // Salva posição durante scroll (com debounce)
  useEffect(() => {
    const currentPath = location.pathname;
    let scrollTimer: number | null = null;

    const handleScroll = () => {
      if (getIsRestoring() || document.visibilityState === 'hidden') {
        return;
      }

      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }

      scrollTimer = window.setTimeout(() => {
        saveScrollPosition(currentPath, 'scroll');
      }, 500); // Debounce aumentado
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    console.log(`[useScrollRestoration] Added scroll listener for ${currentPath}`);

    return () => {
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
      window.removeEventListener('scroll', handleScroll);
      console.log(`[useScrollRestoration] Removed scroll listener for ${currentPath}`);
    };
  }, [location.pathname]);

  // Salva posição quando a aba fica oculta
  useEffect(() => {
    const currentPath = location.pathname;
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !getIsRestoring()) {
        saveScrollPosition(currentPath, 'visibility hidden');
      }
    };

    const handleBeforeUnload = () => {
      if (!getIsRestoring()) {
        saveScrollPosition(currentPath, 'before unload');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location.pathname]);
};
