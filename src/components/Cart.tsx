
import { Button } from '@/components/ui/button';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { Product } from './ProductCard';

export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

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
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-900 border-l border-green-500/20 shadow-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-6 h-6 text-green-400" />
              <h3 className="text-2xl font-bold text-white">Meu Pedido</h3>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => setShowCart(false)} 
              className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-full w-10 h-10 p-0"
            >
              ✕
            </Button>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Seu carrinho está vazio</p>
              <p className="text-gray-500 text-sm mt-2">Adicione alguns produtos incríveis!</p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cart.map((item, index) => (
                  <div key={index} className="bg-gray-800/80 p-4 rounded-xl border border-gray-700 hover:border-green-500/30 transition-colors duration-200">
                    <div className="flex items-start space-x-3">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="text-white font-semibold text-sm leading-tight">{item.product.name}</h4>
                        <p className="text-gray-400 text-xs mt-1">
                          {item.size}{item.color ? `, ${item.color}` : ''}
                        </p>
                        
                        <div className="flex justify-between items-center mt-3">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item, -1)}
                              className="w-8 h-8 p-0 border-gray-600 hover:border-red-500 hover:text-red-400"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="text-white font-semibold text-sm w-8 text-center">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item, 1)}
                              className="w-8 h-8 p-0 border-gray-600 hover:border-green-500 hover:text-green-400"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="text-green-400 font-bold text-sm">
                            R$ {(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total and Checkout */}
              <div className="border-t border-gray-700 pt-6">
                <div className="bg-gray-800/50 p-4 rounded-xl mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Subtotal:</span>
                    <span className="text-white font-semibold">R$ {getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Frete:</span>
                    <span className="text-green-400 font-semibold">
                      {getTotalPrice() >= 200 ? 'GRÁTIS' : 'Calcular'}
                    </span>
                  </div>
                  <div className="border-t border-gray-700 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-white">Total:</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
                        R$ {getTotalPrice().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={sendToWhatsApp}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-green-500/25 text-lg"
                >
                  Finalizar no WhatsApp 📱
                </Button>
                
                <p className="text-xs text-gray-500 text-center mt-2">
                  Você será redirecionado para o WhatsApp
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
