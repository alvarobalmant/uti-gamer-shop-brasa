
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
import Footer from '@/components/Footer';
import { ArrowLeft, Check, Crown, Star, Zap, Shield, Gift, ChevronDown, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';

// Animation Variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const UTIPro = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { plans, userSubscription, usuario, loading, createSubscription, cancelSubscription, hasActiveSubscription } = useSubscriptions();
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
    setTimeout(() => {
        setProcessingPlan(null);
        if (!success) {
             console.error("Subscription failed");
        }
    }, 1500); 
  };

  const handleCancel = async () => {
    const success = await cancelSubscription();
    if (success) {
      // Handle success
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
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <ProfessionalHeader onCartOpen={() => {}} onAuthOpen={() => setShowAuthModal(true)} />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-uti-red animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-uti-dark to-black text-white flex flex-col">
      <ProfessionalHeader onCartOpen={() => {}} onAuthOpen={() => setShowAuthModal(true)} />
      
      <main className="flex-grow">
        {/* Back Button */}
        <div className="absolute top-[calc(var(--header-height,64px)+1rem)] left-4 z-10">
             <Button
                onClick={() => navigate('/')}
                variant="ghost"
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-full px-3 py-1.5 text-sm"
             >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
             </Button>
        </div>

        {/* Hero Section - Adjusted for mobile */}
        <motion.section 
          className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] flex items-center justify-center text-center overflow-hidden bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url('/lovable-uploads/uti-pro-hero-bg.jpg')` }}
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >
          <div className="relative z-10 p-4">
            <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
              <Crown className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-yellow-400 mx-auto mb-3 md:mb-4 drop-shadow-lg" />
            </motion.div>
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white mb-3 md:mb-4 drop-shadow-lg uppercase tracking-tight"
              variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.4 }}
            >
              UTI PRO
            </motion.h1>
            <motion.p 
              className="text-base md:text-lg lg:text-2xl text-white/80 mb-6 md:mb-8 max-w-xs sm:max-w-md md:max-w-2xl mx-auto drop-shadow-md"
              variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.6 }}
            >
              Descontos exclusivos, acesso prioritário e vantagens premium em toda a loja.
            </motion.p>
            {!hasActiveSubscription() && (
              <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.8 }}>
                <Button 
                  size="lg"
                  className="bg-uti-red text-white hover:bg-uti-red/90 font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-6 py-2.5 md:px-8 md:py-3 text-base md:text-lg rounded-full"
                  onClick={() => document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Ver Planos
                </Button>
              </motion.div>
            )}
            {hasActiveSubscription() && (
                <motion.div 
                    className="bg-green-600/80 backdrop-blur-sm border border-green-400 rounded-lg p-3 md:p-4 mt-4 md:mt-6 max-w-sm md:max-w-md mx-auto shadow-lg"
                    variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.8 }}
                >
                  <div className="flex items-center justify-center gap-2 text-white">
                    <Check className="w-5 h-5 md:w-6 md:h-6" />
                    <span className="font-bold text-base md:text-lg">Você já é membro UTI PRO!</span>
                  </div>
                  <p className="text-green-100 text-xs md:text-sm mt-1">
                    Aproveite seus benefícios!
                  </p>
                </motion.div>
            )}
          </div>
        </motion.section>

        {/* Benefits Section - Horizontal Scroll on Mobile */}
        <section className="py-12 md:py-24 bg-uti-dark">
          <div className="container-professional">
            <motion.h2 
              className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-white"
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
            >
              Vantagens Exclusivas
            </motion.h2>
            {/* Horizontal Scroll Container for Mobile */}
            <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4 scrollbar-thin scrollbar-thumb-uti-red/50 scrollbar-track-transparent">
              <motion.div 
                className="flex gap-4 w-max"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
              >
                {[ 
                  { icon: Star, title: '10% de Desconto', description: 'Em todos os produtos da loja, sem exceção!' },
                  { icon: Zap, title: 'Acesso Prioritário', description: 'Seja o primeiro a saber sobre novos lançamentos.' },
                  { icon: Gift, title: 'Ofertas Exclusivas', description: 'Promoções especiais apenas para membros PRO.' },
                ].map((benefit, index) => (
                  <motion.div key={index} variants={fadeInUp} className="w-[75vw] sm:w-[45vw] flex-shrink-0">
                    <Card className="text-center bg-gray-800/50 border-uti-red/30 hover:border-uti-red/70 hover:bg-gray-800/80 transition-all duration-300 shadow-lg h-full flex flex-col">
                      <CardHeader className="items-center pt-6 md:pt-8">
                        <div className="mb-3 md:mb-4 w-12 h-12 md:w-16 md:h-16 bg-uti-red/20 rounded-full flex items-center justify-center border border-uti-red/50">
                          <benefit.icon className="w-6 h-6 md:w-8 md:h-8 text-uti-red" />
                        </div>
                        <CardTitle className="text-lg md:text-xl text-white font-semibold">{benefit.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow flex items-center pb-6 md:pb-8">
                        <p className="text-white/70 text-center px-4 text-sm md:text-base">{benefit.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            {/* Grid Layout for Desktop */}
            <motion.div 
              className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
               {[ 
                  { icon: Star, title: '10% de Desconto', description: 'Em todos os produtos da loja, sem exceção!' },
                  { icon: Zap, title: 'Acesso Prioritário', description: 'Seja o primeiro a saber sobre novos lançamentos.' },
                  { icon: Gift, title: 'Ofertas Exclusivas', description: 'Promoções especiais apenas para membros PRO.' },
                ].map((benefit, index) => (
                  <motion.div key={index} variants={fadeInUp}>
                    <Card className="text-center bg-gray-800/50 border-uti-red/30 hover:border-uti-red/70 hover:bg-gray-800/80 transition-all duration-300 shadow-lg h-full flex flex-col">
                      <CardHeader className="items-center pt-8">
                        <div className="mb-4 w-16 h-16 bg-uti-red/20 rounded-full flex items-center justify-center border border-uti-red/50">
                          <benefit.icon className="w-8 h-8 text-uti-red" />
                        </div>
                        <CardTitle className="text-xl text-white font-semibold">{benefit.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow flex items-center pb-8">
                        <p className="text-white/70 text-center px-4">{benefit.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </motion.div>
          </div>
        </section>

        {/* Pricing Plans Section - Horizontal Scroll on Mobile */}
        {!hasActiveSubscription() && (
          <section id="planos" className="py-12 md:py-24 bg-gradient-to-b from-black via-uti-dark to-black">
            <div className="container-professional">
              <motion.h2 
                className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-white"
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5 }}
              >
                Escolha seu Plano UTI PRO
              </motion.h2>
              {/* Horizontal Scroll Container for Mobile */}
              <div className="md:hidden overflow-x-auto pb-6 -mx-4 px-4 pt-4 scrollbar-thin scrollbar-thumb-uti-red/50 scrollbar-track-transparent">
                <motion.div 
                  className="flex gap-4 w-max pt-3"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                >
                  {plans.map((plan) => {
                    const isPopular = plan.duration_months === 6;
                    const monthlyPrice = calculateMonthlyPrice(plan.price, plan.duration_months);
                    
                    return (
                      <motion.div 
                        key={plan.id} 
                        variants={fadeInUp} 
                        // Adjusted width for better fit on mobile, popular plan slightly larger
                        className={cn(
                          "flex-shrink-0",
                          isPopular ? "w-[80vw] sm:w-[55vw]" : "w-[75vw] sm:w-[50vw]"
                        )}
                      >
                        <Card className={cn(
                          "relative bg-gray-800/60 border border-gray-700 shadow-xl h-full flex flex-col transition-all duration-300",
                          isPopular ? 'border-uti-red ring-2 ring-uti-red z-10 mt-5' : '' 
                          // Adicionado mt-5 para dar espaço para a badge no mobile
                        )}>
                          {isPopular && (
                            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-uti-red text-white px-3 py-1.5 text-xs sm:text-sm font-semibold shadow-md z-20">
                              Mais Popular
                            </Badge>
                          )}
                          
                          <CardHeader className="text-center pt-6 md:pt-8 pb-3 md:pb-4">
                            <CardTitle className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">{plan.name}</CardTitle>
                            <CardDescription className="text-white/70 text-xs sm:text-sm min-h-[30px] md:min-h-[40px]">{plan.description}</CardDescription>
                            <div className="mt-4 md:mt-6">
                              <span className="text-3xl md:text-4xl font-extrabold text-uti-red">
                                {formatPrice(plan.price)}
                              </span>
                              <div className="text-xs sm:text-sm text-white/60 mt-1">
                                Equivalente a {formatPrice(monthlyPrice)}/mês
                              </div>
                            </div>
                          </CardHeader>

                          <CardContent className="flex-grow flex flex-col justify-between pt-0 pb-6 md:pb-8 px-4 md:px-6">
                            <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8 text-left text-white/80 text-sm md:text-base">
                              {[ 
                                  '10% de desconto em tudo',
                                  'Ofertas exclusivas para membros',
                                  'Acesso prioritário a novidades',
                                  'Suporte premium via WhatsApp'
                              ].map((feature, i) => (
                                  <li key={i} className="flex items-center gap-2 md:gap-3">
                                  <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0" />
                                  <span>{feature}</span>
                                  </li>
                              ))}
                            </ul>

                            <Button
                              onClick={() => handleSubscribe(plan.id)}
                              disabled={processingPlan === plan.id}
                              size="lg"
                              className={cn(
                                "w-full font-bold text-base md:text-lg py-2.5 md:py-3 rounded-lg transition-all duration-300", // Adjusted padding
                                isPopular 
                                  ? 'bg-uti-red text-white hover:bg-uti-red/90 shadow-lg'
                                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/30'
                              )}
                            >
                              {processingPlan === plan.id ? (
                                <span className="flex items-center justify-center gap-2">
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                  Processando...
                                </span>
                              ) : 'Assinar Agora'}
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
              {/* Grid Layout for Desktop */}
              <motion.div 
                className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-stretch"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
              >
                 {plans.map((plan) => {
                    const isPopular = plan.duration_months === 6;
                    const monthlyPrice = calculateMonthlyPrice(plan.price, plan.duration_months);
                    
                    return (
                      <motion.div key={plan.id} variants={fadeInUp} className={cn(isPopular ? "lg:scale-105 lg:z-10" : "")}>
                        <Card className={cn(
                          "relative bg-gray-800/60 border border-gray-700 shadow-xl h-full flex flex-col transition-all duration-300",
                          isPopular ? 'border-uti-red ring-2 ring-uti-red' : 'hover:border-uti-red/70 hover:bg-gray-800/80'
                        )}>
                          {isPopular && (
                            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-uti-red text-white px-4 py-1 text-sm font-semibold">
                              Mais Popular
                            </Badge>
                          )}
                          
                          <CardHeader className="text-center pt-8 pb-4">
                            <CardTitle className="text-2xl font-bold text-white mb-2">{plan.name}</CardTitle>
                            <CardDescription className="text-white/70 min-h-[40px]">{plan.description}</CardDescription>
                            <div className="mt-6">
                              <span className="text-4xl font-extrabold text-uti-red">
                                {formatPrice(plan.price)}
                              </span>
                              <div className="text-sm text-white/60 mt-1">
                                Equivalente a {formatPrice(monthlyPrice)}/mês
                              </div>
                            </div>
                          </CardHeader>

                          <CardContent className="flex-grow flex flex-col justify-between pt-0 pb-8 px-6">
                            <ul className="space-y-3 mb-8 text-left text-white/80">
                                {[ 
                                  '10% de desconto em tudo',
                                  'Ofertas exclusivas para membros',
                                  'Acesso prioritário a novidades',
                                  'Suporte premium via WhatsApp'
                                ].map((feature, i) => (
                                  <li key={i} className="flex items-center gap-3">
                                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                  <span>{feature}</span>
                                  </li>
                              ))}
                            </ul>

                            <Button
                              onClick={() => handleSubscribe(plan.id)}
                              disabled={processingPlan === plan.id}
                              size="lg"
                              className={cn(
                                "w-full font-bold text-lg py-3 rounded-lg transition-all duration-300",
                                isPopular 
                                  ? 'bg-uti-red text-white hover:bg-uti-red/90 shadow-lg'
                                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/30'
                              )}
                            >
                               {processingPlan === plan.id ? (
                                <span className="flex items-center justify-center gap-2">
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                  Processando...
                                </span>
                              ) : 'Assinar Agora'}
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
              </motion.div>
            </div>
          </section>
        )}

        {/* Subscription Management Section */}
        {hasActiveSubscription() && usuario && (
          <section className="py-12 md:py-20 bg-gray-900">
            <div className="container-professional max-w-2xl mx-auto">
              <motion.h2 
                className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-white"
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5 }}
              >
                Sua Assinatura UTI PRO
              </motion.h2>
              <motion.div 
                className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 md:p-8 shadow-lg"
                initial={{ opacity: 0, scale: 0.95 }} 
                whileInView={{ opacity: 1, scale: 1 }} 
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-4">
                  <p className="text-sm text-white/60">Plano Atual</p>
                  <p className="text-lg font-semibold text-white">{usuario.plano || 'UTI PRO'}</p>
                </div>
                <div className="mb-6">
                  <p className="text-sm text-white/60">Status</p>
                  <p className={cn(
                      "text-lg font-semibold",
                      usuario.status_assinatura === 'Ativo' ? 'text-green-400' : 'text-yellow-400'
                    )}
                  >
                    {usuario.status_assinatura === 'Ativo' ? 'Ativa' : 'Pendente'}
                  </p>
                </div>
                <Button 
                  onClick={handleCancel}
                  variant="outline"
                  className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                  Cancelar Assinatura
                </Button>
              </motion.div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <section className="py-12 md:py-24 bg-black">
          <div className="container-professional max-w-3xl mx-auto">
            <motion.h2 
              className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-white"
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
            >
              Perguntas Frequentes
            </motion.h2>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              <Accordion type="single" collapsible className="w-full space-y-3">
                {[ 
                  { q: "Como funciona o desconto?", a: "O desconto de 10% é aplicado automaticamente em todos os produtos da loja ao finalizar a compra, desde que sua assinatura UTI PRO esteja ativa." },
                  { q: "Posso cancelar a qualquer momento?", a: "Sim, você pode cancelar sua assinatura UTI PRO a qualquer momento através do painel de gerenciamento. O acesso aos benefícios continuará até o final do período já pago." },
                  { q: "O que são as ofertas exclusivas?", a: "São promoções especiais em produtos selecionados, disponíveis apenas para membros UTI PRO. Fique atento aos nossos emails e notificações!" },
                  { q: "Como funciona o acesso prioritário?", a: "Membros UTI PRO recebem notificações antecipadas sobre pré-vendas e lançamentos, garantindo a chance de comprar antes do público geral." },
                ].map((faq, index) => (
                  <motion.div key={index} variants={fadeInUp}>
                    <AccordionItem value={`item-${index}`} className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 md:px-6 transition-colors hover:bg-gray-800/80">
                      <AccordionTrigger className="text-left text-base md:text-lg font-medium text-white hover:no-underline py-4">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-white/70 pt-1 pb-4 text-sm md:text-base">
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

      {/* Fixed: Added isOpen prop to AuthModal */}
      {showAuthModal && <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />} 
    </div>
  );
};

export default UTIPro;
