import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight, Check, Gamepad2, Monitor, Headphones, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import EquipmentSelector from './EquipmentSelector';
import PriceSummary from './PriceSummary';

interface SubscriptionWizardProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlan?: string | null;
}

interface Product {
  id: string;
  descricao: string;
  foto: string | null;
  platform: string | null;
  grupo: string | null;
}

interface SelectedEquipment {
  console?: Product | null;
  controllers: { product: Product; quantity: number }[];
}

interface CustomerInfo {
  name: string;
  whatsapp: string;
  email: string;
}

const plans = [
  {
    id: 'controle',
    name: 'UTI Care Controle',
    basePrice: 19.90,
    description: 'Proteção para controles',
    icon: Gamepad2,
    color: 'from-blue-500 to-blue-600',
    includesConsole: false,
    includesController: true,
    maxControllers: 4
  },
  {
    id: 'console',
    name: 'UTI Care Console',
    basePrice: 39.90,
    description: 'Proteção para console',
    icon: Monitor,
    color: 'from-purple-500 to-purple-600',
    includesConsole: true,
    includesController: false,
    maxControllers: 0
  },
  {
    id: 'gamer-pro',
    name: 'UTI Care Gamer Pro',
    basePrice: 54.90,
    description: 'Console + Controle',
    icon: Headphones,
    color: 'from-primary to-purple-600',
    includesConsole: true,
    includesController: true,
    maxControllers: 4,
    extraControllerPrice: 15.90
  }
];

const steps = ['Plano', 'Equipamentos', 'Resumo', 'Contato'];

const SubscriptionWizard: React.FC<SubscriptionWizardProps> = ({ isOpen, onClose, initialPlan }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(initialPlan || null);
  const [selectedEquipment, setSelectedEquipment] = useState<SelectedEquipment>({
    console: null,
    controllers: []
  });
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    whatsapp: '',
    email: ''
  });
  const [products, setProducts] = useState<{ consoles: Product[]; controllers: Product[] }>({
    consoles: [],
    controllers: []
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const selectedPlan = plans.find(p => p.id === selectedPlanId);

  // Load products from database
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const { data: allProducts, error } = await supabase
          .from('integra_products')
          .select('id, descricao, foto, platform, grupo')
          .eq('is_active', true)
          .in('grupo', ['Consoles', 'Controles']);

        if (error) throw error;

        const consoles = allProducts?.filter(p => p.grupo === 'Consoles') || [];
        const controllers = allProducts?.filter(p => p.grupo === 'Controles') || [];

        setProducts({ consoles, controllers });
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadProducts();
    }
  }, [isOpen]);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      if (initialPlan) {
        setSelectedPlanId(initialPlan);
        setCurrentStep(1);
      } else {
        setCurrentStep(0);
      }
      setSelectedEquipment({ console: null, controllers: [] });
      setCustomerInfo({ name: '', whatsapp: '', email: '' });
    }
  }, [isOpen, initialPlan]);

  const calculatePrice = () => {
    if (!selectedPlan) return 0;

    let total = selectedPlan.basePrice;

    if (selectedPlan.id === 'controle') {
      // R$ 19,90 per controller
      const totalControllers = selectedEquipment.controllers.reduce((sum, c) => sum + c.quantity, 0);
      total = selectedPlan.basePrice * Math.max(1, totalControllers);
    } else if (selectedPlan.id === 'gamer-pro') {
      // Base includes 1 console + 1 controller, extras are +R$ 15,90 each
      const totalControllers = selectedEquipment.controllers.reduce((sum, c) => sum + c.quantity, 0);
      const extraControllers = Math.max(0, totalControllers - 1);
      total = selectedPlan.basePrice + (extraControllers * (selectedPlan.extraControllerPrice || 0));
    }

    return total;
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return !!selectedPlanId;
      case 1:
        if (!selectedPlan) return false;
        if (selectedPlan.includesConsole && !selectedEquipment.console) return false;
        if (selectedPlan.includesController && selectedEquipment.controllers.length === 0) return false;
        return true;
      case 2:
        return true;
      case 3:
        return customerInfo.name.trim() && customerInfo.whatsapp.trim() && customerInfo.email.trim();
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1 && canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!selectedPlan || !canProceed()) return;

    setSubmitting(true);

    try {
      // Build WhatsApp message
      const controllersText = selectedEquipment.controllers
        .map(c => `${c.product.descricao} (${c.quantity}x)`)
        .join(', ');

      const message = encodeURIComponent(
        `🎮 *Nova Assinatura UTI Care*\n\n` +
        `*Plano:* ${selectedPlan.name}\n` +
        `*Valor Mensal:* R$ ${calculatePrice().toFixed(2).replace('.', ',')}\n\n` +
        `*Equipamentos:*\n` +
        (selectedEquipment.console ? `Console: ${selectedEquipment.console.descricao}\n` : '') +
        (controllersText ? `Controles: ${controllersText}\n` : '') +
        `\n*Cliente:*\n` +
        `Nome: ${customerInfo.name}\n` +
        `WhatsApp: ${customerInfo.whatsapp}\n` +
        `Email: ${customerInfo.email}`
      );

      // Open WhatsApp with the message
      const whatsappUrl = `https://wa.me/5511999999999?text=${message}`;
      window.open(whatsappUrl, '_blank');

      // Close wizard
      onClose();
    } catch (error) {
      console.error('Error submitting:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto"
      >
        <div className="min-h-screen py-8 px-4">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Assinar UTI Care</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              {steps.map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    index <= currentStep 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  )}>
                    {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                  </div>
                  <span className={cn(
                    "ml-2 text-sm hidden sm:block",
                    index <= currentStep ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {step}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "w-8 sm:w-16 h-0.5 mx-2",
                      index < currentStep ? "bg-primary" : "bg-muted"
                    )} />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="min-h-[400px]"
              >
                {/* Step 1: Select Plan */}
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold mb-6">Escolha seu plano</h3>
                    <div className="grid gap-4">
                      {plans.map((plan) => {
                        const Icon = plan.icon;
                        return (
                          <div
                            key={plan.id}
                            onClick={() => setSelectedPlanId(plan.id)}
                            className={cn(
                              "p-4 rounded-xl border cursor-pointer transition-all",
                              selectedPlanId === plan.id
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            <div className="flex items-center gap-4">
                              <div className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br",
                                plan.color
                              )}>
                                <Icon className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold">{plan.name}</h4>
                                <p className="text-sm text-muted-foreground">{plan.description}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold">
                                  R$ {plan.basePrice.toFixed(2).replace('.', ',')}
                                </div>
                                <div className="text-xs text-muted-foreground">/mês</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 2: Select Equipment */}
                {currentStep === 1 && (
                  <EquipmentSelector
                    plan={selectedPlan!}
                    products={products}
                    selectedEquipment={selectedEquipment}
                    onEquipmentChange={setSelectedEquipment}
                    loading={loading}
                  />
                )}

                {/* Step 3: Summary */}
                {currentStep === 2 && (
                  <PriceSummary
                    plan={selectedPlan!}
                    selectedEquipment={selectedEquipment}
                    monthlyPrice={calculatePrice()}
                  />
                )}

                {/* Step 4: Contact Info */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-6">Seus dados</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nome completo</Label>
                        <Input
                          id="name"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                          placeholder="Seu nome"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="whatsapp">WhatsApp</Label>
                        <Input
                          id="whatsapp"
                          value={customerInfo.whatsapp}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, whatsapp: e.target.value })}
                          placeholder="(11) 99999-9999"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                          id="email"
                          type="email"
                          value={customerInfo.email}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                          placeholder="seu@email.com"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <p className="text-sm text-muted-foreground">
                        Ao continuar, você será redirecionado para o WhatsApp para finalizar sua assinatura.
                        Em breve teremos pagamento online integrado.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={currentStep === 0 ? onClose : handleBack}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {currentStep === 0 ? 'Cancelar' : 'Voltar'}
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="gap-2"
                >
                  Continuar
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed() || submitting}
                  className="gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Finalizar Assinatura
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SubscriptionWizard;
