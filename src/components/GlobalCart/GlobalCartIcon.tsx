
import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import GlobalCartDropdown from './GlobalCartDropdown';

const GlobalCartIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { getCartItemsCount, isLoading } = useCart();

  const cartItemsCount = getCartItemsCount();

  return (
    <div className="relative">
      <Button 
        onClick={() => setIsOpen(!isOpen)} 
        variant="ghost" 
        className="flex flex-col items-center p-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-105 relative"
        disabled={isLoading}
      >
        <ShoppingCart className={`w-6 h-6 mb-1 ${isLoading ? 'animate-pulse' : ''}`} />
        <span className="text-xs font-semibold hidden lg:block">Carrinho</span>
        {cartItemsCount > 0 && (
          <Badge className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 min-w-[20px] h-5 flex items-center justify-center rounded-full shadow-lg">
            {cartItemsCount}
          </Badge>
        )}
      </Button>

      <GlobalCartDropdown isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default GlobalCartIcon;
