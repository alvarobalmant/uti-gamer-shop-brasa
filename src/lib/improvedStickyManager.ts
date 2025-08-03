/**
 * Advanced Sticky Manager with Smooth Transitions
 * Eliminates teleportation through interpolation and transform-based positioning
 */

import { scrollCoordinator } from './scrollCoordinator';

export interface StickyBounds {
  containerTop: number;
  containerBottom: number;
  referenceBottom: number;
}

export interface StickyElement {
  id: string;
  element: HTMLElement;
  bounds: StickyBounds;
  naturalOffset: number;
  originalWidth: number;
  originalHeight: number;
  isActive: boolean;
}

interface ElementState {
  phase: 'before' | 'sticky' | 'transitioning' | 'bottom-limit' | 'after';
  lastValidPosition: number;
  targetPosition: number;
  currentTransform: number;
  isStable: boolean;
  interpolationFactor: number;
  lastBoundaryCheck: number;
}

interface TransitionConfig {
  smoothness: number; // 0-1, higher = smoother but slower
  damping: number; // 0-1, higher = more damping
  boundaryTolerance: number; // pixels of tolerance near boundaries
  enableInterpolation: boolean;
}

export class ImprovedStickyManager {
  private elements: Map<string, StickyElement> = new Map();
  private elementStates: Map<string, ElementState> = new Map();
  private headerHeight = 0;
  private boundariesCache: Map<string, StickyBounds> = new Map();
  private lastScrollY = 0;
  private scrollDirection: 'up' | 'down' | 'none' = 'none';
  private scrollVelocity = 0;
  private lastFrameTime = 0;
  
  // Advanced configuration - EMERGENCY: reduce complexity
  private config: TransitionConfig = {
    smoothness: 0.3, // Increased for stability
    damping: 0.95, // High damping to prevent oscillation
    boundaryTolerance: 50, // Increased tolerance
    enableInterpolation: false // DISABLED until stable
  };
  
  // Performance thresholds
  private readonly RAPID_SCROLL_THRESHOLD = 30; // Reduced for better detection
  private readonly STABILITY_THRESHOLD = 2; // Tighter stability check
  private readonly CACHE_REFRESH_INTERVAL = 1000; // ms between boundary cache refreshes
  
  constructor() {
    this.updateHeaderHeight();
    
    // Register with scroll coordinator
    scrollCoordinator.registerSystem('sticky-manager', this.updateScroll.bind(this), {
      priority: 10, // High priority for visual elements
      throttleMs: 8 // ~120fps for smooth scrolling
    });
  }

  addElement(id: string, element: HTMLElement, bounds: StickyBounds, naturalOffset: number = 100) {
    // Add safety check for invalid bounds FIRST
    if (!bounds || bounds.containerTop === undefined || bounds.containerBottom === undefined || bounds.referenceBottom === undefined) {
      console.error(`[ImprovedStickyManager] Invalid bounds for element: ${id}`, bounds);
      return;
    }
    
    // Store original dimensions before any modifications
    const rect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);
    
    const stickyElement: StickyElement = {
      id,
      element,
      bounds: { ...bounds }, // Deep copy
      naturalOffset,
      originalWidth: rect.width,
      originalHeight: rect.height,
      isActive: true
    };
    
    this.elements.set(id, stickyElement);
    
    // Initialize element state with advanced tracking
    this.elementStates.set(id, {
      phase: 'before',
      lastValidPosition: 0,
      targetPosition: 0,
      currentTransform: 0,
      isStable: true,
      interpolationFactor: 1,
      lastBoundaryCheck: Date.now()
    });
    
    // Cache boundaries
    this.boundariesCache.set(id, { ...bounds });
    
    // Setup initial styles
    this.setupElementStyles(element);
    
    // Immediate position update
    this.updateElementPositionSmooth(stickyElement);
    
    console.log(`[ImprovedStickyManager] Added element: ${id}`, bounds);
  }

  removeElement(id: string) {
    const stickyElement = this.elements.get(id);
    if (stickyElement) {
      this.resetElementStyles(stickyElement.element);
      this.elements.delete(id);
      this.elementStates.delete(id);
      this.boundariesCache.delete(id);
      console.log(`[ImprovedStickyManager] Removed element: ${id}`);
    }
  }

  private updateScroll = (scrollY: number) => {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastFrameTime;
    const scrollDelta = scrollY - this.lastScrollY;
    
    // Calculate scroll velocity and direction
    this.scrollVelocity = deltaTime > 0 ? Math.abs(scrollDelta) / deltaTime : 0;
    const isRapidScroll = this.scrollVelocity > this.RAPID_SCROLL_THRESHOLD;
    this.scrollDirection = scrollDelta > 0 ? 'down' : scrollDelta < 0 ? 'up' : 'none';
    
    this.lastScrollY = scrollY;
    this.lastFrameTime = currentTime;
    
    // Update all active elements with smooth transitions
    this.elements.forEach(stickyElement => {
      if (stickyElement.isActive) {
        this.updateElementPositionSmooth(stickyElement, isRapidScroll, deltaTime);
      }
    });
  };

  private updateElementPositionSmooth(stickyElement: StickyElement, isRapidScroll: boolean = false, deltaTime: number = 16) {
    const { id, element, bounds, naturalOffset, originalWidth, originalHeight } = stickyElement;
    const state = this.elementStates.get(id)!;
    
    const scrollY = this.lastScrollY;
    const desiredPosition = this.headerHeight + naturalOffset;
    
    // Enhanced boundary calculations with tolerance
    const stickyStart = bounds.containerTop - desiredPosition - this.config.boundaryTolerance;
    const stickyEnd = bounds.referenceBottom - originalHeight - desiredPosition + this.config.boundaryTolerance;
    const bottomLimit = bounds.referenceBottom - originalHeight;
    
    // Determine target position and phase
    let newPhase: ElementState['phase'];
    let targetPosition: number;
    let shouldUseTransform = false;
    
    if (scrollY <= stickyStart) {
      // PHASE 1: Before sticky zone - natural positioning
      newPhase = 'before';
      targetPosition = 0;
      
    } else if (scrollY <= stickyEnd) {
      // PHASE 2: Sticky zone - fixed at desired position
      newPhase = 'sticky';
      targetPosition = desiredPosition;
      shouldUseTransform = this.config.enableInterpolation;
      
    } else if (scrollY <= bottomLimit + this.config.boundaryTolerance) {
      // PHASE 3: Transition zone - smooth movement toward bottom
      newPhase = 'transitioning';
      targetPosition = Math.max(0, bottomLimit - scrollY);
      shouldUseTransform = true;
      
    } else {
      // PHASE 4: Past bottom limit
      newPhase = 'after';
      targetPosition = bottomLimit - scrollY;
      shouldUseTransform = true;
    }
    
    // Smooth interpolation for position changes
    if (this.config.enableInterpolation && shouldUseTransform) {
      const positionDelta = targetPosition - state.currentTransform;
      const interpolationSpeed = this.config.smoothness * (deltaTime / 16); // Normalize to 60fps
      
      // Apply damping to reduce oscillation
      state.currentTransform += positionDelta * interpolationSpeed * this.config.damping;
      
      // Snap to target if very close (prevents infinite interpolation)
      if (Math.abs(positionDelta) < 0.1) {
        state.currentTransform = targetPosition;
      }
    } else {
      state.currentTransform = targetPosition;
    }
    
    // Skip micro-updates during rapid scrolling for performance
    if (isRapidScroll && state.isStable) {
      const positionDelta = Math.abs(state.currentTransform - state.lastValidPosition);
      if (positionDelta < this.STABILITY_THRESHOLD && newPhase === state.phase) {
        return;
      }
    }
    
    // Apply smooth positioning
    this.applyElementPositionSmooth(element, newPhase, state.currentTransform, originalWidth, originalHeight, shouldUseTransform);
    
    // Update state
    state.phase = newPhase;
    state.targetPosition = targetPosition;
    state.lastValidPosition = state.currentTransform;
    state.isStable = !isRapidScroll;
    
    // Refresh boundary cache periodically
    const now = Date.now();
    if (now - state.lastBoundaryCheck > this.CACHE_REFRESH_INTERVAL) {
      this.refreshElementBounds(id);
      state.lastBoundaryCheck = now;
    }
    
    // Reduce console spam - only log phase changes
    if (process.env.NODE_ENV === 'development' && (state.phase !== newPhase || Math.abs(state.currentTransform - targetPosition) > 20)) {
      console.log(`[StickySmooth] ${id}: phase=${newPhase}, target=${targetPosition.toFixed(1)}, current=${state.currentTransform.toFixed(1)}, scroll=${scrollY}, bounds=${JSON.stringify(bounds)}`);
    }
  }

  private applyElementPositionSmooth(
    element: HTMLElement, 
    phase: ElementState['phase'], 
    position: number, 
    width: number, 
    height: number,
    useTransform: boolean = false
  ) {
    // Get parent positioning context
    const parent = element.parentElement;
    if (!parent) {
      console.warn('[ImprovedStickyManager] Parent element not found');
      return;
    }
    
    // Prevent extreme negative values that cause visual glitches
    const clampedPosition = Math.max(position, -height * 2);
    
    const parentRect = parent.getBoundingClientRect();
    const leftPosition = parentRect.left + window.scrollX;
    
    // Clear any existing transform if not using it
    if (!useTransform) {
      element.style.transform = '';
    }
    
    switch (phase) {
      case 'before':
        // Natural relative positioning - no teleportation
        element.style.position = 'relative';
        element.style.top = '';
        element.style.left = '';
        element.style.width = '';
        element.style.height = '';
        element.style.transform = '';
        break;
        
      case 'sticky':
        if (useTransform) {
          // Use transform for micro-adjustments within sticky phase
          element.style.position = 'fixed';
          element.style.top = `${position}px`;
          element.style.left = `${Math.max(0, leftPosition)}px`;
          element.style.width = `${Math.max(100, width)}px`;
          element.style.height = `${Math.max(50, height)}px`;
          element.style.transform = `translateY(0px)`; // Ready for smooth transitions
        } else {
          // Standard fixed positioning
          element.style.position = 'fixed';
          element.style.top = `${position}px`;
          element.style.left = `${Math.max(0, leftPosition)}px`;
          element.style.width = `${Math.max(100, width)}px`;
          element.style.height = `${Math.max(50, height)}px`;
          element.style.transform = '';
        }
        break;
        
      case 'transitioning':
      case 'bottom-limit':
      case 'after':
        // Use transform for smooth movement - prevents teleportation
        const basePosition = this.headerHeight + (element.dataset.naturalOffset ? parseInt(element.dataset.naturalOffset) : 100);
        const transformValue = clampedPosition - basePosition;
        
        // Don't apply extreme negative transforms that cause visual issues
        if (Math.abs(transformValue) > height * 3) {
          // Element is too far out - hide it instead of extreme positioning
          element.style.position = 'fixed';
          element.style.top = `${basePosition}px`;
          element.style.left = `${Math.max(0, leftPosition)}px`;
          element.style.width = `${Math.max(100, width)}px`;
          element.style.height = `${Math.max(50, height)}px`;
          element.style.transform = `translateY(-${height + 50}px)`; // Move just out of view
          element.style.transition = 'none';
        } else {
          element.style.position = 'fixed';
          element.style.top = `${basePosition}px`;
          element.style.left = `${Math.max(0, leftPosition)}px`;
          element.style.width = `${Math.max(100, width)}px`;
          element.style.height = `${Math.max(50, height)}px`;
          element.style.transform = `translateY(${transformValue}px)`;
          element.style.transition = this.scrollVelocity > this.RAPID_SCROLL_THRESHOLD ? 'none' : 'transform 0.1s ease-out';
        }
        break;
    }
    
    // Ensure consistent z-index and visibility
    element.style.zIndex = '10';
    element.style.visibility = 'visible';
  }

  private setupElementStyles(element: HTMLElement) {
    element.style.position = 'relative';
    element.style.zIndex = '10';
    element.style.visibility = 'visible';
  }

  private resetElementStyles(element: HTMLElement) {
    element.style.position = '';
    element.style.top = '';
    element.style.left = '';
    element.style.width = '';
    element.style.height = '';
    element.style.zIndex = '';
    element.style.transform = '';
    element.style.visibility = '';
  }

  calculateBounds(containerElement: HTMLElement, referenceElement: HTMLElement): StickyBounds {
    const containerRect = containerElement.getBoundingClientRect();
    const referenceRect = referenceElement.getBoundingClientRect();
    const scrollY = window.scrollY;
    
    const bounds: StickyBounds = {
      containerTop: containerRect.top + scrollY,
      containerBottom: containerRect.bottom + scrollY,
      referenceBottom: referenceRect.bottom + scrollY
    };
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[StickyBounds] Calculated:', bounds);
    }
    
    return bounds;
  }

  refreshBounds() {
    // Recalculate bounds for all elements
    this.elements.forEach((stickyElement, id) => {
      this.refreshElementBounds(id);
    });
    
    // Update header height
    this.updateHeaderHeight();
    
    // Force update positions with smooth transitions
    this.elements.forEach(stickyElement => {
      if (stickyElement.isActive) {
        this.updateElementPositionSmooth(stickyElement);
      }
    });
  }

  private refreshElementBounds(id: string) {
    const stickyElement = this.elements.get(id);
    if (!stickyElement) return;

    const container = stickyElement.element.closest('[data-sticky-container]') as HTMLElement;
    const reference = document.getElementById(stickyElement.bounds.referenceBottom.toString().split('.')[0]);
    
    if (container && reference) {
      const newBounds = this.calculateBounds(container, reference);
      stickyElement.bounds = newBounds;
      this.boundariesCache.set(id, newBounds);
      
      // Reset last boundary check time
      const state = this.elementStates.get(id);
      if (state) {
        state.lastBoundaryCheck = Date.now();
      }
    }
  }

  private updateHeaderHeight() {
    const header = document.querySelector('header') || 
                  document.querySelector('[role="banner"]') || 
                  document.querySelector('nav');
    this.headerHeight = header ? header.offsetHeight : 80;
  }

  // Emergency fallback methods
  resetElement(id: string) {
    const stickyElement = this.elements.get(id);
    if (stickyElement) {
      this.resetElementStyles(stickyElement.element);
      
      // Reset state with new properties
      const state = this.elementStates.get(id);
      if (state) {
        state.phase = 'before';
        state.isStable = true;
        state.lastValidPosition = 0;
        state.targetPosition = 0;
        state.currentTransform = 0;
        state.interpolationFactor = 1;
        state.lastBoundaryCheck = Date.now();
      }
      
      console.log(`[ImprovedStickyManager] Reset element: ${id}`);
    }
  }

  resetAllElements() {
    this.elements.forEach((_, id) => {
      this.resetElement(id);
    });
  }

  // Configuration methods
  updateConfig(newConfig: Partial<TransitionConfig>) {
    this.config = { ...this.config, ...newConfig };
    console.log('[ImprovedStickyManager] Configuration updated:', this.config);
  }

  // Advanced debugging methods
  getElementState(id: string) {
    return {
      element: this.elements.get(id),
      state: this.elementStates.get(id),
      bounds: this.boundariesCache.get(id),
      config: this.config
    };
  }

  getPerformanceMetrics() {
    return {
      scrollVelocity: this.scrollVelocity,
      scrollDirection: this.scrollDirection,
      lastScrollY: this.lastScrollY,
      activeElements: this.elements.size,
      config: this.config
    };
  }

  debugAllElements() {
    console.group('[ImprovedStickyManager] Debug All Elements');
    console.log('Performance:', this.getPerformanceMetrics());
    this.elements.forEach((element, id) => {
      console.log(`${id}:`, this.getElementState(id));
    });
    console.groupEnd();
  }

  // Emergency fallback for issues
  emergencyReset() {
    console.warn('[ImprovedStickyManager] Emergency reset triggered');
    this.resetAllElements();
    this.boundariesCache.clear();
    this.refreshBounds();
  }

  destroy() {
    // Reset all elements
    this.resetAllElements();
    
    // Unregister from scroll coordinator
    scrollCoordinator.unregisterSystem('sticky-manager');
    
    // Clear all data
    this.elements.clear();
    this.elementStates.clear();
    this.boundariesCache.clear();
    
    console.log('[ImprovedStickyManager] Destroyed');
  }
}