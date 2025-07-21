import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUTICoins } from '@/hooks/useUTICoins';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Coins, Gift, Star, Package, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CoinProduct {
  id: string;
  name: string;
  description?: string;
  cost: number;
  product_type: 'discount' | 'freebie' | 'exclusive_access' | 'physical_product';
  product_data: any;
  stock?: number;
  is_active: boolean;
  image_url?: string;
}

const CoinsShop = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { coins, spendCoins, loading: coinsLoading } = useUTICoins();
  const { toast } = useToast();
  const [products, setProducts] = useState<CoinProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    loadProducts();
  }, [user, navigate]);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('coin_products')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;

      setProducts((data || []).map(p => ({
        ...p,
        product_type: p.product_type as 'discount' | 'freebie' | 'exclusive_access' | 'physical_product'
      })));
    } catch (error) {
      toast({ 
        title: 'Erro', 
        description: 'Erro ao carregar produtos', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (productId: string, productName: string) => {
    const result = await spendCoins(productId);
    if (result?.success) {
      // Recarregar produtos para atualizar estoque
      loadProducts();
    }
  };

  const getProductIcon = (type: string) => {
    switch (type) {
      case 'discount': return <Star className="w-6 h-6" />;
      case 'freebie': return <Gift className="w-6 h-6" />;
      case 'exclusive_access': return <Zap className="w-6 h-6" />;
      case 'physical_product': return <Package className="w-6 h-6" />;
      default: return <Gift className="w-6 h-6" />;
    }
  };

  const getProductTypeLabel = (type: string) => {
    switch (type) {
      case 'discount': return 'Desconto';
      case 'freebie': return 'Brinde';
      case 'exclusive_access': return 'Acesso Exclusivo';
      case 'physical_product': return 'Produto Físico';
      default: return 'Produto';
    }
  };

  const getProductTypeColor = (type: string) => {
    switch (type) {
      case 'discount': return 'bg-yellow-100 text-yellow-800';
      case 'freebie': return 'bg-green-100 text-green-800';
      case 'exclusive_access': return 'bg-purple-100 text-purple-800';
      case 'physical_product': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading || coinsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Coins className="w-12 h-12 text-yellow-500 animate-spin mx-auto mb-4" />
          <p className="text-lg">Carregando loja...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <Gift className="w-8 h-8" />
                  Loja UTI Coins
                </h1>
                <p className="opacity-90">Troque suas moedas por recompensas incríveis!</p>
              </div>
            </div>
            
            {/* Saldo atual */}
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <div className="text-center">
                <div className="text-2xl font-bold flex items-center gap-2">
                  <Coins className="w-6 h-6" />
                  {coins.balance.toLocaleString()}
                </div>
                <div className="text-sm opacity-90">Seu saldo</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Produtos */}
      <div className="container mx-auto px-4 py-8">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              Nenhum produto disponível
            </h2>
            <p className="text-gray-500">
              Novos produtos serão adicionados em breve!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 text-yellow-600">
                      {getProductIcon(product.product_type)}
                    </div>
                    <Badge className={getProductTypeColor(product.product_type)}>
                      {getProductTypeLabel(product.product_type)}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  {product.description && (
                    <p className="text-sm text-muted-foreground">
                      {product.description}
                    </p>
                  )}
                </CardHeader>
                
                <CardContent>
                  {product.image_url && (
                    <div className="mb-4">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    {/* Preço */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Custo:</span>
                      <div className="flex items-center gap-1 font-semibold text-yellow-600">
                        <Coins className="w-4 h-4" />
                        {product.cost.toLocaleString()}
                      </div>
                    </div>
                    
                    {/* Estoque */}
                    {product.stock !== null && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Estoque:</span>
                        <span className={`text-sm font-medium ${
                          product.stock <= 0 ? 'text-red-500' : 
                          product.stock <= 5 ? 'text-yellow-500' : 'text-green-500'
                        }`}>
                          {product.stock <= 0 ? 'Esgotado' : `${product.stock} disponíveis`}
                        </span>
                      </div>
                    )}
                    
                    {/* Botão de resgate */}
                    <Button
                      onClick={() => handleRedeem(product.id, product.name)}
                      disabled={
                        coins.balance < product.cost || 
                        (product.stock !== null && product.stock <= 0)
                      }
                      className="w-full"
                    >
                      {coins.balance < product.cost ? (
                        'Saldo Insuficiente'
                      ) : product.stock !== null && product.stock <= 0 ? (
                        'Esgotado'
                      ) : (
                        'Resgatar'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinsShop;