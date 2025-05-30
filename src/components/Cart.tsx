
import { useEffect } from 'react';
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

  // Effect to lock body scroll when cart is open
  useEffect(() => {
    if (showCart) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [showCart]);

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
      className="fixed inset-0 bg-black/80 z-[100] backdrop-blur-sm"
      onClick={handleBackdropClick}
      aria-hidden={!showCart}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
    >
      {/* Cart Panel - Takes up most of the screen */}
      <div 
        className="bg-white shadow-2xl overflow-hidden flex flex-col 
                  fixed inset-x-4 inset-y-8 rounded-2xl animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()} 
        role="document"
      >
        {/* Header - Fixed at top */}
        <div className="p-6 border-b bg-gradient-to-r from-red-600 to-red-700 text-white flex-shrink-0 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 id="cart-title" className="text-xl font-bold">Meu Carrinho</h3>
                <p className="text-red-100 text-sm">
                  {cart.length} {cart.length === 1 ? 'item' : 'itens'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {cart.length > 0 && clearCart && (
                <Button 
                  variant="ghost" 
                  onClick={handleClearCart}
                  className="text-white hover:text-red-200 hover:bg-red-800/50 rounded-full w-12 h-12 p-0"
                  title="Limpar carrinho"
                  aria-label="Limpar carrinho"
                >
                  <Trash2 className="w-6 h-6" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                onClick={() => setShowCart(false)} 
                className="text-white hover:text-red-200 hover:bg-red-800/50 rounded-full w-12 h-12 p-0"
                aria-label="Fechar carrinho"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {cart.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-8 text-center bg-gray-50">
            <div className="max-w-sm">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-12 h-12 text-gray-400" />
              </div>
              <h4 className="text-2xl font-bold text-gray-800 mb-3">Carrinho Vazio</h4>
              <p className="text-gray-500 mb-8 text-lg">Que tal adicionar alguns produtos incríveis?</p>
              <Button 
                onClick={() => setShowCart(false)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl text-lg"
              >
                Continuar Comprando
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Cart Items - Scrollable middle section */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {cart.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start space-x-4">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-xl flex-shrink-0 border"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-gray-800 font-semibold text-base leading-tight mr-2">
                          {item.product.name}
                        </h4>
                        {removeFromCart && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full w-8 h-8 p-0 flex-shrink-0"
                            title="Remover item"
                            aria-label="Remover item"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm mb-4">
                        {item.size || 'Padrão'}{item.color ? `, ${item.color}` : ''}
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleQuantityChange(item, -1)}
                            className="w-10 h-10 p-0 border-gray-300 hover:border-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl"
                            disabled={item.quantity <= 1}
                            aria-label="Diminuir quantidade"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="text-gray-800 font-bold text-lg w-10 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleQuantityChange(item, 1)}
                            className="w-10 h-10 p-0 border-gray-300 hover:border-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl"
                            aria-label="Aumentar quantidade"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-red-600 font-bold text-lg">
                          R$ {(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer - Fixed at bottom */}
            <div className="border-t border-gray-200 p-6 bg-white flex-shrink-0 rounded-b-2xl">
              <div className="bg-red-50 p-5 rounded-xl mb-5 border border-red-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Subtotal:</span>
                  <span className="text-gray-800 font-semibold">R$ {getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Frete:</span>
                  <span className="text-red-600 font-bold">
                    {getTotalPrice() >= 200 ? 'GRÁTIS' : 'Calcular'}
                  </span>
                </div>
                {getTotalPrice() >= 200 && (
                  <div className="text-center py-3 bg-green-100 rounded-xl">
                    <p className="text-green-700 text-sm font-bold">🎉 Você ganhou frete grátis!</p>
                  </div>
                )}
                <div className="border-t border-red-200 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">Total:</span>
                    <span className="text-2xl font-bold text-red-600">
                      R$ {getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Button
                  onClick={sendToWhatsApp}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-md text-lg"
                >
                  Finalizar no WhatsApp 📱
                </Button>
                
                <Button
                  onClick={() => setShowCart(false)}
                  variant="outline"
                  className="w-full border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-bold py-3 rounded-xl transition-all duration-300"
                >
                  Continuar Comprando
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                Você será redirecionado para o WhatsApp para finalizar sua compra.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
