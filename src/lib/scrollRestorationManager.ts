import { useRef, useCallback } from 'react';

// Tipos
interface ScrollPositionEntry {
  x: number;
  y: number;
  timestamp: number;
}
type ScrollPositionMap = Record<string, ScrollPositionEntry>;

// Estado compartilhado (simulando um singleton/módulo)
const scrollPositions: ScrollPositionMap = {};
let isRestoring = false; // Flag para evitar salvar durante a restauração

// Carrega posições salvas do localStorage na inicialização do módulo
try {
  const savedPositions = localStorage.getItem('utiGamesScrollPositions');
  if (savedPositions) {
    Object.assign(scrollPositions, JSON.parse(savedPositions));
    console.log('[ScrollManager] Loaded scroll positions from localStorage:', scrollPositions);
  }
} catch (error) {
  console.warn('[ScrollManager] Failed to load scroll positions from localStorage:', error);
  localStorage.removeItem('utiGamesScrollPositions');
}

// Função para persistir posições no localStorage
const persistScrollPositions = () => {
  try {
    localStorage.setItem('utiGamesScrollPositions', JSON.stringify(scrollPositions));
    // console.log('[ScrollManager] Persisted scroll positions to localStorage.');
  } catch (error) {
    console.warn('[ScrollManager] Failed to save scroll positions to localStorage:', error);
  }
};

// Função exportada para salvar a posição de scroll atual
export const saveScrollPosition = (path: string, source: string = 'unknown') => {
  // Não salva se estamos no processo de restauração
  if (isRestoring) {
    console.log(`[ScrollManager] Save skipped for ${path} (source: ${source}) because restoration is in progress.`);
    return;
  }

  const scrollPos: ScrollPositionEntry = {
    x: window.scrollX,
    y: window.scrollY,
    timestamp: Date.now()
  };

  // Só salva se realmente houver scroll significativo (evita salvar 0,0)
  if (scrollPos.y > 10 || scrollPos.x > 10) {
    scrollPositions[path] = scrollPos;
    console.log(`[ScrollManager] Saved scroll position for ${path} (source: ${source}):`, scrollPos);
    persistScrollPositions(); // Atualiza localStorage
  } else {
    // console.log(`[ScrollManager] Save skipped for ${path} (source: ${source}) due to insignificant scroll (y=${scrollPos.y}, x=${scrollPos.x}).`);
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
    console.log(`[ScrollManager] Removed scroll position for ${path}.`);
    persistScrollPositions();
  }
};

// Salva posições no localStorage ao descarregar a página
// Isso garante que a última posição seja salva mesmo se o componente desmontar rápido
window.addEventListener('beforeunload', () => {
    // Tentativa de salvar a posição atual antes de sair
    // Nota: O path pode não ser o mais preciso aqui, mas é um fallback
    if (window.location) { // Verifica se window.location está disponível
        saveScrollPosition(window.location.pathname, 'beforeunload');
    }
    persistScrollPositions();
});

