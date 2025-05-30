# Merged version of GlobalCartDropdown.tsx
# Prioritizing GitHub version's styling and structure, assuming updateQuantity uses itemId based on GitHub's hook usage.

import { Button } from '@/components/ui/button';
import { Plus, Minus, ShoppingCart, X, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext'; // Assuming CartContext provides the necessary functions
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils'; // Import cn for conditional classes

interface GlobalCartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalCartDropdown = ({ isOpen, onClose }: GlobalCartDropdownProps) => {
  // Assuming useCart provides these based on CartContext.tsx (to be checked next)
  const { items, updateQuantity, removeFromCart, clearCart, getCartTotal, sendToWhatsApp } = useCart(); 
  const isMobile = useIsMobile();

  // Using itemId based on GitHub version's usage pattern
  const handleQuantityChange = (itemId: string, currentQuantity: number, change: number) => {
    const newQuantity = Math.max(0, currentQuantity + change);
    // Check if quantity becomes 0 to remove item
    if (newQuantity === 0) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity); 
    }
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
      {/* Backdrop - Using GitHub version's styling */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999]" // Adjusted z-index slightly lower than dropdown
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      
      {/* Dropdown Container - Using GitHub version's styling and mobile layout */}
      <div className={cn(
        "fixed z-[1000] bg-white shadow-2xl border border-gray-200 flex flex-col", // Highest z-index
        isMobile 
          ? 'inset-x-2 inset-y-4 rounded-2xl max-h-[calc(100vh-2rem)]' // Adjusted insets slightly for smaller gaps
          : 'absolute right-0 top-full mt-2 w-96 max-h-[70vh] rounded-lg' // Adjusted max-height for desktop
      )}>
        {/* Header - Using GitHub version's styling */}
        <div className={cn(
          "p-4 border-b border-gray-200 bg-gradient-to-r from-red-600 to-red-700 text-white flex-shrink-0",
          isMobile ? 'rounded-t-2xl' : 'rounded-t-lg'
        )}>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Meu Carrinho</h3>
                <p className="text-red-100 text-sm">
                  {items.length} {items.length === 1 ? 'item' : 'itens'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {items.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleClearCart}
                  className="text-white hover:text-red-200 hover:bg-red-800/50 rounded-full w-9 h-9"
                  title="Limpar carrinho"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onClose} 
                className="text-white hover:text-red-200 hover:bg-red-800/50 rounded-full w-9 h-9"
                title="Fechar carrinho"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {items.length === 0 ? (
          // Empty Cart View - Using GitHub version's styling
          <div className="p-6 text-center flex-1 flex items-center justify-center bg-gray-50 rounded-b-2xl">
            <div className="max-w-xs">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="font-bold text-lg text-gray-800 mb-2">Carrinho Vazio</h4>
              <p className="text-gray-500 mb-6 text-sm">Que tal adicionar alguns produtos incríveis?</p>
              <Button 
                onClick={onClose}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-lg text-sm"
              >
                Continuar Comprando
              </Button>
            </div>
          </div>
        ) : (
          // Cart with Items - Using GitHub version's structure and styling
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm"
                >
                  <div className="flex items-start space-x-3">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      className="w-14 h-14 object-cover rounded-lg flex-shrink-0 border"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-gray-800 font-medium text-sm leading-tight mr-2">
                          {item.product.name}
                        </h4>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full w-6 h-6 p-0 ml-1 flex-shrink-0"
                          title="Remover item"
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                      {(item.size || item.color) && (
                        <p className="text-gray-500 text-xs mb-2">
                           {item.size}{item.size && item.color ? ', ' : ''}{item.color}
                        </p>
                      )}
                      <div className="flex justify-between items-center mt-1">
                        {/* Quantity Controls - Using GitHub version's styling */}
                        <div className="flex items-center border border-gray-300 rounded-md">
                           <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                            className="w-7 h-7 p-0 text-gray-600 hover:bg-gray-100 rounded-r-none"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </Button>
                          <span className="text-gray-800 font-medium text-sm w-8 text-center px-1 border-l border-r">
                            {item.quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                            className="w-7 h-7 p-0 text-gray-600 hover:bg-gray-100 rounded-l-none"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                        {/* Price */}
                        <p className="text-red-600 font-semibold text-sm">
                          R$ {(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer - Using GitHub version's styling */}
            <div className={cn(
              "border-t border-gray-200 p-4 bg-white flex-shrink-0",
              isMobile ? 'rounded-b-2xl' : 'rounded-b-lg'
            )}>
              {/* Price Summary Box */}
              <div className="bg-gray-50 p-3 rounded-lg mb-3 border border-gray-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Subtotal:</span>
                  <span className="text-gray-800 text-sm font-medium">R$ {getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Frete:</span>
                  <span className="text-red-600 text-sm font-semibold">
                    {getCartTotal() >= 200 ? 'GRÁTIS' : 'Calcular'}
                  </span>
                </div>
                {getCartTotal() >= 200 && (
                  <div className="text-center py-1.5 bg-green-100 rounded-md mt-1">
                    <p className="text-green-700 text-xs font-bold">🎉 Você ganhou frete grátis!</p>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-gray-800">Total:</span>
                    <span className="text-lg font-bold text-red-600">
                      R$ {getCartTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <Button
                onClick={() => {
                  sendToWhatsApp();
                  onClose();
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 text-base shadow-sm mb-2"
              >
                Finalizar no WhatsApp 📱
              </Button>
              
              <Button
                onClick={onClose}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold py-2.5 rounded-lg transition-all duration-300 text-sm"
              >
                Continuar Comprando
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default GlobalCartDropdown;

