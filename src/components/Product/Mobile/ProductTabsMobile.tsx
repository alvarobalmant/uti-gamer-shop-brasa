import React, { useState } from 'react';
import { Product } from '@/hooks/useProducts';
import { ChevronDown, ChevronUp, Info, Package, Shield, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductTabsMobileProps {
  product: Product;
}

const ProductTabsMobile: React.FC<ProductTabsMobileProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState<string | null>('description');

  const tabs = [
    {
      id: 'description',
      title: 'Descrição do Produto',
      icon: Info,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            {product.description || `${product.name} oferece a melhor experiência de jogo com gráficos 4K, Ray Tracing, feedback háptico DualSense e carregamento ultra-rápido. Uma experiência next-gen completa.`}
          </p>
          
          {product.features && product.features.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Características principais:</h4>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'specifications',
      title: 'Especificações Técnicas',
      icon: Package,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {[
              { label: 'Plataforma', value: product.platform || 'PlayStation 5' },
              { label: 'Gênero', value: product.genre || 'Ação/Aventura' },
              { label: 'Classificação', value: product.rating || '18 anos' },
              { label: 'Desenvolvedor', value: product.developer || 'Capcom' },
              { label: 'Idiomas', value: 'Português, Inglês, Espanhol' },
              { label: 'Modo de Jogo', value: 'Single Player / Multiplayer' }
            ].map((spec, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{spec.label}</span>
                  <span className="text-gray-700">{spec.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'shipping',
      title: 'Entrega e Garantias',
      icon: Shield,
      content: (
        <div className="space-y-6">
          {/* Shipping Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 text-lg">📦 Informações de Entrega</h4>
            <div className="bg-blue-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Frete Grátis</span>
                <span className="text-green-600 font-semibold">Compras acima de R$ 150</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Prazo de Entrega</span>
                <span className="text-gray-700">2 a 5 dias úteis</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Rastreamento</span>
                <span className="text-gray-700">Código enviado por email</span>
              </div>
            </div>
          </div>

          {/* Guarantees */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 text-lg">🛡️ Suas Garantias</h4>
            <div className="grid grid-cols-1 gap-3">
              {[
                { title: 'Produto Original', desc: '100% original e lacrado de fábrica' },
                { title: 'Troca Garantida', desc: '7 dias para trocar sem complicação' },
                { title: 'Garantia UTI', desc: '30 dias de garantia contra defeitos' },
                { title: 'Suporte Especializado', desc: 'Atendimento gamer por especialistas' }
              ].map((guarantee, index) => (
                <div key={index} className="bg-green-50 rounded-xl p-4">
                  <div className="font-semibold text-gray-900 mb-1">{guarantee.title}</div>
                  <div className="text-sm text-gray-700">{guarantee.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Return Policy */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 text-lg">🔄 Política de Troca</h4>
            <div className="bg-yellow-50 rounded-xl p-4 space-y-2">
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>7 dias corridos a partir do recebimento</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>Produto deve estar lacrado e sem sinais de uso</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>Embalagem original preservada</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>Frete de retorno por conta da UTI dos Games</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'faq',
      title: 'Perguntas Frequentes',
      icon: HelpCircle,
      content: (
        <div className="space-y-4">
          {[
            {
              question: 'O jogo é compatível com PlayStation 4?',
              answer: 'Este produto é específico para PlayStation 5. Para PS4, temos uma versão separada disponível em nossa loja.'
            },
            {
              question: 'Posso trocar por outro jogo?',
              answer: 'Sim! Você tem 7 dias para trocar por qualquer outro produto de valor igual ou superior, pagando apenas a diferença.'
            },
            {
              question: 'O jogo vem dublado em português?',
              answer: 'Sim, o jogo inclui dublagem e legendas em português brasileiro, além de outros idiomas.'
            },
            {
              question: 'Qual o prazo de entrega para minha região?',
              answer: 'O prazo padrão é de 2 a 5 dias úteis. Você pode consultar o prazo específico inserindo seu CEP no checkout.'
            },
            {
              question: 'Posso retirar na loja física?',
              answer: 'Sim! Nossa loja fica em Colatina-ES. Você pode escolher a opção "Retirar na loja" no checkout.'
            }
          ].map((faq, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-4 space-y-3">
              <h5 className="font-semibold text-gray-900">{faq.question}</h5>
              <p className="text-gray-700 text-sm leading-relaxed">{faq.answer}</p>
            </div>
          ))}
          
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-gray-700 mb-3">Não encontrou sua resposta?</p>
            <Button 
              variant="outline" 
              className="border-blue-500 text-blue-600 hover:bg-blue-100"
            >
              💬 Falar com Especialista
            </Button>
          </div>
        </div>
      )
    }
  ];

  const toggleTab = (tabId: string) => {
    setActiveTab(activeTab === tabId ? null : tabId);
  };

  return (
    <div className="bg-white">
      <div className="px-6 py-8 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Informações do Produto
        </h2>
        
        {tabs.map((tab) => (
          <div key={tab.id} className="border border-gray-200 rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleTab(tab.id)}
              className="w-full p-6 text-left bg-white hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <tab.icon className="w-5 h-5 text-red-600" />
                </div>
                <span className="font-semibold text-gray-900 text-lg">
                  {tab.title}
                </span>
              </div>
              <div className="transition-transform duration-200">
                {activeTab === tab.id ? (
                  <ChevronUp className="w-6 h-6 text-gray-500" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-500" />
                )}
              </div>
            </button>
            
            {activeTab === tab.id && (
              <div className="px-6 pb-6 bg-gray-50 animate-in slide-in-from-top duration-300">
                <div className="pt-4">
                  {tab.content}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductTabsMobile;

