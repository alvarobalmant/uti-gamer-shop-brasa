
import GlobalCartHeader from './GlobalCartHeader';
import GlobalCartEmptyState from './GlobalCartEmptyState';
import GlobalCartItemList from './GlobalCartItemList';
import GlobalCartFooter from './GlobalCartFooter';
import { CartItem } from '@/hooks/useNewCart';

interface GlobalCartContentProps {
  items: CartItem[];
  onClose: () => void;
  onQuantityChange: (itemId: string, currentQuantity: number, change: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  getCartTotal: () => number;
  sendToWhatsApp: () => void;
}

const GlobalCartContent = ({
  items,
  onClose,
  onQuantityChange,
  onRemoveItem,
  onClearCart,
  getCartTotal,
  sendToWhatsApp,
}: GlobalCartContentProps) => {
  return (
    <>
      <GlobalCartHeader
        itemCount={items.length}
        onClose={onClose}
        onClearCart={onClearCart}
        hasItems={items.length > 0}
      />

      {items.length === 0 ? (
        <GlobalCartEmptyState onClose={onClose} />
      ) : (
        <>
          <GlobalCartItemList
            items={items}
            onQuantityChange={onQuantityChange}
            onRemoveItem={onRemoveItem}
          />
          <GlobalCartFooter
            total={getCartTotal()}
            onSendToWhatsApp={sendToWhatsApp}
            onClose={onClose}
          />
        </>
      )}
    </>
  );
};

export default GlobalCartContent;
