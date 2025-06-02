
// Tipos
interface ScrollPositionEntry {
  x: number;
  y: number;
  timestamp: number;
}
type ScrollPositionMap = Record<string, ScrollPositionEntry>;

// Estado compartilhado em memória
const scrollPositions: ScrollPositionMap = {};
let isRestoring = false;

// Função para salvar a posição de scroll atual
export const saveScrollPosition = (path: string, source: string = 'unknown') => {
  if (isRestoring) {
    return;
  }

  const scrollPos: ScrollPositionEntry = {
    x: window.scrollX,
    y: window.scrollY,
    timestamp: Date.now()
  };

  // Só salva se houver scroll significativo (> 20px) para evitar salvar posições irrelevantes
  if (scrollPos.y > 20 || scrollPos.x > 20) {
    scrollPositions[path] = scrollPos;
    console.log(`[ScrollManager v7] Saved scroll position for ${path} (source: ${source}):`, scrollPos);
  }
};

// Funções para controlar o estado de restauração
export const setIsRestoring = (restoring: boolean) => {
  isRestoring = restoring;
};

export const getIsRestoring = () => {
  return isRestoring;
};

// Função para obter a posição salva
export const getSavedScrollPosition = (path: string): ScrollPositionEntry | undefined => {
  return scrollPositions[path];
};

// Função para remover posição
export const removeScrollPosition = (path: string) => {
  if (scrollPositions[path]) {
    delete scrollPositions[path];
    console.log(`[ScrollManager v7] Removed scroll position for ${path}.`);
  }
};

// Função para limpar posições antigas (chamada periodicamente)
export const cleanupOldPositions = () => {
  const now = Date.now();
  const maxAge = 30 * 60 * 1000; // 30 minutos

  Object.keys(scrollPositions).forEach(path => {
    if (now - scrollPositions[path].timestamp > maxAge) {
      delete scrollPositions[path];
      console.log(`[ScrollManager v7] Cleaned up old position for ${path}`);
    }
  });
};

// Limpeza automática a cada 5 minutos
setInterval(cleanupOldPositions, 5 * 60 * 1000);
