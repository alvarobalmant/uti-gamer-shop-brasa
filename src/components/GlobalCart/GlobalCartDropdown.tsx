
import { Button } from '@/components/ui/button';
import { Plus, Minus, ShoppingCart, X, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useIsMobile } from '@/hooks/use-mobile';

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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with proper opacity */}
      <div 
        className="fixed inset-0 bg-black/60 z-40" 
        onClick={handleBackdropClick}
      />
      
      {/* Dropdown - Better positioning and sizing */}
      <div className={`
        fixed z-50 bg-white shadow-2xl border border-gray-200 flex flex-col
        ${isMobile 
          ? 'inset-x-4 top-20 bottom-4 rounded-xl max-h-[calc(100vh-6rem)]' 
          : 'absolute right-0 top-full mt-2 w-96 max-h-[500px] rounded-xl'
        }
      `}>
        {/* Header with proper contrast */}
        <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Carrinho</h3>
                <p className="text-sm text-gray-600">
                  {items.length} {items.length === 1 ? 'item' : 'itens'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {items.length > 0 && (
                <Button 
                  variant="ghost" 
                  onClick={handleClearCart}
                  className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full w-9 h-9 p-0"
                  title="Limpar carrinho"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                onClick={onClose} 
                className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full w-9 h-9 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="p-8 text-center flex-1 flex items-center justify-center bg-white">
            <div>
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2 text-lg">Carrinho Vazio</h4>
              <p className="text-gray-500 text-sm">Adicione produtos para começar!</p>
            </div>
          </div>
        ) : (
          <>
            {/* Items with proper spacing and contrast */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-red-200 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0 border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-gray-900 font-semibold text-sm leading-tight">
                          {item.product.name}
                        </h4>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full w-7 h-7 p-0 ml-2 flex-shrink-0"
                          title="Remover item"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-gray-500 text-xs mb-3">
                        {item.size || 'Padrão'}{item.color ? `, ${item.color}` : ''}
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuantityChange(item.product.id, item.size, item.color, item.quantity, -1)}
                            className="w-8 h-8 p-0 border-red-300 hover:border-red-500 hover:bg-red-50 hover:text-red-600"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-gray-900 font-bold text-sm w-8 text-center bg-white px-2 py-1 rounded border border-gray-200">
                            {item.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuantityChange(item.product.id, item.size, item.color, item.quantity, 1)}
                            className="w-8 h-8 p-0 border-red-300 hover:border-red-500 hover:bg-red-50 hover:text-red-600"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="text-red-600 font-bold text-sm">
                          R$ {(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer with better contrast and spacing */}
            <div className="border-t border-gray-200 p-4 bg-white flex-shrink-0 rounded-b-xl">
              <div className="bg-red-50 p-4 rounded-xl mb-4 border border-red-200">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900 text-lg">Total:</span>
                  <span className="text-2xl font-bold text-red-600">
                    R$ {getCartTotal().toFixed(2)}
                  </span>
                </div>
              </div>
              
              <Button
                onClick={() => {
                  sendToWhatsApp();
                  onClose();
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl text-base shadow-lg"
              >
                Finalizar no WhatsApp 📱
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default GlobalCartDropdown;
