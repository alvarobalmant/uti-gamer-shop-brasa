
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { formatCurrency } from '@/utils/format';
import { X, ShoppingBag, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { sendToWhatsApp } from '@/utils/whatsapp';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart = ({ isOpen, onClose }: CartProps) => {
  const { items: cartItems, removeItem, updateQuantity, clearCart } = useCart();
  const { hasActiveSubscription } = useSubscriptions();
  const [mounted, setMounted] = useState(false);
  
  // Evitar problemas de hidratação
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity > 0 && newQuantity <= 10) {
      // Find the cart item to get the product details
      const cartItem = cartItems.find(item => item.id === itemId);
      if (cartItem) {
        updateQuantity(cartItem.product.id, cartItem.size || '', cartItem.color || '', newQuantity);
      }
    }
  };

  const handleCheckout = () => {
    sendToWhatsApp(cartItems);
    clearCart();
    onClose();
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  // Aplicar desconto UTI PRO se o usuário tiver assinatura ativa
  const discount = hasActiveSubscription() ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  // Evitar renderização no servidor
  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
            aria-hidden="true"
          />
          
          {/* Cart Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:w-96 bg-gray-900 shadow-xl z-50 flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Carrinho de compras"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white flex items-center">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Carrinho
              </h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className="text-gray-400 hover:text-white"
                aria-label="Fechar carrinho"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <ShoppingBag className="h-16 w-16 text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Seu carrinho está vazio</h3>
                  <p className="text-gray-400 mb-6">Adicione produtos ao carrinho para continuar.</p>
                  <Button 
                    onClick={onClose}
                    className="bg-uti-red hover:bg-uti-red/90 text-white"
                  >
                    Continuar Comprando
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <Card key={`${item.product.id}-${item.size}-${item.color}-${item.id}`} className="bg-gray-800 border-gray-700">
                      <CardContent className="p-3">
                        <div className="flex gap-3">
                          {/* Product Image */}
                          <div className="w-20 h-20 bg-gray-700 rounded-md overflow-hidden flex-shrink-0">
                            <img 
                              src={item.product.image} 
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between">
                              <h3 className="font-medium text-white text-sm truncate">{item.product.name}</h3>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleRemoveItem(item.id)}
                                className="h-5 w-5 text-gray-400 hover:text-white -mr-1 -mt-1"
                                aria-label={`Remover ${item.product.name} do carrinho`}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            {/* Variant Info */}
                            <div className="text-xs text-gray-400 mt-1">
                              {item.size && <span className="mr-2">Tamanho: {item.size}</span>}
                              {item.color && <span>Cor: {item.color}</span>}
                            </div>
                            
                            {/* Price and Quantity */}
                            <div className="flex justify-between items-center mt-2">
                              <span className="font-medium text-white">
                                {formatCurrency(item.product.price)}
                              </span>
                              
                              <div className="flex items-center border border-gray-600 rounded-md">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="h-7 w-7 text-gray-400 hover:text-white"
                                  aria-label="Diminuir quantidade"
                                >
                                  <span className="text-lg font-medium">-</span>
                                </Button>
                                <span className="w-8 text-center text-white text-sm">
                                  {item.quantity}
                                </span>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  disabled={item.quantity >= 10}
                                  className="h-7 w-7 text-gray-400 hover:text-white"
                                  aria-label="Aumentar quantidade"
                                >
                                  <span className="text-lg font-medium">+</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
            
            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-800 p-4 space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">{formatCurrency(subtotal)}</span>
                </div>
                
                {/* Discount */}
                {hasActiveSubscription() && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400 flex items-center">
                      Desconto UTI PRO (10%)
                    </span>
                    <span className="text-green-400">-{formatCurrency(discount)}</span>
                  </div>
                )}
                
                {/* Total */}
                <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-800">
                  <span className="text-white">Total</span>
                  <span className="text-white">{formatCurrency(total)}</span>
                </div>
                
                {/* UTI PRO Promo */}
                {!hasActiveSubscription() && (
                  <div className="bg-uti-red/20 border border-uti-red/30 rounded-md p-3 flex items-start gap-2">
                    <AlertCircle className="text-uti-red w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white text-sm font-medium">Economize 10% em todas as compras!</p>
                      <p className="text-gray-300 text-xs mt-1">
                        Assine o UTI PRO e ganhe 10% de desconto em todos os produtos.
                      </p>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="text-uti-red p-0 h-auto mt-1"
                        onClick={onClose}
                        asChild
                      >
                        <a href="/uti-pro">Saiba mais</a>
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Checkout Button */}
                <Button 
                  onClick={handleCheckout}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-6 md:py-3"
                  aria-label="Finalizar compra via WhatsApp"
                >
                  Finalizar via WhatsApp
                </Button>
                
                {/* Continue Shopping */}
                <Button 
                  variant="outline" 
                  onClick={onClose}
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Continuar Comprando
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;
