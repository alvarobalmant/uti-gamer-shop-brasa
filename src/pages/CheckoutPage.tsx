import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import {
  ShieldCheck,
  Lock,
  ShoppingBag,
  Truck,
  Loader2,
  AlertTriangle,
} from 'lucide-react';

/**
 * Checkout page — collects customer data and redirects to Mercado Pago
 * Checkout Pro. Prices/totals shown here are indicative only; the server
 * recalculates everything from the products table.
 */

const FREE_SHIPPING_THRESHOLD = 150;
const STANDARD_SHIPPING = 15;

const effPrice = (
  p: { price?: number | string; promotional_price?: number | string; promotionalPrice?: number | string } | null | undefined,
): number => {
  const price = Number(p?.price ?? 0);
  const promo = Number(p?.promotional_price ?? p?.promotionalPrice ?? 0);
  return promo > 0 && promo < price ? promo : price;
};

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();

  const [name, setName] = useState<string>(user?.user_metadata?.name ?? '');
  const [email, setEmail] = useState<string>(user?.email ?? '');
  const [phone, setPhone] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const totals = useMemo(() => {
    const subtotal = cart.reduce((acc, item) => acc + effPrice(item.product) * item.quantity, 0);
    const shipping = subtotal <= 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
    return { subtotal, shipping, total: subtotal + shipping };
  }, [cart]);

  const formatBRL = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const validate = (): string | null => {
    if (cart.length === 0) return 'Seu carrinho está vazio.';
    if (name.trim().length < 3) return 'Informe seu nome completo.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Informe um e-mail válido.';
    if (phone.replace(/\D/g, '').length < 10) return 'Informe um telefone válido com DDD.';
    return null;
  };

  const handlePay = async () => {
    const validationError = validate();
    if (validationError) {
      toast({ title: 'Atenção', description: validationError, variant: 'destructive' });
      return;
    }
    // Double-click guard: the ref blocks synchronous repeat clicks before the
    // state update lands. The server also deduplicates identical carts.
    if (loading || submittingRef.current) return;
    submittingRef.current = true;
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-mercadopago-order', {
        body: {
          items: cart.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity,
          })),
          customer: {
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim() || null,
          },
        },
      });

      if (error || !data?.checkout_url) {
        const message = data?.error ?? 'Não foi possível iniciar o pagamento. Tente novamente.';
        toast({ title: 'Erro no pagamento', description: message, variant: 'destructive' });
        setLoading(false);
        return;
      }

      // Order created successfully — only now clear the cart and redirect.
      await clearCart();
      window.location.href = data.checkout_url;
    } catch (e) {
      console.error('checkout error', e);
      toast({
        title: 'Erro no pagamento',
        description: 'Falha de conexão. Verifique sua internet e tente novamente.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  if (cart.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
          <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Seu carrinho está vazio</h1>
          <p className="text-gray-500 mb-6">Adicione produtos para finalizar sua compra.</p>
          <Button
            onClick={() => navigate('/')}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl"
          >
            Ver Produtos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-6 h-6 text-red-600" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Finalizar Compra</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Customer data */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Seus dados</h2>
            <p className="text-sm text-gray-500 mb-5">
              Usaremos para confirmar o pedido e a entrega.
            </p>

            <div className="space-y-4">
              <div>
                <Label htmlFor="checkout-name">Nome completo *</Label>
                <Input
                  id="checkout-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  maxLength={120}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="checkout-email">E-mail *</Label>
                <Input
                  id="checkout-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@email.com"
                  maxLength={200}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="checkout-phone">Telefone / WhatsApp *</Label>
                <Input
                  id="checkout-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(27) 99999-9999"
                  maxLength={20}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="mt-6 flex items-start gap-2 bg-green-50 border border-green-100 rounded-xl p-4">
              <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
              <p className="text-sm text-green-700">
                O pagamento é processado pelo <strong>Mercado Pago</strong> em ambiente 100%
                seguro. Nenhum dado de cartão passa pela nossa loja.
              </p>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:sticky lg:top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Resumo do pedido</h2>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {cart.map((item) => {
                  const unit = effPrice(item.product);
                  return (
                    <div key={item.id} className="flex justify-between items-start gap-3 text-sm">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-gray-500">
                          {item.quantity} × {formatBRL(unit)}
                        </p>
                      </div>
                      <span className="font-semibold text-gray-900 whitespace-nowrap">
                        {formatBRL(unit * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">{formatBRL(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Truck className="w-4 h-4" /> Frete
                  </span>
                  <span className={`font-medium ${totals.shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {totals.shipping === 0 ? 'GRÁTIS' : formatBRL(totals.shipping)}
                  </span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center mb-5">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-red-600">{formatBRL(totals.total)}</span>
              </div>

              <Button
                onClick={handlePay}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl text-base shadow-lg disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  'Pagar com Mercado Pago'
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-3 flex items-center justify-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Você será redirecionado para o ambiente seguro do Mercado Pago
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
