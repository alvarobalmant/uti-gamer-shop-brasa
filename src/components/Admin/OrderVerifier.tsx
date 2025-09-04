import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, Package, User, Clock, CheckCircle, XCircle, AlertCircle, Coins } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useOrderVerification, OrderVerificationData } from '@/hooks/useOrderVerification';

const OrderVerifier = () => {
  const [searchCode, setSearchCode] = useState('');
  const [orderData, setOrderData] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const { loading, error, verifyCode, completeOrder } = useOrderVerification();
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchCode.trim()) {
      toast({
        title: "Erro",
        description: "Digite um código para pesquisar",
        variant: "destructive"
      });
      return;
    }

    const result = await verifyCode(searchCode.trim());
    if (result) {
      setOrderData(result);
    } else {
      setOrderData(null);
    }
  };

  const handleCompleteOrder = async () => {
    if (!orderData?.order_data?.code) return;

    setProcessing(true);
    const result = await completeOrder(orderData.order_data.code);
    
    if (result) {
      toast({
        title: "Sucesso!",
        description: `Pedido finalizado com sucesso! ${result.coins_awarded} UTI coins foram creditados ao cliente.`,
      });
      
      // Atualizar dados
      setOrderData({
        ...orderData,
        order_data: {
          ...orderData.order_data,
          status: 'completed',
          completed_at: new Date().toISOString()
        }
      });
    }
    setProcessing(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>;
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Finalizado</Badge>;
      case 'expired':
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Expirado</Badge>;
      default:
        return <Badge variant="secondary"><AlertCircle className="w-3 h-3 mr-1" />Desconhecido</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Calcular cashback previsto baseado nos produtos reais
  const calculateExpectedCashback = (items: any[]) => {
    let totalCashbackReais = 0;
    let hasProductsWithCashback = false;

    items.forEach(item => {
      // Buscar produto pelo nome "coin" ou verificar se tem product_id
      const isProductCoin = item.product_name?.toLowerCase().includes('coin');
      const itemTotal = item.total || (item.price * item.quantity);
      
      if (isProductCoin || item.product_id) {
        hasProductsWithCashback = true;
        // Para o produto "coin", usar 10% de cashback
        const cashbackPercentage = isProductCoin ? 10 : 10; // Assumir 10% para todos por enquanto
        totalCashbackReais += itemTotal * (cashbackPercentage / 100);
      }
    });

    const utiCoinsFromCashback = Math.round(totalCashbackReais * 100); // 1 real = 100 UTI Coins
    const defaultCoins = 20; // UTI coins padrão por compra
    const totalCoins = defaultCoins + utiCoinsFromCashback;

    return {
      cashbackReais: totalCashbackReais,
      cashbackCoins: utiCoinsFromCashback,
      defaultCoins,
      totalCoins,
      hasProductsWithCashback
    };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            VERIFICADOR DE PEDIDO
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Digite o código de verificação (25 dígitos)"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              maxLength={25}
              className="font-mono"
            />
            <Button 
              onClick={handleSearch} 
              disabled={loading}
              className="min-w-[120px]"
            >
              {loading ? 'Verificando...' : 'Verificar'}
            </Button>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {orderData && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Detalhes do Pedido
              </CardTitle>
              {getStatusBadge(orderData.order_data.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Informações básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-sm text-gray-600 mb-2">CÓDIGO DE VERIFICAÇÃO</h3>
                <p className="font-mono text-lg bg-gray-100 p-2 rounded">{orderData.order_data.code}</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-600 mb-2">VALOR TOTAL</h3>
                <p className="text-lg font-bold text-green-600">{formatCurrency(orderData.order_data.total_amount)}</p>
              </div>
            </div>

            {/* Informações do cliente */}
            {orderData.user_data && (
              <div>
                <h3 className="font-semibold text-sm text-gray-600 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  DADOS DO CLIENTE
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="space-y-2">
                    <p><strong>Nome:</strong> {orderData.user_data.name || 'Não informado'}</p>
                    <p><strong>Email:</strong> {orderData.user_data.email || 'Não informado'}</p>
                    <p><strong>ID do Usuário:</strong> {orderData.user_data.id}</p>
                  </div>
                  
                  {orderData.uti_coins_balance !== undefined && (
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs">U</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Saldo UTI Coins</p>
                          <p className="text-lg font-bold text-amber-900 dark:text-amber-100">
                            {orderData.uti_coins_balance.toLocaleString()} moedas
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Itens do pedido */}
            <div>
              <h3 className="font-semibold text-sm text-gray-600 mb-3">ITENS DO PEDIDO</h3>
              <div className="space-y-3">
                {orderData.order_data.items.map((item: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product_name}</h4>
                        <div className="text-sm text-gray-600 mt-1">
                          {item.size && <span className="mr-3">Tamanho: {item.size}</span>}
                          {item.color && <span className="mr-3">Cor: {item.color}</span>}
                          <span>Quantidade: {item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(item.total)}</p>
                        <p className="text-sm text-gray-600">{formatCurrency(item.price)} cada</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Timestamps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-gray-600 mb-1">CRIADO EM</h4>
                <p>{formatDate(orderData.order_data.created_at)}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-600 mb-1">EXPIRA EM</h4>
                <p className={new Date(orderData.order_data.expires_at) < new Date() ? 'text-red-600' : ''}>
                  {formatDate(orderData.order_data.expires_at)}
                </p>
              </div>
              {orderData.order_data.completed_at && (
                <div>
                  <h4 className="font-semibold text-gray-600 mb-1">FINALIZADO EM</h4>
                  <p>{formatDate(orderData.order_data.completed_at)}</p>
                </div>
              )}
            </div>

            {/* Recompensas */}
            {orderData.order_data.rewards_given && Object.keys(orderData.order_data.rewards_given).length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Coins className="w-4 h-4" />
                  RECOMPENSAS CONCEDIDAS
                </h4>
                <p className="text-blue-700">
                  UTI Coins: {orderData.order_data.rewards_given.uti_coins || 0}
                </p>
              </div>
            )}

            {/* Previsão de Recompensas ANTES de finalizar */}
            {orderData.order_data.status === 'pending' && (() => {
              const expectedRewards = calculateExpectedCashback(orderData.order_data.items);
              
              return (
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                  <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-3 flex items-center gap-2">
                    <Coins className="w-5 h-5" />
                    🎯 RECOMPENSAS QUE SERÃO CONCEDIDAS
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-amber-700 dark:text-amber-300">UTI Coins padrão por compra:</span>
                      <span className="font-bold text-amber-900 dark:text-amber-100">
                        {expectedRewards.defaultCoins.toLocaleString()} moedas
                      </span>
                    </div>
                    
                    {expectedRewards.hasProductsWithCashback && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-amber-700 dark:text-amber-300">
                            Cashback (10%): {expectedRewards.cashbackReais.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </span>
                          <span className="font-bold text-amber-900 dark:text-amber-100">
                            {expectedRewards.cashbackCoins.toLocaleString()} moedas
                          </span>
                        </div>
                        
                        <div className="border-t border-amber-200 dark:border-amber-700 pt-2">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-amber-800 dark:text-amber-200">TOTAL DE UTI COINS:</span>
                            <span className="text-xl font-bold text-amber-900 dark:text-amber-100">
                              🪙 {expectedRewards.totalCoins.toLocaleString()} moedas
                            </span>
                          </div>
                        </div>
                        
                        {expectedRewards.cashbackCoins >= 1000000 && (
                          <div className="mt-3 p-3 bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/50 dark:to-amber-900/50 rounded-lg border border-yellow-300 dark:border-yellow-700">
                            <p className="text-center text-yellow-800 dark:text-yellow-200 font-bold text-lg">
                              🎉 MEGA CASHBACK! Mais de 1 MILHÃO de UTI Coins! 🎉
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Ações */}
            {orderData.order_data.status === 'pending' && new Date(orderData.order_data.expires_at) > new Date() && (
              <div className="pt-4 border-t">
                <Button 
                  onClick={handleCompleteOrder}
                  disabled={processing}
                  className="w-full md:w-auto bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  {processing ? 'Processando...' : 'MARCAR COMO CONCLUÍDA'}
                </Button>
                <p className="text-sm text-gray-600 mt-2">
                  ⚠️ Esta ação não pode ser desfeita. O cliente receberá as recompensas e o estoque será atualizado.
                </p>
              </div>
            )}

            {orderData.order_data.status === 'expired' && (
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-red-700 font-medium">Este código expirou e não pode mais ser processado.</p>
              </div>
            )}

            {orderData.order_data.status === 'completed' && (
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-700 font-medium">✅ Este pedido já foi finalizado com sucesso.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrderVerifier;