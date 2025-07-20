// Sistema SIMPLIFICADO de scroll horizontal baseado no vertical que funciona
interface HorizontalScrollData {
  x: number;
  timestamp: number;
  sectionId?: string; // Identificador específico da seção
}

interface PageHorizontalScrolls {
  [elementKey: string]: HorizontalScrollData;
}

class HorizontalScrollManager {
  private horizontalPositions = new Map<string, PageHorizontalScrolls>();
  private trackedElements = new Set<HTMLElement>();
  private isRestoring = false;
  private currentPath: string = '';
  
  constructor() {
    console.log('[HorizontalScrollManager] ✅ Sistema iniciado');
  }

  // Método principal para rastrear um elemento específico
  trackElement(element: HTMLElement, sectionId?: string): void {
    if (!element || this.trackedElements.has(element)) return;
    
    this.trackedElements.add(element);
    
    // Adiciona listener de scroll para salvar posição automaticamente
    const savePosition = () => {
      if (this.isRestoring || !this.currentPath) return;
      this.saveElementPosition(element, sectionId);
    };
    
    element.addEventListener('scroll', savePosition, { passive: true });
    
    // Salva referência para cleanup
    (element as any).__horizontalScrollCleanup = () => {
      element.removeEventListener('scroll', savePosition);
      this.trackedElements.delete(element);
    };
    
    console.log(`[HorizontalScrollManager] 📍 Elemento rastreado: ${sectionId || 'unnamed'}`);
  }

  // Para de rastrear um elemento
  untrackElement(element: HTMLElement): void {
    if (!element || !this.trackedElements.has(element)) return;
    
    const cleanup = (element as any).__horizontalScrollCleanup;
    if (cleanup) {
      cleanup();
      delete (element as any).__horizontalScrollCleanup;
    }
    
    console.log(`[HorizontalScrollManager] 🚫 Elemento removido do rastreamento`);
  }

  // Salva posição de um elemento específico
  private saveElementPosition(element: HTMLElement, sectionId?: string): void {
    if (!element || !this.currentPath) return;
    
    // Só salva se o elemento tem scroll horizontal
    if (element.scrollWidth <= element.clientWidth) return;
    
    const pageScrolls = this.horizontalPositions.get(this.currentPath) || {};
    const elementKey = sectionId || this.generateElementKey(element);
    
    pageScrolls[elementKey] = {
      x: element.scrollLeft,
      timestamp: Date.now(),
      sectionId
    };
    
    this.horizontalPositions.set(this.currentPath, pageScrolls);
    console.log(`[HorizontalScrollManager] 💾 Posição salva para ${elementKey}: ${element.scrollLeft}px`);
  }

  // Gera uma chave única para o elemento baseada em sua posição no DOM
  private generateElementKey(element: HTMLElement): string {
    // Usa data attributes se disponível
    if (element.dataset.section) {
      return `section-${element.dataset.section}`;
    }
    
    // Usa ID se disponível
    if (element.id) {
      return `id-${element.id}`;
    }
    
    // Fallback: posição no DOM
    const parent = element.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children);
      const index = siblings.indexOf(element);
      return `element-${index}`;
    }
    
    return 'unknown-element';
  }

  // Define a página atual
  setCurrentPage(path: string): void {
    if (path !== this.currentPath) {
      console.log(`[HorizontalScrollManager] 📄 Página alterada: ${this.currentPath} → ${path}`);
      this.currentPath = path;
    }
  }

  // Restaura posições horizontais para a página atual
  async restoreCurrentPageHorizontalPositions(): Promise<void> {
    if (!this.currentPath) return;
    
    const savedData = this.horizontalPositions.get(this.currentPath);
    if (!savedData || Object.keys(savedData).length === 0) {
      console.log(`[HorizontalScrollManager] 📍 Nenhuma posição horizontal salva para ${this.currentPath}`);
      return;
    }

    console.log(`[HorizontalScrollManager] 🎯 RESTAURANDO posições horizontais para ${this.currentPath}`);
    
    // Aguarda carregamento da página
    await this.waitForPageLoad();
    
    this.isRestoring = true;
    
    try {
      // Restaura elementos rastreados primeiro
      for (const element of this.trackedElements) {
        const elementKey = this.generateElementKey(element);
        const scrollData = savedData[elementKey];
        
        if (scrollData) {
          await this.restoreElementPosition(element, scrollData, elementKey);
        }
      }
      
      // Depois tenta restaurar outros elementos por seletor
      const allScrollElements = document.querySelectorAll('.overflow-x-auto, .overflow-x-scroll');
      allScrollElements.forEach((element, index) => {
        const htmlElement = element as HTMLElement;
        if (!this.trackedElements.has(htmlElement)) {
          const fallbackKey = `element-${index}`;
          const scrollData = savedData[fallbackKey];
          if (scrollData) {
            this.restoreElementPosition(htmlElement, scrollData, fallbackKey);
          }
        }
      });
      
    } finally {
      setTimeout(() => {
        this.isRestoring = false;
        console.log(`[HorizontalScrollManager] ✅ Restauração horizontal completa para ${this.currentPath}`);
      }, 300);
    }
  }

  // Restaura posição de um elemento específico
  private async restoreElementPosition(element: HTMLElement, scrollData: HorizontalScrollData, elementKey: string): Promise<void> {
    if (!element || element.scrollWidth <= element.clientWidth) return;
    
    console.log(`[HorizontalScrollManager] 🔄 Restaurando ${elementKey}: ${scrollData.x}px`);
    
    // Aplica scroll imediatamente
    element.scrollLeft = scrollData.x;
    
    // Verifica se funcionou após um delay
    setTimeout(() => {
      const currentX = element.scrollLeft;
      const tolerance = 5;
      const success = Math.abs(currentX - scrollData.x) <= tolerance;
      
      if (success) {
        console.log(`[HorizontalScrollManager] ✅ SUCESSO! ${elementKey} restaurado: ${currentX}px`);
      } else {
        console.log(`[HorizontalScrollManager] ⚠️ PARTIAL ${elementKey}. Target: ${scrollData.x}px, Atual: ${currentX}px`);
        // Tenta mais uma vez
        element.scrollLeft = scrollData.x;
      }
    }, 100);
  }

  // Aguarda carregamento da página
  private async waitForPageLoad(): Promise<void> {
    return new Promise((resolve) => {
      const checkContent = () => {
        const hasScrollElements = document.querySelectorAll('.overflow-x-auto, .overflow-x-scroll').length > 0;
        const isDocumentReady = document.readyState === 'complete';
        
        if (hasScrollElements || isDocumentReady) {
          resolve();
        } else {
          setTimeout(checkContent, 50);
        }
      };
      
      // Aguarda mínimo de 500ms para estabilizar
      setTimeout(checkContent, 500);
    });
  }

  // Debug: mostra todas as posições horizontais salvas
  debugHorizontalPositions(): void {
    console.log('[HorizontalScrollManager] 🔍 DEBUG - Posições horizontais salvas:');
    for (const [path, pageScrolls] of this.horizontalPositions.entries()) {
      console.log(`  📄 ${path}:`);
      for (const [elementKey, scrollData] of Object.entries(pageScrolls)) {
        const ageSeconds = Math.round((Date.now() - scrollData.timestamp) / 1000);
        console.log(`    ${elementKey}: ${scrollData.x}px (${ageSeconds}s atrás)`);
      }
    }
    console.log(`  Página atual: ${this.currentPath}`);
    console.log(`  Elementos rastreados: ${this.trackedElements.size}`);
    console.log(`  Restaurando: ${this.isRestoring}`);
  }

  // Remove posições horizontais de uma página
  clearPageHorizontalPositions(path: string): void {
    this.horizontalPositions.delete(path);
    console.log(`[HorizontalScrollManager] 🗑️ Posições horizontais removidas para: ${path}`);
  }

  // Limpa o sistema
  destroy(): void {
    // Limpa todos os listeners
    for (const element of this.trackedElements) {
      this.untrackElement(element);
    }
    
    this.horizontalPositions.clear();
    this.trackedElements.clear();
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

