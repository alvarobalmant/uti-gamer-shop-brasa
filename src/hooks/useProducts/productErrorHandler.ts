
export const handleProductError = (error: any, context: string) => {
  console.error(`Erro ${context}:`, error);
  
  // Tratamento específico para diferentes tipos de erro
  let errorMessage = `Erro desconhecido ${context}`;
  
  if (error.message?.includes('JWT') || error.message?.includes('expired')) {
    errorMessage = 'Sessão expirada. A página será recarregada.';
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
    errorMessage = 'Erro de conexão. Verifique sua internet.';
  } else if (error.message) {
    errorMessage = error.message;
  }
  
  return errorMessage;
};

export const shouldReloadOnError = (error: any): boolean => {
  return error.message?.includes('JWT') || error.message?.includes('expired');
};
