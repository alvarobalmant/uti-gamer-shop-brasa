
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PremiumHeader from '@/components/Header/PremiumHeader';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = (productId: string, size: string | undefined, color: string | undefined, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, size, color);
    } else {
      updateQuantity(productId, size, color, newQuantity);
    }
  };

  const handleCheckout = () => {
    const itemsList = cart.map(item => 
      `• ${item.product.name} (${item.size || 'Padrão'}${item.color ? `, ${item.color}` : ''}) - Qtd: ${item.quantity} - R$ ${(item.product.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    const total = getCartTotal();
    const message = `Olá! Gostaria de finalizar minha compra da UTI DOS GAMES:\n\n${itemsList}\n\n*Total: R$ ${total.toFixed(2)}*\n\nPor favor, me ajudem com o processo de pagamento e entrega!`;
    const whatsappUrl = `https://wa.me/5527996882090?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleClearCart = async () => {
    if (window.confirm('Tem certeza que deseja limpar todo o carrinho?')) {
      setLoading(true);
      await clearCart();
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PremiumHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mr-4 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Meu Carrinho</h1>
              <p className="text-gray-600">{cart.length} {cart.length === 1 ? 'item' : 'itens'}</p>
            </div>
          </div>
        </div>

        {cart.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <img 
                src="/lovable-uploads/ad940e09-b6fc-44a8-98a5-3247986d6f98.png" 
                alt="Carrinho vazio" 
                className="w-32 h-32 mx-auto mb-6 opacity-50"
              />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Carrinho Vazio</h2>
              <p className="text-gray-500 mb-8">Ainda não há produtos no seu carrinho</p>
              <Button 
                onClick={() => navigate('/')}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3"
              >
                Continuar Comprando
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Itens do Carrinho</h2>
                <Button
                  variant="outline"
                  onClick={handleClearCart}
                  disabled={loading}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Limpar Carrinho
                </Button>
              </div>

              {cart.map((item, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{item.product.name}</h3>
                        <p className="text-gray-500 mb-4">
                          {item.size || 'Padrão'}{item.color ? `, ${item.color}` : ''}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleQuantityChange(item.product.id, item.size, item.color, item.quantity - 1)}
                              className="w-10 h-10 p-0"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="text-lg font-bold w-12 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleQuantityChange(item.product.id, item.size, item.color, item.quantity + 1)}
                              className="w-10 h-10 p-0"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-lg font-bold text-red-600">
                              R$ {(item.product.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">
                              R$ {item.product.price.toFixed(2)} cada
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.product.id, item.size, item.color)}
                        className="text-red-600 hover:bg-red-50 p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-bold">R$ {getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Frete</span>
                      <span className="font-bold text-red-600">
                        {getCartTotal() >= 200 ? 'GRÁTIS' : 'A calcular'}
                      </span>
                    </div>
                    {getCartTotal() >= 200 && (
                      <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                        <p className="text-green-700 text-sm font-bold text-center">
                          🎉 Você ganhou frete grátis!
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xl font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-red-600">
                        R$ {getCartTotal().toFixed(2)}
                      </span>
                    </div>
                    
                    <Button
                      onClick={handleCheckout}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-lg mb-4"
                    >
                      Finalizar no WhatsApp 📱
                    </Button>
                    
                    <Button
                      onClick={() => navigate('/')}
                      variant="outline"
                      className="w-full border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-bold py-3"
                    >
                      Continuar Comprando
                    </Button>
                    
                    <p className="text-xs text-gray-500 text-center mt-3">
                      Você será redirecionado para o WhatsApp para finalizar sua compra
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
