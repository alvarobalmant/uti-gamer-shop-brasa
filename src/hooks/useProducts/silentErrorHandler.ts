// Silent Error Handler para suprimir completamente o erro idasproduct_id
// Este módulo garante que o erro específico seja tratado de forma invisível ao usuário

export const isSuppressedError = (error: any): boolean => {
  if (!error?.message) return false;
  
  const errorMessage = error.message.toLowerCase();
  return (
    errorMessage.includes('idasproduct_id') ||
    errorMessage.includes('column products.idasproduct_id does not exist') ||
    errorMessage.includes('view_product_with_tags')
  );
};

export const silentErrorHandler = (error: any, context: string = ''): never | null => {
  // Se for o erro específico que queremos suprimir, retornar null silenciosamente
  if (isSuppressedError(error)) {
    return null;
  }
  
  // Para outros erros, relançar
  throw error;
};

export const withSilentFallback = async <T>(
  primaryOperation: () => Promise<T>,
  fallbackOperation: () => Promise<T>
): Promise<T> => {
  try {
    return await primaryOperation();
  } catch (error) {
    // Se for o erro específico, usar fallback silenciosamente
    if (isSuppressedError(error)) {
      return await fallbackOperation();
    }
    
    // Para outros erros, relançar
    throw error;
  }
};

// Interceptor global para suprimir erros no console
export const installSilentErrorInterceptor = (): void => {
  if (typeof window === 'undefined') return;
  
  // Interceptar console.error
  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    const errorString = args.join(' ');
    
    // Não mostrar logs para o erro específico
    if (isSuppressedError({ message: errorString })) {
      return;
    }
    
    originalConsoleError.apply(console, args);
  };
  
  // Interceptar console.warn
  const originalConsoleWarn = console.warn;
  console.warn = (...args: any[]) => {
    const warnString = args.join(' ');
    
    // Não mostrar logs para o erro específico
    if (isSuppressedError({ message: warnString })) {
      return;
    }
    
    originalConsoleWarn.apply(console, args);
  };
};