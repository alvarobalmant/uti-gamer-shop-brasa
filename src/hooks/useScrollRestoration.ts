import { useEffect, useLayoutEffect, useCallback } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * Hook simplificado para gerenciamento de scroll.
 * - Garante scroll para o topo em navegações PUSH/REPLACE.
 * - Confia no comportamento padrão do navegador (`history.scrollRestoration = 'auto'`) 
 *   para restaurar a posição em navegações POP (voltar/avançar).
 * - Remove a complexidade de salvar/restaurar manualmente posições.
 */
export const useScrollRestoration = () => {
  const location = useLocation();
  const navigationType = useNavigationType();

  const getWindow = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        return window;
      }
    } catch (e) {
      console.warn('Window não está acessível:', e);
    }
    return null;
  }, []);

  // Garante que a restauração padrão do navegador esteja ativa
  useEffect(() => {
    const win = getWindow();
    if (!win) return;

    if (win.history.scrollRestoration !== 'auto') {
      win.history.scrollRestoration = 'auto';
      // console.log("Definido history.scrollRestoration para 'auto'");
    }

    // Restaura para 'manual' ao desmontar, se necessário (geralmente não é)
    // return () => {
    //   if (win.history.scrollRestoration === 'auto') {
    //     win.history.scrollRestoration = 'manual';
    //   }
    // };
  }, [getWindow]);

  // Efeito para rolar para o topo em novas navegações (PUSH/REPLACE)
  useLayoutEffect(() => {
    const win = getWindow();
    if (!win) return;

    // Rola para o topo apenas se não for uma navegação POP (voltar/avançar)
    if (navigationType !== 'POP') {
      // console.log(`Navegação ${navigationType}, rolando para o topo para ${location.pathname}`);
      win.scrollTo(0, 0);
    }
    // Para navegação POP, confiamos no 'history.scrollRestoration = auto'
    // else {
    //   console.log(`Navegação POP para ${location.pathname}, deixando o navegador restaurar.`);
    // }

  }, [location.pathname, navigationType, getWindow]); // Depende do pathname e tipo de navegação

}; // Fim do hook

