import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const SESSION_STORAGE_KEY = 'scrollPositions';

/**
 * Hook robusto para restauração de posição de scroll em React Router v6.
 * - Salva a posição de scroll no sessionStorage antes de navegar.
 * - Restaura a posição em navegações POP (voltar/avançar).
 * - Rola para o topo em navegações PUSH/REPLACE.
 */
export const useScrollRestoration = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const lastNavigationType = useRef(navigationType);

  // Função para obter as posições salvas do sessionStorage
  const getScrollPositions = (): { [key: string]: number } => {
    const json = sessionStorage.getItem(SESSION_STORAGE_KEY);
    try {
      return json ? JSON.parse(json) : {};
    } catch (e) {
      console.error('Erro ao parsear posições de scroll do sessionStorage:', e);
      return {};
    }
  };

  // Função para salvar a posição atual no sessionStorage
  const saveScrollPosition = (key: string, position: number) => {
    const positions = getScrollPositions();
    positions[key] = position;
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(positions));
    } catch (e) {
      console.error('Erro ao salvar posição de scroll no sessionStorage:', e);
    }
  };

  // Salva a posição de scroll ANTES da navegação ou desmontagem
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveScrollPosition(location.key, window.scrollY);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Retorna uma função de limpeza que salva a posição ao mudar de rota
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Salva a posição da chave de localização atual ANTES de navegar para a próxima
      saveScrollPosition(location.key, window.scrollY);
    };
  }, [location.key]); // Depende da chave da localização

  // Restaura a posição de scroll ou rola para o topo APÓS a navegação
  useLayoutEffect(() => {
    // Rola para o topo se for uma nova navegação (PUSH/REPLACE)
    // Ou se for a primeira renderização (lastNavigationType ainda não definido ou diferente)
    if (navigationType !== 'POP') {
      window.scrollTo(0, 0);
    } else {
      // Se for POP, tenta restaurar a posição salva
      const positions = getScrollPositions();
      const savedPosition = positions[location.key];

      if (savedPosition !== undefined) {
        // Adiciona um pequeno delay para garantir que o DOM esteja pronto
        // Em alguns casos, especialmente com renderização assíncrona, isso pode ser necessário
        const timer = setTimeout(() => {
            window.scrollTo(0, savedPosition);
        }, 50); // 50ms delay, ajuste se necessário
        return () => clearTimeout(timer);
      } else {
        // Se não houver posição salva para esta chave (raro em POP), rola para o topo
        window.scrollTo(0, 0);
      }
    }

    // Atualiza o último tipo de navegação
    lastNavigationType.current = navigationType;

  }, [location.key, navigationType]); // Depende da chave e do tipo de navegação

}; // Fim do hook

