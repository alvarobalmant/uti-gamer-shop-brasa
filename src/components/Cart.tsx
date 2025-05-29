
import { Button } from '@/components/ui/button';
import { Plus, Minus, ShoppingCart, X, Trash2 } from 'lucide-react';
import { CartItem } from '@/hooks/useCartSync';

interface CartProps {
  cart: CartItem[];
  showCart: boolean;
  setShowCart: (show: boolean) => void;
  updateQuantity: (productId: string, size: string | undefined, color: string | undefined, quantity: number) => void;
  removeFromCart?: (itemId: string) => void;
  clearCart?: () => void;
  sendToWhatsApp: () => void;
}

const Cart = ({ 
  cart, 
  showCart, 
  setShowCart, 
  updateQuantity, 
  removeFromCart,
  clearCart,
  sendToWhatsApp 
}: CartProps) => {
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handleQuantityChange = (item: CartItem, change: number) => {
    const newQuantity = Math.max(0, item.quantity + change);
    updateQuantity(
      item.product.id, 
      item.size, 
      item.color, 
      newQuantity
    );
  };

  const handleRemoveItem = (itemId: string) => {
    if (removeFromCart) {
      removeFromCart(itemId);
    }
  };

  const handleClearCart = () => {
    if (clearCart) {
      clearCart();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowCart(false);
    }
  };

  if (!showCart) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" 
      onClick={handleBackdropClick}
    >
      <div className="fixed right-0 top-0 h-full w-full sm:w-[90%] md:w-[450px] max-w-md bg-white shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b-2 border-red-600 bg-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-600 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-2xl font-bold text-gray-800">Meu Carrinho</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {cart.length} {cart.length === 1 ? 'item' : 'itens'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              {cart.length > 0 && clearCart && (
                <Button 
                  variant="ghost" 
                  onClick={handleClearCart}
                  className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full w-8 h-8 sm:w-10 sm:h-10 p-0"
                  title="Limpar carrinho"
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                onClick={() => setShowCart(false)} 
                className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full w-8 h-8 sm:w-10 sm:h-10 p-0"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center">
              <img 
                src="/lovable-uploads/ad940e09-b6fc-44a8-98a5-3247986d6f98.png" 
                alt="Carrinho vazio" 
                className="w-24 h-24 mx-auto mb-4 opacity-50"
              />
              <h4 className="text-xl font-bold text-gray-800 mb-2">Carrinho Vazio</h4>
              <p className="text-gray-500 mb-6">Adicione alguns produtos incríveis!</p>
              <Button 
                onClick={() => setShowCart(false)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg"
              >
                Continuar Comprando
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4">
              {cart.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-200 hover:border-red-300 transition-colors duration-200"
                >
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-gray-800 font-bold text-xs sm:text-sm leading-tight truncate">
                          {item.product.name}
                        </h4>
                        {removeFromCart && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full w-5 h-5 sm:w-6 sm:h-6 p-0 ml-1 sm:ml-2 flex-shrink-0"
                            title="Remover item"
                          >
                            <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          </Button>
                        )}
                      </div>
                      <p className="text-gray-500 text-xs mb-2 sm:mb-3">
                        {item.size || 'Padrão'}{item.color ? `, ${item.color}` : ''}
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuantityChange(item, -1)}
                            className="w-6 h-6 sm:w-8 sm:h-8 p-0 border-red-300 hover:border-red-500 hover:bg-red-50 hover:text-red-600"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          </Button>
                          <span className="text-gray-800 font-bold text-xs sm:text-sm w-6 sm:w-8 text-center bg-white px-1 sm:px-2 py-1 rounded border">
                            {item.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuantityChange(item, 1)}
                            className="w-6 h-6 sm:w-8 sm:h-8 p-0 border-red-300 hover:border-red-500 hover:bg-red-50 hover:text-red-600"
                          >
                            <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          </Button>
                        </div>
                        <p className="text-red-600 font-bold text-xs sm:text-sm">
                          R$ {(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t-2 border-gray-200 p-4 sm:p-6 bg-white">
              <div className="bg-red-50 p-3 sm:p-4 rounded-xl mb-3 sm:mb-4 border border-red-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 text-sm sm:text-base font-medium">Subtotal:</span>
                  <span className="text-gray-800 text-sm sm:text-base font-bold">R$ {getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 text-sm sm:text-base font-medium">Frete:</span>
                  <span className="text-red-600 text-sm sm:text-base font-bold">
                    {getTotalPrice() >= 200 ? 'GRÁTIS' : 'Calcular'}
                  </span>
                </div>
                {getTotalPrice() >= 200 && (
                  <div className="text-center py-1.5 sm:py-2 bg-green-100 rounded-lg mb-2">
                    <p className="text-green-700 text-xs sm:text-sm font-bold">🎉 Você ganhou frete grátis!</p>
                  </div>
                )}
                <div className="border-t border-red-200 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg sm:text-xl font-bold text-gray-800">Total:</span>
                    <span className="text-xl sm:text-2xl font-bold text-red-600">
                      R$ {getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={sendToWhatsApp}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 sm:py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg text-base sm:text-lg mb-3 sm:mb-4"
              >
                Finalizar no WhatsApp 📱
              </Button>
              
              <Button
                onClick={() => setShowCart(false)}
                variant="outline"
                className="w-full border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-bold py-2.5 sm:py-3 rounded-xl transition-all duration-300"
              >
                Continuar Comprando
              </Button>
              
              <p className="text-xs text-gray-500 text-center mt-3">
                Você será redirecionado para o WhatsApp para finalizar sua compra
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
