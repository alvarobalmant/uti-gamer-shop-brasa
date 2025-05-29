import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useAuth } from '@/hooks/useAuth';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { AuthModal } from '@/components/Auth/AuthModal';
import ProfessionalHeader from '@/components/Header/ProfessionalHeader';
import Footer from '@/components/Footer'; // Import Footer
import { ArrowLeft, Check, Crown, Star, Zap, Shield, Gift, TrendingUp, Users, Award } from 'lucide-react';
import { motion } from 'framer-motion'; // Import framer-motion
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion" // Import Accordion

// **Radical Redesign - UTI PRO Page**

const UTIPro = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { plans, userSubscription, loading, createSubscription, cancelSubscription, hasActiveSubscription } = useSubscriptions();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  useScrollPosition(); // Restore scroll position on navigation

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setProcessingPlan(planId);
    const success = await createSubscription(planId);
    // No need for timeout, state update will re-render
    setProcessingPlan(null);
    if (!success) {
      // Handle error (e.g., show toast notification)
      console.error("Subscription failed");
    }
  };

  const handleCancel = async () => {
    const success = await cancelSubscription();
    if (success) {
      // Optionally navigate or show confirmation
    } else {
      // Handle error
      console.error("Cancellation failed");
    }
  };

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  const calculateMonthlyPrice = (price: number, months: number) => {
    return price / months;
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ProfessionalHeader onCartOpen={() => {}} onAuthOpen={() => setShowAuthModal(true)} />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="animate-spin w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
      <ProfessionalHeader onCartOpen={() => {}} onAuthOpen={() => setShowAuthModal(true)} />

      {/* Back Button Area */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="container-professional">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="text-gray-600 hover:text-uti-red hover:bg-gray-100 px-2"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Voltar à loja
          </Button>
        </div>
      </div>

      <main className="flex-grow">
        {/* Hero Section - Enhanced */}
        <motion.section
          className="py-16 md:py-24 text-center bg-gradient-to-br from-uti-dark via-gray-900 to-uti-dark overflow-hidden relative"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          {/* Background elements */}
          <div className="absolute inset-0 opacity-10">
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-red-500/20 via-transparent to-transparent"></div>
             <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-yellow-400/15 via-transparent to-transparent"></div>
          </div>
          <div className="container-professional relative z-10">
            <motion.div variants={fadeIn} className="inline-block mb-6 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-1">
              <Crown className="w-6 h-6 text-yellow-400 inline-block mr-2" />
              <span className="font-bold text-yellow-300 text-sm">PROGRAMA DE VANTAGENS EXCLUSIVO</span>
            </motion.div>
            <motion.h1
              variants={fadeIn}
              className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight"
            >
              Desbloqueie o <span className="text-yellow-400">Nível PRO</span>
            </motion.h1>
            <motion.p
              variants={fadeIn}
              className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8"
            >
              Economize em cada compra, tenha acesso antecipado a lançamentos e aproveite ofertas que só membros UTI PRO recebem.
            </motion.p>

            {/* CTA for non-subscribed users */}
            {!hasActiveSubscription() && plans.length > 0 && (
              <motion.div variants={fadeIn}>
                <Button
                  size="lg"
                  onClick={() => document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-lg px-8 py-3 rounded-lg shadow-lg hover:shadow-yellow-400/40 transition-all duration-300 transform hover:scale-105"
                >
                  Ver Planos e Assinar
                </Button>
              </motion.div>
            )}

            {/* Confirmation for subscribed users */}
            {hasActiveSubscription() && (
              <motion.div
                variants={fadeIn}
                className="mt-8 inline-block bg-green-600/10 border border-green-500/30 rounded-lg p-4 max-w-md mx-auto shadow-md"
              >
                <div className="flex items-center justify-center gap-2 text-green-300">
                  <Check className="w-5 h-5" />
                  <span className="font-bold">Você já é membro UTI PRO!</span>
                </div>
                <p className="text-green-400 text-sm mt-1">
                  Plano: <span className="font-semibold">{userSubscription?.plan_name}</span>
                </p>
                <p className="text-green-400 text-sm">
                  Válido até: <span className="font-semibold">{new Date(userSubscription?.end_date || '').toLocaleDateString('pt-BR')}</span>
                </p>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Benefits Section - Enhanced */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container-professional">
            <motion.h2
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12"
            >
              Vantagens que <span className="text-uti-red">Impulsionam</span> seu Jogo
            </motion.h2>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {[ // Define benefits directly here for better control
                { icon: Award, title: "10% OFF Sempre", description: "Desconto garantido em TODOS os produtos, o ano todo.", color: "red" },
                { icon: Zap, title: "Acesso VIP", description: "Pré-vendas exclusivas e novidades antes de todo mundo.", color: "blue" },
                { icon: Gift, title: "Ofertas Secretas", description: "Promoções e brindes que só membros PRO têm acesso.", color: "yellow" },
                { icon: Users, title: "Suporte Prioritário", description: "Atendimento mais rápido e dedicado para suas dúvidas.", color: "green" }
              ].map((benefit, index) => (
                <motion.div key={index} variants={fadeIn}>
                  <Card className="text-center h-full border-gray-200 hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                    <CardHeader className="pt-6">
                      <div className={cn(
                        "mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-4",
                        `bg-${benefit.color}-100`
                      )}>
                        <benefit.icon className={cn("w-7 h-7", `text-${benefit.color}-600`)} />
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-800">{benefit.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-6 px-4">
                      <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Pricing Plans - Enhanced */}
        {!hasActiveSubscription() && plans.length > 0 && (
          <motion.section
            id="planos"
            className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-gray-100"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
          >
            <div className="container-professional">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">Escolha seu Plano PRO</h2>
              <p className="text-lg text-gray-600 text-center mb-12 max-w-xl mx-auto">Invista na sua paixão por games e comece a economizar hoje mesmo.</p>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-end"
                variants={staggerContainer}
              >
                {plans.sort((a, b) => a.duration_months - b.duration_months).map((plan) => {
                  const isPopular = plan.duration_months === 6; // Example: Mark 6-month plan as popular
                  const monthlyPrice = calculateMonthlyPrice(plan.price, plan.duration_months);

                  return (
                    <motion.div key={plan.id} variants={fadeIn} className={cn(isPopular ? "md:scale-105 z-10" : "md:scale-95")}>
                      <Card className={cn(
                        "relative h-full flex flex-col shadow-md hover:shadow-xl transition-all duration-300",
                        isPopular ? 'border-2 border-uti-red bg-white' : 'border-gray-200 bg-white'
                      )}>
                        {isPopular && (
                          <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-uti-red text-white px-3 py-1 text-xs font-bold tracking-wider">
                            MAIS POPULAR
                          </Badge>
                        )}

                        <CardHeader className="text-center pt-8 pb-4">
                          <CardTitle className="text-xl font-bold mb-1">{plan.name}</CardTitle>
                          <CardDescription className="text-sm h-10">{plan.description}</CardDescription> {/* Fixed height */} 
                          <div className="mt-4">
                            <span className={cn("text-4xl font-extrabold", isPopular ? "text-uti-red" : "text-gray-800")}>
                              {formatPrice(plan.price)}
                            </span>
                            <div className="text-xs text-gray-500 mt-1">
                              Equivalente a {formatPrice(monthlyPrice)}/mês
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="flex-grow flex flex-col justify-between pt-4 pb-6 px-6">
                          <ul className="space-y-2 mb-6 text-sm text-gray-700">
                            {[ // Define features consistently
                              "10% de desconto em tudo",
                              "Ofertas exclusivas para membros",
                              "Acesso prioritário a novidades",
                              "Suporte premium via WhatsApp"
                            ].map((feature, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>

                          <Button
                            onClick={() => handleSubscribe(plan.id)}
                            disabled={processingPlan === plan.id}
                            size="lg"
                            className={cn(
                              "w-full font-bold transition-all duration-300 transform hover:scale-105",
                              isPopular
                                ? 'bg-uti-red hover:bg-red-700 text-white shadow-lg hover:shadow-red-500/50'
                                : 'bg-gray-800 hover:bg-gray-900 text-white'
                            )}
                          >
                            {processingPlan === plan.id ? (
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                <span>Processando...</span>
                              </div>
                            ) : (
                              'Assinar Agora'
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* Current Subscription Management - Enhanced */}
        {hasActiveSubscription() && (
          <motion.section
            className="py-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
          >
            <div className="container-professional max-w-2xl mx-auto">
              <Card className="border-green-200 bg-green-50/50 shadow-sm">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Shield className="w-6 h-6 text-green-600" />
                    <CardTitle className="text-xl font-semibold text-green-800">Sua Assinatura PRO Ativa</CardTitle>
                  </div>
                  <CardDescription className="text-green-700">
                    Continue aproveitando {userSubscription?.discount_percentage}% de desconto em todos os produtos!
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 pt-0 pb-6 px-6">
                  <div className="text-center bg-white p-4 rounded-lg border border-green-100">
                    <p className="font-medium text-gray-800">{userSubscription?.plan_name}</p>
                    <p className="text-sm text-gray-600">
                      Válido até: <span className="font-semibold">{new Date(userSubscription?.end_date || '').toLocaleDateString('pt-BR')}</span>
                    </p>
                  </div>

                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    Cancelar Renovação Automática
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.section>
        )}

        {/* FAQ Section - Enhanced with Accordion */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container-professional">
            <motion.h2
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12"
            >
              Perguntas Frequentes
            </motion.h2>
            <motion.div
              className="max-w-3xl mx-auto"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <Accordion type="single" collapsible className="w-full space-y-4">
                {[ // Define FAQs directly
                  {
                    q: "Como o desconto UTI PRO é aplicado?",
                    a: "É simples! O desconto de 10% é aplicado automaticamente a todos os produtos no seu carrinho assim que você faz login como membro PRO. Você verá o preço com desconto em toda a loja."
                  },
                  {
                    q: "Posso cancelar minha assinatura a qualquer momento?",
                    a: "Sim, você tem total liberdade para cancelar a renovação automática da sua assinatura quando quiser. Seus benefícios continuarão ativos até o final do período que já foi pago."
                  },
                  {
                    q: "Quais são as 'ofertas exclusivas' para membros?",
                    a: "Membros UTI PRO recebem acesso antecipado a promoções, descontos extras em produtos selecionados, brindes especiais e convites para pré-vendas de grandes lançamentos."
                  },
                  {
                    q: "Como funciona o suporte prioritário?",
                    a: "Se precisar de ajuda, suas solicitações via WhatsApp ou outros canais terão prioridade na fila de atendimento, garantindo uma resposta mais rápida da nossa equipe especializada."
                  }
                ].map((faq, index) => (
                  <motion.div key={index} variants={fadeIn}>
                    <AccordionItem value={`item-${index}`} className="bg-white border border-gray-200 rounded-lg shadow-sm px-6">
                      <AccordionTrigger className="text-left font-semibold text-gray-800 hover:no-underline">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 pt-2 pb-4">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default UTIPro;

