export interface StickyBounds {
  containerTop: number;
  containerBottom: number;
  column3Bottom: number; // Altura real da coluna 3
}

export interface StickyElement {
  id: string;
  element: HTMLElement;
  bounds: StickyBounds;
  naturalOffset: number; // Offset natural do elemento para não grudar no topo
  originalWidth: number; // Largura original preservada
  originalHeight: number; // Altura original preservada
  isFrozen: boolean; // Se está congelado na posição final
  frozenTop: number; // Posição congelada
  frozenLeft: number; // Posição horizontal congelada
}

export class StickyManager {
  private elements: Map<string, StickyElement> = new Map();
  private scrollY = 0;
  private ticking = false;
  private headerHeight = 0;

  constructor() {
    this.updateHeaderHeight();
  }

  addElement(id: string, element: HTMLElement, bounds: StickyBounds, naturalOffset: number = 100) {
    // Capturar dimensões originais antes de qualquer modificação
    const computedStyle = window.getComputedStyle(element);
    const originalWidth = element.offsetWidth;
    const originalHeight = element.offsetHeight;
    
    this.elements.set(id, {
      id,
      element,
      bounds,
      naturalOffset,
      originalWidth,
      originalHeight,
      isFrozen: false,
      frozenTop: 0,
      frozenLeft: 0
    });
    
    // Setup inicial do elemento
    element.style.position = 'relative';
    element.style.zIndex = '10';
  }

  removeElement(id: string) {
    const stickyElement = this.elements.get(id);
    if (stickyElement) {
      // Reset element styles completely
      const element = stickyElement.element;
      element.style.position = '';
      element.style.top = '';
      element.style.left = '';
      element.style.width = '';
      element.style.zIndex = '';
      element.style.transform = '';
    }
    this.elements.delete(id);
  }

  updateScroll(scrollY: number) {
    this.scrollY = scrollY;
    if (!this.ticking) {
      requestAnimationFrame(() => {
        this.updateElements();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  private updateElements() {
    this.elements.forEach((stickyElement) => {
      const { element, bounds, naturalOffset, originalWidth, originalHeight, id } = stickyElement;
      
      // Posição fixa desejada na tela (header + offset natural)
      const fixedPosition = this.headerHeight + naturalOffset;
      
      // Calcular quando o elemento deve começar a ser sticky
      const elementTop = bounds.containerTop;
      const startStickyAt = elementTop - fixedPosition;
      
      // Nova lógica: usar a altura da coluna 3 como limite com margem de segurança
      const column3Bottom = bounds.column3Bottom;
      const safetyMargin = 10; // Margem de segurança para evitar bugs de posicionamento
      const shouldFreeze = (this.scrollY + fixedPosition + originalHeight) >= (column3Bottom - safetyMargin);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[STICKY DEBUG] ${id}:`, {
          scrollY: this.scrollY,
          elementTop,
          startStickyAt,
          column3Bottom,
          shouldFreeze,
          isFrozen: stickyElement.isFrozen,
          fixedPosition,
          originalHeight,
          safetyMargin
        });
      }
      
      if (this.scrollY <= startStickyAt) {
        // Antes do início: posição relativa normal
        if (process.env.NODE_ENV === 'development') {
          console.log(`[STICKY DEBUG] ${id}: RELATIVE - before sticky start`);
        }
        stickyElement.isFrozen = false;
        this.resetElementToRelative(element);
      } else if (shouldFreeze && !stickyElement.isFrozen) {
        // Congelar: calcular posição absoluta precisa
        const parentElement = element.parentElement;
        if (!parentElement) {
          console.warn(`[STICKY] Parent element not found for ${id}`);
          return;
        }
        
        // Calcular a posição absoluta final de forma mais precisa
        // A posição deve ser relativa ao container pai, não à página
        const absoluteTop = column3Bottom - bounds.containerTop - originalHeight - safetyMargin;
        
        stickyElement.isFrozen = true;
        stickyElement.frozenTop = Math.max(0, absoluteTop); // Evitar valores negativos
        stickyElement.frozenLeft = 0; // Sempre relativo ao container pai
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`[STICKY DEBUG] ${id}: FREEZING at top=${stickyElement.frozenTop}px, left=0px`);
        }
        
        this.setElementToAbsolute(element, stickyElement.frozenTop, originalWidth, originalHeight);
      } else if (stickyElement.isFrozen && !shouldFreeze) {
        // Descongelar: voltar ao modo fixed
        stickyElement.isFrozen = false;
        
        const parentElement = element.parentElement;
        if (!parentElement) {
          console.warn(`[STICKY] Parent element not found for ${id}`);
          return;
        }
        
        // Calcular posição left do parent de forma mais precisa
        const parentRect = parentElement.getBoundingClientRect();
        const parentAbsoluteLeft = parentRect.left + window.scrollX;
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`[STICKY DEBUG] ${id}: UNFREEZING - back to fixed mode at left=${parentAbsoluteLeft}px`);
        }
        
        this.setElementToFixed(element, fixedPosition, parentAbsoluteLeft, originalWidth, originalHeight);
      } else if (stickyElement.isFrozen) {
        // Manter congelado: usar posição salva sem recalcular
        if (process.env.NODE_ENV === 'development') {
          console.log(`[STICKY DEBUG] ${id}: STAYING FROZEN at top=${stickyElement.frozenTop}px`);
        }
        // Não recalcular, apenas manter a posição congelada
        this.setElementToAbsolute(element, stickyElement.frozenTop, originalWidth, originalHeight);
      } else {
        // Modo sticky normal: posição fixa na tela
        const parentElement = element.parentElement;
        if (!parentElement) {
          console.warn(`[STICKY] Parent element not found for ${id}`);
          return;
        }
        
        // Usar getBoundingClientRect para posicionamento mais preciso
        const parentRect = parentElement.getBoundingClientRect();
        const parentAbsoluteLeft = parentRect.left + window.scrollX;
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`[STICKY DEBUG] ${id}: FIXED - sticky mode, top=${fixedPosition}px, left=${parentAbsoluteLeft}px`);
        }
        this.setElementToFixed(element, fixedPosition, parentAbsoluteLeft, originalWidth, originalHeight);
      }
    });
  }

  // Helper methods com posicionamento mais preciso
  private resetElementToRelative(element: HTMLElement) {
    element.style.position = 'relative';
    element.style.top = '';
    element.style.left = '';
    element.style.width = '';
    element.style.height = '';
    element.style.transform = '';
    element.style.zIndex = '10';
  }

  private setElementToAbsolute(element: HTMLElement, top: number, width: number, height: number) {
    element.style.position = 'absolute';
    element.style.top = `${top}px`;
    element.style.left = '0px'; // Sempre 0 para manter alinhamento com o container pai
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
    element.style.transform = ''; // Limpar qualquer transform
    element.style.zIndex = '10';
  }

  private setElementToFixed(element: HTMLElement, top: number, left: number, width: number, height: number) {
    element.style.position = 'fixed';
    element.style.top = `${top}px`;
    element.style.left = `${left}px`;
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
    element.style.transform = ''; // Limpar qualquer transform
    element.style.zIndex = '10';
  }

  private updateHeaderHeight() {
    const header = document.querySelector('header') || 
                  document.querySelector('[role="banner"]') || 
                  document.querySelector('nav');
    this.headerHeight = header ? header.offsetHeight : 80;
  }

  calculateBounds(containerElement: HTMLElement, referenceElement: HTMLElement): StickyBounds {
    // Forçar recálculo do layout antes de medir
    containerElement.offsetHeight; // Trigger layout
    referenceElement.offsetHeight; // Trigger layout
    
    const containerRect = containerElement.getBoundingClientRect();
    const referenceRect = referenceElement.getBoundingClientRect();
    
    const currentScrollY = window.scrollY;
    
    // Calcular bounds com mais precisão
    const bounds = {
      containerTop: containerRect.top + currentScrollY,
      containerBottom: containerRect.bottom + currentScrollY,
      column3Bottom: referenceRect.bottom + currentScrollY // A coluna 3 é a referência
    };
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[STICKY DEBUG] Calculated bounds:', bounds, 'Current scroll:', currentScrollY);
    }
    
    return bounds;
  }

  refreshHeaderHeight() {
    this.updateHeaderHeight();
  }

  destroy() {
    this.elements.forEach((stickyElement) => {
      this.removeElement(stickyElement.id);
    });
    this.elements.clear();
  }
}

// Throttle otimizado para scroll suave
export const throttle = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;
  
  return (...args: any[]) => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, Math.max(0, delay - (currentTime - lastExecTime)));
    }
  };
};

// Debounce para resize
export const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return (...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
