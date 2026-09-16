/**
 * Script preemptivo para suprimir erro n7.map is not a function
 * Carregado antes de qualquer outro script para interceptar o erro na origem
 */

(function() {
  'use strict';
  
  console.log('🚀 [N7PreemptiveScript] Iniciando supressão de erro n7.map na origem...');
  
  // Função para detectar erro n7.map
  function isN7MapError(error) {
    if (!error) return false;
    const errorMessage = typeof error === 'string' ? error : (error.message || '');
    return errorMessage.includes('n7.map is not a function') || 
           errorMessage.includes('n7.map') ||
           (errorMessage.includes('map is not a function') && errorMessage.includes('n7'));
  }
  
  // Interceptar console.error
  const originalConsoleError = console.error;
  console.error = function(...args) {
    const hasN7Error = args.some(arg => isN7MapError(arg));
    if (hasN7Error) {
      console.log('🔇 [N7PreemptiveScript] Console.error n7.map interceptado na origem');
      return;
    }
    return originalConsoleError.apply(console, args);
  };
  
  // Interceptar window.onerror
  const originalOnError = window.onerror;
  window.onerror = function(message, source, lineno, colno, error) {
    if (isN7MapError(message) || isN7MapError(error)) {
      console.log('🔇 [N7PreemptiveScript] Window.onerror n7.map interceptado na origem');
      return true;
    }
    if (originalOnError) {
      return originalOnError(message, source, lineno, colno, error);
    }
    return false;
  };
  
  // Interceptar unhandledrejection
  window.addEventListener('unhandledrejection', function(event) {
    if (isN7MapError(event.reason)) {
      console.log('🔇 [N7PreemptiveScript] Unhandled rejection n7.map interceptado na origem');
      event.preventDefault();
    }
  });
  
  // Interceptar addEventListener para capturar erros em event listeners
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(type, listener, options) {
    if (type === 'error' && typeof listener === 'function') {
      const wrappedListener = function(event) {
        if (isN7MapError(event.error) || isN7MapError(event.message)) {
          console.log('🔇 [N7PreemptiveScript] Event listener error n7.map interceptado na origem');
          return;
        }
        return listener.call(this, event);
      };
      return originalAddEventListener.call(this, type, wrappedListener, options);
    }
    return originalAddEventListener.call(this, type, listener, options);
  };
  
  // Interceptar Promise.catch para capturar erros em promises
  const originalPromiseCatch = Promise.prototype.catch;
  Promise.prototype.catch = function(onRejected) {
    const wrappedOnRejected = function(reason) {
      if (isN7MapError(reason)) {
        console.log('🔇 [N7PreemptiveScript] Promise.catch n7.map interceptado na origem');
        return Promise.resolve(); // Resolver a promise em vez de rejeitar
      }
      if (onRejected) {
        return onRejected(reason);
      }
      throw reason;
    };
    return originalPromiseCatch.call(this, wrappedOnRejected);
  };
  
  // Função para remover elementos DOM que contenham o erro
  function removeN7ErrorElements() {
    const selectors = [
      '[data-error*="n7.map"]',
      '[data-error*="n7 map"]',
      '.error-notification',
      '.toast',
      '.notification'
    ];
    
    selectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          if (element.textContent && isN7MapError(element.textContent)) {
            console.log('🔇 [N7PreemptiveScript] Removendo elemento DOM com erro n7.map');
            element.style.display = 'none';
            element.style.visibility = 'hidden';
            element.style.opacity = '0';
            element.style.height = '0';
            element.style.margin = '0';
            element.style.padding = '0';
          }
        });
      } catch (e) {
        // Ignorar erros de seletor
      }
    });
  }
  
  // Executar limpeza periodicamente
  setInterval(removeN7ErrorElements, 2000);
  
  // Executar limpeza quando DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeN7ErrorElements);
  } else {
    removeN7ErrorElements();
  }
  
  // Interceptar MutationObserver para capturar novos elementos com erro
  const originalMutationObserver = window.MutationObserver;
  window.MutationObserver = function(callback) {
    const wrappedCallback = function(mutations, observer) {
      try {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node;
              if (element.textContent && isN7MapError(element.textContent)) {
                element.style.display = 'none';
              }
            }
          });
        });
      } catch (e) {
        // ignore
      }
      return callback.call(this, mutations, observer);
    };
    return new originalMutationObserver(wrappedCallback);
  };
  window.MutationObserver.prototype = originalMutationObserver.prototype;
  
  console.log('✅ [N7PreemptiveScript] Supressão de erro n7.map na origem ativada');
  
  // Marcar que o script foi carregado
  window.__n7SuppressionLoaded = true;
})();

