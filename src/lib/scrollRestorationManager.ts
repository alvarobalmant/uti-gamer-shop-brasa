
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

    // Salva qualquer posição de scroll (removido threshold)
    this.positions.set(path, position);
    console.log(`[ScrollManager] Saved position for ${path} (${source}): y=${position.y}`);
  }

  async restorePosition(path: string, context: string = 'unknown', waitForContent: boolean = false): Promise<boolean> {
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

    // Restaura qualquer posição salva (removido threshold)
    console.log(`[ScrollManager] Restoring saved position for ${path}: ${savedPosition.y}px`);

    console.log(`[ScrollManager] Restoring position for ${path} (${context}): y=${savedPosition.y}, waitForContent=${waitForContent}`);
    
    this.isRestoring = true;

    return new Promise((resolve) => {
      const attemptRestore = () => {
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
      };

      if (waitForContent) {
        // Aguardar carregamento de conteúdo para homepage
        this.waitForContentLoaded().then(() => {
          console.log(`[ScrollManager] Content loaded, attempting restore`);
          attemptRestore();
        }).catch(() => {
          console.log(`[ScrollManager] Content loading timeout, attempting restore anyway`);
          attemptRestore();
        });
      } else {
        // Comportamento original para outras páginas
        setTimeout(attemptRestore, 150);
      }
    });
  }

  private waitForContentLoaded(): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = 8000; // 8 segundos timeout
      const checkInterval = 100; // Verificar a cada 100ms
      let elapsed = 0;

      const checkContent = () => {
        // Verificar se elementos críticos existem e têm altura
        const criticalSelectors = [
          '[data-section="products"]',
          '[data-section="jogos-da-galera"]',
          '.product-card',
          '[data-testid="section-renderer"]'
        ];

        const hasContent = criticalSelectors.some(selector => {
          const elements = document.querySelectorAll(selector);
          if (elements.length === 0) return false;
          
          // Verificar se pelo menos um elemento tem altura significativa
          return Array.from(elements).some(el => {
            const rect = el.getBoundingClientRect();
            return rect.height > 50;
          });
        });

        if (hasContent) {
          console.log(`[ScrollManager] Critical content detected after ${elapsed}ms`);
          resolve();
          return;
        }

        elapsed += checkInterval;
        if (elapsed >= timeout) {
          console.log(`[ScrollManager] Content loading timeout after ${elapsed}ms`);
          reject(new Error('Content loading timeout'));
          return;
        }

        setTimeout(checkContent, checkInterval);
      };

      // Verificar imediatamente
      checkContent();
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

// Exports simplificados
export const saveScrollPosition = (path: string, source?: string) => {
  scrollManager.savePosition(path, source);
};

export const restoreScrollPosition = (path: string, context?: string) => {
  return scrollManager.restorePosition(path, context);
};

export const removeScrollPosition = (path: string) => {
  scrollManager.removePosition(path);
};

export const setIsRestoring = (restoring: boolean) => {
  scrollManager.setIsRestoring(restoring);
};

export const getIsRestoring = (): boolean => {
  return scrollManager.getIsRestoring();
};

export default scrollManager;
