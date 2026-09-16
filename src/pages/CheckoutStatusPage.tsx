import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  ShoppingBag,
  MessageCircle,
} from 'lucide-react';

/**
 * Post-payment return pages (/checkout/success, /checkout/pending, /checkout/failure).
 * The URL is NEVER trusted as payment confirmation: the order status shown here
 * always comes from the database (updated by the Mercado Pago webhook).
 */

interface OrderStatus {
  order_number: string | null;
  status: string | null;
  payment_status: string | null;
  total_amount: number | null;
  created_at: string | null;
}

type Tone = 'success' | 'pending' | 'failure';

const PAYMENT_LABELS: Record<string, string> = {
  approved: 'Pagamento aprovado',
  pending: 'Pagamento pendente',
  rejected: 'Pagamento recusado',
  refunded: 'Pagamento devolvido',
  cancelled: 'Pagamento cancelado',
};

const formatBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const CheckoutStatusPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tone: Tone = location.pathname.endsWith('/failure')
    ? 'failure'
    : location.pathname.endsWith('/pending')
      ? 'pending'
      : 'success';

  const ref = new URLSearchParams(location.search).get('ref');
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(Boolean(ref));
  const [notFound, setNotFound] = useState(!ref);
  const pollCount = useRef(0);

  const fetchStatus = useCallback(async () => {
    if (!ref) return;
    try {
      const { data, error } = await supabase.rpc('get_order_public_status', {
        p_reference: ref,
      });
      const row = Array.isArray(data) ? data[0] : data;
      if (error || !row) {
        setNotFound(true);
        return;
      }
      setOrder(row as OrderStatus);
      setNotFound(false);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [ref]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Poll while payment is pending so Pix/boleto confirmations appear without reload.
  useEffect(() => {
    if (!order || order.payment_status !== 'pending') return;
    if (pollCount.current >= 48) return; // ~4 minutes, then stop
    const t = setTimeout(() => {
      pollCount.current += 1;
      fetchStatus();
    }, 5000);
    return () => clearTimeout(t);
  }, [order, fetchStatus]);

  const paymentStatus = order?.payment_status ?? null;
  const isApproved = paymentStatus === 'approved';
  const isPending = paymentStatus === 'pending' || paymentStatus === null;
  const isRejected =
    paymentStatus === 'rejected' || paymentStatus === 'cancelled' || paymentStatus === 'refunded';

  const visual = isApproved
    ? { icon: <CheckCircle2 className="w-16 h-16 text-green-600" />, color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-100' }
    : isPending
      ? { icon: <Clock className="w-16 h-16 text-yellow-500" />, color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-100' }
      : { icon: <XCircle className="w-16 h-16 text-red-600" />, color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-100' };

  const message = isApproved
    ? 'Recebemos seu pagamento e já estamos preparando seu pedido!'
    : isPending
      ? 'Seu pagamento está sendo processado. Assim que o Mercado Pago confirmar, atualizaremos o status aqui automaticamente.'
      : 'Infelizmente o pagamento não foi concluído. Você pode tentar novamente — seu carrinho continua salvo.';

  const headline =
    tone === 'failure' && !isApproved
      ? paymentStatus === 'pending'
        ? 'Pedido em processamento'
        : 'Pagamento não concluído'
      : tone === 'pending' && isPending
        ? 'Aguardando confirmação'
        : PAYMENT_LABELS[paymentStatus ?? ''] ?? 'Processando seu pedido';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
        {loading ? (
          <>
            <Loader2 className="w-16 h-16 mx-auto text-gray-300 animate-spin mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">Consultando pedido...</h1>
          </>
        ) : notFound || !order ? (
          <>
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">Pedido não encontrado</h1>
            <p className="text-gray-500 mb-6">
              Não localizamos esse pedido. Se você concluiu o pagamento, fale com a gente pelo
              WhatsApp.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => navigate('/')}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl"
              >
                Voltar à Loja
              </Button>
              <a
                href="https://wa.me/5527999771112"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full border-2 border-green-500 text-green-700 font-semibold py-3 rounded-xl hover:bg-green-50"
              >
                <MessageCircle className="w-5 h-5" />
                Falar no WhatsApp
              </a>
            </div>
          </>
        ) : (
          <>
            <div className={`w-24 h-24 mx-auto rounded-full ${visual.bg} border ${visual.border} flex items-center justify-center mb-4`}>
              {paymentStatus === 'pending' && tone !== 'failure' ? (
                <div className="relative">
                  {visual.icon}
                  <Loader2 className="w-6 h-6 text-yellow-600 animate-spin absolute -right-2 -bottom-1" />
                </div>
              ) : (
                visual.icon
              )}
            </div>
            <h1 className={`text-2xl font-bold ${visual.color} mb-2`}>{headline}</h1>
            <p className="text-gray-500 mb-5">{message}</p>

            <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-500">Pedido</span>
                <span className="font-semibold text-gray-900">{order.order_number}</span>
              </div>
              {order.total_amount != null && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Total</span>
                  <span className="font-semibold text-gray-900">{formatBRL(Number(order.total_amount))}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Situação</span>
                <span className={`font-semibold ${visual.color}`}>
                  {PAYMENT_LABELS[paymentStatus ?? 'pending'] ?? 'Processando'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => navigate('/')}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl"
              >
                Voltar à Loja
              </Button>
              <a
                href={`https://wa.me/5527999771112?text=${encodeURIComponent(`Olá! Preciso de ajuda com o pedido ${order.order_number}.`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full border-2 border-green-500 text-green-700 font-semibold py-3 rounded-xl hover:bg-green-50"
              >
                <MessageCircle className="w-5 h-5" />
                Falar no WhatsApp
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutStatusPage;
