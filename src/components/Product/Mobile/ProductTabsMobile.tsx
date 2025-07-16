<<<<<<< HEAD
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
=======
import React, { useState, useEffect } from 'react';
import { Product } from '@/hooks/useProducts';
import { ChevronDown, ChevronUp, Star, User, CheckCircle, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface ProductTabsMobileProps {
  product: any;
}

const ProductTabsMobile: React.FC<ProductTabsMobileProps> = ({ product }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [jsonbData, setJsonbData] = useState<any>(null);

  // Buscar campos JSONB diretamente da tabela products
  useEffect(() => {
    const fetchJsonbData = async () => {
      if (!product?.id) return;

      try {
        const { data, error } = await supabase
          .from('products')
          .select('product_faqs, product_videos, product_descriptions, specifications')
          .eq('id', product.id)
          .single();

        if (!error) {
          setJsonbData(data);
        }
      } catch (err) {
        console.error('Erro ao buscar campos JSONB:', err);
      }
    };

    fetchJsonbData();
  }, [product?.id]);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Processar especificações
  const getSpecifications = () => {
    if (product.specifications) {
      if (Array.isArray(product.specifications)) {
        return [{
          name: 'Especificações Técnicas',
          specs: product.specifications.map(spec => ({
            label: spec.name,
            value: spec.value,
            highlight: false
          }))
        }];
      }
      
      if (product.specifications.categories && Array.isArray(product.specifications.categories)) {
        return product.specifications.categories;
      }

      if (typeof product.specifications === 'object' && !Array.isArray(product.specifications)) {
        return [{
          name: 'Especificações Técnicas',
          specs: Object.entries(product.specifications).map(([key, value]) => ({
            label: key,
            value: String(value),
            highlight: false
          }))
        }];
      }
    }
    
    return [];
  };

  // Processar FAQs
  const getFAQs = () => {
    const faqs = jsonbData?.product_faqs || product.product_faqs;
    
    if (faqs && Array.isArray(faqs) && faqs.length > 0) {
      return faqs.map((faq, index) => ({
        id: faq.id || index + 1,
        question: faq.question,
        answer: faq.answer,
        category: faq.category || 'Geral',
        is_visible: faq.is_visible !== false
      }));
    }
    
    // FAQs mock
    return [
      {
        id: 1,
        question: 'O jogo vem lacrado e original?',
        answer: 'Sim! Todos os nossos jogos são 100% originais e lacrados de fábrica.',
      },
      {
        id: 2,
        question: 'Qual o prazo de entrega?',
        answer: 'O prazo de entrega varia de 2 a 5 dias úteis, dependendo da sua localização.',
      },
      {
        id: 3,
        question: 'Posso trocar o produto se não gostar?',
        answer: 'Sim! Oferecemos 7 dias para troca do produto, desde que esteja lacrado.',
      },
    ];
  };

  // Processar avaliações
  const getReviews = () => {
    return {
      rating: 4.8,
      count: 127,
      reviews: [
        {
          id: 1,
          name: 'João Santos',
          rating: 5,
          date: '2024-01-15',
          comment: 'Jogo incrível! Gráficos espetaculares e gameplay viciante.',
          verified: true,
        },
        {
          id: 2,
          name: 'Maria Silva',
          rating: 4,
          date: '2024-01-10',
          comment: 'Muito bom, mas achei um pouco difícil no início.',
          verified: true,
        }
      ]
    };
  };

  const specifications = getSpecifications();
  const faqs = getFAQs();
  const reviewsData = getReviews();

  const sections = [
    {
      id: 'description',
      title: 'Descrição do produto',
      content: (
        <div className="prose-sm">
          <p className="text-gray-700 leading-relaxed mb-4">
            {product.description || `Descubra ${product.name}, uma experiência única de gaming que vai revolucionar sua forma de jogar.`}
          </p>
          
          {product.product_highlights && product.product_highlights.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 mb-3">Características principais:</h4>
              {product.product_highlights.map((highlight) => (
                <div key={highlight.id} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{highlight.text}</span>
                </div>
              ))}
>>>>>>> a08235d3a56d734c06d5e45b7a55a52a13c49cf3
            </div>
          )}
        </div>
      )
    },
    {
      id: 'specifications',
<<<<<<< HEAD
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
=======
      title: 'Especificações técnicas',
      content: (
        <div className="space-y-4">
          {specifications.length > 0 ? (
            specifications.map((category, index) => (
              <div key={index}>
                <h4 className="font-semibold text-gray-900 mb-3">{category.name}</h4>
                <div className="space-y-2">
                  {category.specs && category.specs.map((spec, specIndex) => (
                    <div 
                      key={specIndex} 
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                    >
                      <span className="text-sm text-gray-600">{spec.label}</span>
                      <span className="text-sm font-medium text-gray-900">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">Especificações não disponíveis.</p>
          )}
        </div>
      )
    },
    {
      id: 'reviews',
      title: `Avaliações (${reviewsData.count})`,
      content: (
        <div className="space-y-4">
          {/* Rating Summary */}
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{reviewsData.rating}</div>
              <div className="flex justify-center mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= reviewsData.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {reviewsData.count} avaliações
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-3">
            {reviewsData.reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{review.name}</span>
                        {review.verified && (
                          <Badge variant="secondary" className="text-xs">
                            Verificado
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              star <= review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{review.date}</span>
                </div>
                <p className="text-sm text-gray-700">{review.comment}</p>
              </div>
>>>>>>> a08235d3a56d734c06d5e45b7a55a52a13c49cf3
            ))}
          </div>
        </div>
      )
    },
    {
<<<<<<< HEAD
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
=======
      id: 'faq',
      title: 'Perguntas frequentes',
      content: (
        <div className="space-y-3">
          {faqs.filter(faq => 'is_visible' in faq ? faq.is_visible !== false : true).slice(0, 5).map((faq) => (
            <div key={faq.id} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection(`faq-${faq.id}`)}
                className="w-full flex items-center justify-between p-3 text-left"
              >
                <span className="text-sm font-medium text-gray-900 pr-2">
                  {faq.question}
                </span>
                {expandedSection === `faq-${faq.id}` ? (
                  <ChevronUp className="w-4 h-4 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                )}
              </button>
              {expandedSection === `faq-${faq.id}` && (
                <div className="px-3 pb-3">
                  <p className="text-sm text-gray-700">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
>>>>>>> a08235d3a56d734c06d5e45b7a55a52a13c49cf3
        </div>
      )
    }
  ];

<<<<<<< HEAD
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
=======
  return (
    <div className="bg-white">
      <div className="divide-y divide-gray-200">
        {sections.map((section) => (
          <div key={section.id}>
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
            >
              <h3 className="text-base font-semibold text-gray-900">
                {section.title}
              </h3>
              {expandedSection === section.id ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            
            {expandedSection === section.id && (
              <div className="px-4 pb-4">
                {section.content}
>>>>>>> a08235d3a56d734c06d5e45b7a55a52a13c49cf3
              </div>
            )}
          </div>
        ))}
      </div>
<<<<<<< HEAD
=======

      {/* Contact CTA */}
      <div className="p-4 bg-gray-50 text-center">
        <p className="text-sm text-gray-600 mb-3">
          Ainda tem dúvidas? Fale com nossos especialistas!
        </p>
        <Button
          onClick={() => {
            const message = `Olá! Tenho uma dúvida sobre o produto: ${product.name}`;
            const whatsappUrl = `https://wa.me/5527996882090?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
          }}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          Falar no WhatsApp
        </Button>
      </div>
>>>>>>> a08235d3a56d734c06d5e45b7a55a52a13c49cf3
    </div>
  );
};

<<<<<<< HEAD
export default ProductTabsMobile;

=======
export default ProductTabsMobile;
>>>>>>> a08235d3a56d734c06d5e45b7a55a52a13c49cf3
