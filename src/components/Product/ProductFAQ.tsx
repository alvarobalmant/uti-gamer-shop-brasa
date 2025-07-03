import React, { useState, useEffect } from 'react';
import { Product } from '@/hooks/useProducts';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ProductFAQProps {
  product: Product;
}

const ProductFAQ: React.FC<ProductFAQProps> = ({ product }) => {
  console.log('TESTE SIMPLES - ProductFAQ carregado');
  console.log('🚀 ProductFAQ EXECUTANDO! Produto:', product?.id);
  
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Buscar FAQs do banco de dados
  useEffect(() => {
    const fetchFAQs = async () => {
      console.log('🔍 ProductFAQ: Iniciando busca de FAQs para produto:', product.id);
      
      try {
        // Buscar FAQs diretamente da tabela products
        const { data, error } = await supabase
          .from('products')
          .select('product_faqs')
          .eq('id', product.id)
          .single();

        if (error) {
          console.error('❌ ProductFAQ: Erro ao buscar FAQs:', error);
          console.log('⚠️ ProductFAQ: Usando FAQs mock devido ao erro');
          setFaqs(getMockFAQs());
        } else {
          console.log('✅ ProductFAQ: Dados carregados:', data);
          console.log('🔍 ProductFAQ: product_faqs encontrado:', data?.product_faqs);
          
          // Usar FAQs do banco se existirem, senão usar mock
          if (data?.product_faqs && Array.isArray(data.product_faqs) && data.product_faqs.length > 0) {
            console.log('✅ ProductFAQ: Usando FAQs do banco de dados');
            setFaqs(data.product_faqs);
          } else {
            console.log('⚠️ ProductFAQ: Nenhum FAQ no banco, usando FAQs mock');
            setFaqs(getMockFAQs());
          }
        }
      } catch (err) {
        console.error('❌ ProductFAQ: Exceção ao buscar FAQs:', err);
        console.log('⚠️ ProductFAQ: Usando FAQs mock devido ao erro');
        setFaqs(getMockFAQs());
      } finally {
        setLoading(false);
      }
    };

    if (product?.id) {
      fetchFAQs();
    } else {
      setFaqs(getMockFAQs());
      setLoading(false);
    }
  }, [product?.id]);

  // FAQs mock como fallback
  const getMockFAQs = () => [
    {
      id: 1,
      question: 'O jogo vem lacrado e original?',
      answer: 'Sim! Todos os nossos jogos são 100% originais e lacrados de fábrica. Garantimos a autenticidade de todos os produtos vendidos na UTI dos Games.',
    },
    {
      id: 2,
      question: 'Qual o prazo de entrega?',
      answer: 'O prazo de entrega varia de 2 a 5 dias úteis, dependendo da sua localização. Para Colatina-ES e região, oferecemos entrega no mesmo dia em compras realizadas até às 14h.',
    },
    {
      id: 3,
      question: 'Posso trocar o produto se não gostar?',
      answer: 'Sim! Oferecemos 7 dias para troca do produto, desde que esteja lacrado e nas condições originais. A troca pode ser feita na nossa loja física ou por correio.',
    },
    {
      id: 4,
      question: 'O jogo tem legendas em português?',
      answer: 'Sim, este jogo possui legendas e dublagem completa em português brasileiro, além de outros idiomas como inglês e espanhol.',
    },
    {
      id: 5,
      question: 'Preciso de PlayStation Plus para jogar?',
      answer: 'Não é necessário PlayStation Plus para jogar o modo campanha. Apenas os modos multiplayer online exigem assinatura ativa do serviço.',
    },
    {
      id: 6,
      question: 'Como funciona a garantia?',
      answer: 'Oferecemos garantia de 30 dias contra defeitos de fabricação. Em caso de problemas, fazemos a troca imediata do produto ou restituição do valor pago.',
    },
  ];

  const toggleFAQ = (faqId: number) => {
    setOpenFAQ(openFAQ === faqId ? null : faqId);
  };

  return (
    <div className="bg-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-gray-600">
            Tire todas as suas dúvidas sobre este produto
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900 pr-8">
                  {faq.question}
                </span>
                {openFAQ === faq.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              {openFAQ === faq.id && (
                <div className="px-6 pb-6">
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Não encontrou sua resposta?
          </p>
          <button
            onClick={() => {
              const message = `Olá! Tenho uma dúvida sobre o produto: ${product.name}`;
              const whatsappUrl = `https://wa.me/5527996882090?text=${encodeURIComponent(message)}`;
              window.open(whatsappUrl, '_blank');
            }}
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            Falar com Especialista no WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFAQ;
