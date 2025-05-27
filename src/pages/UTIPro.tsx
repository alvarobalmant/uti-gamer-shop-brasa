
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useAuth } from '@/hooks/useAuth';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { AuthModal } from '@/components/Auth/AuthModal';
import ProfessionalHeader from '@/components/Header/ProfessionalHeader';
import { ArrowLeft, Check, Crown, Star, Zap, Shield, Gift } from 'lucide-react';

const UTIPro = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { plans, userSubscription, loading, createSubscription, cancelSubscription, hasActiveSubscription } = useSubscriptions();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  useScrollPosition();

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setProcessingPlan(planId);
    const success = await createSubscription(planId);
    if (success) {
      // Simulate payment success for demo
      setTimeout(() => {
        setProcessingPlan(null);
      }, 2000);
    } else {
      setProcessingPlan(null);
    }
  };

  const handleCancel = async () => {
    const success = await cancelSubscription();
    if (success) {
      navigate('/');
    }
  };

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  const calculateMonthlyPrice = (price: number, months: number) => {
    return price / months;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ProfessionalHeader onCartOpen={() => {}} onAuthOpen={() => setShowAuthModal(true)} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfessionalHeader onCartOpen={() => {}} onAuthOpen={() => setShowAuthModal(true)} />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-red-600 to-red-700 text-white py-4">
        <div className="container-professional">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="text-white hover:bg-red-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar à loja
          </Button>
        </div>
      </div>

      <div className="container-professional py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="w-8 h-8 text-yellow-500" />
            <h1 className="text-4xl font-black text-gray-900">UTI PRO</h1>
            <Crown className="w-8 h-8 text-yellow-500" />
          </div>
          <p className="text-xl text-gray-600 mb-6">
            Torne-se membro premium e economize em todos os seus jogos favoritos!
          </p>
          
          {hasActiveSubscription() && (
            <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-6 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-2 text-green-800">
                <Check className="w-5 h-5" />
                <span className="font-bold">Você é membro UTI PRO!</span>
              </div>
              <p className="text-green-700 text-sm mt-1">
                Plano: {userSubscription?.plan_name}
              </p>
              <p className="text-green-700 text-sm">
                Válido até: {new Date(userSubscription?.end_date || '').toLocaleDateString('pt-BR')}
              </p>
            </div>
          )}
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center border-red-200">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-lg">10% de Desconto</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Em todos os produtos da loja, sem exceção!</p>
            </CardContent>
          </Card>

          <Card className="text-center border-red-200">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-lg">Acesso Prioritário</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Seja o primeiro a saber sobre novos lançamentos</p>
            </CardContent>
          </Card>

          <Card className="text-center border-red-200">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Gift className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-lg">Ofertas Exclusivas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Promoções especiais apenas para membros PRO</p>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Plans */}
        {!hasActiveSubscription() && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-8">Escolha seu plano</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {plans.map((plan) => {
                const isPopular = plan.duration_months === 6;
                const monthlyPrice = calculateMonthlyPrice(plan.price, plan.duration_months);
                
                return (
                  <Card key={plan.id} className={`relative ${isPopular ? 'border-red-500 shadow-lg scale-105' : 'border-gray-200'}`}>
                    {isPopular && (
                      <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-600">
                        Mais Popular
                      </Badge>
                    )}
                    
                    <CardHeader className="text-center">
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                      <div className="mt-4">
                        <span className="text-3xl font-bold text-red-600">
                          {formatPrice(plan.price)}
                        </span>
                        <div className="text-sm text-gray-500 mt-1">
                          {formatPrice(monthlyPrice)}/mês
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="text-sm">10% de desconto em tudo</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Ofertas exclusivas</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Acesso prioritário</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Suporte premium</span>
                        </li>
                      </ul>

                      <Button
                        onClick={() => handleSubscribe(plan.id)}
                        disabled={processingPlan === plan.id}
                        className={`w-full ${isPopular ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-800 hover:bg-gray-900'}`}
                      >
                        {processingPlan === plan.id ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processando...
                          </div>
                        ) : (
                          'Assinar Agora'
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Current Subscription Management */}
        {hasActiveSubscription() && (
          <div className="max-w-md mx-auto">
            <Card className="border-green-300">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Shield className="w-6 h-6 text-green-600" />
                  <CardTitle className="text-green-800">Assinatura Ativa</CardTitle>
                </div>
                <CardDescription>
                  Você está economizando {userSubscription?.discount_percentage}% em todos os produtos!
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="font-medium">{userSubscription?.plan_name}</p>
                  <p className="text-sm text-gray-600">
                    Válido até: {new Date(userSubscription?.end_date || '').toLocaleDateString('pt-BR')}
                  </p>
                </div>
                
                <Button
                  onClick={handleCancel}
                  variant="destructive"
                  className="w-full"
                >
                  Cancelar Assinatura
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Perguntas Frequentes</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Como funciona o desconto?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  O desconto de 10% é aplicado automaticamente no carrinho para todos os produtos. 
                  Você verá o preço especial UTI PRO durante toda a navegação.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Posso cancelar a qualquer momento?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Sim! Você pode cancelar sua assinatura a qualquer momento. 
                  Os benefícios continuam até o final do período já pago.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">O que são as ofertas exclusivas?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Membros UTI PRO recebem acesso a promoções especiais, descontos adicionais em 
                  produtos selecionados e pré-vendas de lançamentos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default UTIPro;
