import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Wrench, Clock, BadgeCheck, Play, ArrowRight, Gamepad2, Monitor, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SubscriptionWizard from '@/components/UTICare/SubscriptionWizard';
import PlanCard from '@/components/UTICare/PlanCard';

const benefits = [
  {
    icon: Shield,
    title: 'Proteção Total',
    description: 'Cobertura completa para reparos e manutenções do seu equipamento.'
  },
  {
    icon: Wrench,
    title: 'Manutenção Preventiva',
    description: 'Limpeza e manutenção periódica para evitar problemas futuros.'
  },
  {
    icon: Clock,
    title: 'Atendimento Prioritário',
    description: 'Seu equipamento entra na frente da fila quando precisar de reparo.'
  },
  {
    icon: BadgeCheck,
    title: 'Economia Garantida',
    description: 'Economize até 70% comparado a reparos avulsos ou comprar novo.'
  }
];

const plans = [
  {
    id: 'controle',
    name: 'UTI Care Controle',
    price: 19.90,
    description: 'Proteção para seus controles',
    features: [
      '1 controle coberto',
      'Reparos ilimitados',
      'Manutenção preventiva',
      'Atendimento prioritário'
    ],
    icon: Gamepad2,
    popular: false,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'console',
    name: 'UTI Care Console',
    price: 39.90,
    description: 'Proteção para seu console',
    features: [
      '1 console coberto',
      'Reparos ilimitados',
      'Limpeza profunda inclusa',
      'Troca de pasta térmica',
      'Atendimento VIP'
    ],
    icon: Monitor,
    popular: false,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'gamer-pro',
    name: 'UTI Care Gamer Pro',
    price: 54.90,
    description: 'Proteção completa para gamers',
    features: [
      '1 console coberto',
      '1 controle coberto',
      'Reparos ilimitados',
      'Manutenção preventiva',
      'Limpeza profunda',
      'Atendimento VIP prioritário',
      'Controles extras: +R$ 15,90/un'
    ],
    icon: Headphones,
    popular: true,
    color: 'from-primary to-purple-600'
  }
];

const UTICare: React.FC = () => {
  const [showWizard, setShowWizard] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setShowWizard(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Novo Serviço</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="text-foreground">UTI Care</span>
                <br />
                <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                  Proteção Total para seu Console
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Assine e tenha cobertura completa para manutenção e reparo do seu console e controles. 
                Economize até 70% comparado a reparos avulsos.
              </p>

              <Button 
                size="lg" 
                className="gap-2 text-lg px-8 py-6"
                onClick={() => setShowWizard(true)}
              >
                Assinar Agora
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>

            {/* Video placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-12"
            >
              <div className="relative aspect-video max-w-3xl mx-auto rounded-2xl overflow-hidden bg-card border border-border shadow-2xl">
                {/* Placeholder for video - replace with actual YouTube embed */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-purple-500/20">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-primary transition-colors hover:scale-110 transform duration-200">
                      <Play className="w-8 h-8 text-primary-foreground ml-1" />
                    </div>
                    <p className="text-muted-foreground">Vídeo explicativo em breve</p>
                  </div>
                </div>
                {/* 
                  Para adicionar vídeo do YouTube, substitua o placeholder acima por:
                  <iframe
                    src="https://www.youtube.com/embed/VIDEO_ID"
                    title="UTI Care - Como Funciona"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                */}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Por que escolher o <span className="text-primary">UTI Care</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Mais do que um serviço de reparo, é a tranquilidade de saber que seu equipamento está sempre protegido.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Escolha seu <span className="text-primary">Plano</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Planos flexíveis que cabem no seu bolso. Cancele quando quiser.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onSelect={() => handleSelectPlan(plan.id)}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Perguntas <span className="text-primary">Frequentes</span>
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: 'O que está coberto pelo UTI Care?',
                a: 'Todos os reparos de hardware do seu console e/ou controles, incluindo problemas de drift, botões, conectores, fonte, superaquecimento e mais.'
              },
              {
                q: 'Posso cancelar a qualquer momento?',
                a: 'Sim! Não há fidelidade. Você pode cancelar sua assinatura quando quiser, sem multas ou taxas.'
              },
              {
                q: 'Qual o tempo de atendimento?',
                a: 'Assinantes têm atendimento prioritário. O prazo médio de reparo é de 3 a 5 dias úteis, mas pode variar conforme o tipo de serviço.'
              },
              {
                q: 'O plano cobre danos por líquidos?',
                a: 'Danos por líquidos e quedas são cobertos com uma franquia reduzida. Consulte os termos completos.'
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl bg-card border border-border"
              >
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center p-8 md:p-12 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/30"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Proteja seu equipamento agora
            </h2>
            <p className="text-muted-foreground mb-6">
              Junte-se a centenas de gamers que já protegem seus consoles e controles com o UTI Care.
            </p>
            <Button 
              size="lg" 
              className="gap-2"
              onClick={() => setShowWizard(true)}
            >
              Começar Assinatura
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* Subscription Wizard Modal */}
      <SubscriptionWizard 
        isOpen={showWizard} 
        onClose={() => {
          setShowWizard(false);
          setSelectedPlan(null);
        }}
        initialPlan={selectedPlan}
      />
    </div>
  );
};

export default UTICare;
