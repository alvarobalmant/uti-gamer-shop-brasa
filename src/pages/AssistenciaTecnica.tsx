import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from '@/components/Auth/AuthModal';
import Cart from '@/components/Cart';
import ProfessionalHeader from '@/components/Header/ProfessionalHeader';
import { useCart } from '@/contexts/CartContext';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Clock, 
  Star, 
  MapPin, 
  Phone, 
  CheckCircle, 
  ArrowRight,
  Gamepad2,
  Wrench,
  Calendar,
  Truck
} from 'lucide-react';

// Componente de Indicadores de Confiança
function TrustIndicators() {
  const indicators = [
    {
      icon: Shield,
      title: "10+ Anos de Tradição",
      description: "Referência consolidada em games na região de Colatina"
    },
    {
      icon: CheckCircle,
      title: "Garantia Total",
      description: "Produtos originais com garantia completa"
    },
    {
      icon: Clock,
      title: "Atendimento Rápido",
      description: "Diagnóstico gratuito e reparo no mesmo dia"
    },
    {
      icon: MapPin,
      title: "Localização Central",
      description: "R. Alexandre Calmon, 314 - Centro, Colatina - ES"
    }
  ];

  return (
    <section className="py-6 sm:py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">Por que escolher a UTI DOS GAMES?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {indicators.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-4 sm:pt-6 p-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Componente do Formulário Multi-Step
function AssistanceForm() {
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    consoleBrand: '',
    consoleModel: '',
    problemCategory: '',
    problemDescription: '',
    serviceType: '',
    urgency: '',
    logistics: '',
    name: '',
    whatsapp: '',
    email: '',
    address: ''
  });

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Mapear parâmetros URL para nomes de serviços
  const serviceParamMapping: Record<string, string> = {
    "manutencao-preventiva": "Manutenção Preventiva",
    "diagnostico-reparo": "Diagnóstico + Reparo",
    "avaliacao-venda": "Avaliação para Venda"
  };

  // Efeito para seleção automática de serviço baseada em parâmetros URL
  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam && serviceParamMapping[serviceParam]) {
      const serviceName = serviceParamMapping[serviceParam];
      setFormData(prev => ({ ...prev, serviceType: serviceName }));
      
      // Scroll automático para a seção do formulário após um pequeno delay
      setTimeout(() => {
        const formSection = document.getElementById('assistance-form');
        if (formSection) {
          formSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 500);
    }
  }, [searchParams]);
  const isScrollingRef = useRef(false);

  // Debounced scroll reset to prevent conflicts
  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollContainerRef.current && !isScrollingRef.current) {
        scrollContainerRef.current.scrollTo({
          top: 0,
          behavior: 'instant'
        });
      }
    }, 50); // Small delay to prevent conflicts

    return () => clearTimeout(timer);
  }, [currentStep]);

  // Handle scroll events to prevent conflicts
  const handleScroll = () => {
    isScrollingRef.current = true;
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 150);
  };

  const consoleBrands = [
    { id: 'playstation', name: 'PlayStation', icon: '🎮' },
    { id: 'xbox', name: 'Xbox', icon: '🎯' },
    { id: 'nintendo', name: 'Nintendo', icon: '🕹️' },
    { id: 'pc', name: 'PC Gaming', icon: '💻' },
    { id: 'outros', name: 'Outros', icon: '🎲' }
  ];

  const consoleModels = {
    PlayStation: [
      { id: 'ps1-fat', name: 'PlayStation 1 Fat', description: 'Versão original (1995)' },
      { id: 'ps1-slim', name: 'PlayStation 1 Slim (PSone)', description: 'Versão compacta (2000)' },
      { id: 'ps2-fat', name: 'PlayStation 2 Fat', description: 'Versão original com HDD' },
      { id: 'ps2-slim', name: 'PlayStation 2 Slim', description: 'Versão compacta' },
      { id: 'ps3-fat', name: 'PlayStation 3 Fat', description: 'Versão original com retrocompatibilidade' },
      { id: 'ps3-slim', name: 'PlayStation 3 Slim', description: 'Versão compacta' },
      { id: 'ps3-super-slim', name: 'PlayStation 3 Super Slim', description: 'Versão mais leve' },
      { id: 'ps4-fat', name: 'PlayStation 4 Fat', description: 'Versão padrão original' },
      { id: 'ps4-slim', name: 'PlayStation 4 Slim', description: 'Versão mais compacta' },
      { id: 'ps4-pro', name: 'PlayStation 4 Pro', description: 'Versão premium com 4K' },
      { id: 'ps5-standard', name: 'PlayStation 5 Standard', description: 'Com leitor Blu-ray' },
      { id: 'ps5-digital', name: 'PlayStation 5 Digital', description: 'Apenas digital' }
    ],
    Xbox: [
      { id: 'xbox-fat', name: 'Xbox Original', description: 'Console original (2001)' },
      { id: 'xbox360-fat', name: 'Xbox 360 Fat', description: 'Versão original' },
      { id: 'xbox360-arcade', name: 'Xbox 360 Arcade', description: 'Versão sem HD' },
      { id: 'xbox360-pro', name: 'Xbox 360 Pro', description: 'Com HD de 20GB' },
      { id: 'xbox360-elite', name: 'Xbox 360 Elite', description: 'Versão premium' },
      { id: 'xbox360-slim', name: 'Xbox 360 Slim (S)', description: 'Redesign compacto' },
      { id: 'xbox360-e', name: 'Xbox 360 E', description: 'Versão final' },
      { id: 'xboxone-fat', name: 'Xbox One Fat', description: 'Versão original' },
      { id: 'xboxone-s', name: 'Xbox One S', description: 'Versão slim com 4K HDR' },
      { id: 'xboxone-x', name: 'Xbox One X', description: 'Versão premium 4K' },
      { id: 'xbox-series-x', name: 'Xbox Series X', description: 'Console premium atual' },
      { id: 'xbox-series-s', name: 'Xbox Series S', description: 'Console compacto digital' }
    ],
    Nintendo: [
      { id: 'nes', name: 'Nintendo NES', description: 'Console 8-bit clássico' },
      { id: 'snes-fat', name: 'Super Nintendo Fat', description: 'Versão original' },
      { id: 'snes-mini', name: 'Super Nintendo Mini', description: 'Versão compacta' },
      { id: 'n64', name: 'Nintendo 64', description: 'Console com analógico' },
      { id: 'gamecube', name: 'Nintendo GameCube', description: 'Console com discos mini' },
      { id: 'wii-fat', name: 'Nintendo Wii Fat', description: 'Com retrocompatibilidade GameCube' },
      { id: 'wii-mini', name: 'Nintendo Wii Mini', description: 'Versão compacta' },
      { id: 'wiiu-basic', name: 'Nintendo Wii U Basic', description: '8GB de armazenamento' },
      { id: 'wiiu-deluxe', name: 'Nintendo Wii U Deluxe', description: '32GB de armazenamento' },
      { id: 'switch-standard', name: 'Nintendo Switch', description: 'Versão híbrida padrão' },
      { id: 'switch-lite', name: 'Nintendo Switch Lite', description: 'Versão portátil apenas' },
      { id: 'switch-oled', name: 'Nintendo Switch OLED', description: 'Tela OLED maior' }
    ],
    'PC Gaming': [
      { id: 'desktop-gamer', name: 'PC Desktop Gamer', description: 'Computador de mesa' },
      { id: 'notebook-gamer', name: 'Notebook Gamer', description: 'Laptop para jogos' },
      { id: 'steam-deck', name: 'Steam Deck', description: 'Console portátil PC' },
      { id: 'rog-ally', name: 'ROG Ally', description: 'Console portátil ASUS' }
    ],
    Outros: [
      { id: 'atari-2600', name: 'Atari 2600', description: 'Console clássico' },
      { id: 'sega-genesis', name: 'Sega Genesis/Mega Drive', description: 'Console 16-bit' },
      { id: 'sega-dreamcast', name: 'Sega Dreamcast', description: 'Último console Sega' },
      { id: 'gameboy', name: 'Game Boy', description: 'Portátil clássico' },
      { id: 'gameboy-color', name: 'Game Boy Color', description: 'Versão colorida' },
      { id: 'gameboy-advance', name: 'Game Boy Advance', description: 'Versão 32-bit' },
      { id: 'nintendo-ds', name: 'Nintendo DS', description: 'Portátil duas telas' },
      { id: 'nintendo-3ds', name: 'Nintendo 3DS', description: 'Com 3D sem óculos' },
      { id: 'psp', name: 'PlayStation Portable (PSP)', description: 'Portátil Sony' },
      { id: 'ps-vita', name: 'PlayStation Vita', description: 'Sucessor do PSP' }
    ]
  };

  const problemCategories = [
    { id: 'nao-liga', name: 'Não liga', description: 'Console não responde ao ligar' },
    { id: 'erro-leitura', name: 'Erro de leitura', description: 'Problemas com jogos ou discos' },
    { id: 'superaquecimento', name: 'Superaquecimento', description: 'Console esquenta muito ou desliga' },
    { id: 'controle', name: 'Problemas no controle', description: 'Controle não funciona corretamente' },
    { id: 'outros', name: 'Outros problemas', description: 'Descreva seu problema específico' }
  ];

  const serviceTypes = [
    { 
      id: 'diagnostico-reparo', 
      name: 'Diagnóstico + Reparo', 
      description: 'Identificamos e corrigimos o problema',
      icon: Wrench,
      popular: true
    },
    { 
      id: 'manutencao-preventiva', 
      name: 'Manutenção Preventiva', 
      description: 'Limpeza, pasta térmica e cuidados gerais',
      icon: Shield
    },
    { 
      id: 'avaliacao-venda', 
      name: 'Avaliação para Venda', 
      description: 'Quer vender seu console? Fazemos avaliação',
      icon: Calendar
    }
  ];

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      // Scroll do card interno para o topo quando avançar etapa
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Scroll do card interno para o topo quando voltar etapa
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    }
  };

  const handleSubmit = () => {
    // Construir mensagem dinâmica baseada no tipo de serviço
    let message = `Olá! Gostaria de solicitar assistência técnica:

Console: ${formData.consoleModel}
Serviço: ${formData.serviceType}`;

    // Adicionar problema apenas se for Diagnóstico + Reparo
    if (formData.serviceType === 'Diagnóstico + Reparo' && formData.problemCategory) {
      message += `\nProblema: ${formData.problemCategory}`;
    }

    // Adicionar urgência apenas se for Diagnóstico + Reparo ou Manutenção Preventiva
    if ((formData.serviceType === 'Diagnóstico + Reparo' || formData.serviceType === 'Manutenção Preventiva') && formData.urgency) {
      message += `\nUrgência: ${formData.urgency === 'normal' ? 'Normal (3-5 dias)' : 'Express (24-48h)'}`;
    }

    message += `\nLogística: ${formData.logistics === 'levar-loja' ? 'Levar na loja' : 'Buscar em casa'}

Nome: ${formData.name}
WhatsApp: ${formData.whatsapp}
Email: ${formData.email}
${formData.address ? `Endereço: ${formData.address}` : ''}`;
    
    const whatsappUrl = `https://wa.me/5527999771112?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="assistance-form" className="py-4 px-4 min-h-screen">
      <div className="w-full max-w-4xl mx-auto">
        {/* Card adaptável para mobile */}
        <Card className="shadow-xl w-full min-h-[600px] flex flex-col transition-all duration-300">
          <CardHeader className="text-center px-3 sm:px-6 py-4 flex-shrink-0">
            <CardTitle className="text-lg sm:text-2xl font-bold">Solicite sua Assistência Técnica</CardTitle>
            <CardDescription className="text-sm">
              Preencha os dados abaixo e entraremos em contato rapidamente
            </CardDescription>
            
            {/* Progress bar mobile-first */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium">Etapa {currentStep} de {totalSteps}</span>
                <span className="text-xs text-gray-500">{Math.round(progress)}% concluído</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>

          <CardContent className="px-3 sm:px-6 flex-1 flex flex-col min-h-0">
            {/* Conteúdo mobile-optimized */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">

            {/* Etapa 1: Tipo de Serviço - Mobile First */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-semibold text-center">Que tipo de serviço você precisa?</h3>
                <div className="space-y-3">
                  {serviceTypes.map((service) => {
                    const Icon = service.icon;
                    return (
                      <div
                        key={service.id}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          formData.serviceType === service.name
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => {
                          setFormData({ ...formData, serviceType: service.name });
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-sm sm:text-lg">{service.name}</h4>
                              {service.popular && (
                                <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
                                  Popular
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600 text-xs sm:text-sm mt-1">{service.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Etapa 2: Marca e Modelo - Mobile Optimized */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-center">Qual é a marca do seu console?</h3>
                
                {/* Grid de marcas - Mobile First */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {consoleBrands.map((brand) => (
                    <Button
                      key={brand.id}
                      variant="outline"
                      className={`h-20 sm:h-24 flex flex-col items-center justify-center p-2 text-xs transition-all ${
                        formData.consoleBrand === brand.name 
                          ? 'ring-2 ring-red-500 border-red-500 text-red-600 bg-red-50' 
                          : 'hover:border-gray-400'
                      }`}
                      onClick={() => {
                        setFormData({ 
                          ...formData, 
                          consoleBrand: brand.name,
                          consoleModel: ''
                        });
                      }}
                    >
                      <span className="text-2xl mb-1">{brand.icon}</span>
                      <span className="font-semibold text-center leading-tight text-xs">{brand.name}</span>
                    </Button>
                  ))}
                </div>

                {/* Modelos - Lista mobile-friendly */}
                {formData.consoleBrand && consoleModels[formData.consoleBrand] && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-center">Qual modelo específico?</h3>
                    <div className="space-y-2">
                      {consoleModels[formData.consoleBrand].map((model) => (
                        <div
                          key={model.id}
                          className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                            formData.consoleModel === model.name 
                              ? 'border-red-500 bg-red-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => {
                            setFormData({ ...formData, consoleModel: model.name });
                          }}
                        >
                          <div className="text-sm font-semibold">{model.name}</div>
                          <div className="text-xs text-gray-600 mt-1">{model.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Etapa 3: Problemas - Mobile Lista */}
            {currentStep === 3 && formData.serviceType === 'Diagnóstico + Reparo' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center">Qual o problema?</h3>
                <div className="space-y-3">
                  {problemCategories.map((problem) => (
                    <div
                      key={problem.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        formData.problemCategory === problem.name 
                          ? 'border-red-500 bg-red-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        setFormData({ ...formData, problemCategory: problem.name });
                      }}
                    >
                      <div className="font-semibold text-sm">{problem.name}</div>
                      <div className="text-xs text-gray-600 mt-1">{problem.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Etapa 3: Skip automático para outros serviços */}
            {currentStep === 3 && formData.serviceType !== 'Diagnóstico + Reparo' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Serviço selecionado</h3>
                <p className="text-sm text-gray-600">{formData.serviceType}</p>
                <p className="text-xs text-gray-500 mt-2">Vamos prosseguir para as próximas etapas</p>
              </div>
            )}

            {/* Etapa 4: Urgência - Cards mobile */}
            {currentStep === 4 && formData.serviceType !== 'Avaliação para Venda' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center">Qual a urgência?</h3>
                <div className="space-y-3">
                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      formData.urgency === 'normal' 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setFormData({ ...formData, urgency: 'normal' })}
                  >
                    <div className="flex items-center space-x-3">
                      <Clock className="h-6 w-6 text-blue-600 flex-shrink-0" />
                      <div>
                        <div className="font-semibold">Normal</div>
                        <div className="text-sm text-gray-600">3-5 dias úteis</div>
                      </div>
                    </div>
                  </div>
                  
                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      formData.urgency === 'express' 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setFormData({ ...formData, urgency: 'express' })}
                  >
                    <div className="flex items-center space-x-3">
                      <Star className="h-6 w-6 text-yellow-600 flex-shrink-0" />
                      <div>
                        <div className="font-semibold">Express</div>
                        <div className="text-sm text-gray-600">24-48 horas</div>
                        <div className="text-xs text-orange-600 font-medium">Taxa adicional</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Etapa 4: Skip para Avaliação */}
            {currentStep === 4 && formData.serviceType === 'Avaliação para Venda' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Avaliação para Venda</h3>
                <p className="text-sm text-gray-600">Para avaliações, vamos direto para a logística</p>
              </div>
            )}

            {/* Etapa 5: Logística - Cards mobile */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center">Como prefere a logística?</h3>
                <div className="space-y-3">
                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      formData.logistics === 'levar-loja' 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setFormData({ ...formData, logistics: 'levar-loja' })}
                  >
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-6 w-6 text-green-600 flex-shrink-0" />
                      <div>
                        <div className="font-semibold">Levar na Loja</div>
                        <div className="text-sm text-gray-600">Você leva o console até nós</div>
                        <div className="text-xs text-green-600 font-medium">Sem taxa adicional</div>
                      </div>
                    </div>
                  </div>
                  
                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      formData.logistics === 'buscar-casa' 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setFormData({ ...formData, logistics: 'buscar-casa' })}
                  >
                    <div className="flex items-center space-x-3">
                      <Truck className="h-6 w-6 text-blue-600 flex-shrink-0" />
                      <div>
                        <div className="font-semibold">Buscar em Casa</div>
                        <div className="text-sm text-gray-600">Buscamos na sua residência</div>
                        <div className="text-xs text-orange-600 font-medium">Frete a calcular</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Etapa 6: Dados Pessoais - Mobile Form */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-center">Seus dados para contato</h3>
                
                {/* Formulário mobile-first */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome Completo *</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Seu nome completo"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">WhatsApp *</label>
                    <input
                      type="tel"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      placeholder="(27) 99999-9999"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Email (opcional)</label>
                    <input
                      type="email"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="seu@email.com"
                    />
                  </div>
                  
                  {formData.logistics === 'buscar-casa' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Endereço Completo *</label>
                      <textarea
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm h-20 resize-none"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Rua, número, bairro, cidade"
                      />
                    </div>
                  )}
                </div>

                {/* Resumo compacto */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-3">📋 Resumo da solicitação</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Console:</span>
                      <span className="font-medium">{formData.consoleModel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Serviço:</span>
                      <span className="font-medium">{formData.serviceType}</span>
                    </div>
                    {formData.serviceType === 'Diagnóstico + Reparo' && formData.problemCategory && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Problema:</span>
                        <span className="font-medium">{formData.problemCategory}</span>
                      </div>
                    )}
                    {(formData.serviceType === 'Diagnóstico + Reparo' || formData.serviceType === 'Manutenção Preventiva') && formData.urgency && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Urgência:</span>
                        <span className="font-medium">{formData.urgency === 'normal' ? 'Normal' : 'Express'}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Logística:</span>
                      <span className="font-medium">{formData.logistics === 'levar-loja' ? 'Levar na loja' : 'Buscar em casa'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            </div>

            {/* Botões mobile-optimized */}
            <div className="flex gap-3 pt-4 border-t flex-shrink-0">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex-1 h-12"
              >
                Voltar
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 && !formData.serviceType) ||
                    (currentStep === 2 && !formData.consoleModel) ||
                    (currentStep === 3 && formData.serviceType === 'Diagnóstico + Reparo' && !formData.problemCategory) ||
                    (currentStep === 4 && formData.serviceType !== 'Avaliação para Venda' && !formData.urgency) ||
                    (currentStep === 5 && !formData.logistics)
                  }
                  className="flex-1 h-12 bg-purple-600 hover:bg-purple-700"
                >
                  <span>Próximo</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.name || !formData.whatsapp || (formData.logistics === 'buscar-casa' && !formData.address)}
                  className="flex-1 h-12 bg-green-600 hover:bg-green-700"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  <span>Enviar WhatsApp</span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

// Componente Principal da Página
const AssistenciaTecnica: React.FC = () => {
  const { user, signOut } = useAuth();
  const { items, addToCart, updateQuantity, getCartTotal, getCartItemsCount, sendToWhatsApp } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Força scroll para o topo quando a página carregar
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Oficial do Site */}
      <ProfessionalHeader
        onCartOpen={() => setShowCart(true)}
        onAuthOpen={() => setShowAuthModal(true)}
        onMobileMenuToggle={() => {}}
        showNavigation={false}
      />
      
      {/* Título da Página - Mobile Optimized */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white py-6 sm:py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-xl sm:text-3xl font-bold mb-2">Assistência Técnica Especializada</h1>
          <p className="text-sm sm:text-lg opacity-90">Diagnóstico gratuito e reparo profissional para seu console</p>
        </div>
      </div>
      
      <TrustIndicators />
      <AssistanceForm />
      
      {/* Footer Oficial */}
      <Footer />
      
      {/* Modais */}
      <Cart 
        isOpen={showCart} 
        onClose={() => setShowCart(false)} 
        items={items}
        updateQuantity={updateQuantity}
        getCartTotal={getCartTotal}
        sendToWhatsApp={sendToWhatsApp}
      />
      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default AssistenciaTecnica;

