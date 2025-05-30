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
import { ArrowLeft, Check, Crown, Star, Zap, Shield, Gift, ChevronDown, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion'; // Import Accordion

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
  hidden: { opacity: 1 }, // Container itself is visible
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Stagger delay between children
    },
  },
};

const UTIPro = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { plans, userSubscription, loading, createSubscription, cancelSubscription, hasActiveSubscription } = useSubscriptions();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  useScrollPosition(); // Setup scroll restoration

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setProcessingPlan(planId);
    const success = await createSubscription(planId);
    // Keep processing state for a bit even on success for visual feedback
    setTimeout(() => {
        setProcessingPlan(null);
        if (!success) {
             // Handle error display if needed (e.g., toast)
             console.error("Subscription failed");
        }
    }, 1500); 
  };

  const handleCancel = async () => {
    // Add confirmation dialog here if desired
    const success = await cancelSubscription();
    if (success) {
      // Optionally navigate or show success message
    }
  };

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  const calculateMonthlyPrice = (price: number, months: number) => {
    return price / months;
  };

  // --- Loading State --- 
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
        {/* Back Button - Positioned absolutely or within a container */}
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

        {/* Hero Section - Game Pass Inspired */}
        <motion.section 
          className="relative h-[70vh] md:h-[80vh] flex items-center justify-center text-center overflow-hidden bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url('/lovable-uploads/uti-pro-hero-bg.jpg')` }} // Replace with actual UTI PRO bg
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >
          <div className="relative z-10 p-4">
            <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
              <Crown className="w-16 h-16 md:w-20 md:w-20 text-yellow-400 mx-auto mb-4 drop-shadow-lg" />
            </motion.div>
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 drop-shadow-lg uppercase tracking-tight"
              variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.4 }}
            >
              UTI PRO
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl lg:text-2xl text-white/80 mb-8 max-w-2xl mx-auto drop-shadow-md"
              variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.6 }}
            >
              Desbloqueie descontos exclusivos, acesso prioritário e vantagens premium em toda a loja.
            </motion.p>
            {!hasActiveSubscription() && (
              <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.8 }}>
                <Button 
                  size="lg"
                  className="bg-uti-red text-white hover:bg-uti-red/90 font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8 py-3 text-lg rounded-full"
                  onClick={() => document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Ver Planos
                </Button>
              </motion.div>
            )}
            {hasActiveSubscription() && (
                <motion.div 
                    className="bg-green-600/80 backdrop-blur-sm border border-green-400 rounded-lg p-4 mt-6 max-w-md mx-auto shadow-lg"
                    variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.8 }}
                >
                  <div className="flex items-center justify-center gap-2 text-white">
                    <Check className="w-6 h-6" />
                    <span className="font-bold text-lg">Você já é membro UTI PRO!</span>
                  </div>
                  <p className="text-green-100 text-sm mt-1">
                    Aproveite seus benefícios!
                  </p>
                </motion.div>
            )}
          </div>
        </motion.section>

        {/* Benefits Section - Animated Cards */}
        <section className="py-16 md:py-24 bg-uti-dark">
          <div className="container-professional">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-white"
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
            >
              Vantagens Exclusivas
            </motion.h2>
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {[ // Define benefits data here
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

        {/* Pricing Plans Section - Only show if not subscribed */}
        {!hasActiveSubscription() && (
          <section id="planos" className="py-16 md:py-24 bg-gradient-to-b from-black via-uti-dark to-black">
            <div className="container-professional">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold text-center mb-12 text-white"
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5 }}
              >
                Escolha seu Plano UTI PRO
              </motion.h2>
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                {plans.map((plan) => {
                  const isPopular = plan.duration_months === 6; // Example: Highlight 6-month plan
                  const monthlyPrice = calculateMonthlyPrice(plan.price, plan.duration_months);
                  
                  return (
                    <motion.div key={plan.id} variants={fadeInUp}>
                      <Card className={cn(
                        "relative bg-gray-800/60 border border-gray-700 shadow-xl h-full flex flex-col transition-all duration-300",
                        isPopular ? 'border-uti-red ring-2 ring-uti-red scale-105 z-10' : 'hover:border-gray-500'
                      )}>
                        {isPopular && (
                          <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-uti-red text-white px-3 py-1 text-sm font-semibold">
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
                            {[ // Define features consistently
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
                              "w-full font-bold text-lg py-3 rounded-lg transition-all duration-300 transform hover:scale-105",
                              isPopular 
                                ? 'bg-uti-red text-white hover:bg-uti-red/90 shadow-lg hover:shadow-xl'
                                : 'bg-white/10 text-white hover:bg-white/20 border border-white/30'
                            )}
                          >
                            {processingPlan === plan.id ? (
                              <span className="flex items-center justify-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processando...
                              </span>
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
          </section>
        )}

        {/* Current Subscription Management Section - Only show if subscribed */}
        {hasActiveSubscription() && userSubscription && (
          <section className="py-16 md:py-24 bg-uti-dark">
            <div className="container-professional max-w-2xl mx-auto">
              <motion.div 
                variants={fadeInUp} 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true, amount: 0.5 }}
              >
                <Card className="bg-gray-800/50 border border-green-500/50 shadow-lg">
                  <CardHeader className="text-center pb-4">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <Shield className="w-8 h-8 text-green-400" />
                      <CardTitle className="text-2xl font-bold text-white">Sua Assinatura UTI PRO</CardTitle>
                    </div>
                    <CardDescription className="text-green-300">
                      Você está aproveitando {userSubscription.discount_percentage}% de desconto!
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6 text-center">
                    <div>
                      <p className="text-lg font-semibold text-white">{userSubscription.plan_name}</p>
                      <p className="text-sm text-white/70">
                        Válido até: {new Date(userSubscription.end_date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    
                    <Button
                      onClick={handleCancel} // Add confirmation later if needed
                      variant="destructive"
                      size="lg"
                      className="w-full max-w-xs mx-auto bg-red-700/80 hover:bg-red-700 border border-red-600 text-white font-semibold"
                    >
                      Cancelar Assinatura
                    </Button>
                    <p className="text-xs text-white/50">Se cancelar, seus benefícios continuarão até a data de validade.</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </section>
        )}

        {/* FAQ Section - Accordion Style */}
        <section className="py-16 md:py-24 bg-black">
          <div className="container-professional max-w-3xl mx-auto">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-white"
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
              <Accordion type="single" collapsible className="w-full space-y-4">
                {[ // Define FAQ data here
                  {
                    q: 'Como funciona o desconto?',
                    a: 'O desconto de 10% é aplicado automaticamente no carrinho para todos os produtos da loja. Você verá o preço especial UTI PRO durante toda a navegação, sem precisar de cupons.',
                  },
                  {
                    q: 'Posso cancelar a qualquer momento?',
                    a: 'Sim! Você pode cancelar sua assinatura a qualquer momento diretamente nesta página. Seus benefícios continuarão ativos até o final do período que já foi pago.',
                  },
                  {
                    q: 'O que são as ofertas exclusivas?',
                    a: 'Periodicamente, membros UTI PRO recebem acesso a promoções especiais com descontos ainda maiores em produtos selecionados, além de acesso antecipado a pré-vendas.',
                  },
                   {
                    q: 'Como funciona o acesso prioritário?',
                    a: 'Membros UTI PRO são os primeiros a serem notificados sobre a chegada de novos produtos e lançamentos importantes em nossa loja.',
                  },
                ].map((faq, index) => (
                  <motion.div key={index} variants={fadeInUp}>
                    <AccordionItem value={`item-${index}`} className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
                      <AccordionTrigger className="text-left text-lg font-semibold px-6 py-4 text-white hover:no-underline hover:bg-gray-700/50 transition-colors">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4 pt-2 text-white/80 bg-gray-900/30">
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

