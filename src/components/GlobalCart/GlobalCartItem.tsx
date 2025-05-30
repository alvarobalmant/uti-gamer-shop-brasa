
import { Button } from '@/components/ui/button';
import { Plus, Minus, X } from 'lucide-react';
import { CartItem } from '@/hooks/useNewCart';

interface GlobalCartItemProps {
  item: CartItem;
  onQuantityChange: (itemId: string, currentQuantity: number, change: number) => void;
  onRemoveItem: (itemId: string) => void;
}

const GlobalCartItem = ({ item, onQuantityChange, onRemoveItem }: GlobalCartItemProps) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-start space-x-4">
        <img 
          src={item.product.image} 
          alt={item.product.name}
          className="w-16 h-16 object-cover rounded-xl flex-shrink-0 border"
        />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-gray-800 font-semibold text-base leading-tight">
              {item.product.name}
            </h4>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onRemoveItem(item.id)}
              className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full w-8 h-8 p-0 ml-2 flex-shrink-0"
              title="Remover item"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-gray-500 text-sm mb-3">
            {item.size || 'Padrão'}{item.color ? `, ${item.color}` : ''}
          </p>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onQuantityChange(item.id, item.quantity, -1)}
                className="w-8 h-8 p-0 border-red-300 hover:border-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg"
                disabled={item.quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-gray-800 font-bold text-base w-8 text-center">
                {item.quantity}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onQuantityChange(item.id, item.quantity, 1)}
                className="w-8 h-8 p-0 border-red-300 hover:border-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-red-600 font-bold text-base">
              R$ {(item.product.price * item.quantity).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalCartItem;
