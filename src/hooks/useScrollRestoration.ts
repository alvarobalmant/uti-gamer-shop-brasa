import { useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import {
  saveScrollPosition as managerSaveScrollPosition,
  getSavedScrollPosition,
  removeScrollPosition,
  setIsRestoring, // Manter para lógica de salvamento
  getIsRestoring // Manter para lógica de salvamento
} from '@/lib/scrollRestorationManager';

/**
 * Hook revisado para restauração de posição de scroll, focado na página inicial ('/')
 * e minimizando o "flash" visual.
 */
export const useScrollRestoration = () => {
  const location = useLocation();
  const navigationType = useNavigationType(); // 'POP', 'PUSH', ou 'REPLACE'
  const initialRenderRef = useRef(true);

  // Verifica se a posição salva é válida (não expirada)
  const isPositionValid = (position: { timestamp: number } | undefined): boolean => {
    if (!position) return false;
    const now = Date.now();
    const expirationTime = 24 * 60 * 60 * 1000; // 24 horas em ms
    return now - position.timestamp < expirationTime;
  };

  // Efeito principal que gerencia a restauração e o scroll para o topo
  useLayoutEffect(() => {
    const { pathname } = location;
    console.log(`[useScrollRestoration Rev.] LayoutEffect triggered for path: ${pathname}, navigationType: ${navigationType}`);

    // Garante que history.scrollRestoration esteja manual
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Pula a primeira renderização (geralmente já no topo)
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      console.log('[useScrollRestoration Rev.] Initial render, skipping logic.');
      // Não força scroll aqui, deixa o navegador/router decidir o inicial
      return;
    }

    // Lógica baseada no tipo de navegação
    if (navigationType === 'POP') {
      // Voltando para uma página
      if (pathname === '/') {
        // Voltando para a PÁGINA INICIAL: Tenta restaurar
        const savedPosition = getSavedScrollPosition(pathname);
        console.log(`[useScrollRestoration Rev.] POP to HOME ('/'). Found saved position:`, savedPosition);

        if (isPositionValid(savedPosition)) {
          console.log('[useScrollRestoration Rev.] Attempting SYNC scroll restoration to:', savedPosition);
          // Tenta restaurar SINCRONAMENTE para minimizar flash
          window.scrollTo({
            left: savedPosition!.x, // Non-null assertion ok due to isPositionValid check
            top: savedPosition!.y,
            behavior: 'auto' // Instantâneo
          });
          // Marcamos como restaurando brevemente para evitar salvamento imediato no scroll listener
          setIsRestoring(true);
          setTimeout(() => setIsRestoring(false), 50); // Libera após um pequeno delay
        } else {
          console.log('[useScrollRestoration Rev.] No valid saved position for HOME, scrolling to top.');
          if (savedPosition) removeScrollPosition(pathname); // Remove expirada
          window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
        }
      } else {
        // Voltando para QUALQUER OUTRA PÁGINA: Sempre vai para o topo
        console.log(`[useScrollRestoration Rev.] POP to non-home page (${pathname}), scrolling to top.`);
        window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
      }
    } else {
      // PUSH ou REPLACE (Navegação para uma nova página)
      // Sempre vai para o topo
      console.log(`[useScrollRestoration Rev.] ${navigationType} navigation to ${pathname}, scrolling to top.`);
      window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
    }

    // Função de limpeza: Salva a posição ANTES de desmontar, APENAS se for a página inicial
    const currentPath = pathname;
    return () => {
      if (currentPath === '/') {
        console.log(`[useScrollRestoration Rev.] Cleanup: Saving scroll for HOME ('/')`);
        managerSaveScrollPosition(currentPath, 'LayoutEffect cleanup');
      } else {
        console.log(`[useScrollRestoration Rev.] Cleanup: Not saving scroll for non-home page (${currentPath})`);
      }
    };
  // Dependências: location e navigationType são suficientes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, navigationType]);

  // Salva periodicamente durante a rolagem, APENAS na página inicial (com debounce)
  useEffect(() => {
    const { pathname } = location;

    // Só adiciona listener se estiver na página inicial
    if (pathname !== '/') {
      return; // Sai se não for a página inicial
    }

    let scrollTimer: number | null = null;

    const handleScroll = () => {
      // Não salva se estivermos no meio de uma restauração síncrona
      if (getIsRestoring()) return;

      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }

      scrollTimer = window.setTimeout(() => {
        console.log('[useScrollRestoration Rev.] Debounced scroll event triggered save for HOME.');
        managerSaveScrollPosition(pathname, 'debounced scroll');
      }, 350) as unknown as number;
    };

    console.log(`[useScrollRestoration Rev.] Adding scroll listener for HOME ('/')`);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Função de limpeza do listener
    return () => {
      console.log(`[useScrollRestoration Rev.] Removing scroll listener for HOME ('/')`);
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location]); // Depende apenas da location para reavaliar se está na home

  // Listener de visibilidade não é mais estritamente necessário com a lógica simplificada,
  // mas pode ser mantido como fallback se houver problemas com abas.
  // Por ora, vamos remover para simplificar.

};

