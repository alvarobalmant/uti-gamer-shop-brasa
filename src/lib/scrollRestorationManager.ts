
// Sistema de restauração de scroll simplificado e robusto
interface ScrollPosition {
  x: number;
  y: number;
  timestamp: number;
}

class ScrollRestorationManager {
  private positions = new Map<string, ScrollPosition>();
  private isRestoring = false;
  private cleanupInterval: number;

  constructor() {
    // Limpa posições antigas a cada 10 minutos
    this.cleanupInterval = window.setInterval(() => {
      this.cleanup();
    }, 10 * 60 * 1000);
  }

  savePosition(path: string, source: string = 'unknown'): void {
    if (this.isRestoring) {
      console.log(`[ScrollManager] Skipping save - currently restoring`);
      return;
    }

    const position: ScrollPosition = {
      x: window.scrollX,
      y: window.scrollY,
      timestamp: Date.now()
    };

    // Só salva se tiver scroll significativo
    if (position.y > 50) {
      this.positions.set(path, position);
      console.log(`[ScrollManager] Saved position for ${path} (${source}): y=${position.y}`);
    }
  }

  async restorePosition(path: string, context: string = 'unknown'): Promise<boolean> {
    const savedPosition = this.positions.get(path);
    
    if (!savedPosition) {
      console.log(`[ScrollManager] No saved position for ${path}`);
      return false;
    }

    // Verifica se não expirou (15 minutos)
    const now = Date.now();
    const maxAge = 15 * 60 * 1000;
    
    if (now - savedPosition.timestamp > maxAge) {
      console.log(`[ScrollManager] Position expired for ${path}`);
      this.positions.delete(path);
      return false;
    }

    // Só restaura se for uma posição significativa
    if (savedPosition.y < 100) {
      console.log(`[ScrollManager] Position too small for ${path}: ${savedPosition.y}px`);
      return false;
    }

    console.log(`[ScrollManager] Restoring position for ${path} (${context}): y=${savedPosition.y}`);
    
    this.isRestoring = true;

    return new Promise((resolve) => {
      // Aguarda o DOM estar pronto
      setTimeout(() => {
        window.scrollTo({
          left: savedPosition.x,
          top: savedPosition.y,
          behavior: 'auto'
        });

        // Verifica se conseguiu restaurar
        setTimeout(() => {
          const currentY = window.scrollY;
          const success = Math.abs(currentY - savedPosition.y) <= 100;
          
          console.log(`[ScrollManager] Restore result: target=${savedPosition.y}, current=${currentY}, success=${success}`);
          
          this.isRestoring = false;
          resolve(success);
        }, 200);
      }, 150);
    });
  }

  removePosition(path: string): void {
    if (this.positions.has(path)) {
      this.positions.delete(path);
      console.log(`[ScrollManager] Removed position for ${path}`);
    }
  }

  setIsRestoring(restoring: boolean): void {
    this.isRestoring = restoring;
  }

  getIsRestoring(): boolean {
    return this.isRestoring;
  }

  private cleanup(): void {
    const now = Date.now();
    const maxAge = 15 * 60 * 1000; // 15 minutos

    for (const [path, position] of this.positions.entries()) {
      if (now - position.timestamp > maxAge) {
        this.positions.delete(path);
        console.log(`[ScrollManager] Cleaned up expired position for ${path}`);
      }
    }
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.positions.clear();
  }
}

// Instância singleton
const scrollManager = new ScrollRestorationManager();

// Exports para compatibilidade
export const saveScrollPosition = (path: string, source?: string) => {
  scrollManager.savePosition(path, source);
};

export const getSavedScrollPosition = (path: string) => {
  // Retorna undefined para manter compatibilidade
  return undefined;
};

export const removeScrollPosition = (path: string) => {
  scrollManager.removePosition(path);
};

export const setIsRestoring = (restoring: boolean) => {
  scrollManager.setIsRestoring(restoring);
};

export const getIsRestoring = () => {
  scrollManager.getIsRestoring();
};

export const cleanupOldPositions = () => {
  // Função vazia para compatibilidade
};

// Novos exports
export const restoreScrollPosition = (path: string, context?: string) => {
  return scrollManager.restorePosition(path, context);
};

export default scrollManager;
