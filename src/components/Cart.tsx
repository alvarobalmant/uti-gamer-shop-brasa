
import { Button } from '@/components/ui/button';
import { Plus, Minus, ShoppingCart, X } from 'lucide-react';
import { CartItem } from '@/hooks/useCart';

interface CartProps {
  cart: CartItem[];
  showCart: boolean;
  setShowCart: (show: boolean) => void;
  updateQuantity: (item: CartItem, change: number) => void;
  sendToWhatsApp: () => void;
}

const Cart = ({ cart, showCart, setShowCart, updateQuantity, sendToWhatsApp }: CartProps) => {
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  if (!showCart) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={() => setShowCart(false)}>
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-red-600">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Meu Carrinho</h3>
                <p className="text-sm text-gray-600">{cart.length} {cart.length === 1 ? 'item' : 'itens'}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => setShowCart(false)} 
              className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full w-10 h-10 p-0"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-16">
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
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cart.map((item, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-red-300 transition-colors duration-200">
                    <div className="flex items-start space-x-3">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="text-gray-800 font-bold text-sm leading-tight mb-1">{item.product.name}</h4>
                        <p className="text-gray-500 text-xs mb-3">
                          {item.size || 'Padrão'}{item.color ? `, ${item.color}` : ''}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item, -1)}
                              className="w-8 h-8 p-0 border-red-300 hover:border-red-500 hover:bg-red-50 hover:text-red-600"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="text-gray-800 font-bold text-sm w-8 text-center bg-white px-2 py-1 rounded border">
                              {item.quantity}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item, 1)}
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

              {/* Resumo e Checkout */}
              <div className="border-t-2 border-gray-200 pt-6">
                <div className="bg-red-50 p-4 rounded-xl mb-4 border border-red-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 font-medium">Subtotal:</span>
                    <span className="text-gray-800 font-bold">R$ {getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 font-medium">Frete:</span>
                    <span className="text-red-600 font-bold">
                      {getTotalPrice() >= 200 ? 'GRÁTIS' : 'Calcular'}
                    </span>
                  </div>
                  {getTotalPrice() >= 200 && (
                    <div className="text-center py-2 bg-green-100 rounded-lg mb-2">
                      <p className="text-green-700 text-sm font-bold">🎉 Você ganhou frete grátis!</p>
                    </div>
                  )}
                  <div className="border-t border-red-200 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-800">Total:</span>
                      <span className="text-2xl font-bold text-red-600">
                        R$ {getTotalPrice().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={sendToWhatsApp}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg text-lg mb-4"
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
                
                <p className="text-xs text-gray-500 text-center mt-3">
                  Você será redirecionado para o WhatsApp para finalizar sua compra
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
