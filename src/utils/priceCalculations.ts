// Unified price calculation system for UTI DOS GAMES
// This ensures cart and buy-now flows use identical calculations

export interface Product {
  id: string;
  name: string;
  price: number;
  discount_percentage?: number;
  uti_coins_cashback_percentage?: number;
  uti_coins_discount_percentage?: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export interface PriceCalculationResult {
  originalPrice: number;
  discountedPrice: number;
  regularDiscountAmount: number;
  regularDiscountPercentage: number;
  coinsEarned: number;
  maxCoinsDiscount: number;
  appliedCoinsDiscount: number;
  finalPrice: number;
  shippingCost: number;
  totalWithShipping: number;
}

export interface CartTotals {
  subtotal: number;
  totalRegularDiscount: number;
  totalCoinsDiscount: number;
  totalCoinsEarned: number;
  totalCoinsNeeded: number;
  finalPrice: number;
  shippingCost: number;
  totalWithShipping: number;
  itemsCount: number;
}

/**
 * Calculate UTI Coins earned from a purchase
 * Uses product configuration or fallback to 2%
 */
export const calculateCoinsEarned = (
  product: Product, 
  quantity: number, 
  useCoins: boolean,
  discountedPrice: number
): number => {
  if (useCoins) return 0; // No cashback when using coins for discount
  
  const cashbackPercentage = product.uti_coins_cashback_percentage || 2;
  const roundedPrice = Math.ceil(discountedPrice * quantity); // Round UP like cart
  const cashbackAmount = (roundedPrice * cashbackPercentage) / 100;
  return Math.round(cashbackAmount * 100); // Convert to coins (1 real = 100 coins)
};

/**
 * Calculate maximum UTI Coins discount available for a product
 * Uses product configuration with proper rounding
 */
export const calculateMaxCoinsDiscount = (
  product: Product, 
  quantity: number,
  discountedPrice: number
): number => {
  const maxDiscountPercentage = product.uti_coins_discount_percentage || 0;
  if (maxDiscountPercentage === 0) return 0;
  
  const roundedDiscountedPrice = Math.ceil(discountedPrice * quantity); // Round UP like cart
  const maxDiscountAmount = (roundedDiscountedPrice * maxDiscountPercentage) / 100;
  return Math.floor(maxDiscountAmount * 100); // Convert to coins (1 coin = 1 centavo)
};

/**
 * Calculate applied UTI Coins discount based on user balance
 */
export const calculateAppliedCoinsDiscount = (
  maxCoinsDiscount: number,
  userCoinsBalance: number,
  useCoins: boolean
): number => {
  if (!useCoins || maxCoinsDiscount === 0) return 0;
  
  const coinsToUse = Math.min(maxCoinsDiscount, userCoinsBalance);
  return coinsToUse / 100; // Convert coins to reais (1 coin = R$ 0.01)
};

/**
 * Calculate shipping cost based on final price
 * Free shipping above R$ 150
 */
export const calculateShipping = (finalPrice: number): number => {
  return finalPrice >= 150 ? 0 : 15;
};

/**
 * Calculate complete price breakdown for a single product/item
 */
export const calculateItemPrice = (
  product: Product,
  quantity: number,
  useCoins: boolean,
  userCoinsBalance: number = 0
): PriceCalculationResult => {
  // Step 1: Calculate original price and regular discount
  const originalPrice = product.price * quantity;
  const regularDiscountPercentage = product.discount_percentage || 0;
  const regularDiscountAmount = originalPrice * (regularDiscountPercentage / 100);
  const discountedPrice = originalPrice - regularDiscountAmount;
  
  // Step 2: Calculate UTI Coins
  const maxCoinsDiscount = calculateMaxCoinsDiscount(product, quantity, discountedPrice / quantity);
  const appliedCoinsDiscount = calculateAppliedCoinsDiscount(maxCoinsDiscount, userCoinsBalance, useCoins);
  const coinsEarned = calculateCoinsEarned(product, quantity, useCoins, discountedPrice / quantity);
  
  // Step 3: Calculate final prices (ensure minimum of 0)
  const finalPrice = Math.max(0, discountedPrice - appliedCoinsDiscount);
  const shippingCost = calculateShipping(finalPrice);
  const totalWithShipping = finalPrice + shippingCost;
  
  return {
    originalPrice,
    discountedPrice,
    regularDiscountAmount,
    regularDiscountPercentage,
    coinsEarned,
    maxCoinsDiscount,
    appliedCoinsDiscount,
    finalPrice,
    shippingCost,
    totalWithShipping
  };
};

/**
 * Calculate totals for multiple cart items
 */
export const calculateCartTotals = (
  items: CartItem[],
  useCoins: boolean,
  userCoinsBalance: number = 0
): CartTotals => {
  const itemCalculations = items.map(item => 
    calculateItemPrice(item.product, item.quantity, useCoins, userCoinsBalance)
  );
  
  const subtotal = itemCalculations.reduce((sum, calc) => sum + calc.originalPrice, 0);
  const totalRegularDiscount = itemCalculations.reduce((sum, calc) => sum + calc.regularDiscountAmount, 0);
  const totalCoinsDiscount = itemCalculations.reduce((sum, calc) => sum + calc.appliedCoinsDiscount, 0);
  const totalCoinsEarned = itemCalculations.reduce((sum, calc) => sum + calc.coinsEarned, 0);
  const totalCoinsNeeded = itemCalculations.reduce((sum, calc) => sum + calc.maxCoinsDiscount, 0);
  
  const finalPrice = Math.max(0, subtotal - totalRegularDiscount - totalCoinsDiscount);
  const shippingCost = calculateShipping(finalPrice);
  const totalWithShipping = finalPrice + shippingCost;
  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  return {
    subtotal,
    totalRegularDiscount,
    totalCoinsDiscount,
    totalCoinsEarned,
    totalCoinsNeeded,
    finalPrice,
    shippingCost,
    totalWithShipping,
    itemsCount
  };
};

/**
 * Helper function to format currency values
 */
export const formatCurrency = (value: number): string => {
  return value.toFixed(2).replace('.', ',');
};

/**
 * Helper function to format coin values
 */
export const formatCoins = (coins: number): string => {
  return coins.toLocaleString();
};