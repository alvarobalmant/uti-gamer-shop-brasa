
import { useCart } from '@/contexts/CartContext';

export const useGlobalCartLogic = () => {
  const { items, updateQuantity, removeFromCart, clearCart, getCartTotal, sendToWhatsApp } = useCart();

  const handleQuantityChange = (itemId: string, currentQuantity: number, change: number) => {
    const newQuantity = Math.max(0, currentQuantity + change);
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
  };

  const handleClearCart = () => {
    clearCart();
  };

  return {
    items,
    handleQuantityChange,
    handleRemoveItem,
    handleClearCart,
    getCartTotal,
    sendToWhatsApp,
  };
};
