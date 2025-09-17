
import { Button } from '@/components/ui/button';
import { Plus, Minus, ShoppingCart, X, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useIsMobile } from '@/hooks/use-mobile';
import ProfessionalCartModal from '@/components/Cart/ProfessionalCartModal';

interface GlobalCartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalCartDropdown = ({ isOpen, onClose }: GlobalCartDropdownProps) => {
  const { items, updateQuantity, removeFromCart, clearCart, getCartTotal, sendToWhatsApp } = useCart();
  const isMobile = useIsMobile();

  const handleQuantityChange = (productId: string, size: string | undefined, color: string | undefined, currentQuantity: number, change: number) => {
    const newQuantity = Math.max(0, currentQuantity + change);
    updateQuantity(productId, size, color, newQuantity);
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
  };

  const handleClearCart = () => {
    clearCart();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ProfessionalCartModal 
      isOpen={isOpen} 
      onClose={onClose} 
    />
  );
};

export default GlobalCartDropdown;
