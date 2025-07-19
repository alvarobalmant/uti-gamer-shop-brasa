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
  const restoreTimeoutRef = useRef<number | null>(null);

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

    console.log(`[ScrollRestoration] 🔄 NAVEGAÇÃO DETECTADA. Tipo: ${navigationType}, De: ${previousPathKey}, Para: ${currentPathKey}`);

    // Limpa qualquer timeout de restauração anterior
    if (restoreTimeoutRef.current) {
      clearTimeout(restoreTimeoutRef.current);
      restoreTimeoutRef.current = null;
    }

    // SALVA IMEDIATAMENTE a posição da página anterior antes de qualquer coisa
    if (previousPathKey !== currentPathKey && !scrollManager.getIsRestoring()) {
      scrollManager.savePosition(previousPathKey, 'navigation sync save');
      console.log(`[ScrollRestoration] 💾 SALVOU posição da página anterior: ${previousPathKey}`);
    }

    // Lógica de restauração/scroll para a NOVA página
    if (navigationType === NavigationType.Pop) {
      // Tentativa de restaurar a posição salva para esta página
      console.log(`[ScrollRestoration] ⬅️ POP detectado (VOLTAR). Tentando restaurar para: ${currentPathKey}`);
      
      // Verificar se é homepage para aguardar carregamento
      const isHomepage = currentPathKey === '/' || currentPathKey === '';
      
      // Aguardar para garantir que o DOM esteja completamente renderizado
      restoreTimeoutRef.current = window.setTimeout(async () => {
        const restored = await scrollManager.restorePosition(
          currentPathKey, 
          'POP navigation',
          isHomepage // Aguardar carregamento apenas na homepage
        );
        
        if (!restored) {
          console.log(`[ScrollRestoration] ❌ Restauração falhou para ${currentPathKey}. Aplicando fallback.`);
          // Emergency fallback: tenta restaurar após um delay maior
          setTimeout(async () => {
            const fallbackRestored = await scrollManager.restorePosition(currentPathKey, 'emergency fallback');
            if (!fallbackRestored) {
              console.log(`[ScrollRestoration] ⚠️ Fallback também falhou. Mantendo posição atual.`);
            }
          }, 500);
        } else {
          console.log(`[ScrollRestoration] ✅ Posição restaurada com sucesso para ${currentPathKey}!`);
        }
        
        restoreTimeoutRef.current = null;
      }, isHomepage ? 250 : 350); // Delay otimizado

    } else {
      // Nova navegação (PUSH ou REPLACE)
      const isProductPage = currentPathKey.startsWith('/produto/');
      if (!isProductPage) {
        console.log(`[ScrollRestoration] ➡️ ${navigationType} detectado para página que NÃO é produto. Indo para topo: ${currentPathKey}`);
        // Remove qualquer posição salva para o caminho atual, pois é uma nova visita
        scrollManager.removePosition(currentPathKey);
        window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
      } else {
        console.log(`[ScrollRestoration] ➡️ ${navigationType} detectado em página de produto. SEM scroll automático: ${currentPathKey}`);
        // Para páginas de produto, remove posição mas não força scroll
        scrollManager.removePosition(currentPathKey);
      }
    }

    // Atualiza a referência do último caminho *após* o processamento
    lastPathRef.current = currentPathKey;

    // Cleanup function
    return () => {
      if (restoreTimeoutRef.current) {
        clearTimeout(restoreTimeoutRef.current);
        restoreTimeoutRef.current = null;
      }
    };

  }, [location.pathname, location.search, navigationType]); // Depende do pathname e search para identificar a página única

  // Efeito para salvar a posição durante o scroll (inteligente)
  useEffect(() => {
    const currentPathKey = location.pathname + location.search;
    let scrollDebounceTimer: number | null = null;
    let lastSavedPosition = 0;

    const handleScroll = () => {
      // Não salva enquanto restaura ou se a posição não mudou significativamente
      if (scrollManager.getIsRestoring()) return;
      
      const currentY = window.scrollY;
      if (Math.abs(currentY - lastSavedPosition) < 50) return; // Evita saves desnecessários

      if (scrollDebounceTimer) {
        clearTimeout(scrollDebounceTimer);
      }
      
      scrollDebounceTimer = window.setTimeout(() => {
        scrollManager.savePosition(currentPathKey, 'intelligent scroll');
        lastSavedPosition = currentY;
      }, 400); // Debounce aumentado para evitar conflitos
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    console.log(`[ScrollRestoration] Intelligent scroll listener added for: ${currentPathKey}`);

    return () => {
      if (scrollDebounceTimer) {
        clearTimeout(scrollDebounceTimer);
      }
      window.removeEventListener('scroll', handleScroll);
      
      // Salva uma última vez ao desmontar/mudar de rota APENAS se não estiver restaurando
      if (!scrollManager.getIsRestoring()) {
        scrollManager.savePosition(currentPathKey, 'cleanup save');
        console.log(`[ScrollRestoration] Final position saved for: ${currentPathKey}`);
      }
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

