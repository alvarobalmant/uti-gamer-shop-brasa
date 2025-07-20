// Sistema de scroll horizontal ULTRA SIMPLES baseado no vertical que funciona
interface HorizontalScrollData {
  x: number;
  timestamp: number;
}

interface PageHorizontalScrolls {
  [elementIndex: string]: HorizontalScrollData;
}

class HorizontalScrollManager {
  private horizontalPositions = new Map<string, PageHorizontalScrolls>();
  private saveInterval: number | null = null;
  private currentPath: string = '';
  private isRestoring = false;
  
  constructor() {
    this.initializeSaveInterval();
  }

  // Inicia o salvamento automático (IGUAL AO VERTICAL)
  private initializeSaveInterval(): void {
    if (this.saveInterval) {
      clearInterval(this.saveInterval);
    }
    
    this.saveInterval = window.setInterval(() => {
      this.saveCurrentHorizontalPositions();
    }, 150);
    
    console.log('[HorizontalScrollManager] ✅ Sistema iniciado - salvamento a cada 150ms');
  }

  // Salva posições horizontais (SIMPLIFICADO)
  private saveCurrentHorizontalPositions(): void {
    if (this.isRestoring || !this.currentPath) return;

    const scrollElements = document.querySelectorAll('.overflow-x-auto, .overflow-x-scroll');
    const pageScrolls: PageHorizontalScrolls = {};
    
    scrollElements.forEach((element, index) => {
      const htmlElement = element as HTMLElement;
      
      // Só salva se tem scroll real
      if (htmlElement.scrollWidth > htmlElement.clientWidth) {
        pageScrolls[`element-${index}`] = {
          x: htmlElement.scrollLeft,
          timestamp: Date.now()
        };
      }
    });

    // Só salva se encontrou elementos
    if (Object.keys(pageScrolls).length > 0) {
      this.horizontalPositions.set(this.currentPath, pageScrolls);
    }
  }

  // Define a página atual (IGUAL AO VERTICAL)
  setCurrentPage(path: string): void {
    console.log(`[HorizontalScrollManager] 📄 Mudança de página: ${this.currentPath} → ${path}`);
    this.currentPath = path;
  }

  // Restaura posições horizontais (IGUAL AO VERTICAL)
  async restoreCurrentPageHorizontalPositions(): Promise<void> {
    const savedData = this.horizontalPositions.get(this.currentPath);
    
    if (!savedData) {
      console.log(`[HorizontalScrollManager] 📍 Nenhuma posição horizontal salva para ${this.currentPath}`);
      return;
    }

    console.log(`[HorizontalScrollManager] 🎯 RESTAURANDO posições horizontais para ${this.currentPath}`);
    
    // Aguarda carregamento da página (IGUAL AO VERTICAL)
    await this.waitForPageLoad();
    
    this.isRestoring = true;
    
    const scrollElements = document.querySelectorAll('.overflow-x-auto, .overflow-x-scroll');
    
    // Restaura cada elemento por índice
    scrollElements.forEach((element, index) => {
      const htmlElement = element as HTMLElement;
      const elementKey = `element-${index}`;
      const scrollData = savedData[elementKey];
      
      if (scrollData && htmlElement.scrollWidth > htmlElement.clientWidth) {
        console.log(`[HorizontalScrollManager] 🔄 Restaurando elemento ${index}: ${scrollData.x}px`);
        
        // Aplica scroll (IGUAL AO VERTICAL - direto e simples)
        htmlElement.scrollLeft = scrollData.x;
        
        // Verifica se funcionou (IGUAL AO VERTICAL)
        setTimeout(() => {
          const currentX = htmlElement.scrollLeft;
          const success = Math.abs(currentX - scrollData.x) <= 10;
          
          if (success) {
            console.log(`[HorizontalScrollManager] ✅ SUCESSO! Elemento ${index} restaurado: ${currentX}px`);
          } else {
            console.log(`[HorizontalScrollManager] ❌ FALHA elemento ${index}. Target: ${scrollData.x}px, Atual: ${currentX}px`);
            // Tenta mais uma vez (IGUAL AO VERTICAL)
            htmlElement.scrollLeft = scrollData.x;
          }
        }, 100);
      }
    });
    
    setTimeout(() => {
      this.isRestoring = false;
      console.log(`[HorizontalScrollManager] ✅ Restauração horizontal completa para ${this.currentPath}`);
    }, 200);
  }

  // Aguarda carregamento da página (IGUAL AO VERTICAL)
  private async waitForPageLoad(): Promise<void> {
    return new Promise((resolve) => {
      // Sempre aguarda 500ms mínimo (IGUAL AO VERTICAL)
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
      }, 500); // 500ms obrigatório (IGUAL AO VERTICAL)
    });
  }

  // Remove posições horizontais de uma página (IGUAL AO VERTICAL)
  clearPageHorizontalPositions(path: string): void {
    this.horizontalPositions.delete(path);
    console.log(`[HorizontalScrollManager] 🗑️ Posições horizontais removidas para: ${path}`);
  }

  // Debug: mostra todas as posições horizontais salvas (IGUAL AO VERTICAL)
  debugHorizontalPositions(): void {
    console.log('[HorizontalScrollManager] 🔍 DEBUG - Posições horizontais salvas:');
    for (const [path, pageScrolls] of this.horizontalPositions.entries()) {
      const age = Object.keys(pageScrolls).length;
      console.log(`  ${path}: ${age} elementos salvos`);
      for (const [elementKey, scrollData] of Object.entries(pageScrolls)) {
        const ageSeconds = Math.round((Date.now() - scrollData.timestamp) / 1000);
        console.log(`    ${elementKey}: ${scrollData.x}px (${ageSeconds}s atrás)`);
      }
    }
    console.log(`  Página atual: ${this.currentPath}`);
    console.log(`  Restaurando: ${this.isRestoring}`);
  }

  // Limpa o sistema (IGUAL AO VERTICAL)
  destroy(): void {
    if (this.saveInterval) {
      clearInterval(this.saveInterval);
      this.saveInterval = null;
    }
    this.horizontalPositions.clear();
    console.log('[HorizontalScrollManager] 🔌 Sistema horizontal destruído');
  }
}

// Instância global
const horizontalScrollManager = new HorizontalScrollManager();

// Expor globalmente para debug
declare global {
  interface Window {
    horizontalScrollManager: typeof horizontalScrollManager;
  }
}

if (typeof window !== 'undefined') {
  window.horizontalScrollManager = horizontalScrollManager;
}

export default horizontalScrollManager;

