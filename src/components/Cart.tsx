
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, X, Trash2, Plus, Minus } from 'lucide-react';
// Correcting import path if CartItem is defined elsewhere, e.g., in types/cart
// Assuming CartItem is correctly defined and imported based on the project structure
import { CartItem } from '@/types/cart'; // Adjusted path assuming types/cart.ts
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
// Import useCart to access context functions
import { useCart } from '@/contexts/CartContext';

interface CartSheetProps {
  showCart?: boolean;
  setShowCart?: (show: boolean) => void;
  // Additional props that components are passing
  items?: any[];
  onUpdateQuantity?: (productId: string, size: string, color: string, quantity: number) => void;
  onClose?: () => void;
  onSendToWhatsApp?: () => void;
  total?: number;
}

const Cart = ({ showCart = false, setShowCart }: CartSheetProps) => {
  const { 
    items: cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    getCartTotal, 
    sendToWhatsApp 
  } = useCart();

  const handleQuantityChange = (itemId: string, currentQuantity: number, change: number) => {
    const newQuantity = Math.max(0, currentQuantity + change);
    // Find the cart item to get the product, size, and color
    const cartItem = cart.find(item => item.id === itemId);
    if (cartItem) {
      updateQuantity(cartItem.product.id, cartItem.size || '', cartItem.color || '', newQuantity);
    }
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

  const totalPrice = getCartTotal ? getCartTotal() : 0;

  return (
    <Sheet open={showCart} onOpenChange={setShowCart}>
      {/* Ensure no default close button is rendered by SheetContent if possible.
         The explicit SheetClose below should be the only one. */}
      <SheetContent
        side="bottom"
        className={cn(
          "h-[90vh] w-full flex flex-col p-0 z-[100]", // Adjusted z-index to match MobileMenu
          "md:w-[450px] md:h-full md:side-right"
        )}
        aria-describedby="cart-title"
        // If Shadcn UI's SheetContent adds a default close button, 
        // having an explicit SheetClose usually overrides or hides it.
        // We are relying on this behavior.
      >
        {/* Header - Contains the ONLY intended close button */}
        <SheetHeader className="p-4 border-b flex-row justify-between items-center flex-shrink-0 bg-white">
          <div className="flex items-center gap-2">
             <ShoppingCart className="w-5 h-5 text-gray-700" />
             <SheetTitle id="cart-title" className="text-lg font-semibold text-gray-800">Carrinho</SheetTitle>
             <span className="text-sm text-gray-500">({cart.length} {cart.length === 1 ? 'item' : 'itens'})</span>
          </div>
          <div className="flex items-center gap-1">
            {cart.length > 0 && clearCart && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearCart}
                className="text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full w-8 h-8"
                title="Limpar carrinho"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
            {/* This is the close button to keep */}
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full w-8 h-8">
                <X className="w-4 h-4" />
                <span className="sr-only">Fechar</span>
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>

        {/* Scrollable Content Area */}
        <ScrollArea className="flex-grow bg-gray-50">
          <div className="p-4"> 
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center h-[calc(90vh-150px)]">
                <ShoppingCart className="w-16 h-16 text-gray-300 mb-6" />
                <h4 className="text-xl font-semibold text-gray-700 mb-2">Seu carrinho está vazio</h4>
                <p className="text-gray-500 mb-8 max-w-xs">Parece que você ainda não adicionou nenhum produto ao seu carrinho.</p>
                 <SheetClose asChild>
                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg text-base"
                    >
                      Continuar Comprando
                    </Button>
                 </SheetClose>
              </div>
            ) : (
              <div className="space-y-3 pb-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex items-start space-x-3"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-md flex-shrink-0 border"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-gray-800 font-medium text-sm leading-tight mr-2">
                          {item.product.name}
                        </h4>
                        {removeFromCart && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full w-6 h-6 p-0 flex-shrink-0"
                            title="Remover item"
                          >
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                      {(item.size || item.color) && (
                        <p className="text-gray-500 text-xs mb-2">
                          {item.size}{item.size && item.color ? ', ' : ''}{item.color}
                        </p>
                      )}
                      <div className="flex justify-between items-center mt-2">
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
                        <p className="text-red-600 font-semibold text-sm">
                          R$ {(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        {cart.length > 0 && (
          <SheetFooter className="border-t p-4 bg-white flex-shrink-0 flex-col sm:flex-col sm:justify-start sm:items-stretch space-y-3">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2">
               <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Subtotal:</span>
                  <span className="text-gray-800 text-sm font-medium">R$ {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Frete:</span>
                  <span className="text-red-600 text-sm font-semibold">
                    {totalPrice >= 200 ? 'GRÁTIS' : 'Calcular'}
                  </span>
                </div>
                {totalPrice >= 200 && (
                  <div className="text-center py-1 bg-green-100 rounded">
                    <p className="text-green-700 text-xs font-semibold">🎉 Você ganhou frete grátis!</p>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-gray-800">Total:</span>
                    <span className="text-lg font-bold text-red-600">
                      R$ {totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
            </div>

            <Button
              onClick={sendToWhatsApp}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 text-base shadow-sm"
            >
              Finalizar no WhatsApp 📱
            </Button>

            <SheetClose asChild>
              <Button
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold py-3 rounded-lg transition-all duration-300 text-base"
              >
                Continuar Comprando
              </Button>
            </SheetClose>

            <p className="text-xs text-gray-500 text-center mt-1">
              Você será redirecionado para o WhatsApp.
            </p>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
