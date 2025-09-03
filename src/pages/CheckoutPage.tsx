
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import UTICoinsCheckout from '@/components/Checkout/UTICoinsCheckout';
import { formatPrice } from '@/utils/formatPrice';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, getCartTotal, getCartItemsCount } = useCart();
  const [utiCoinsSummary, setUTICoinsSummary] = useState<any>(null);
  const [useUTICoins, setUseUTICoins] = useState(false);

  const cartTotal = getCartTotal();
  const itemCount = getCartItemsCount();

  const handleUTICoinsChange = (enabled: boolean, summary: any) => {
    setUseUTICoins(enabled);
    setUTICoinsSummary(summary);
  };

  const finalTotal = useUTICoins && utiCoinsSummary ? utiCoinsSummary.finalTotal : cartTotal;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle>Acesso Necessário</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Você precisa estar logado para finalizar a compra.</p>
              <Button onClick={() => navigate('/login')}>
                Fazer Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Carrinho Vazio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Seu carrinho está vazio. Adicione alguns produtos antes de finalizar a compra.</p>
              <Button onClick={() => navigate('/')}>
                Continuar Comprando
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="p-0 h-auto font-normal hover:text-red-600"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Voltar
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Resumo do Pedido */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pedido ({itemCount} {itemCount === 1 ? 'item' : 'itens'})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.size || ''}-${item.color || ''}`} className="flex justify-between items-start border-b pb-4">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product.name}</h4>
                        <div className="text-sm text-gray-600 mt-1">
                          {item.size && <span className="mr-3">Tamanho: {item.size}</span>}
                          {item.color && <span className="mr-3">Cor: {item.color}</span>}
                          <span>Quantidade: {item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(item.product.price * item.quantity)}</p>
                        <p className="text-sm text-gray-600">{formatPrice(item.product.price)} cada</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* UTI Coins Checkout */}
            <UTICoinsCheckout
              cartItems={items}
              cartTotal={cartTotal}
              onUTICoinsChange={handleUTICoinsChange}
            />
          </div>

          {/* Total e Finalização */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Total da Compra</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  
                  {useUTICoins && utiCoinsSummary?.hasDiscount && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto UTI Coins:</span>
                      <span>-{formatPrice(utiCoinsSummary.discountApplied)}</span>
                    </div>
                  )}
                  
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>{formatPrice(finalTotal)}</span>
                    </div>
                  </div>

                  {useUTICoins && utiCoinsSummary?.utiCoinsUsed > 0 && (
                    <div className="text-sm text-yellow-600">
                      Serão debitadas {utiCoinsSummary.utiCoinsUsed.toLocaleString()} 🪙
                    </div>
                  )}

                  {utiCoinsSummary?.hasCashback && (
                    <div className="text-sm text-blue-600">
                      Você receberá +{utiCoinsSummary.cashbackCoins.toLocaleString()} 🪙 de cashback
                    </div>
                  )}
                </div>

                <Button className="w-full" size="lg">
                  Finalizar Compra via WhatsApp
                </Button>
                
                <p className="text-xs text-gray-500 text-center">
                  Você será redirecionado para o WhatsApp para finalizar o pagamento
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
