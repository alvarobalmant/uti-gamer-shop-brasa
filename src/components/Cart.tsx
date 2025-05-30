
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
    // Only close if the backdrop itself (the div with bg-black/60) is clicked
    if (e.target === e.currentTarget) {
      setShowCart(false);
    }
  };

  if (!showCart) return null;

  return (
    // Backdrop - Covers the entire screen, centers the modal on mobile
    <div 
      className={`fixed inset-0 bg-black/60 z-50 backdrop-blur-sm transition-opacity duration-300 flex items-center justify-center ${showCart ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={handleBackdropClick} // Close when clicking backdrop
    >
      {/* Cart Panel - Centered modal on mobile, slides from right on md+ */}
      <div 
        className={`bg-white shadow-2xl overflow-hidden flex flex-col transform transition-all duration-300 ease-in-out 
                    w-[90%] max-w-[400px] rounded-lg max-h-[90vh]  /* Mobile: Centered Modal */
                    md:fixed md:right-0 md:top-0 md:h-full md:w-[450px] md:max-w-[450px] md:rounded-none md:max-h-full /* Desktop: Side Panel */
                    ${showCart ? 'scale-100 opacity-100 md:translate-x-0' : 'scale-95 opacity-0 md:translate-x-full'}` 
                  }
        // Prevent backdrop click from closing if clicking inside the cart panel
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Header */}
        <div className="p-4 border-b-2 border-red-600 bg-white flex-shrink-0 rounded-t-lg md:rounded-none">
          <div className="flex justify-between items-center">
            {/* Left: Icon + Title */} 
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Meu Carrinho</h3>
                <p className="text-sm text-gray-600">
                  {cart.length} {cart.length === 1 ? 'item' : 'itens'}
                </p>
              </div>
            </div>
            {/* Right: Clear + Close Buttons */} 
            <div className="flex items-center space-x-1">
              {cart.length > 0 && clearCart && (
                <Button 
                  variant="ghost" 
                  onClick={handleClearCart}
                  className="text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full w-9 h-9 p-0"
                  title="Limpar carrinho"
                  aria-label="Limpar carrinho"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                onClick={() => setShowCart(false)} 
                className="text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full w-9 h-9 p-0"
                aria-label="Fechar carrinho"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Conditional Content: Empty or Items + Footer */} 
        {cart.length === 0 ? (
          // Empty Cart View
          <div className="flex-1 flex items-center justify-center p-6 text-center">
            <div>
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
          // Cart with Items
          <>
            {/* Cart Items List (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-red-300 transition-colors duration-200"
                >
                  <div className="flex items-start space-x-3">
                    {/* Item Image */}
                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-md flex-shrink-0 border"
                    />
                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-gray-800 font-semibold text-sm leading-tight mr-2">
                          {item.product.name}
                        </h4>
                        {removeFromCart && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full w-6 h-6 p-0 flex-shrink-0"
                            title="Remover item"
                            aria-label="Remover item"
                          >
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                      <p className="text-gray-500 text-xs mb-2">
                        {item.size || 'Padrão'}{item.color ? `, ${item.color}` : ''}
                      </p>
                      
                      {/* Quantity + Price */}
                      <div className="flex justify-between items-center mt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleQuantityChange(item, -1)}
                            className="w-7 h-7 p-0 border-gray-300 hover:border-red-500 hover:bg-red-50 hover:text-red-600 rounded-md"
                            disabled={item.quantity <= 1}
                            aria-label="Diminuir quantidade"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </Button>
                          <span className="text-gray-800 font-bold text-sm w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleQuantityChange(item, 1)}
                            className="w-7 h-7 p-0 border-gray-300 hover:border-red-500 hover:bg-red-50 hover:text-red-600 rounded-md"
                            aria-label="Aumentar quantidade"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                        {/* Item Total Price */}
                        <p className="text-red-600 font-bold text-sm">
                          R$ {(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer with Summary and Actions */}
            <div className="border-t-2 border-gray-200 p-4 bg-white flex-shrink-0 rounded-b-lg md:rounded-none">
              {/* Price Summary Box */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm font-medium">Subtotal:</span>
                  <span className="text-gray-800 text-sm font-semibold">R$ {getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm font-medium">Frete:</span>
                  <span className="text-red-600 text-sm font-bold">
                    {getTotalPrice() >= 200 ? 'GRÁTIS' : 'Calcular'}
                  </span>
                </div>
                {getTotalPrice() >= 200 && (
                  <div className="text-center py-1.5 bg-green-100 rounded-md">
                    <p className="text-green-700 text-xs font-bold">🎉 Você ganhou frete grátis!</p>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-gray-800">Total:</span>
                    <span className="text-lg font-bold text-red-600">
                      R$ {getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={sendToWhatsApp}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-md text-base"
                >
                  Finalizar no WhatsApp 📱
                </Button>
                
                <Button
                  onClick={() => setShowCart(false)}
                  variant="outline"
                  className="w-full border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-bold py-2.5 rounded-lg transition-all duration-300"
                >
                  Continuar Comprando
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 text-center mt-3">
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

