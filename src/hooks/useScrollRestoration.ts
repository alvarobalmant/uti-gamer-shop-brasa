import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType, NavigationType } from 'react-router-dom';
import scrollManager from '@/lib/scrollRestorationManager';

/**
 * Hook para gerenciar a restauração da posição de scroll entre navegações.
 * Versão otimizada para Safari mobile com suporte a navegação rápida entre produtos.
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

    console.log(`[ScrollRestoration] Navigating. Type: ${navigationType}, From: ${previousPathKey}, To: ${currentPathKey}, Safari: ${isSafari}, Mobile: ${isMobile}`);

    // Lógica de restauração/scroll para a NOVA página
    if (navigationType === NavigationType.Pop) {
      // Safari Mobile: força salvamento da página anterior antes de restaurar
      // Isso já é feito no scrollManager.forceSave, chamado por outros listeners
      // if (isSafariMobile && previousPathKey !== currentPathKey) {
      //   scrollManager.forceSave(previousPathKey);
      // }
      
      console.log(`[ScrollRestoration] POP detected. Attempting restore for: ${currentPathKey}`);
      
      // Safari Mobile: delay maior e uso de requestAnimationFrame
      const restoreDelay = isSafariMobile ? 250 : (isSafari ? 200 : 100);
      
      const restoreTimer = setTimeout(async () => {
        if (isSafariMobile) {
          // Safari Mobile: usa requestAnimationFrame para garantir que o DOM está pronto
          // e tenta múltiplas vezes com intervalos crescentes
          let attemptCount = 0;
          const maxAttempts = 3;
          
          const attemptRestore = () => {
            requestAnimationFrame(async () => {
              attemptCount++;
              const restored = await scrollManager.restorePosition(currentPathKey, `POP navigation (attempt ${attemptCount})`);
              
              if (!restored && attemptCount < maxAttempts) {
                // Tenta novamente com um delay crescente
                const nextDelay = 150 * attemptCount;
                console.log(`[ScrollRestoration] Safari Mobile: restore attempt ${attemptCount} failed, retrying in ${nextDelay}ms`);
                setTimeout(attemptRestore, nextDelay);
              } else if (!restored) {
                console.log(`[ScrollRestoration] All restore attempts failed for ${currentPathKey}. Scrolling top.`);
                window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
              }
            });
          };
          
          attemptRestore();
        } else if (isSafari) {
          // Safari Desktop: usa requestAnimationFrame simples
          requestAnimationFrame(async () => {
            const restored = await scrollManager.restorePosition(currentPathKey, 'POP navigation');
            if (!restored) {
              console.log(`[ScrollRestoration] Restore failed for ${currentPathKey}. Scrolling top.`);
              window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
            }
          });
        } else {
          // Outros navegadores: abordagem padrão
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

  }, [location.pathname, location.search, navigationType, isSafari, isMobile, isSafariMobile]);

  // Efeito para salvar a posição durante o scroll
  useEffect(() => {
    const currentPathKey = location.pathname + location.search;
    let scrollDebounceTimer: number | null = null;

    const handleScroll = () => {
      if (scrollManager.getIsRestoring()) return;

      if (scrollDebounceTimer) {
        clearTimeout(scrollDebounceTimer);
      }
      
      // Safari Mobile: debounce menor para capturar melhor as posições
      const debounceTime = isSafariMobile ? 150 : (isSafari ? 200 : 300);
      
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
        
        // Safari Mobile: força salvamento adicional
        if (isSafariMobile) {
          scrollManager.forceSave(currentPathKey);
        }
      }
      
      console.log(`[ScrollRestoration] Scroll listener removed for: ${currentPathKey}`);
    };
  }, [location.pathname, location.search, isSafari, isMobile, isSafariMobile]);

  // Efeito para salvar ao sair da página/mudar visibilidade
  useEffect(() => {
    const currentPathKey = location.pathname + location.search;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !scrollManager.getIsRestoring()) {
        scrollManager.savePosition(currentPathKey, 'visibility hidden');
        
        // Safari Mobile: força salvamento adicional
        if (isSafariMobile) {
          scrollManager.forceSave(currentPathKey);
        }
      }
    };

    const handleBeforeUnload = () => {
       if (!scrollManager.getIsRestoring()) {
         scrollManager.savePosition(currentPathKey, 'before unload');
         
         // Safari Mobile: força salvamento adicional
         if (isSafariMobile) {
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
  }, [location.pathname, location.search, isSafari, isMobile, isSafariMobile]);

  // Efeito especial para forçar salvamento em cliques de navegação (Safari Mobile)
  useEffect(() => {
    // Só aplicamos essa lógica especial para Safari Mobile
    if (!isSafariMobile) return;
    
    const currentPathKey = location.pathname + location.search;
    
    // Função para garantir que a posição seja salva antes de qualquer navegação
    const handleBeforeNavigate = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Verifica se o clique originou dentro do carrossel de banners para evitar interferência
      // Usamos um seletor que provavelmente identifica o container do Embla Carousel
      if (target.closest('[data-embla-carousel]')) {
          console.log('[ScrollRestoration] Click inside banner carousel, ignoring for forceSave.');
          return; // Não faz nada se o clique for dentro do carrossel de banners
      }

      // Verifica se o clique foi em um link ou botão que pode levar a outra página
      const clickableElement = target.closest('a, button');
      
      if (clickableElement) {
        const href = (clickableElement as HTMLAnchorElement).href;
        
        // Verifica se é um link para outra origem ou outro caminho interno
        const isExternalLink = href && new URL(href, window.location.origin).origin !== window.location.origin;
        const isInternalLink = href && new URL(href, window.location.origin).pathname !== location.pathname;
        
        // Verifica se é um botão de voltar (pode precisar de ajuste no seletor)
        const isBackButton = clickableElement.getAttribute('aria-label') === 'Voltar' || 
                            clickableElement.textContent?.includes('Voltar');
        
        // Se parece ser um gatilho de navegação, força o salvamento
        if (isExternalLink || isInternalLink || isBackButton) {
          console.log(`[ScrollRestoration] Safari Mobile: Detected potential navigation click outside banner. Forcing save.`);
          scrollManager.forceSave(currentPathKey); 
          // REMOVIDO: Lógica de preventDefault e setTimeout que poderia interferir
        }
      }
    };
    
    // Adiciona o listener na fase de bubble (não captura) para ser menos intrusivo
    document.addEventListener('click', handleBeforeNavigate, false);
    console.log('[ScrollRestoration] Safari Mobile navigation click listener added.');
    
    return () => {
      document.removeEventListener('click', handleBeforeNavigate, false);
      console.log('[ScrollRestoration] Safari Mobile navigation click listener removed.');
    };
  }, [location.pathname, location.search, isSafariMobile]); // Dependências ajustadas
};
