// Funções utilitárias para cálculos de UTI Coins
// Conversão fixa: 1 UTI Coin = R$ 0,01

/**
 * Converte UTI Coins para valor em Reais
 * @param coins Quantidade de UTI Coins
 * @returns Valor em Reais
 */
export const utiCoinsToReais = (coins: number): number => {
  return coins * 0.01;
};

/**
 * Converte valor em Reais para UTI Coins
 * @param reais Valor em Reais
 * @returns Quantidade de UTI Coins (arredondado para baixo)
 */
export const reaisToUtiCoins = (reais: number): number => {
  return Math.floor(reais * 100);
};

/**
 * Calcula o desconto máximo disponível em UTI Coins para um produto
 * @param productPrice Preço do produto
 * @param discountPercentage Porcentagem de desconto configurada
 * @returns Quantidade máxima de UTI Coins necessárias para desconto completo
 */
export const calculateMaxDiscountUTICoins = (productPrice: number, discountPercentage: number): number => {
  const discountReais = (productPrice * discountPercentage) / 100;
  return reaisToUtiCoins(discountReais);
};

/**
 * Calcula o valor real do desconto que pode ser aplicado
 * @param productPrice Preço do produto
 * @param discountPercentage Porcentagem de desconto configurada
 * @param clientBalance Saldo atual do cliente em UTI Coins
 * @returns Objeto com informações do desconto
 */
export const calculateApplicableDiscount = (
  productPrice: number, 
  discountPercentage: number, 
  clientBalance: number
) => {
  const maxDiscountUTICoins = calculateMaxDiscountUTICoins(productPrice, discountPercentage);
  const maxDiscountReais = utiCoinsToReais(maxDiscountUTICoins);
  
  const availableUTICoins = Math.min(clientBalance, maxDiscountUTICoins);
  const discountApplied = utiCoinsToReais(availableUTICoins);
  const finalPrice = productPrice - discountApplied;
  
  return {
    maxDiscountUTICoins,
    maxDiscountReais,
    availableUTICoins,
    discountApplied,
    finalPrice,
    canApplyFullDiscount: clientBalance >= maxDiscountUTICoins
  };
};

/**
 * Calcula o cashback em UTI Coins baseado no valor final pago
 * @param finalPaidValue Valor final pago pelo cliente (após desconto)
 * @param cashbackPercentage Porcentagem de cashback configurada
 * @returns Quantidade de UTI Coins de cashback
 */
export const calculateCashback = (finalPaidValue: number, cashbackPercentage: number): number => {
  const cashbackReais = (finalPaidValue * cashbackPercentage) / 100;
  return reaisToUtiCoins(cashbackReais);
};

/**
 * Verifica se o cliente tem saldo suficiente para aplicar o desconto
 * @param clientBalance Saldo do cliente
 * @param requiredCoins UTI Coins necessárias
 * @returns true se tem saldo suficiente
 */
export const canApplyDiscount = (clientBalance: number, requiredCoins: number): boolean => {
  return clientBalance >= requiredCoins;
};

/**
 * Formata UTI Coins para exibição
 * @param coins Quantidade de UTI Coins
 * @returns String formatada
 */
export const formatUTICoins = (coins: number): string => {
  return `${coins.toLocaleString()} 🪙`;
};

/**
 * Calcula o resumo completo de uma compra com UTI Coins
 * @param productPrice Preço original do produto
 * @param discountPercentage Porcentagem de desconto em UTI Coins
 * @param cashbackPercentage Porcentagem de cashback em UTI Coins
 * @param clientBalance Saldo atual do cliente
 * @returns Objeto com todos os cálculos da compra
 */
export const calculatePurchaseSummary = (
  productPrice: number,
  discountPercentage: number = 0,
  cashbackPercentage: number = 0,
  clientBalance: number = 0
) => {
  const discountInfo = calculateApplicableDiscount(productPrice, discountPercentage, clientBalance);
  const cashbackCoins = calculateCashback(discountInfo.finalPrice, cashbackPercentage);
  
  const newBalance = clientBalance - discountInfo.availableUTICoins + cashbackCoins;
  
  return {
    originalPrice: productPrice,
    discountPercentage,
    cashbackPercentage,
    
    // Desconto
    maxDiscountUTICoins: discountInfo.maxDiscountUTICoins,
    maxDiscountReais: discountInfo.maxDiscountReais,
    utiCoinsUsed: discountInfo.availableUTICoins,
    discountApplied: discountInfo.discountApplied,
    
    // Valores finais
    finalPrice: discountInfo.finalPrice,
    cashbackCoins,
    cashbackReais: utiCoinsToReais(cashbackCoins),
    
    // Saldo
    currentBalance: clientBalance,
    newBalance,
    
    // Status
    canApplyFullDiscount: discountInfo.canApplyFullDiscount,
    hasDiscount: discountPercentage > 0 && clientBalance > 0,
    hasCashback: cashbackPercentage > 0
  };
};