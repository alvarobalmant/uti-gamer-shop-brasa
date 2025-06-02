
// Sistema de restauração de scroll otimizado para Safari mobile
interface ScrollPosition {
  x: number;
  y: number;
  timestamp: number;
  attempts?: number;
  source?: string;
}

class ScrollRestorationManager {
  private positions = new Map<string, ScrollPosition>();
  private isRestoring = false;
  private cleanupInterval: number;
  private isSafari: boolean;
  private isMobile: boolean;
  private isSafariMobile: boolean;

  constructor() {
    // Detecta Safari e dispositivos móveis
    this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    this.isSafariMobile = this.isSafari && this.isMobile;
    
    // Limpa posições antigas a cada 10 minutos
    this.cleanupInterval = window.setInterval(() => {
      this.cleanup();
    }, 10 * 60 * 1000);

    console.log(`[ScrollManager] Initialized. Safari: ${this.isSafari}, Mobile: ${this.isMobile}, SafariMobile: ${this.isSafariMobile}`);
    
    // Inicializa o backup do Safari Mobile a partir do sessionStorage
    if (this.isSafariMobile) {
      this.restoreFromBackup();
    }
  }

  // Restaura posições do backup do sessionStorage (Safari Mobile)
  private restoreFromBackup(): void {
    if (!this.isSafariMobile) return;
    
    try {
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key?.startsWith('safari_scroll_')) {
          const path = key.replace('safari_scroll_', '');
          const data = sessionStorage.getItem(key);
          if (data) {
            const position = JSON.parse(data);
            this.positions.set(path, position);
            console.log(`[ScrollManager] Safari Mobile: Restored position from backup for ${path}: y=${position.y}`);
          }
        }
      }
    } catch (e) {
      console.warn('[ScrollManager] Safari Mobile: Backup restoration failed:', e);
    }
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
      attempts: 0,
      source
    };

    // Para Safari Mobile, sempre salva mesmo com scroll pequeno
    const minScroll = this.isSafariMobile ? 5 : 50;
    
    if (position.y > minScroll || path.includes('/produto/')) {
      this.positions.set(path, position);
      
      console.log(`[ScrollManager] Saved position for ${path} (${source}): y=${position.y}`);
      
      // Safari Mobile: força salvamento adicional no sessionStorage como backup
      if (this.isSafariMobile) {
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
    
    // Safari Mobile: tenta recuperar do backup se posição principal não existe
    if (!savedPosition && this.isSafariMobile) {
      try {
        const safariKey = `safari_scroll_${path}`;
        const backupData = sessionStorage.getItem(safariKey);
        if (backupData) {
          savedPosition = JSON.parse(backupData);
          console.log(`[ScrollManager] Safari Mobile: recovered from backup for ${path}`);
          this.positions.set(path, savedPosition);
        }
      } catch (e) {
        console.warn('[ScrollManager] Safari backup recovery failed:', e);
      }
    }
    
    if (!savedPosition) {
      console.log(`[ScrollManager] No saved position for ${path}`);
      return false;
    }

    // Verifica se não expirou
    const now = Date.now();
    const maxAge = this.isSafariMobile ? 5 * 60 * 1000 : 15 * 60 * 1000;
    
    if (now - savedPosition.timestamp > maxAge) {
      console.log(`[ScrollManager] Position expired for ${path}`);
      this.positions.delete(path);
      if (this.isSafariMobile) {
        try {
          sessionStorage.removeItem(`safari_scroll_${path}`);
        } catch (e) {
          console.warn('[ScrollManager] Safari cleanup failed:', e);
        }
      }
      return false;
    }

    const minPosition = this.isSafariMobile ? 10 : 100;
    if (savedPosition.y < minPosition && !path.includes('/produto/')) {
      console.log(`[ScrollManager] Position too small for ${path}: ${savedPosition.y}px`);
      return false;
    }

    console.log(`[ScrollManager] Restoring position for ${path} (${context}): y=${savedPosition.y}`);
    
    this.isRestoring = true;

    return new Promise((resolve) => {
      const delay = this.isSafariMobile ? 300 : 150;
      
      setTimeout(() => {
        window.scrollTo({
          left: savedPosition.x,
          top: savedPosition.y,
          behavior: 'auto'
        });

        // Verificação de sucesso
        setTimeout(() => {
          const currentY = window.scrollY;
          const tolerance = this.isSafariMobile ? 200 : 100;
          const success = Math.abs(currentY - savedPosition.y) <= tolerance;
          
          console.log(`[ScrollManager] Restore result: target=${savedPosition.y}, current=${currentY}, success=${success}`);
          
          this.isRestoring = false;
          resolve(success);
        }, this.isSafariMobile ? 200 : 100);
      }, delay);
    });
  }

  removePosition(path: string): void {
    if (this.positions.has(path)) {
      this.positions.delete(path);
      console.log(`[ScrollManager] Removed position for ${path}`);
    }
    
    if (this.isSafariMobile) {
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

  forceSave(path: string): void {
    const position: ScrollPosition = {
      x: window.scrollX,
      y: window.scrollY,
      timestamp: Date.now(),
      attempts: 0,
      source: 'force save'
    };
    
    this.positions.set(path, position);
    
    console.log(`[ScrollManager] Force saved position for ${path}: y=${position.y}`);
    
    if (this.isSafariMobile) {
      try {
        const safariKey = `safari_scroll_${path}`;
        sessionStorage.setItem(safariKey, JSON.stringify(position));
      } catch (e) {
        console.warn('[ScrollManager] Safari force backup save failed:', e);
      }
    }
  }

  private cleanup(): void {
    const now = Date.now();
    const maxAge = this.isSafariMobile ? 5 * 60 * 1000 : 15 * 60 * 1000;

    for (const [path, position] of this.positions.entries()) {
      if (now - position.timestamp > maxAge) {
        this.positions.delete(path);
        console.log(`[ScrollManager] Cleaned up expired position for ${path}`);
        
        if (this.isSafariMobile) {
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
    
    if (this.isSafariMobile) {
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
