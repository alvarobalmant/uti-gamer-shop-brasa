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
  private lastSavedPath = '';
  private navigationLock = false;
  private lastSaveTimestamp = 0;

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

    // Para Safari Mobile, sempre salva mesmo com scroll pequeno para evitar perda
    const minScroll = this.isSafariMobile ? 5 : (this.isSafari ? 10 : 50);
    
    if (position.y > minScroll || path.includes('/product/')) {
      this.positions.set(path, position);
      this.lastSavedPath = path;
      this.lastSaveTimestamp = position.timestamp;
      
      console.log(`[ScrollManager] Saved position for ${path} (${source}): y=${position.y}, Safari=${this.isSafari}, Mobile=${this.isMobile}`);
      
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
          
          // Adiciona de volta ao Map principal
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

    // Verifica se não expirou (Safari Mobile: tempo menor por causa dos problemas de memória)
    const now = Date.now();
    const maxAge = this.isSafariMobile ? 5 * 60 * 1000 : (this.isSafari ? 10 * 60 * 1000 : 15 * 60 * 1000);
    
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

    // Safari Mobile: posição mínima menor
    const minPosition = this.isSafariMobile ? 10 : (this.isSafari ? 20 : 100);
    if (savedPosition.y < minPosition && !path.includes('/product/')) {
      console.log(`[ScrollManager] Position too small for ${path}: ${savedPosition.y}px`);
      return false;
    }

    console.log(`[ScrollManager] Restoring position for ${path} (${context}): y=${savedPosition.y}, Safari=${this.isSafari}, Mobile=${this.isMobile}`);
    
    this.isRestoring = true;
    savedPosition.attempts = (savedPosition.attempts || 0) + 1;

    return new Promise((resolve) => {
      // Safari Mobile: timing específico e múltiplas tentativas
      const safariMobileDelay = 200;
      const safariDelay = 150;
      const standardDelay = 100;
      const delay = this.isSafariMobile ? safariMobileDelay : (this.isSafari ? safariDelay : standardDelay);
      
      const maxAttempts = this.isSafariMobile ? 3 : (this.isSafari ? 2 : 1);
      
      const attemptRestore = (attemptNumber: number = 1) => {
        setTimeout(() => {
          // Safari: scroll behavior sempre 'auto' (instant não funciona bem)
          window.scrollTo({
            left: savedPosition.x,
            top: savedPosition.y,
            behavior: 'auto'
          });

          // Verificação de sucesso com timeout maior para Safari Mobile
          const verificationDelay = this.isSafariMobile ? 300 : (this.isSafari ? 200 : 150);
          setTimeout(() => {
            const currentY = window.scrollY;
            // Safari Mobile: tolerância maior para considerar sucesso
            const tolerance = this.isSafariMobile ? 200 : (this.isSafari ? 150 : 100);
            const success = Math.abs(currentY - savedPosition.y) <= tolerance;
            
            console.log(`[ScrollManager] Restore attempt ${attemptNumber}: target=${savedPosition.y}, current=${currentY}, success=${success}, Safari=${this.isSafari}, Mobile=${this.isMobile}`);
            
            // Safari: tenta novamente se falhou e ainda há tentativas
            if (!success && attemptNumber < maxAttempts && (this.isSafari || this.isSafariMobile)) {
              console.log(`[ScrollManager] Safari: retrying restore (${attemptNumber + 1}/${maxAttempts})`);
              attemptRestore(attemptNumber + 1);
              return;
            }
            
            this.isRestoring = false;
            resolve(success);
          }, verificationDelay);
        }, delay);
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

  // Safari Mobile: método para forçar salvamento antes de navegação
  forceSave(path: string): void {
    // Sempre salva, independente do navegador, mas com lógica especial para Safari Mobile
    const position: ScrollPosition = {
      x: window.scrollX,
      y: window.scrollY,
      timestamp: Date.now(),
      attempts: 0,
      source: 'force save'
    };
    
    this.positions.set(path, position);
    this.lastSavedPath = path;
    this.lastSaveTimestamp = position.timestamp;
    
    console.log(`[ScrollManager] Force saved position for ${path}: y=${position.y}, Safari=${this.isSafari}, Mobile=${this.isMobile}`);
    
    // Safari Mobile: salva também no sessionStorage como backup
    if (this.isSafariMobile) {
      try {
        const safariKey = `safari_scroll_${path}`;
        sessionStorage.setItem(safariKey, JSON.stringify(position));
        
        // Adiciona um flag especial para indicar que foi um salvamento forçado
        // Isso pode ser útil para diagnóstico
        sessionStorage.setItem('safari_last_force_save', JSON.stringify({
          path,
          timestamp: position.timestamp
        }));
      } catch (e) {
        console.warn('[ScrollManager] Safari force backup save failed:', e);
      }
    }
  }

  // Safari Mobile: método para verificar se o salvamento está em andamento
  isNavigationLocked(): boolean {
    return this.navigationLock;
  }

  // Safari Mobile: método para bloquear navegação durante salvamento
  lockNavigation(): void {
    this.navigationLock = true;
  }

  // Safari Mobile: método para desbloquear navegação após salvamento
  unlockNavigation(): void {
    this.navigationLock = false;
  }

  // Safari Mobile: método para obter o timestamp do último salvamento
  getLastSaveTimestamp(): number {
    return this.lastSaveTimestamp;
  }

  private cleanup(): void {
    const now = Date.now();
    const maxAge = this.isSafariMobile ? 5 * 60 * 1000 : (this.isSafari ? 10 * 60 * 1000 : 15 * 60 * 1000);

    for (const [path, position] of this.positions.entries()) {
      if (now - position.timestamp > maxAge) {
        this.positions.delete(path);
        console.log(`[ScrollManager] Cleaned up expired position for ${path}`);
        
        // Safari: limpa backup também
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
    
    // Safari: limpa todos os backups
    if (this.isSafariMobile) {
      try {
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key?.startsWith('safari_scroll_')) {
            sessionStorage.removeItem(key);
          }
        }
        sessionStorage.removeItem('safari_last_force_save');
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

export const isNavigationLocked = (): boolean => {
  return scrollManager.isNavigationLocked();
};

export const lockNavigation = () => {
  scrollManager.lockNavigation();
};

export const unlockNavigation = () => {
  scrollManager.unlockNavigation();
};

export const getLastSaveTimestamp = (): number => {
  return scrollManager.getLastSaveTimestamp();
};

export default scrollManager;
