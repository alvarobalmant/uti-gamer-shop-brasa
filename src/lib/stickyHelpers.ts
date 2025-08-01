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
      
      // Calculate header height dynamically
      const headerHeight = this.getHeaderHeight();
      
      // Calculate the position based on scroll and bounds
      let translateY = 0;
      
      if (this.scrollY > bounds.start) {
        const maxScroll = bounds.end - bounds.start - headerHeight;
        const currentScroll = Math.min(this.scrollY - bounds.start, maxScroll);
        translateY = Math.max(0, currentScroll);
      }

      // Apply smooth transform with CSS transition
      element.style.transform = `translate3d(0, ${translateY}px, 0)`;
      element.style.transition = 'transform 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      element.style.willChange = 'transform';
    });
  }

  private getHeaderHeight(): number {
    const header = document.querySelector('header') || 
                  document.querySelector('[role="banner"]') || 
                  document.querySelector('nav');
    return header ? header.offsetHeight + 16 : 80; // fallback to 80px + 16px margin
  }

  calculateBounds(containerElement: HTMLElement, referenceElement: HTMLElement): StickyBounds {
    const containerRect = containerElement.getBoundingClientRect();
    const referenceRect = referenceElement.getBoundingClientRect();
    
    const containerTop = containerRect.top + window.scrollY;
    const referenceBottom = referenceRect.bottom + window.scrollY;
    const headerHeight = this.getHeaderHeight();
    
    return {
      start: Math.max(0, containerTop - headerHeight),
      end: referenceBottom - containerRect.height - headerHeight
    };
  }

  destroy() {
    this.elements.clear();
  }
}

// Smooth throttle for better performance and fluidity
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

// Debounce utility for resize events
export const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return (...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};