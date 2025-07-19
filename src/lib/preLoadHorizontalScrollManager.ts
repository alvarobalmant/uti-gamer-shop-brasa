// Sistema de scroll horizontal PRÉ-CARREGAMENTO para seções de produtos
interface SectionScrollData {
  x: number;
  timestamp: number;
}

interface PageSectionScrolls {
  [sectionId: string]: SectionScrollData;
}

class PreLoadHorizontalScrollManager {
  private scrollPositions = new Map<string, PageSectionScrolls>();
  private saveInterval: number | null = null;
  private currentPath: string = '';
  private activeSections = new Map<string, HTMLElement>();

  constructor() {
    this.initializeSaveInterval();
    this.loadFromCache();
  }

  // Inicia o salvamento automático a cada 20ms
  private initializeSaveInterval(): void {
    if (this.saveInterval) {
      clearInterval(this.saveInterval);
    }
    
    this.saveInterval = window.setInterval(() => {
      this.saveAllActiveSections();
    }, 20);
    
    console.log('[PreLoadHorizontalScroll] ✅ Sistema iniciado - salvamento a cada 20ms');
  }

  // Salva posições de todas as seções ativas
  private saveAllActiveSections(): void {
    if (!this.currentPath) return;

    const pageScrolls: PageSectionScrolls = this.scrollPositions.get(this.currentPath) || {};

    this.activeSections.forEach((element, sectionId) => {
      if (element.scrollLeft > 0) {
        pageScrolls[sectionId] = {
          x: element.scrollLeft,
          timestamp: Date.now()
        };
      }
    });

    this.scrollPositions.set(this.currentPath, pageScrolls);
    this.saveToCache();
  }

  // Salva no localStorage
  private saveToCache(): void {
    try {
      const data = Object.fromEntries(this.scrollPositions);
      localStorage.setItem('horizontal-scroll-positions', JSON.stringify(data));
    } catch (e) {
      console.warn('[PreLoadHorizontalScroll] Erro ao salvar no cache:', e);
    }
  }

  // Carrega do localStorage
  private loadFromCache(): void {
    try {
      const saved = localStorage.getItem('horizontal-scroll-positions');
      if (saved) {
        const data = JSON.parse(saved);
        this.scrollPositions = new Map(Object.entries(data));
        console.log('[PreLoadHorizontalScroll] 📦 Dados carregados do cache');
      }
    } catch (e) {
      console.warn('[PreLoadHorizontalScroll] Erro ao carregar do cache:', e);
    }
  }

  // Define página atual
  setCurrentPage(path: string): void {
    console.log(`[PreLoadHorizontalScroll] 📄 Mudança de página: ${this.currentPath} → ${path}`);
    this.currentPath = path;
    this.activeSections.clear();
  }

  // MÉTODO PRINCIPAL: Consulta posição ANTES do carregamento
  getInitialScrollPosition(sectionId: string): number {
    const pageScrolls = this.scrollPositions.get(this.currentPath);
    
    if (!pageScrolls || !pageScrolls[sectionId]) {
      console.log(`[PreLoadHorizontalScroll] 📍 Nenhuma posição salva para seção ${sectionId} - usando posição 0`);
      return 0;
    }

    const savedPosition = pageScrolls[sectionId].x;
    console.log(`[PreLoadHorizontalScroll] 🎯 POSIÇÃO RECUPERADA para seção ${sectionId}: ${savedPosition}px`);
    
    return savedPosition;
  }

  // Registra seção ativa para salvamento contínuo
  registerSection(sectionId: string, element: HTMLElement): void {
    this.activeSections.set(sectionId, element);
    console.log(`[PreLoadHorizontalScroll] 📌 Seção registrada: ${sectionId}`);
    
    // Aplica posição inicial imediatamente
    const initialPosition = this.getInitialScrollPosition(sectionId);
    if (initialPosition > 0) {
      // Pequeno delay para garantir que o DOM está pronto
      setTimeout(() => {
        element.scrollLeft = initialPosition;
        console.log(`[PreLoadHorizontalScroll] ✅ Posição aplicada imediatamente para ${sectionId}: ${initialPosition}px`);
      }, 10);
    }
  }

  // Remove seção do rastreamento
  unregisterSection(sectionId: string): void {
    this.activeSections.delete(sectionId);
    console.log(`[PreLoadHorizontalScroll] 📌 Seção removida: ${sectionId}`);
  }

  // Limpa posições de uma página
  clearPagePositions(path: string): void {
    this.scrollPositions.delete(path);
    this.saveToCache();
    console.log(`[PreLoadHorizontalScroll] 🗑️ Posições removidas para: ${path}`);
  }

  // Debug
  debugPositions(): void {
    console.log('[PreLoadHorizontalScroll] 🔍 DEBUG:');
    console.log(`  Página atual: ${this.currentPath}`);
    console.log(`  Seções ativas: ${Array.from(this.activeSections.keys()).join(', ')}`);
    
    for (const [path, pageScrolls] of this.scrollPositions.entries()) {
      console.log(`  Página ${path}:`);
      for (const [sectionId, data] of Object.entries(pageScrolls)) {
        const age = Math.round((Date.now() - data.timestamp) / 1000);
        console.log(`    ${sectionId}: ${data.x}px (${age}s atrás)`);
      }
    }
  }

  // Força salvamento imediato
  forceSave(): void {
    this.saveAllActiveSections();
    console.log('[PreLoadHorizontalScroll] 💾 Salvamento forçado executado');
  }

  destroy(): void {
    if (this.saveInterval) {
      clearInterval(this.saveInterval);
      this.saveInterval = null;
    }
    this.saveAllActiveSections(); // Salva antes de destruir
    this.activeSections.clear();
    console.log('[PreLoadHorizontalScroll] 🔌 Sistema destruído');
  }
}

// Instância global
const preLoadHorizontalScrollManager = new PreLoadHorizontalScrollManager();

// Expor globalmente
declare global {
  interface Window {
    preLoadHorizontalScrollManager: typeof preLoadHorizontalScrollManager;
  }
}

if (typeof window !== 'undefined') {
  window.preLoadHorizontalScrollManager = preLoadHorizontalScrollManager;
}

export default preLoadHorizontalScrollManager;