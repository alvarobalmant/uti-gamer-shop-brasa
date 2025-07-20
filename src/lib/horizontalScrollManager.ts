<<<<<<< HEAD
// Sistema de scroll horizontal ULTRA SIMPLES baseado no vertical que funciona
=======
// Sistema de scroll horizontal para seções de produtos
>>>>>>> f4f3b9ce92abff7508966d295fc2a040175fa4e9
interface HorizontalScrollData {
  x: number;
  timestamp: number;
}

interface PageHorizontalScrolls {
<<<<<<< HEAD
  [elementIndex: string]: HorizontalScrollData;
=======
  [sectionId: string]: HorizontalScrollData;
>>>>>>> f4f3b9ce92abff7508966d295fc2a040175fa4e9
}

class HorizontalScrollManager {
  private horizontalPositions = new Map<string, PageHorizontalScrolls>();
  private saveInterval: number | null = null;
  private currentPath: string = '';
<<<<<<< HEAD
  private isRestoring = false;
  
=======
  private trackedElements = new Set<HTMLElement>();
  private isRestoring = false;

>>>>>>> f4f3b9ce92abff7508966d295fc2a040175fa4e9
  constructor() {
    this.initializeSaveInterval();
  }

<<<<<<< HEAD
  // Inicia o salvamento automático (IGUAL AO VERTICAL)
=======
  // Inicia o salvamento automático a cada 20ms
>>>>>>> f4f3b9ce92abff7508966d295fc2a040175fa4e9
  private initializeSaveInterval(): void {
    if (this.saveInterval) {
      clearInterval(this.saveInterval);
    }
    
    this.saveInterval = window.setInterval(() => {
<<<<<<< HEAD
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
=======
      this.saveAllHorizontalPositions();
    }, 20);
    
    console.log('[HorizontalScrollManager] ✅ Sistema horizontal iniciado - salvamento a cada 20ms');
  }

  // Salva todas as posições horizontais da página atual
  private saveAllHorizontalPositions(): void {
    if (this.isRestoring || !this.currentPath) return;

    const pageScrolls: PageHorizontalScrolls = this.horizontalPositions.get(this.currentPath) || {};

    // Busca automaticamente por elementos com scroll horizontal
    this.findAndTrackHorizontalScrollElements();

    // Salva posição de cada elemento rastreado
    this.trackedElements.forEach(element => {
      const sectionId = this.getElementId(element);
      if (sectionId && element.scrollLeft > 0) {
        pageScrolls[sectionId] = {
          x: element.scrollLeft,
>>>>>>> f4f3b9ce92abff7508966d295fc2a040175fa4e9
          timestamp: Date.now()
        };
      }
    });

<<<<<<< HEAD
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
=======
    this.horizontalPositions.set(this.currentPath, pageScrolls);
  }

  // Encontra e rastreia elementos com scroll horizontal
  private findAndTrackHorizontalScrollElements(): void {
    // Selectors para elementos que normalmente têm scroll horizontal
    const selectors = [
      '[data-section="products"]',
      '[data-section="jogos-da-galera"]',
      '.horizontal-scroll',
      '.product-carousel',
      '.products-grid',
      '.overflow-x-auto',
      '.overflow-x-scroll',
      '.carousel-container',
      '[data-testid="product-carousel"]',
      '[data-testid="horizontal-scroll"]'
    ];

    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        const htmlElement = element as HTMLElement;
        
        // Verifica se realmente tem scroll horizontal
        if (this.hasHorizontalScroll(htmlElement)) {
          this.trackedElements.add(htmlElement);
        }
      });
    });

    // Também procura por elementos filhos que podem ter scroll
    this.trackedElements.forEach(parent => {
      const scrollableChildren = parent.querySelectorAll('.overflow-x-auto, .overflow-x-scroll');
      scrollableChildren.forEach(child => {
        const htmlChild = child as HTMLElement;
        if (this.hasHorizontalScroll(htmlChild)) {
          this.trackedElements.add(htmlChild);
        }
      });
    });
  }

  // Verifica se elemento tem scroll horizontal
  private hasHorizontalScroll(element: HTMLElement): boolean {
    return element.scrollWidth > element.clientWidth;
  }

  // Gera ID único para elemento
  private getElementId(element: HTMLElement): string {
    // Tenta usar ID existente
    if (element.id) return element.id;
    
    // Tenta usar data-section
    const dataSection = element.getAttribute('data-section');
    if (dataSection) return `section-${dataSection}`;
    
    // Tenta usar data-testid
    const dataTestId = element.getAttribute('data-testid');
    if (dataTestId) return `testid-${dataTestId}`;
    
    // Usa classe + posição como fallback
    const className = element.className.split(' ')[0] || 'unknown';
    const siblings = Array.from(element.parentElement?.children || []);
    const index = siblings.indexOf(element);
    
    return `${className}-${index}`;
  }

  // Define a página atual
  setCurrentPage(path: string): void {
    console.log(`[HorizontalScrollManager] 📄 Mudança de página: ${this.currentPath} → ${path}`);
    
    // Limpa elementos rastreados da página anterior
    this.trackedElements.clear();
    this.currentPath = path;
  }

  // Restaura as posições horizontais da página atual
  async restoreCurrentPageHorizontalPositions(): Promise<void> {
    const pageScrolls = this.horizontalPositions.get(this.currentPath);
    
    if (!pageScrolls || Object.keys(pageScrolls).length === 0) {
>>>>>>> f4f3b9ce92abff7508966d295fc2a040175fa4e9
      console.log(`[HorizontalScrollManager] 📍 Nenhuma posição horizontal salva para ${this.currentPath}`);
      return;
    }

<<<<<<< HEAD
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
=======
    console.log(`[HorizontalScrollManager] 🎯 RESTAURANDO ${Object.keys(pageScrolls).length} posições horizontais para ${this.currentPath}`);
    
    // Aguarda conteúdo carregar
    await this.waitForContent();
    
    this.isRestoring = true;
    
    // Busca elementos novamente
    this.findAndTrackHorizontalScrollElements();
    
    // Restaura cada posição salva
    Object.entries(pageScrolls).forEach(([sectionId, scrollData]) => {
      const element = this.findElementById(sectionId);
      
      if (element) {
        console.log(`[HorizontalScrollManager] 🔄 Restaurando seção ${sectionId}: ${scrollData.x}px`);
        
        element.scrollTo({
          left: scrollData.x,
          behavior: 'auto'
        });
        
        // Verifica se funcionou
        setTimeout(() => {
          const currentX = element.scrollLeft;
          const success = Math.abs(currentX - scrollData.x) <= 10;
          
          if (success) {
            console.log(`[HorizontalScrollManager] ✅ Seção ${sectionId} restaurada: ${currentX}px`);
          } else {
            console.log(`[HorizontalScrollManager] ❌ Falha na restauração da seção ${sectionId}. Target: ${scrollData.x}px, Atual: ${currentX}px`);
            // Tenta mais uma vez
            element.scrollTo({ left: scrollData.x, behavior: 'auto' });
          }
        }, 100);
      } else {
        console.log(`[HorizontalScrollManager] ⚠️ Elemento ${sectionId} não encontrado`);
>>>>>>> f4f3b9ce92abff7508966d295fc2a040175fa4e9
      }
    });
    
    setTimeout(() => {
      this.isRestoring = false;
<<<<<<< HEAD
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
=======
    }, 500);
  }

  // Encontra elemento pelo ID gerado
  private findElementById(sectionId: string): HTMLElement | null {
    // Busca por ID direto
    let element = document.getElementById(sectionId);
    if (element) return element;

    // Busca por data-section
    if (sectionId.startsWith('section-')) {
      const dataSection = sectionId.replace('section-', '');
      element = document.querySelector(`[data-section="${dataSection}"]`) as HTMLElement;
      if (element) return element;
    }

    // Busca por data-testid
    if (sectionId.startsWith('testid-')) {
      const dataTestId = sectionId.replace('testid-', '');
      element = document.querySelector(`[data-testid="${dataTestId}"]`) as HTMLElement;
      if (element) return element;
    }

    // Busca nos elementos rastreados
    for (const trackedElement of this.trackedElements) {
      if (this.getElementId(trackedElement) === sectionId) {
        return trackedElement;
      }
    }

    return null;
  }

  // Aguarda carregamento do conteúdo
  private async waitForContent(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const checkContent = () => {
          // Verifica se há elementos com scroll horizontal carregados
          const hasHorizontalScrollElements = document.querySelectorAll('[data-section], .overflow-x-auto, .overflow-x-scroll').length > 0;
          
          if (hasHorizontalScrollElements || document.readyState === 'complete') {
            resolve();
          } else {
            setTimeout(checkContent, 50);
          }
        };
        checkContent();
      }, 300); // Delay menor para horizontal
    });
  }

  // Remove posições horizontais de uma página
>>>>>>> f4f3b9ce92abff7508966d295fc2a040175fa4e9
  clearPageHorizontalPositions(path: string): void {
    this.horizontalPositions.delete(path);
    console.log(`[HorizontalScrollManager] 🗑️ Posições horizontais removidas para: ${path}`);
  }

<<<<<<< HEAD
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
=======
  // Debug: mostra todas as posições horizontais salvas
  debugHorizontalPositions(): void {
    console.log('[HorizontalScrollManager] 🔍 DEBUG - Posições horizontais salvas:');
    for (const [path, pageScrolls] of this.horizontalPositions.entries()) {
      console.log(`  Página: ${path}`);
      for (const [sectionId, scrollData] of Object.entries(pageScrolls)) {
        const age = Math.round((Date.now() - scrollData.timestamp) / 1000);
        console.log(`    ${sectionId}: ${scrollData.x}px (${age}s atrás)`);
      }
    }
    console.log(`  Página atual: ${this.currentPath}`);
    console.log(`  Elementos rastreados: ${this.trackedElements.size}`);
    console.log(`  Restaurando: ${this.isRestoring}`);
  }

  // Força rastreamento de elemento específico
  trackElement(element: HTMLElement): void {
    if (this.hasHorizontalScroll(element)) {
      this.trackedElements.add(element);
      console.log(`[HorizontalScrollManager] 📌 Elemento adicionado ao rastreamento: ${this.getElementId(element)}`);
    }
  }

  // Remove elemento do rastreamento
  untrackElement(element: HTMLElement): void {
    this.trackedElements.delete(element);
    console.log(`[HorizontalScrollManager] 📌 Elemento removido do rastreamento: ${this.getElementId(element)}`);
  }

  // Limpa o sistema
>>>>>>> f4f3b9ce92abff7508966d295fc2a040175fa4e9
  destroy(): void {
    if (this.saveInterval) {
      clearInterval(this.saveInterval);
      this.saveInterval = null;
    }
    this.horizontalPositions.clear();
<<<<<<< HEAD
=======
    this.trackedElements.clear();
>>>>>>> f4f3b9ce92abff7508966d295fc2a040175fa4e9
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

<<<<<<< HEAD
export default horizontalScrollManager;

=======
export default horizontalScrollManager;
>>>>>>> f4f3b9ce92abff7508966d295fc2a040175fa4e9
