/**
 * useSectionScrollRestoration - Sistema de Restauração de Scroll para Páginas de Seção
 * 
 * Este hook implementa um sistema similar ao da homepage, mas específico para páginas de seção.
 * Salva a posição do scroll quando o usuário navega para um produto e restaura quando volta.
 */

import { useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigationType, NavigationType } from 'react-router-dom';

interface ScrollPosition {
  x: number;
  y: number;
  timestamp: number;
  pathname: string;
  search: string;
}

// Cache global para posições de scroll das seções
class SectionScrollCache {
  private positions: Map<string, ScrollPosition> = new Map();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutos
  private readonly STORAGE_KEY = 'uti_section_scroll_positions';

  constructor() {
    this.loadFromStorage();
    this.startCleanupTimer();
  }

  /**
   * Gerar chave única para a página
   */
  private getPageKey(pathname: string, search: string): string {
    return `${pathname}${search}`;
  }

  /**
   * Salvar posição do scroll
   */
  savePosition(pathname: string, search: string, x: number, y: number): void {
    const key = this.getPageKey(pathname, search);
    const position: ScrollPosition = {
      x,
      y,
      timestamp: Date.now(),
      pathname,
      search
    };

    this.positions.set(key, position);
    this.saveToStorage();
    
    console.log(`[SectionScroll] 💾 Posição salva para ${key}: x=${x}, y=${y}`);
  }

  /**
   * Restaurar posição do scroll
   */
  getPosition(pathname: string, search: string): ScrollPosition | null {
    const key = this.getPageKey(pathname, search);
    const position = this.positions.get(key);

    if (!position) {
      console.log(`[SectionScroll] ❌ Nenhuma posição salva para ${key}`);
      return null;
    }

    // Verificar se não expirou
    if (Date.now() - position.timestamp > this.CACHE_DURATION) {
      console.log(`[SectionScroll] ⏰ Posição expirada para ${key}`);
      this.positions.delete(key);
      this.saveToStorage();
      return null;
    }

    console.log(`[SectionScroll] ✅ Posição encontrada para ${key}: x=${position.x}, y=${position.y}`);
    return position;
  }

  /**
   * Limpar posição específica
   */
  clearPosition(pathname: string, search: string): void {
    const key = this.getPageKey(pathname, search);
    this.positions.delete(key);
    this.saveToStorage();
    console.log(`[SectionScroll] 🗑️ Posição removida para ${key}`);
  }

  /**
   * Salvar no localStorage
   */
  private saveToStorage(): void {
    try {
      const data = Array.from(this.positions.entries());
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('[SectionScroll] ⚠️ Erro ao salvar no localStorage:', error);
    }
  }

  /**
   * Carregar do localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.positions = new Map(data);
        console.log(`[SectionScroll] 📦 ${this.positions.size} posições carregadas do localStorage`);
      }
    } catch (error) {
      console.warn('[SectionScroll] ⚠️ Erro ao carregar do localStorage:', error);
      this.positions.clear();
    }
  }

  /**
   * Limpeza automática de posições expiradas
   */
  private startCleanupTimer(): void {
    setInterval(() => {
      const now = Date.now();
      let cleaned = 0;

      for (const [key, position] of this.positions) {
        if (now - position.timestamp > this.CACHE_DURATION) {
          this.positions.delete(key);
          cleaned++;
        }
      }

      if (cleaned > 0) {
        this.saveToStorage();
        console.log(`[SectionScroll] 🧹 ${cleaned} posições expiradas removidas`);
      }
    }, 2 * 60 * 1000); // Limpeza a cada 2 minutos
  }
}

// Instância singleton
const sectionScrollCache = new SectionScrollCache();

/**
 * Hook principal para restauração de scroll em páginas de seção
 */
export const useSectionScrollRestoration = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const saveTimeoutRef = useRef<number>();
  const isRestoringRef = useRef(false);

  // Verificar se é uma página de seção
  const isSectionPage = location.pathname.startsWith('/secao/');

  /**
   * Salvar posição atual do scroll
   */
  const saveCurrentPosition = useCallback(() => {
    if (!isSectionPage || isRestoringRef.current) return;

    const x = window.scrollX;
    const y = window.scrollY;

    // SEMPRE salvar a posição atual, incluindo quando está no topo
    // Isso evita confusão entre "topo intencional" e "sem dados salvos"
    sectionScrollCache.savePosition(location.pathname, location.search, x, y);
    
    console.log(`[SectionScroll] 💾 Posição salva: x=${x}, y=${y} para ${location.pathname}`);
  }, [location.pathname, location.search, isSectionPage]);

  /**
   * Restaurar posição do scroll
   */
  const restorePosition = useCallback(() => {
    if (!isSectionPage) return;

    const savedPosition = sectionScrollCache.getPosition(location.pathname, location.search);
    
    if (savedPosition) {
      isRestoringRef.current = true;
      
      console.log(`[SectionScroll] 🔄 Restaurando posição salva: x=${savedPosition.x}, y=${savedPosition.y}`);
      
      // Aguardar mais tempo para garantir que o conteúdo e cache carregaram
      setTimeout(() => {
        window.scrollTo({
          left: savedPosition.x,
          top: savedPosition.y,
          behavior: 'instant'
        });
        
        console.log(`[SectionScroll] ✅ Scroll restaurado com sucesso para x=${savedPosition.x}, y=${savedPosition.y}`);
        
        // Verificar se realmente restaurou
        setTimeout(() => {
          const actualY = window.scrollY;
          if (Math.abs(actualY - savedPosition.y) > 10) {
            console.warn(`[SectionScroll] ⚠️ Restauração pode ter falhou: esperado=${savedPosition.y}, atual=${actualY}`);
            // Tentar novamente
            window.scrollTo({
              left: savedPosition.x,
              top: savedPosition.y,
              behavior: 'instant'
            });
          }
          
          isRestoringRef.current = false;
        }, 100);
      }, 300); // Aumentado de 150ms para 300ms
    } else {
      // Se não há posição salva, ir para o topo (primeira visita)
      console.log(`[SectionScroll] ⬆️ Primeira visita à seção, indo para o topo`);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location.pathname, location.search, isSectionPage]);

  // Configurar scroll restoration nativo
  useEffect(() => {
    if (isSectionPage && 'scrollRestoration' in window.history) {
      // Desabilitar scroll restoration nativo para controle manual
      window.history.scrollRestoration = 'manual';
      console.log(`[SectionScroll] 🚫 Scroll restoration nativo desabilitado para ${location.pathname}`);
    }
  }, [isSectionPage, location.pathname]);

  // Restaurar posição quando voltar (navegação POP) ou quando entrar na página
  useEffect(() => {
    if (!isSectionPage) return;

    console.log(`[SectionScroll] 📍 Navegação detectada: ${navigationType} para ${location.pathname}`);
    
    if (navigationType === NavigationType.Pop) {
      console.log(`[SectionScroll] ⬅️ Voltando para seção (POP): ${location.pathname}`);
      restorePosition();
    } else {
      // Para navegação PUSH (primeira visita), também tentar restaurar se houver posição salva
      const savedPosition = sectionScrollCache.getPosition(location.pathname, location.search);
      if (savedPosition) {
        console.log(`[SectionScroll] 🔄 Primeira visita mas há posição salva, restaurando`);
        restorePosition();
      } else {
        console.log(`[SectionScroll] 🆕 Primeira visita, mantendo no topo`);
      }
    }
  }, [location.pathname, location.search, navigationType, isSectionPage, restorePosition]);

  // Salvar posição durante o scroll
  useEffect(() => {
    if (!isSectionPage) return;

    const handleScroll = () => {
      // Debounce para evitar muitas chamadas
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = window.setTimeout(() => {
        saveCurrentPosition();
      }, 200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [isSectionPage, saveCurrentPosition]);

  // Salvar posição antes de sair da página
  useEffect(() => {
    if (!isSectionPage) return;

    const handleBeforeUnload = () => {
      saveCurrentPosition();
    };

    // Salvar quando clicar em links (navegação para produtos)
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.href && link.href.includes('/produto/')) {
        console.log(`[SectionScroll] 🔗 Navegando para produto, salvando posição atual`);
        saveCurrentPosition();
      }
    };

    // Salvar quando sair da página
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleClick, true);

    // Cleanup: salvar posição quando o componente for desmontado
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleClick, true);
      saveCurrentPosition();
    };
  }, [isSectionPage, saveCurrentPosition]);

  return {
    isSectionPage,
    saveCurrentPosition,
    restorePosition,
    clearPosition: () => sectionScrollCache.clearPosition(location.pathname, location.search)
  };
};

/**
 * Hook simplificado para usar nas páginas de seção
 */
export const useAutoSectionScrollRestoration = () => {
  const { isSectionPage } = useSectionScrollRestoration();
  return { isSectionPage };
};

export default useSectionScrollRestoration;
