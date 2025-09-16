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

  // Inicia o salvamento automático
  private initializeSaveInterval(): void {
    if (this.saveInterval) {
      clearInterval(this.saveInterval);
    }
    
    this.saveInterval = window.setInterval(() => {
      this.saveCurrentPosition();
    }, 200); // Mais lento para evitar conflitos
    
    console.log('[SimpleScrollManager] ✅ Sistema iniciado - salvamento a cada 200ms');
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
    if (this.currentPath !== path) {
      console.log(`[SimpleScrollManager] 📄 Página: ${this.currentPath} → ${path}`);
      this.currentPath = path;
    }
  }

  // Obtém a posição salva de uma página (para restauração instantânea)
  getPagePosition(path: string): PageScrollData | undefined {
    return this.scrollPositions.get(path);
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
    
    // Aguarda carregamento adequado
    await this.waitForPageLoad();
    
    this.isRestoring = true;
    
    // Múltiplas tentativas rápidas de restauração
    for (let attempt = 1; attempt <= 3; attempt++) {
      console.log(`[SimpleScrollManager] 🔄 Tentativa ${attempt}/3 de restauração`);
      
      // Restaura a posição
      window.scrollTo({
        left: 0,
        top: savedData.y,
        behavior: 'auto'
      });
      
      // Aguarda menos tempo para ser mais responsivo
      await new Promise(resolve => setTimeout(resolve, 100 * attempt)); // Delay mais rápido: 100ms, 200ms, 300ms
      
      const currentY = window.scrollY;
      const tolerance = 50; // Tolerância reduzida
      const success = Math.abs(currentY - savedData.y) <= tolerance;
      
      console.log(`[SimpleScrollManager] 📊 Tentativa ${attempt}: Target=${savedData.y}px, Atual=${currentY}px, Sucesso=${success}`);
      
      if (success) {
        console.log(`[SimpleScrollManager] ✅ SUCESSO na tentativa ${attempt}!`);
        break;
      } else if (attempt === 3) {
        console.log(`[SimpleScrollManager] ❌ FALHA após 3 tentativas. Diferença: ${Math.abs(currentY - savedData.y)}px`);
        // Tentativa final com scroll suave
        window.scrollTo({
          left: 0,
          top: savedData.y,
          behavior: 'smooth'
        });
      }
    }
    
    this.isRestoring = false;
  }

  // Vai para o topo
  private goToTop(): void {
    window.scrollTo({
      left: 0,
      top: 0,
      behavior: 'auto'
    });
  }

  // Aguarda DOM básico carregar
  private async waitForPageLoad(): Promise<void> {
    return new Promise((resolve) => {
      // Verificação simples e rápida
      const checkDOM = () => {
        const hasBasicContent = document.body.children.length > 0 || 
                               document.readyState === 'complete';
        
        if (hasBasicContent) {
          resolve();
        } else {
          setTimeout(checkDOM, 50);
        }
      };
      
      setTimeout(checkDOM, 100); // Delay mínimo
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