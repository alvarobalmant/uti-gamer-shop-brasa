import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, GamepadIcon, Star, Shield, Zap, Gift, Check, Clock, Users, Trophy, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Define valid easing types
type ValidEasing = "linear" | "easeIn" | "easeOut" | "easeInOut" | "circIn" | "circOut" | "circInOut" | "backIn" | "backOut" | "backInOut" | "anticipate";

const UTIPro: React.FC = () => {
  const { user, userSubscription, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [proCode, setProCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);

  // Animation variants with valid easing
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: "easeOut" as ValidEasing 
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: "easeOut" as ValidEasing 
      }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: "easeOut" as ValidEasing 
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        ease: "easeOut" as ValidEasing
      }
    }
  };

  const handleRedeemCode = async () => {
    if (!user) {
      toast({
        title: 'Erro',
        description: 'Você precisa estar logado para resgatar um código.',
        variant: 'destructive',
      });
      return;
    }

    if (!proCode.trim()) {
      toast({
        title: 'Erro',
        description: 'Por favor, insira um código válido.',
        variant: 'destructive',
      });
      return;
    }

    setIsRedeeming(true);

    try {
      const { data: code, error: codeError } = await supabase
        .from('pro_codes')
        .select('*')
        .eq('code', proCode.trim())
        .eq('is_active', true)
        .is('used_by', null)
        .single();

      if (codeError || !code) {
        toast({
          title: 'Código inválido',
          description: 'O código informado não existe ou já foi utilizado.',
          variant: 'destructive',
        });
        return;
      }

      if (code.expires_at && new Date(code.expires_at) < new Date()) {
        toast({
          title: 'Código expirado',
          description: 'Este código já expirou.',
          variant: 'destructive',
        });
        return;
      }

      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + code.duration_months);

      const { data: result, error: redeemError } = await supabase
        .rpc('redeem_pro_code', {
          p_code_id: code.id,
          p_user_id: user.id,
          p_end_date: endDate.toISOString()
        });

      if (redeemError) {
        throw redeemError;
      }

      if (result?.success) {
        toast({
          title: 'Código resgatado!',
          description: `Parabéns! Você agora tem acesso ao UTI PRO por ${code.duration_months} meses.`,
        });
        setProCode('');
        window.location.reload();
      } else {
        toast({
          title: 'Erro',
          description: result?.message || 'Erro ao resgatar código.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Erro ao resgatar código:', error);
      toast({
        title: 'Erro',
        description: 'Erro interno. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsRedeeming(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
  }, [authLoading]);

  const benefits = [
    {
      icon: Trophy,
      title: "10% de Desconto",
      description: "Desconto em todos os produtos da loja"
    },
    {
      icon: Zap,
      title: "Acesso Antecipado",
      description: "Seja o primeiro a ver lançamentos e ofertas"
    },
    {
      icon: Gift,
      title: "Ofertas Exclusivas",
      description: "Promoções especiais apenas para membros PRO"
    },
    {
      icon: Shield,
      title: "Suporte Prioritário",
      description: "Atendimento preferencial e mais rápido"
    },
    {
      icon: Star,
      title: "Produtos Exclusivos",
      description: "Acesso a itens limitados e edições especiais"
    },
    {
      icon: GamepadIcon,
      title: "Comunidade VIP",
      description: "Acesso ao grupo exclusivo de gamers PRO"
    }
  ];

  const renderSubscriptionStatus = () => {
    if (authLoading) {
      return (
        <div className="text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
          Carregando...
        </div>
      );
    }

    if (!user) {
      return <p className="text-center">Faça login para ver seu status.</p>;
    }

    if (userSubscription?.subscription_id) {
      return (
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-6 py-3 rounded-full text-lg font-semibold">
            <Check className="h-5 w-5" />
            UTI PRO Ativo
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="font-semibold text-gray-900">{userSubscription.plan_name}</p>
              <p className="text-sm text-gray-600">Plano Atual</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Trophy className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="font-semibold text-gray-900">{userSubscription.discount_percentage}%</p>
              <p className="text-sm text-gray-600">Desconto</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="font-semibold text-gray-900">
                {new Date(userSubscription.end_date).toLocaleDateString('pt-BR')}
              </p>
              <p className="text-sm text-gray-600">Válido até</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            Resgate seu código UTI PRO para desbloquear benefícios exclusivos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              placeholder="Digite seu código UTI PRO"
              value={proCode}
              onChange={(e) => setProCode(e.target.value.toUpperCase())}
              className="flex-1"
              disabled={isRedeeming}
            />
            <Button
              onClick={handleRedeemCode}
              disabled={isRedeeming || !proCode.trim()}
              className="bg-green-600 hover:bg-green-700 px-8"
            >
              {isRedeeming ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Resgatando...
                </>
              ) : (
                'Resgatar'
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-16"
          >
            <motion.div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Programa de Fidelidade Premium
            </motion.div>
            
            <motion.h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">
              UTI PRO
            </motion.h1>
            
            <motion.p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Descontos exclusivos, acesso antecipado e benefícios premium para os verdadeiros gamers
            </motion.p>

            <motion.div className="flex flex-wrap justify-center gap-4 mb-12">
              <Badge variant="secondary" className="px-6 py-2 text-lg bg-green-100 text-green-800">
                <Trophy className="h-4 w-4 mr-2" />
                10% de desconto
              </Badge>
              <Badge variant="secondary" className="px-6 py-2 text-lg bg-blue-100 text-blue-800">
                <Zap className="h-4 w-4 mr-2" />
                Acesso antecipado
              </Badge>
              <Badge variant="secondary" className="px-6 py-2 text-lg bg-purple-100 text-purple-800">
                <Gift className="h-4 w-4 mr-2" />
                Ofertas exclusivas
              </Badge>
            </motion.div>
          </motion.div>

          {/* Status Card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto mb-16"
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl text-gray-900">
                  {userSubscription?.subscription_id ? 'Status da Assinatura' : 'Torne-se UTI PRO'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {userSubscription?.subscription_id ? (
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-6 py-3 rounded-full text-lg font-semibold">
                      <Check className="h-5 w-5" />
                      UTI PRO Ativo
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="font-semibold text-gray-900">{userSubscription.plan_name}</p>
                        <p className="text-sm text-gray-600">Plano Atual</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Trophy className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="font-semibold text-gray-900">{userSubscription.discount_percentage}%</p>
                        <p className="text-sm text-gray-600">Desconto</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="font-semibold text-gray-900">
                          {new Date(userSubscription.end_date).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-sm text-gray-600">Válido até</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center">
                      <p className="text-gray-600 mb-6">
                        Resgate seu código UTI PRO para desbloquear benefícios exclusivos
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <Input
                          placeholder="Digite seu código UTI PRO"
                          value={proCode}
                          onChange={(e) => setProCode(e.target.value.toUpperCase())}
                          className="flex-1"
                          disabled={isRedeeming}
                        />
                        <Button 
                          onClick={handleRedeemCode}
                          disabled={isRedeeming || !proCode.trim()}
                          className="bg-green-600 hover:bg-green-700 px-8"
                        >
                          {isRedeeming ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Resgatando...
                            </>
                          ) : (
                            'Resgatar'
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Benefits Section */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-6xl mx-auto"
          >
            <motion.h2 
              variants={featureVariants}
              className="text-3xl font-bold text-center text-gray-900 mb-12"
            >
              Benefícios Exclusivos UTI PRO
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Trophy,
                  title: "10% de Desconto",
                  description: "Desconto em todos os produtos da loja"
                },
                {
                  icon: Zap,
                  title: "Acesso Antecipado",
                  description: "Seja o primeiro a ver lançamentos e ofertas"
                },
                {
                  icon: Gift,
                  title: "Ofertas Exclusivas",
                  description: "Promoções especiais apenas para membros PRO"
                },
                {
                  icon: Shield,
                  title: "Suporte Prioritário",
                  description: "Atendimento preferencial e mais rápido"
                },
                {
                  icon: Star,
                  title: "Produtos Exclusivos",
                  description: "Acesso a itens limitados e edições especiais"
                },
                {
                  icon: GamepadIcon,
                  title: "Comunidade VIP",
                  description: "Acesso ao grupo exclusivo de gamers PRO"
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={featureVariants}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                        <benefit.icon className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UTIPro;
