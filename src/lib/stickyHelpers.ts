<<<<<<< HEAD
export interface StickyBounds {
  containerTop: number;
  containerBottom: number;
  referenceBottom: number;
=======

export interface StickyBounds {
  containerTop: number;
  containerBottom: number;
  column3Bottom: number; // Altura real da coluna 3
>>>>>>> 727b89def26603bfb9cd8619676d5b7666a161f8
}

export interface StickyElement {
  id: string;
  element: HTMLElement;
  bounds: StickyBounds;
  naturalOffset: number; // Offset natural do elemento para não grudar no topo
  originalWidth: number; // Largura original preservada
  originalHeight: number; // Altura original preservada
<<<<<<< HEAD
=======
  isFrozen: boolean; // Se está congelado na posição final
  frozenTop: number; // Posição congelada
  frozenLeft: number; // Posição horizontal congelada
  // Nova propriedade para estabilidade
  lastFreezeCheck: number; // Timestamp da última verificação de freeze
>>>>>>> 727b89def26603bfb9cd8619676d5b7666a161f8
}

export class StickyManager {
  private elements: Map<string, StickyElement> = new Map();
  private scrollY = 0;
  private ticking = false;
  private headerHeight = 0;
  
<<<<<<< HEAD
  // SOLUÇÃO DEFINITIVA: Estado dinâmico inteligente para impedir arrombamento
  private elementStates: Map<string, { 
    isInStickyZone: boolean;    // Se está na zona sticky (pode mudar)
    isStuckAtLimit: boolean;    // Se está travado no limite (pode mudar)
    limitPosition: number;      // Posição absoluta do limite
    stuckViewportPosition: number; // Posição na viewport quando travou
  }> = new Map();
=======
  // Constantes para hysteresis (evitar oscilação)
  private readonly FREEZE_HYSTERESIS = 20; // 20px de zona morta
  private readonly BOUNDS_VALIDATION_THRESHOLD = 50; // Mínimo de altura válida para coluna 3
  private readonly PERFORMANCE_THROTTLE = 16; // ~60fps
>>>>>>> 727b89def26603bfb9cd8619676d5b7666a161f8

  constructor() {
    this.updateHeaderHeight();
  }

  addElement(id: string, element: HTMLElement, bounds: StickyBounds, naturalOffset: number = 100) {
<<<<<<< HEAD
=======
    // Validar bounds antes de adicionar
    if (!this.validateBounds(bounds, id)) {
      console.warn(`[STICKY] Bounds inválidos para ${id}, usando fallback`);
      bounds = this.createFallbackBounds(element);
    }

>>>>>>> 727b89def26603bfb9cd8619676d5b7666a161f8
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
<<<<<<< HEAD
      originalHeight
=======
      originalHeight,
      isFrozen: false,
      frozenTop: 0,
      frozenLeft: 0,
      lastFreezeCheck: Date.now()
>>>>>>> 727b89def26603bfb9cd8619676d5b7666a161f8
    });
    
    // Setup inicial do elemento
    element.style.position = 'relative';
    element.style.zIndex = '10';
<<<<<<< HEAD
=======

    if (process.env.NODE_ENV === 'development') {
      console.log(`[STICKY DEBUG] Elemento ${id} adicionado:`, {
        originalWidth,
        originalHeight,
        bounds,
        naturalOffset
      });
    }
>>>>>>> 727b89def26603bfb9cd8619676d5b7666a161f8
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
<<<<<<< HEAD
    this.elements.forEach((stickyElement) => {
      const { element, bounds, naturalOffset, originalWidth, originalHeight, id } = stickyElement;
      
      // Debug logging only in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[STICKY DEBUG] ${id}: scrollY=${this.scrollY}, bounds=`, bounds);
      }
      
      // Posição fixa desejada na tela (header + offset natural)
      const desiredFixedPosition = this.headerHeight + naturalOffset;
      
      // Get parent container for proper positioning context
      const parentElement = element.parentElement;
      if (!parentElement) {
        console.warn(`[STICKY] Parent element not found for ${id}`);
        return;
      }
      
      // NOVA LÓGICA: Calcular zonas de comportamento
      const stickyZoneStart = bounds.containerTop - desiredFixedPosition;
      const limitAbsolute = bounds.referenceBottom - originalHeight;
      const limitInViewport = limitAbsolute - this.scrollY;
      
      // Obter ou criar estado do elemento
      let state = this.elementStates.get(id);
      if (!state) {
        state = { 
          isInStickyZone: false,
          isStuckAtLimit: false,
          limitPosition: limitAbsolute,
          stuckViewportPosition: 0
        };
        this.elementStates.set(id, state);
      }
      
      // FASE 1: Determinar se está na zona sticky
      const inStickyZone = this.scrollY > stickyZoneStart;
      state.isInStickyZone = inStickyZone;
      
      if (!inStickyZone) {
        // ANTES DA ZONA STICKY: Posição relativa (natural)
        state.isStuckAtLimit = false; // Reset do travamento
        if (process.env.NODE_ENV === 'development') {
          console.log(`[STICKY DEBUG] ${id}: 🆓 ANTES DA ZONA - posição relativa`);
        }
        this.resetElementToRelative(element);
        return;
      }
      
      // FASE 2: Dentro da zona sticky - determinar comportamento
      const parentRect = parentElement.getBoundingClientRect();
      const leftPosition = parentRect.left + window.scrollX;
      
      // LÓGICA MASTER: Comportamento baseado na posição do limite
      let finalPosition;
      
      if (limitInViewport > desiredFixedPosition) {
        // CASO 1: Limite ainda não foi atingido - SEGUIR NORMALMENTE
        state.isStuckAtLimit = false;
        finalPosition = desiredFixedPosition;
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`[STICKY DEBUG] ${id}: 🆓 SEGUINDO - limitInViewport=${limitInViewport}, desired=${desiredFixedPosition}`);
        }
        
      } else if (limitInViewport >= 0) {
        // CASO 2: Limite visível na tela - TRAVAR NO LIMITE
        state.isStuckAtLimit = true;
        state.stuckViewportPosition = limitInViewport;
        finalPosition = limitInViewport;
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`[STICKY DEBUG] ${id}: 🔒 TRAVADO NO LIMITE - posição=${limitInViewport}`);
        }
        
      } else {
        // CASO 3: Limite passou da tela - MANTER NA ÚLTIMA POSIÇÃO CONHECIDA
        if (state.isStuckAtLimit) {
          // Já estava travado - calcular posição baseada no limite
          const positionBasedOnLimit = limitAbsolute - this.scrollY;
          
          if (positionBasedOnLimit >= -originalHeight) {
            // Ainda parcialmente visível - usar posição calculada
            finalPosition = positionBasedOnLimit;
          } else {
            // Completamente fora da tela - manter fora (pode ser negativo)
            finalPosition = positionBasedOnLimit;
          }
          
          if (process.env.NODE_ENV === 'development') {
            console.log(`[STICKY DEBUG] ${id}: 🔒 FORA DA TELA - posição=${finalPosition} (baseada no limite)`);
          }
        } else {
          // Não estava travado ainda - comportamento normal
          finalPosition = desiredFixedPosition;
          
          if (process.env.NODE_ENV === 'development') {
            console.log(`[STICKY DEBUG] ${id}: 🆓 NORMAL - posição=${finalPosition}`);
          }
        }
      }
      
      // APLICAR POSIÇÃO FINAL - SEM LIMITAÇÕES ARTIFICIAIS
      this.setElementToFixed(element, finalPosition, leftPosition, originalWidth, originalHeight);
    });
  }

  // Helper methods for cleaner positioning logic
=======
    const currentTime = Date.now();
    
    this.elements.forEach((stickyElement) => {
      const { element, bounds, naturalOffset, originalWidth, originalHeight, id } = stickyElement;
      
      // Throttling para performance
      if (currentTime - stickyElement.lastFreezeCheck < this.PERFORMANCE_THROTTLE) {
        return;
      }
      
      // Posição fixa desejada na tela (header + offset natural)
      const fixedPosition = this.headerHeight + naturalOffset;
      
      // Calcular quando o elemento deve começar a ser sticky
      const elementTop = bounds.containerTop;
      const startStickyAt = elementTop - fixedPosition;
      
      // Calcular posições críticas com hysteresis
      const elementBottomPosition = this.scrollY + fixedPosition + originalHeight;
      const freezeBoundary = bounds.column3Bottom - this.FREEZE_HYSTERESIS;
      const unfreezeBoundary = bounds.column3Bottom - (this.FREEZE_HYSTERESIS * 2);
      
      // Determinar se deve congelar/descongelar com hysteresis
      let shouldFreeze = false;
      let shouldUnfreeze = false;
      
      if (!stickyElement.isFrozen) {
        // Só congela se ultrapassar a linha de freeze
        shouldFreeze = elementBottomPosition >= freezeBoundary;
      } else {
        // Só descongela se voltar para antes da linha de unfreeze
        shouldUnfreeze = elementBottomPosition < unfreezeBoundary;
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[STICKY DEBUG] ${id}:`, {
          scrollY: this.scrollY,
          elementTop,
          startStickyAt,
          column3Bottom: bounds.column3Bottom,
          elementBottomPosition,
          freezeBoundary,
          unfreezeBoundary,
          shouldFreeze,
          shouldUnfreeze,
          isFrozen: stickyElement.isFrozen,
          fixedPosition,
          originalHeight,
          hysteresis: this.FREEZE_HYSTERESIS
        });
      }
      
      // Atualizar timestamp
      stickyElement.lastFreezeCheck = currentTime;
      
      if (this.scrollY <= startStickyAt) {
        // Antes do início: posição relativa normal
        if (process.env.NODE_ENV === 'development') {
          console.log(`[STICKY DEBUG] ${id}: RELATIVE - before sticky start`);
        }
        stickyElement.isFrozen = false;
        this.resetElementToRelative(element);
        
      } else if (shouldFreeze && !stickyElement.isFrozen) {
        // Congelar: calcular posição absoluta estável
        const frozenPosition = this.calculateStableFrozenPosition(
          element, 
          bounds, 
          originalHeight
        );
        
        stickyElement.isFrozen = true;
        stickyElement.frozenTop = frozenPosition.top;
        stickyElement.frozenLeft = frozenPosition.left;
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`[STICKY DEBUG] ${id}: FREEZING at stable position top=${frozenPosition.top}px, left=${frozenPosition.left}px`);
        }
        
        this.setElementToAbsolute(element, frozenPosition.top, originalWidth, originalHeight);
        
      } else if (shouldUnfreeze && stickyElement.isFrozen) {
        // Descongelar: voltar ao modo fixed
        stickyElement.isFrozen = false;
        
        const parentLeft = this.calculateParentLeftPosition(element);
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`[STICKY DEBUG] ${id}: UNFREEZING - back to fixed mode at left=${parentLeft}px`);
        }
        
        this.setElementToFixed(element, fixedPosition, parentLeft, originalWidth, originalHeight);
        
      } else if (stickyElement.isFrozen) {
        // Manter congelado: usar posição salva (não recalcular)
        if (process.env.NODE_ENV === 'development') {
          console.log(`[STICKY DEBUG] ${id}: STAYING FROZEN at cached position top=${stickyElement.frozenTop}px`);
        }
        // Manter a posição congelada sem recálculo
        this.maintainFrozenPosition(element, stickyElement, originalWidth, originalHeight);
        
      } else {
        // Modo sticky normal: posição fixa na tela
        const parentLeft = this.calculateParentLeftPosition(element);
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`[STICKY DEBUG] ${id}: FIXED - sticky mode, top=${fixedPosition}px, left=${parentLeft}px`);
        }
        this.setElementToFixed(element, fixedPosition, parentLeft, originalWidth, originalHeight);
      }
    });
  }

  // Nova função para calcular posição congelada estável
  private calculateStableFrozenPosition(
    element: HTMLElement, 
    bounds: StickyBounds, 
    originalHeight: number
  ): { top: number; left: number } {
    const parentElement = element.parentElement;
    if (!parentElement) {
      console.warn(`[STICKY] Parent element não encontrado, usando posição 0`);
      return { top: 0, left: 0 };
    }
    
    // Calcular posição top de forma mais estável
    // A posição deve ser a altura da coluna 3 menos a altura do elemento, relativa ao container pai
    const safetyMargin = 10;
    const containerTop = bounds.containerTop;
    const targetPosition = bounds.column3Bottom - originalHeight - safetyMargin;
    const absoluteTop = Math.max(0, targetPosition - containerTop);
    
    return {
      top: absoluteTop,
      left: 0 // Sempre 0 para manter alinhamento com o container pai
    };
  }

  // Nova função para calcular posição left do parent
  private calculateParentLeftPosition(element: HTMLElement): number {
    const parentElement = element.parentElement;
    if (!parentElement) {
      console.warn(`[STICKY] Parent element não encontrado para posicionamento`);
      return 0;
    }
    
    const parentRect = parentElement.getBoundingClientRect();
    return parentRect.left + window.scrollX;
  }

  // Nova função para manter posição congelada sem recalcular
  private maintainFrozenPosition(
    element: HTMLElement, 
    stickyElement: StickyElement, 
    originalWidth: number, 
    originalHeight: number
  ) {
    // Apenas aplicar a posição já calculada, sem recalcular
    element.style.position = 'absolute';
    element.style.top = `${stickyElement.frozenTop}px`;
    element.style.left = `${stickyElement.frozenLeft}px`;
    element.style.width = `${originalWidth}px`;
    element.style.height = `${originalHeight}px`;
    element.style.transform = '';
    element.style.zIndex = '10';
  }

  // Função para validar bounds
  private validateBounds(bounds: StickyBounds, elementId: string): boolean {
    const isValid = (
      bounds.containerTop >= 0 &&
      bounds.containerBottom > bounds.containerTop &&
      bounds.column3Bottom > bounds.containerTop &&
      (bounds.column3Bottom - bounds.containerTop) > this.BOUNDS_VALIDATION_THRESHOLD
    );
    
    if (!isValid && process.env.NODE_ENV === 'development') {
      console.warn(`[STICKY] Bounds inválidos para ${elementId}:`, bounds);
    }
    
    return isValid;
  }

  // Função para criar bounds de fallback
  private createFallbackBounds(element: HTMLElement): StickyBounds {
    const rect = element.getBoundingClientRect();
    const scrollY = window.scrollY;
    
    return {
      containerTop: rect.top + scrollY,
      containerBottom: rect.bottom + scrollY,
      column3Bottom: rect.bottom + scrollY + 500 // Fallback com espaço extra
    };
  }

  // Helper methods com posicionamento mais preciso (mantidos como antes)
>>>>>>> 727b89def26603bfb9cd8619676d5b7666a161f8
  private resetElementToRelative(element: HTMLElement) {
    element.style.position = 'relative';
    element.style.top = '';
    element.style.left = '';
    element.style.width = '';
    element.style.height = '';
    element.style.transform = '';
    element.style.zIndex = '10';
<<<<<<< HEAD
    element.style.visibility = 'visible'; // Garantir que elemento seja visível
  }

  private setElementToAbsolute(element: HTMLElement, top: number, width: number, height: number) {
    // CORREÇÃO: Adicionar verificações de segurança
    const safeTop = Math.max(0, top);
    const safeWidth = Math.max(100, width);
    const safeHeight = Math.max(50, height);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[STICKY DEBUG] setElementToAbsolute: top=${safeTop}, width=${safeWidth}, height=${safeHeight}`);
    }
    
    element.style.position = 'absolute';
    element.style.top = `${safeTop}px`;
    element.style.left = '0';
    element.style.width = `${safeWidth}px`;
    element.style.height = `${safeHeight}px`;
    element.style.transform = '';
    element.style.zIndex = '10';
    element.style.visibility = 'visible'; // Garantir que elemento seja visível
  }

  private setElementToAbsoluteWithLeft(element: HTMLElement, top: number, left: number, width: number, height: number) {
    // CORREÇÃO: Método específico para manter posição left quando mudar para absolute
    const safeTop = Math.max(0, top);
    const safeLeft = Math.max(0, left);
    const safeWidth = Math.max(100, width);
    const safeHeight = Math.max(50, height);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[STICKY DEBUG] setElementToAbsoluteWithLeft: top=${safeTop}, left=${safeLeft}, width=${safeWidth}, height=${safeHeight}`);
    }
    
    element.style.position = 'absolute';
    element.style.top = `${safeTop}px`;
    element.style.left = `${safeLeft}px`;
    element.style.width = `${safeWidth}px`;
    element.style.height = `${safeHeight}px`;
    element.style.transform = '';
    element.style.zIndex = '10';
    element.style.visibility = 'visible';
  }

  private setElementToFixed(element: HTMLElement, top: number, left: number, width: number, height: number) {
    // CORREÇÃO MASTER: Permitir posições naturais, mesmo negativas
    // Não forçar Math.max(0, ...) que causa o "empurrão do topo"
    const safeLeft = Math.max(0, left);
    const safeWidth = Math.max(100, width); // Largura mínima
    const safeHeight = Math.max(50, height); // Altura mínima
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[STICKY DEBUG] setElementToFixed: top=${top} (NATURAL), left=${safeLeft}, width=${safeWidth}, height=${safeHeight}`);
    }
    
    element.style.position = 'fixed';
    element.style.top = `${top}px`; // POSIÇÃO NATURAL - pode ser negativa!
    element.style.left = `${safeLeft}px`;
    element.style.width = `${safeWidth}px`;
    element.style.height = `${safeHeight}px`;
    element.style.transform = '';
    element.style.zIndex = '10';
    element.style.visibility = 'visible';
=======
  }

  private setElementToAbsolute(element: HTMLElement, top: number, width: number, height: number) {
    element.style.position = 'absolute';
    element.style.top = `${top}px`;
    element.style.left = '0px';
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
>>>>>>> 727b89def26603bfb9cd8619676d5b7666a161f8
  }

  private updateHeaderHeight() {
    const header = document.querySelector('header') || 
                  document.querySelector('[role="banner"]') || 
                  document.querySelector('nav');
    this.headerHeight = header ? header.offsetHeight : 80;
  }

  calculateBounds(containerElement: HTMLElement, referenceElement: HTMLElement): StickyBounds {
<<<<<<< HEAD
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
=======
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
      column3Bottom: referenceRect.bottom + currentScrollY
>>>>>>> 727b89def26603bfb9cd8619676d5b7666a161f8
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
<<<<<<< HEAD
};
=======
};
>>>>>>> 727b89def26603bfb9cd8619676d5b7666a161f8
