import { useRef, useCallback } from 'react';

// Tipos
interface ScrollPositionEntry {
  x: number;
  y: number;
  timestamp: number;
}
type ScrollPositionMap = Record<string, ScrollPositionEntry>;

// Estado compartilhado (simulando um singleton/módulo)
// REMOVIDO: Carregamento inicial do localStorage
const scrollPositions: ScrollPositionMap = {};
let isRestoring = false; // Flag para evitar salvar durante a restauração

// REMOVIDO: Função para persistir posições no localStorage
// const persistScrollPositions = () => { ... };

// Função exportada para salvar a posição de scroll atual
export const saveScrollPosition = (path: string, source: string = 'unknown') => {
  // Não salva se estamos no processo de restauração
  if (isRestoring) {
    // console.log(`[ScrollManager] Save skipped for ${path} (source: ${source}) because restoration is in progress.`);
    return;
  }

  const scrollPos: ScrollPositionEntry = {
    x: window.scrollX,
    y: window.scrollY,
    timestamp: Date.now()
  };

  // Só salva se realmente houver scroll significativo (evita salvar 0,0)
  // Armazena apenas na memória agora, não mais no localStorage
  if (scrollPos.y > 10 || scrollPos.x > 10) {
    scrollPositions[path] = scrollPos;
    console.log(`[ScrollManager - Memory Only] Saved scroll position for ${path} (source: ${source}):`, scrollPos);
    // REMOVIDO: persistScrollPositions();
  } else {
    // console.log(`[ScrollManager - Memory Only] Save skipped for ${path} (source: ${source}) due to insignificant scroll (y=${scrollPos.y}, x=${scrollPos.x}).`);
  }
};

// Funções para controlar o estado de restauração (usadas pelo hook)
export const setIsRestoring = (restoring: boolean) => {
  // console.log(`[ScrollManager] Setting isRestoring to: ${restoring}`);
  isRestoring = restoring;
};

export const getIsRestoring = () => {
  return isRestoring;
};

// Função para obter a posição salva (usada pelo hook)
export const getSavedScrollPosition = (path: string): ScrollPositionEntry | undefined => {
  return scrollPositions[path];
};

// Função para remover posição (usada pelo hook para expiração)
export const removeScrollPosition = (path: string) => {
  if (scrollPositions[path]) {
    delete scrollPositions[path];
    console.log(`[ScrollManager - Memory Only] Removed scroll position for ${path}.`);
    // REMOVIDO: persistScrollPositions();
  }
};

// REMOVIDO: Listener de beforeunload para salvar no localStorage
// window.addEventListener('beforeunload', () => { ... });

