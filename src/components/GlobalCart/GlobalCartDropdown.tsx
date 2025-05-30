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
        {/* Header */}
        <div className={`p-6 border-b border-gray-200 bg-gradient-to-r from-red-600 to-red-700 text-white flex-shrink-0 ${isMobile ? 'rounded-t-2xl' : 'rounded-t-lg'}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl">Meu Carrinho</h3>
                <p className="text-red-100 text-sm">
                  {items.length} {items.length === 1 ? 'item' : 'itens'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {items.length > 0 && (
                <Button 
                  variant="ghost" 
                  onClick={handleClearCart}
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

        {items.length === 0 ? (
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
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
                >
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
                          onClick={() => handleRemoveItem(item.id)}
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
                            onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
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
                            onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
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
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-6 bg-white flex-shrink-0 rounded-b-2xl">
              <div className="bg-red-50 p-4 rounded-xl mb-4 border border-red-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 font-medium">Subtotal:</span>
                  <span className="text-gray-800 font-semibold">R$ {getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Frete:</span>
                  <span className="text-red-600 font-bold">
                    {getCartTotal() >= 200 ? 'GRÁTIS' : 'Calcular'}
                  </span>
                </div>
                {getCartTotal() >= 200 && (
                  <div className="text-center py-2 bg-green-100 rounded-lg mt-2">
                    <p className="text-green-700 text-sm font-bold">🎉 Você ganhou frete grátis!</p>
                  </div>
                )}
                <div className="border-t border-red-200 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">Total:</span>
                    <span className="text-2xl font-bold text-red-600">
                      R$ {getCartTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={() => {
                  sendToWhatsApp();
                  onClose();
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl text-lg mb-3"
              >
                Finalizar no WhatsApp 📱
              </Button>
              
              <Button
                onClick={onClose}
                variant="outline"
                className="w-full border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-bold py-3 rounded-xl"
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
