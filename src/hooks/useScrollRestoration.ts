<<<<<<< HEAD
import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType, NavigationType } from 'react-router-dom';
import scrollManager from '@/lib/scrollRestorationManager'; // Assuming default export

/**
 * Hook para gerenciar a restauração da posição de scroll entre navegações.
 * Implementado com base nas melhores práticas e guias fornecidos.
=======

import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { 
  saveScrollPosition, 
  restoreScrollPosition,
  getIsRestoring 
} from '@/lib/scrollRestorationManager';

/**
 * Hook simplificado para restauração de scroll
>>>>>>> f5d47cf6457bafbf020cf7f613f58f99556abaf1
 */
export const useScrollRestoration = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
<<<<<<< HEAD
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
=======
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

    // Salva a posição da página anterior se mudou de rota
    if (previousPath && previousPath !== currentPath) {
      saveScrollPosition(previousPath, 'route change');
    }

    // Lógica de restauração baseada no tipo de navegação
    if (navigationType === 'POP') {
      // Navegação de volta (botão voltar)
      setTimeout(async () => {
        const restored = await restoreScrollPosition(currentPath, 'POP navigation');
        if (!restored) {
          console.log(`[useScrollRestoration] Failed to restore, going to top`);
          window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
        }
      }, 100);
    } else {
      // Navegação nova (PUSH/REPLACE)
      console.log(`[useScrollRestoration] New navigation (${navigationType}), going to top`);
      window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
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
>>>>>>> f5d47cf6457bafbf020cf7f613f58f99556abaf1

      if (scrollDebounceTimer) {
        clearTimeout(scrollDebounceTimer);
      }
<<<<<<< HEAD
      scrollDebounceTimer = window.setTimeout(() => {
        scrollManager.savePosition(currentPathKey, 'scroll debounce');
      }, 300); // Ajuste o debounce conforme necessário
=======

      scrollTimer = window.setTimeout(() => {
        saveScrollPosition(currentPath, 'scroll');
      }, 300); // Debounce reduzido
>>>>>>> f5d47cf6457bafbf020cf7f613f58f99556abaf1
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    console.log(`[ScrollRestoration] Scroll listener added for: ${currentPathKey}`);

    return () => {
<<<<<<< HEAD
      if (scrollDebounceTimer) {
        clearTimeout(scrollDebounceTimer);
=======
      if (scrollTimer) {
        clearTimeout(scrollTimer);
>>>>>>> f5d47cf6457bafbf020cf7f613f58f99556abaf1
      }
      window.removeEventListener('scroll', handleScroll);
      // Salva uma última vez ao desmontar/mudar de rota
      scrollManager.savePosition(currentPathKey, 'listener cleanup');
      console.log(`[ScrollRestoration] Scroll listener removed for: ${currentPathKey}`);
    };
<<<<<<< HEAD
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
=======
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
>>>>>>> f5d47cf6457bafbf020cf7f613f58f99556abaf1
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
<<<<<<< HEAD
    console.log(`[ScrollRestoration] Visibility/Unload listeners added for: ${currentPathKey}`);
=======
>>>>>>> f5d47cf6457bafbf020cf7f613f58f99556abaf1

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
<<<<<<< HEAD
      console.log(`[ScrollRestoration] Visibility/Unload listeners removed for: ${currentPathKey}`);
    };
  }, [location.pathname, location.search]);

=======
    };
  }, [location.pathname]);
>>>>>>> f5d47cf6457bafbf020cf7f613f58f99556abaf1
};
