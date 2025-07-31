
export const handleProductError = (error: any, context: string) => {
  // Supressão silenciosa para erro específico do idasproduct_id
  if (error.message?.includes('idasproduct_id') || error.message?.includes('column products.idasproduct_id does not exist')) {
    // Não mostrar logs ou mensagens para este erro específico
    return null; // Retorna null para indicar que o erro deve ser ignorado
  }
  
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
  } else if (error.message?.includes('products_uti_pro_type_check')) {
    errorMessage = 'Erro de validação: O campo "uti_pro_type" deve ser "percentage" ou "fixed". Verifique os dados no Excel.';
  } else if (error.message?.includes('check constraint')) {
    errorMessage = 'Erro de validação nos dados do produto. Verifique os valores no Excel.';
  } else if (error.message) {
    errorMessage = error.message;
  }
  
  return errorMessage;
};

export const shouldReloadOnError = (error: any): boolean => {
  return error.message?.includes('JWT') || error.message?.includes('expired');
};
