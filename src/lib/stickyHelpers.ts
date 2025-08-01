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
    this.elements.set(id, {
      id,
      element,
      bounds,
      naturalOffset
    });
    
    // Setup inicial do elemento
    element.style.position = 'relative';
    element.style.zIndex = '10';
  }

  removeElement(id: string) {
    const stickyElement = this.elements.get(id);
    if (stickyElement) {
      // Reset element styles
      stickyElement.element.style.position = '';
      stickyElement.element.style.top = '';
      stickyElement.element.style.left = '';
      stickyElement.element.style.width = '';
      stickyElement.element.style.zIndex = '';
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
      const { element, bounds, naturalOffset } = stickyElement;
      
      // Posição fixa desejada na tela (header + offset natural)
      const fixedPosition = this.headerHeight + naturalOffset;
      
      // Calcular se devemos usar position fixed ou absolute
      const scrolledPastStart = this.scrollY > bounds.containerTop - fixedPosition;
      const scrolledPastEnd = this.scrollY > bounds.referenceBottom - fixedPosition - element.offsetHeight;
      
      if (!scrolledPastStart) {
        // Antes do início: posição relativa normal
        element.style.position = 'relative';
        element.style.top = '';
        element.style.left = '';
        element.style.width = '';
      } else if (scrolledPastEnd) {
        // Depois do fim: grudado no final da área de referência
        element.style.position = 'absolute';
        element.style.top = `${bounds.referenceBottom - bounds.containerTop - element.offsetHeight}px`;
        element.style.left = '0';
        element.style.width = '100%';
      } else {
        // No meio: posição fixa na tela
        const rect = element.parentElement?.getBoundingClientRect();
        element.style.position = 'fixed';
        element.style.top = `${fixedPosition}px`;
        element.style.left = rect ? `${rect.left}px` : '0';
        element.style.width = rect ? `${rect.width}px` : '100%';
      }
    });
  }

  private updateHeaderHeight() {
    const header = document.querySelector('header') || 
                  document.querySelector('[role="banner"]') || 
                  document.querySelector('nav');
    this.headerHeight = header ? header.offsetHeight : 80;
  }

  calculateBounds(containerElement: HTMLElement, referenceElement: HTMLElement): StickyBounds {
    const containerRect = containerElement.getBoundingClientRect();
    const referenceRect = referenceElement.getBoundingClientRect();
    
    return {
      containerTop: containerRect.top + window.scrollY,
      containerBottom: containerRect.bottom + window.scrollY,
      referenceBottom: referenceRect.bottom + window.scrollY
    };
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