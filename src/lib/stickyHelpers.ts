export interface StickyBounds {
  containerTop: number;
  containerBottom: number;
  referenceBottom: number;
}

export interface StickyElement {
  id: string;
  element: HTMLElement;
  bounds: StickyBounds;
  naturalOffset: number; // Offset natural do elemento para não grudar no topo
  originalWidth: number; // Largura original preservada
  originalHeight: number; // Altura original preservada
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
      originalHeight
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
      
      // Calcular quando o elemento deve parar de ser sticky (chegar no fim da referência)
      const referenceEndPosition = bounds.referenceBottom;
      const stopStickyAt = referenceEndPosition - fixedPosition - originalHeight;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[STICKY DEBUG] ${id}:`, {
          scrollY: this.scrollY,
          elementTop,
          startStickyAt,
          stopStickyAt,
          referenceEndPosition,
          fixedPosition,
          originalHeight
        });
      }
      
      if (this.scrollY <= startStickyAt) {
        // Antes do início: posição relativa normal
        if (process.env.NODE_ENV === 'development') {
          console.log(`[STICKY DEBUG] ${id}: RELATIVE - before sticky start`);
        }
        this.resetElementToRelative(element);
      } else if (this.scrollY >= stopStickyAt) {
        // Depois do fim: posição absoluta travada no fim
        const distanceFromContainerTop = referenceEndPosition - bounds.containerTop - originalHeight;
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`[STICKY DEBUG] ${id}: ABSOLUTE - past sticky end, top=${distanceFromContainerTop}px`);
        }
        this.setElementToAbsolute(element, distanceFromContainerTop, originalWidth, originalHeight);
      } else {
        // No meio: posição fixa na tela
        const parentElement = element.parentElement;
        if (!parentElement) {
          console.warn(`[STICKY] Parent element not found for ${id}`);
          return;
        }
        
        const parentRect = parentElement.getBoundingClientRect();
        const parentAbsoluteLeft = parentRect.left + window.scrollX;
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`[STICKY DEBUG] ${id}: FIXED - sticky mode, top=${fixedPosition}px, left=${parentAbsoluteLeft}px`);
        }
        this.setElementToFixed(element, fixedPosition, parentAbsoluteLeft, originalWidth, originalHeight);
      }
    });
  }

  // Helper methods for cleaner positioning logic
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
    element.style.left = '0';
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
    element.style.transform = '';
    element.style.zIndex = '10';
  }

  private setElementToFixed(element: HTMLElement, top: number, left: number, width: number, height: number) {
    element.style.position = 'fixed';
    element.style.top = `${top}px`;
    element.style.left = `${left}px`;
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
    element.style.transform = '';
    element.style.zIndex = '10';
  }

  private updateHeaderHeight() {
    const header = document.querySelector('header') || 
                  document.querySelector('[role="banner"]') || 
                  document.querySelector('nav');
    this.headerHeight = header ? header.offsetHeight : 80;
  }

  calculateBounds(containerElement: HTMLElement, referenceElement: HTMLElement): StickyBounds {
    // Use more precise measurements to avoid layout issues
    const containerRect = containerElement.getBoundingClientRect();
    const referenceRect = referenceElement.getBoundingClientRect();
    
    // Get the current scroll position for accurate calculations
    const currentScrollY = window.scrollY;
    
    // Calculate bounds with better precision
    const bounds = {
      containerTop: containerRect.top + currentScrollY,
      containerBottom: containerRect.bottom + currentScrollY,
      referenceBottom: referenceRect.bottom + currentScrollY
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