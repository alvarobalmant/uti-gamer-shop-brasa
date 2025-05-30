
import GlobalCartItem from './GlobalCartItem';
import { CartItem } from '@/hooks/useNewCart';

interface GlobalCartItemListProps {
  items: CartItem[];
  onQuantityChange: (itemId: string, currentQuantity: number, change: number) => void;
  onRemoveItem: (itemId: string) => void;
}

const GlobalCartItemList = ({ items, onQuantityChange, onRemoveItem }: GlobalCartItemListProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
      {items.map((item) => (
        <GlobalCartItem
          key={item.id}
          item={item}
          onQuantityChange={onQuantityChange}
          onRemoveItem={onRemoveItem}
        />
      ))}
    </div>
  );
};

export default GlobalCartItemList;
