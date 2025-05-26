
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
        className="flex flex-col items-center p-3 text-uti-dark hover:text-uti-red hover:bg-red-50 rounded-lg transition-all duration-200 relative"
        disabled={isLoading}
      >
        <ShoppingCart className={`w-5 h-5 ${isLoading ? 'animate-pulse' : ''}`} />
        <span className="text-xs font-medium mt-1">Carrinho</span>
        {cartItemsCount > 0 && (
          <Badge className="absolute -top-1 -right-1 bg-uti-red text-white text-xs px-1.5 min-w-[20px] h-5 flex items-center justify-center rounded-full">
            {cartItemsCount}
          </Badge>
        )}
      </Button>

      <GlobalCartDropdown isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default GlobalCartIcon;
