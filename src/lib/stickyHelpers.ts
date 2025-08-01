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
      const { element, bounds, naturalOffset, originalWidth, originalHeight } = stickyElement;
      
      // Posição fixa desejada na tela (header + offset natural)
      const fixedPosition = this.headerHeight + naturalOffset;
      
      // Calcular se devemos usar position fixed ou absolute
      const scrolledPastStart = this.scrollY > bounds.containerTop - fixedPosition;
      const scrolledPastEnd = this.scrollY > bounds.referenceBottom - fixedPosition - originalHeight;
      
      if (!scrolledPastStart) {
        // Antes do início: posição relativa normal
        element.style.position = 'relative';
        element.style.top = '';
        element.style.left = '';
        element.style.width = '';
        element.style.transform = '';
      } else if (scrolledPastEnd) {
        // Depois do fim: posição absoluta no container pai usando dimensões originais
        const maxTop = bounds.referenceBottom - bounds.containerTop - originalHeight;
        
        element.style.position = 'absolute';
        element.style.top = `${Math.max(0, maxTop)}px`;
        element.style.left = '0';
        element.style.width = `${originalWidth}px`;
        element.style.transform = '';
      } else {
        // No meio: posição fixa na tela usando dimensões originais
        const parentRect = element.parentElement?.getBoundingClientRect();
        
        element.style.position = 'fixed';
        element.style.top = `${fixedPosition}px`;
        element.style.left = parentRect ? `${parentRect.left}px` : '0';
        element.style.width = `${originalWidth}px`;
        element.style.transform = '';
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