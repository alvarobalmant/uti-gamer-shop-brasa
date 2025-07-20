// Sistema de scroll restoration robusto e simples
interface PageScrollData {
  y: number;
  timestamp: number;
}

class SimpleScrollManager {
  private scrollPositions = new Map<string, PageScrollData>();
  private saveInterval: number | null = null;
  private currentPath: string = '';
  private isRestoring = false;
  
  constructor() {
    this.initializeSaveInterval();
  }

  // Inicia o salvamento automático a cada 20ms
  private initializeSaveInterval(): void {
    if (this.saveInterval) {
      clearInterval(this.saveInterval);
    }
    
    this.saveInterval = window.setInterval(() => {
      this.saveCurrentPosition();
<<<<<<< HEAD
    }, 150);
    
    console.log('[SimpleScrollManager] ✅ Sistema iniciado - salvamento a cada 150ms');
=======
    }, 20);
    
    console.log('[SimpleScrollManager] ✅ Sistema iniciado - salvamento a cada 20ms');
>>>>>>> f4f3b9ce92abff7508966d295fc2a040175fa4e9
  }

  // Salva a posição atual
  private saveCurrentPosition(): void {
    if (this.isRestoring || !this.currentPath) return;
    
    const scrollY = window.scrollY;
    
    this.scrollPositions.set(this.currentPath, {
      y: scrollY,
      timestamp: Date.now()
    });
  }

  // Define a página atual
  setCurrentPage(path: string): void {
    console.log(`[SimpleScrollManager] 📄 Mudança de página: ${this.currentPath} → ${path}`);
    this.currentPath = path;
  }

  // Restaura a posição da página atual com delay obrigatório
  async restoreCurrentPagePosition(): Promise<void> {
    const savedData = this.scrollPositions.get(this.currentPath);
    
    if (!savedData) {
      console.log(`[SimpleScrollManager] 📍 Nenhuma posição salva para ${this.currentPath} - indo para o topo`);
      this.goToTop();
      return;
    }

    console.log(`[SimpleScrollManager] 🎯 RESTAURANDO posição para ${this.currentPath}: ${savedData.y}px`);
    
    // Aguarda 500ms OBRIGATÓRIO após carregamento
    await this.waitForPageLoad();
    
    this.isRestoring = true;
    
    // Restaura a posição
    window.scrollTo({
      left: 0,
      top: savedData.y,
      behavior: 'auto'
    });
    
    // Aguarda um pouco e verifica se funcionou
    setTimeout(() => {
      const currentY = window.scrollY;
      const success = Math.abs(currentY - savedData.y) <= 10;
      
      if (success) {
        console.log(`[SimpleScrollManager] ✅ SUCESSO! Posição restaurada: ${currentY}px`);
      } else {
        console.log(`[SimpleScrollManager] ❌ FALHA na restauração. Target: ${savedData.y}px, Atual: ${currentY}px`);
        // Tenta mais uma vez
        window.scrollTo({
          left: 0,
          top: savedData.y,
          behavior: 'auto'
        });
      }
      
      this.isRestoring = false;
    }, 100);
  }

  // Vai para o topo
  private goToTop(): void {
    window.scrollTo({
      left: 0,
      top: 0,
      behavior: 'auto'
    });
  }

  // Aguarda 500ms + verifica se página carregou
  private async waitForPageLoad(): Promise<void> {
    return new Promise((resolve) => {
      // Sempre aguarda 500ms mínimo
      setTimeout(() => {
        // Verifica se documento está pronto
        if (document.readyState === 'complete') {
          resolve();
        } else {
          // Se não estiver pronto, aguarda mais um pouco
          const checkReady = () => {
            if (document.readyState === 'complete') {
              resolve();
            } else {
              setTimeout(checkReady, 50);
            }
          };
          checkReady();
        }
      }, 500); // 500ms obrigatório
    });
  }

  // Remove posição salva de uma página
  clearPagePosition(path: string): void {
    this.scrollPositions.delete(path);
    console.log(`[SimpleScrollManager] 🗑️ Posição removida para: ${path}`);
  }

  // Debug: mostra todas as posições salvas
  debugPositions(): void {
    console.log('[SimpleScrollManager] 🔍 DEBUG - Posições salvas:');
    for (const [path, data] of this.scrollPositions.entries()) {
      const age = Math.round((Date.now() - data.timestamp) / 1000);
      console.log(`  ${path}: ${data.y}px (${age}s atrás)`);
    }
    console.log(`  Página atual: ${this.currentPath}`);
    console.log(`  Restaurando: ${this.isRestoring}`);
  }

  // Limpa o sistema
  destroy(): void {
    if (this.saveInterval) {
      clearInterval(this.saveInterval);
      this.saveInterval = null;
    }
    this.scrollPositions.clear();
    console.log('[SimpleScrollManager] 🔌 Sistema destruído');
  }
}

// Instância global
const simpleScrollManager = new SimpleScrollManager();

// Expor globalmente para debug
declare global {
  interface Window {
    simpleScrollManager: typeof simpleScrollManager;
  }
}

if (typeof window !== 'undefined') {
  window.simpleScrollManager = simpleScrollManager;
}

export default simpleScrollManager;