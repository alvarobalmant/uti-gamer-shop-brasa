export interface StickyBounds {
  start: number;
  end: number;
}

export interface StickyElement {
  id: string;
  element: HTMLElement;
  originalTop: number;
  bounds: StickyBounds;
}

export class StickyManager {
  private elements: Map<string, StickyElement> = new Map();
  private scrollY = 0;
  private ticking = false;

  addElement(id: string, element: HTMLElement, bounds: StickyBounds) {
    const rect = element.getBoundingClientRect();
    this.elements.set(id, {
      id,
      element,
      originalTop: rect.top + window.scrollY,
      bounds
    });
  }

  removeElement(id: string) {
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
      const { element, originalTop, bounds } = stickyElement;
      
      // Calculate the position based on scroll and bounds
      let translateY = 0;
      
      if (this.scrollY > bounds.start) {
        const maxScroll = bounds.end - bounds.start;
        const currentScroll = Math.min(this.scrollY - bounds.start, maxScroll);
        translateY = currentScroll;
      }

      // Apply the transform
      element.style.transform = `translateY(${translateY}px)`;
      element.style.willChange = 'transform';
    });
  }

  calculateBounds(containerElement: HTMLElement, referenceElement: HTMLElement): StickyBounds {
    const containerRect = containerElement.getBoundingClientRect();
    const referenceRect = referenceElement.getBoundingClientRect();
    
    const containerTop = containerRect.top + window.scrollY;
    const referenceBottom = referenceRect.bottom + window.scrollY;
    
    return {
      start: containerTop,
      end: referenceBottom - containerRect.height
    };
  }

  destroy() {
    this.elements.clear();
  }
}

// Throttle utility for performance
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
      }, delay - (currentTime - lastExecTime));
    }
  };
};

// Debounce utility for resize events
export const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return (...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};