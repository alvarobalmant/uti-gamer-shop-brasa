import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight, Check, Loader2, Monitor, Gamepad2, Headphones, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface SubscriptionWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

// Equipamentos do PDF com preços mensais
const equipmentCatalog = {
  consoles: [
    { id: 'ps5', name: 'PlayStation 5', price: 25, icon: '🎮' },
    { id: 'ps5-slim', name: 'PlayStation 5 Slim', price: 25, icon: '🎮' },
    { id: 'ps4', name: 'PlayStation 4', price: 25, icon: '🎮' },
    { id: 'ps4-slim', name: 'PlayStation 4 Slim', price: 25, icon: '🎮' },
    { id: 'ps4-pro', name: 'PlayStation 4 Pro', price: 25, icon: '🎮' },
    { id: 'xbox-series-x', name: 'Xbox Series X', price: 25, icon: '🎮' },
    { id: 'xbox-series-s', name: 'Xbox Series S', price: 25, icon: '🎮' },
    { id: 'xbox-one', name: 'Xbox One', price: 25, icon: '🎮' },
    { id: 'xbox-one-s', name: 'Xbox One S', price: 25, icon: '🎮' },
    { id: 'xbox-one-x', name: 'Xbox One X', price: 25, icon: '🎮' },
    { id: 'nintendo-switch', name: 'Nintendo Switch', price: 25, icon: '🎮' },
    { id: 'nintendo-switch-lite', name: 'Nintendo Switch Lite', price: 25, icon: '🎮' },
    { id: 'nintendo-switch-oled', name: 'Nintendo Switch OLED', price: 25, icon: '🎮' },
  ],
  controllers: [
    { id: 'dualsense', name: 'DualSense (PS5)', price: 8, icon: '🕹️' },
    { id: 'dualsense-edge', name: 'DualSense Edge (PS5)', price: 8, icon: '🕹️' },
    { id: 'dualshock4', name: 'DualShock 4 (PS4)', price: 8, icon: '🕹️' },
    { id: 'xbox-series-controller', name: 'Controle Xbox Series', price: 8, icon: '🕹️' },
    { id: 'xbox-elite', name: 'Xbox Elite Controller', price: 8, icon: '🕹️' },
    { id: 'xbox-one-controller', name: 'Controle Xbox One', price: 8, icon: '🕹️' },
    { id: 'joy-con', name: 'Joy-Con (Par)', price: 8, icon: '🕹️' },
    { id: 'pro-controller', name: 'Pro Controller (Switch)', price: 8, icon: '🕹️' },
    { id: 'scuf', name: 'SCUF Controller', price: 8, icon: '🕹️' },
  ],
  headsets: [
    { id: 'pulse-3d', name: 'Pulse 3D (PS5)', price: 10, icon: '🎧' },
    { id: 'pulse-elite', name: 'Pulse Elite (PS5)', price: 10, icon: '🎧' },
    { id: 'gold-wireless', name: 'Gold Wireless (PS4)', price: 10, icon: '🎧' },
    { id: 'xbox-wireless-headset', name: 'Xbox Wireless Headset', price: 10, icon: '🎧' },
    { id: 'astro-a50', name: 'Astro A50', price: 10, icon: '🎧' },
    { id: 'steelseries-arctis', name: 'SteelSeries Arctis', price: 10, icon: '🎧' },
    { id: 'hyperx-cloud', name: 'HyperX Cloud', price: 10, icon: '🎧' },
    { id: 'razer-kraken', name: 'Razer Kraken', price: 10, icon: '🎧' },
  ]
};

interface SelectedItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: 'console' | 'controller' | 'headset';
}

interface CustomerInfo {
  name: string;
  whatsapp: string;
  email: string;
}

const steps = ['Equipamentos', 'Resumo', 'Contato'];

const SubscriptionWizard: React.FC<SubscriptionWizardProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    whatsapp: '',
    email: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setSelectedItems([]);
      setCustomerInfo({ name: '', whatsapp: '', email: '' });
    }
  }, [isOpen]);

  const calculateTotal = () => {
    return selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const toggleItem = (item: { id: string; name: string; price: number }, category: 'console' | 'controller' | 'headset') => {
    const existing = selectedItems.find(i => i.id === item.id);
    
    if (existing) {
      setSelectedItems(selectedItems.filter(i => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, { ...item, quantity: 1, category }]);
    }
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setSelectedItems(selectedItems.map(item => {
      if (item.id === itemId) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const isSelected = (itemId: string) => selectedItems.some(i => i.id === itemId);

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return selectedItems.length > 0;
      case 1:
        return true;
      case 2:
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
    if (!canProceed()) return;

    setSubmitting(true);

    try {
      const consolesText = selectedItems
        .filter(i => i.category === 'console')
        .map(i => `${i.name} (${i.quantity}x)`)
        .join(', ');
      
      const controllersText = selectedItems
        .filter(i => i.category === 'controller')
        .map(i => `${i.name} (${i.quantity}x)`)
        .join(', ');
      
      const headsetsText = selectedItems
        .filter(i => i.category === 'headset')
        .map(i => `${i.name} (${i.quantity}x)`)
        .join(', ');

      const message = encodeURIComponent(
        `🎮 *Nova Assinatura UTI Care*\n\n` +
        `*Valor Mensal:* R$ ${calculateTotal().toFixed(2).replace('.', ',')}\n\n` +
        `*Equipamentos:*\n` +
        (consolesText ? `Consoles: ${consolesText}\n` : '') +
        (controllersText ? `Controles: ${controllersText}\n` : '') +
        (headsetsText ? `Headsets: ${headsetsText}\n` : '') +
        `\n*Cliente:*\n` +
        `Nome: ${customerInfo.name}\n` +
        `WhatsApp: ${customerInfo.whatsapp}\n` +
        `Email: ${customerInfo.email}`
      );

      const whatsappUrl = `https://wa.me/5511999999999?text=${message}`;
      window.open(whatsappUrl, '_blank');

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
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">Monte seu Plano UTI Care</h2>
                <p className="text-muted-foreground">Selecione os equipamentos que deseja proteger</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Running Total */}
            <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between">
              <span className="font-medium">Valor mensal:</span>
              <span className="text-2xl font-bold text-primary">
                R$ {calculateTotal().toFixed(2).replace('.', ',')}
              </span>
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
                {/* Step 1: Equipment Selection */}
                {currentStep === 0 && (
                  <div className="space-y-8">
                    {/* Consoles */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-semibold">Consoles</h3>
                        <span className="text-sm text-muted-foreground">R$ 25,00/mês cada</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {equipmentCatalog.consoles.map((item) => {
                          const selected = isSelected(item.id);
                          const selectedItem = selectedItems.find(i => i.id === item.id);
                          
                          return (
                            <div
                              key={item.id}
                              className={cn(
                                "p-3 rounded-lg border transition-all",
                                selected
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50 cursor-pointer"
                              )}
                              onClick={() => !selected && toggleItem(item, 'console')}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">{item.icon}</span>
                                  <span className="font-medium text-sm">{item.name}</span>
                                </div>
                                {selected ? (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-destructive hover:text-destructive"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleItem(item, 'console');
                                    }}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                ) : (
                                  <Plus className="w-4 h-4 text-muted-foreground" />
                                )}
                              </div>
                              {selected && selectedItem && (
                                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border">
                                  <span className="text-xs text-muted-foreground">Quantidade:</span>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateQuantity(item.id, -1);
                                      }}
                                      disabled={selectedItem.quantity <= 1}
                                    >
                                      <Minus className="w-3 h-3" />
                                    </Button>
                                    <span className="w-6 text-center text-sm font-medium">
                                      {selectedItem.quantity}
                                    </span>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateQuantity(item.id, 1);
                                      }}
                                    >
                                      <Plus className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Controllers */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Gamepad2 className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-semibold">Controles</h3>
                        <span className="text-sm text-muted-foreground">R$ 8,00/mês cada</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {equipmentCatalog.controllers.map((item) => {
                          const selected = isSelected(item.id);
                          const selectedItem = selectedItems.find(i => i.id === item.id);
                          
                          return (
                            <div
                              key={item.id}
                              className={cn(
                                "p-3 rounded-lg border transition-all",
                                selected
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50 cursor-pointer"
                              )}
                              onClick={() => !selected && toggleItem(item, 'controller')}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">{item.icon}</span>
                                  <span className="font-medium text-sm">{item.name}</span>
                                </div>
                                {selected ? (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-destructive hover:text-destructive"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleItem(item, 'controller');
                                    }}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                ) : (
                                  <Plus className="w-4 h-4 text-muted-foreground" />
                                )}
                              </div>
                              {selected && selectedItem && (
                                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border">
                                  <span className="text-xs text-muted-foreground">Quantidade:</span>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateQuantity(item.id, -1);
                                      }}
                                      disabled={selectedItem.quantity <= 1}
                                    >
                                      <Minus className="w-3 h-3" />
                                    </Button>
                                    <span className="w-6 text-center text-sm font-medium">
                                      {selectedItem.quantity}
                                    </span>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateQuantity(item.id, 1);
                                      }}
                                    >
                                      <Plus className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Headsets */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Headphones className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-semibold">Headsets</h3>
                        <span className="text-sm text-muted-foreground">R$ 10,00/mês cada</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {equipmentCatalog.headsets.map((item) => {
                          const selected = isSelected(item.id);
                          const selectedItem = selectedItems.find(i => i.id === item.id);
                          
                          return (
                            <div
                              key={item.id}
                              className={cn(
                                "p-3 rounded-lg border transition-all",
                                selected
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50 cursor-pointer"
                              )}
                              onClick={() => !selected && toggleItem(item, 'headset')}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">{item.icon}</span>
                                  <span className="font-medium text-sm">{item.name}</span>
                                </div>
                                {selected ? (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-destructive hover:text-destructive"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleItem(item, 'headset');
                                    }}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                ) : (
                                  <Plus className="w-4 h-4 text-muted-foreground" />
                                )}
                              </div>
                              {selected && selectedItem && (
                                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border">
                                  <span className="text-xs text-muted-foreground">Quantidade:</span>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateQuantity(item.id, -1);
                                      }}
                                      disabled={selectedItem.quantity <= 1}
                                    >
                                      <Minus className="w-3 h-3" />
                                    </Button>
                                    <span className="w-6 text-center text-sm font-medium">
                                      {selectedItem.quantity}
                                    </span>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateQuantity(item.id, 1);
                                      }}
                                    >
                                      <Plus className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Summary */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Resumo da Assinatura</h3>

                    <div className="space-y-4">
                      {selectedItems.filter(i => i.category === 'console').length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium flex items-center gap-2">
                            <Monitor className="w-4 h-4" /> Consoles
                          </h4>
                          {selectedItems.filter(i => i.category === 'console').map(item => (
                            <div key={item.id} className="flex justify-between p-3 rounded-lg bg-card border border-border">
                              <span>{item.name} × {item.quantity}</span>
                              <span className="font-medium">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {selectedItems.filter(i => i.category === 'controller').length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium flex items-center gap-2">
                            <Gamepad2 className="w-4 h-4" /> Controles
                          </h4>
                          {selectedItems.filter(i => i.category === 'controller').map(item => (
                            <div key={item.id} className="flex justify-between p-3 rounded-lg bg-card border border-border">
                              <span>{item.name} × {item.quantity}</span>
                              <span className="font-medium">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {selectedItems.filter(i => i.category === 'headset').length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium flex items-center gap-2">
                            <Headphones className="w-4 h-4" /> Headsets
                          </h4>
                          {selectedItems.filter(i => i.category === 'headset').map(item => (
                            <div key={item.id} className="flex justify-between p-3 rounded-lg bg-card border border-border">
                              <span>{item.name} × {item.quantity}</span>
                              <span className="font-medium">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total Mensal</span>
                        <span className="text-2xl font-bold text-primary">
                          R$ {calculateTotal().toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <h4 className="font-medium mb-3">O que está incluso:</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-primary" /> Reparos ilimitados
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-primary" /> Manutenção preventiva
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-primary" /> Atendimento prioritário
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-primary" /> Sem fidelidade - cancele quando quiser
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Step 3: Contact Info */}
                {currentStep === 2 && (
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
