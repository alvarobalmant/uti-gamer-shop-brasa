
import { useCart } from '@/contexts/CartContext';
import { useIsMobile } from '@/hooks/use-mobile';
import GlobalCartHeader from './GlobalCartHeader';
import GlobalCartEmptyState from './GlobalCartEmptyState';
import GlobalCartItemList from './GlobalCartItemList';
import GlobalCartFooter from './GlobalCartFooter';

interface GlobalCartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalCartDropdown = ({ isOpen, onClose }: GlobalCartDropdownProps) => {
  const { items, updateQuantity, removeFromCart, clearCart, getCartTotal, sendToWhatsApp } = useCart();
  const isMobile = useIsMobile();

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

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999]" 
        onClick={handleBackdropClick}
      />
      
      {/* Dropdown - Mobile gets almost full screen treatment */}
      <div className={`
        fixed z-[9999] bg-white shadow-2xl border border-gray-200 flex flex-col rounded-2xl
        ${isMobile 
          ? 'inset-x-4 inset-y-8 max-h-[calc(100vh-4rem)]' 
          : 'absolute right-0 top-full mt-2 w-96 max-h-96 rounded-lg'
        }
      `}>
        <GlobalCartHeader
          itemCount={items.length}
          onClose={onClose}
          onClearCart={handleClearCart}
          hasItems={items.length > 0}
        />

        {items.length === 0 ? (
          <GlobalCartEmptyState onClose={onClose} />
        ) : (
          <>
            <GlobalCartItemList
              items={items}
              onQuantityChange={handleQuantityChange}
              onRemoveItem={handleRemoveItem}
            />
            <GlobalCartFooter
              total={getCartTotal()}
              onSendToWhatsApp={sendToWhatsApp}
              onClose={onClose}
            />
          </>
        )}
      </div>
    </>
  );
};

export default GlobalCartDropdown;
