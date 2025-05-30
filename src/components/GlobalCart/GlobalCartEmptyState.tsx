
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface GlobalCartEmptyStateProps {
  onClose: () => void;
}

const GlobalCartEmptyState = ({ onClose }: GlobalCartEmptyStateProps) => {
  return (
    <div className="p-8 text-center flex-1 flex items-center justify-center">
      <div className="max-w-xs">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingCart className="w-10 h-10 text-gray-400" />
        </div>
        <h4 className="font-bold text-xl text-gray-800 mb-3">Carrinho Vazio</h4>
        <p className="text-gray-500 mb-6">Que tal adicionar alguns produtos incríveis?</p>
        <Button 
          onClick={onClose}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg"
        >
          Continuar Comprando
        </Button>
      </div>
    </div>
  );
};

export default GlobalCartEmptyState;
