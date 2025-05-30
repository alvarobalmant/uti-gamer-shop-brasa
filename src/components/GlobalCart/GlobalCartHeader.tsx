
import { Button } from '@/components/ui/button';
import { ShoppingCart, X, Trash2 } from 'lucide-react';

interface GlobalCartHeaderProps {
  itemCount: number;
  onClose: () => void;
  onClearCart: () => void;
  hasItems: boolean;
}

const GlobalCartHeader = ({ itemCount, onClose, onClearCart, hasItems }: GlobalCartHeaderProps) => {
  return (
    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-600 to-red-700 text-white flex-shrink-0 rounded-t-2xl md:rounded-t-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-xl">Meu Carrinho</h3>
            <p className="text-red-100 text-sm">
              {itemCount} {itemCount === 1 ? 'item' : 'itens'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {hasItems && (
            <Button 
              variant="ghost" 
              onClick={onClearCart}
              className="text-white hover:text-red-200 hover:bg-red-800/50 rounded-full w-10 h-10 p-0"
              title="Limpar carrinho"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          )}
          <Button 
            variant="ghost" 
            onClick={onClose} 
            className="text-white hover:text-red-200 hover:bg-red-800/50 rounded-full w-10 h-10 p-0"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GlobalCartHeader;
