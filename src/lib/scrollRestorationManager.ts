
// Sistema de restauração de scroll otimizado para Safari mobile
interface ScrollPosition {
  x: number;
  y: number;
  timestamp: number;
  attempts?: number;
}

class ScrollRestorationManager {
  private positions = new Map<string, ScrollPosition>();
  private isRestoring = false;
  private cleanupInterval: number;
  private isSafari: boolean;
  private lastSavedPath = '';

  constructor() {
    // Detecta Safari
    this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    // Limpa posições antigas a cada 10 minutos
    this.cleanupInterval = window.setInterval(() => {
      this.cleanup();
    }, 10 * 60 * 1000);

    console.log(`[ScrollManager] Initialized. Safari detected: ${this.isSafari}`);
  }

  savePosition(path: string, source: string = 'unknown'): void {
    if (this.isRestoring) {
      console.log(`[ScrollManager] Skipping save - currently restoring`);
      return;
    }

    const position: ScrollPosition = {
      x: window.scrollX,
      y: window.scrollY,
      timestamp: Date.now(),
      attempts: 0
    };

    // Para Safari, sempre salva mesmo com scroll pequeno para evitar perda
    const minScroll = this.isSafari ? 10 : 50;
    
    if (position.y > minScroll) {
      this.positions.set(path, position);
      this.lastSavedPath = path;
      console.log(`[ScrollManager] Saved position for ${path} (${source}): y=${position.y}, Safari=${this.isSafari}`);
      
      // Safari: força salvamento adicional no sessionStorage como backup
      if (this.isSafari) {
        try {
          const safariKey = `safari_scroll_${path}`;
          sessionStorage.setItem(safariKey, JSON.stringify(position));
        } catch (e) {
          console.warn('[ScrollManager] Safari backup save failed:', e);
        }
      }
    }
  }

  async restorePosition(path: string, context: string = 'unknown'): Promise<boolean> {
    let savedPosition = this.positions.get(path);
    
    // Safari: tenta recuperar do backup se posição principal não existe
    if (!savedPosition && this.isSafari) {
      try {
        const safariKey = `safari_scroll_${path}`;
        const backupData = sessionStorage.getItem(safariKey);
        if (backupData) {
          savedPosition = JSON.parse(backupData);
          console.log(`[ScrollManager] Safari: recovered from backup for ${path}`);
        }
      } catch (e) {
        console.warn('[ScrollManager] Safari backup recovery failed:', e);
      }
    }
    
    if (!savedPosition) {
      console.log(`[ScrollManager] No saved position for ${path}`);
      return false;
    }

    // Verifica se não expirou (Safari: tempo menor por causa dos problemas de memória)
    const now = Date.now();
    const maxAge = this.isSafari ? 10 * 60 * 1000 : 15 * 60 * 1000; // Safari: 10 min, outros: 15 min
    
    if (now - savedPosition.timestamp > maxAge) {
      console.log(`[ScrollManager] Position expired for ${path}`);
      this.positions.delete(path);
      if (this.isSafari) {
        try {
          sessionStorage.removeItem(`safari_scroll_${path}`);
        } catch (e) {
          console.warn('[ScrollManager] Safari cleanup failed:', e);
        }
      }
      return false;
    }

    // Safari: posição mínima menor
    const minPosition = this.isSafari ? 20 : 100;
    if (savedPosition.y < minPosition) {
      console.log(`[ScrollManager] Position too small for ${path}: ${savedPosition.y}px`);
      return false;
    }

    console.log(`[ScrollManager] Restoring position for ${path} (${context}): y=${savedPosition.y}, Safari=${this.isSafari}`);
    
    this.isRestoring = true;
    savedPosition.attempts = (savedPosition.attempts || 0) + 1;

    return new Promise((resolve) => {
      // Safari: timing específico e múltiplas tentativas
      const safariDelay = this.isSafari ? 250 : 150;
      const maxAttempts = this.isSafari ? 3 : 1;
      
      const attemptRestore = (attemptNumber: number = 1) => {
        setTimeout(() => {
          // Safari: scroll behavior sempre 'auto' (instant não funciona bem)
          window.scrollTo({
            left: savedPosition.x,
            top: savedPosition.y,
            behavior: 'auto'
          });

          // Verificação de sucesso com timeout maior para Safari
          const verificationDelay = this.isSafari ? 300 : 200;
          setTimeout(() => {
            const currentY = window.scrollY;
            const tolerance = this.isSafari ? 150 : 100; // Safari: tolerância maior
            const success = Math.abs(currentY - savedPosition.y) <= tolerance;
            
            console.log(`[ScrollManager] Restore attempt ${attemptNumber}: target=${savedPosition.y}, current=${currentY}, success=${success}, Safari=${this.isSafari}`);
            
            // Safari: tenta novamente se falhou e ainda há tentativas
            if (!success && attemptNumber < maxAttempts && this.isSafari) {
              console.log(`[ScrollManager] Safari: retrying restore (${attemptNumber + 1}/${maxAttempts})`);
              attemptRestore(attemptNumber + 1);
              return;
            }
            
            this.isRestoring = false;
            resolve(success);
          }, verificationDelay);
        }, safariDelay);
      };

      attemptRestore();
    });
  }

  removePosition(path: string): void {
    if (this.positions.has(path)) {
      this.positions.delete(path);
      console.log(`[ScrollManager] Removed position for ${path}`);
    }
    
    // Safari: remove também do backup
    if (this.isSafari) {
      try {
        sessionStorage.removeItem(`safari_scroll_${path}`);
      } catch (e) {
        console.warn('[ScrollManager] Safari backup removal failed:', e);
      }
    }
  }

  setIsRestoring(restoring: boolean): void {
    this.isRestoring = restoring;
  }

  getIsRestoring(): boolean {
    return this.isRestoring;
  }

  // Safari: método para forçar salvamento antes de navegação
  forceSave(path: string): void {
    if (this.isSafari) {
      this.savePosition(path, 'safari force save');
    }
  }

  private cleanup(): void {
    const now = Date.now();
    const maxAge = this.isSafari ? 10 * 60 * 1000 : 15 * 60 * 1000;

    for (const [path, position] of this.positions.entries()) {
      if (now - position.timestamp > maxAge) {
        this.positions.delete(path);
        console.log(`[ScrollManager] Cleaned up expired position for ${path}`);
        
        // Safari: limpa backup também
        if (this.isSafari) {
          try {
            sessionStorage.removeItem(`safari_scroll_${path}`);
          } catch (e) {
            console.warn('[ScrollManager] Safari backup cleanup failed:', e);
          }
        }
      }
    }
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.positions.clear();
    
    // Safari: limpa todos os backups
    if (this.isSafari) {
      try {
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key?.startsWith('safari_scroll_')) {
            sessionStorage.removeItem(key);
          }
        }
      } catch (e) {
        console.warn('[ScrollManager] Safari full cleanup failed:', e);
      }
    }
  }
}

// Instância singleton
const scrollManager = new ScrollRestorationManager();

// Exports
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

export const forceSavePosition = (path: string) => {
  scrollManager.forceSave(path);
};

export default scrollManager;
