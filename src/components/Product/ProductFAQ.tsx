import React from 'react';
import { Product } from '@/hooks/useProducts';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ProductFAQProps {
  product: Product;
}

const getMockFAQs = () => [
  { id: 1, question: 'O jogo vem lacrado e original?', answer: 'Sim! Todos os nossos jogos são 100% originais e lacrados de fábrica.' },
  { id: 2, question: 'Qual o prazo de entrega?', answer: 'O prazo de entrega varia de 2 a 5 dias úteis.' },
  { id: 3, question: 'Posso trocar o produto se não gostar?', answer: 'Sim! Oferecemos 7 dias para troca do produto.' },
  { id: 4, question: 'O jogo tem legendas em português?', answer: 'Sim, este jogo possui legendas em português brasileiro.' },
  { id: 5, question: 'Como funciona a garantia?', answer: 'Oferecemos garantia de 30 dias contra defeitos de fabricação.' },
];

const ProductFAQ: React.FC<ProductFAQProps> = ({ product }) => {
  const faqs = getMockFAQs();

  return (
    <div className="bg-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
          <p className="text-gray-600">Tire todas as suas dúvidas sobre este produto</p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id.toString()} className="border border-gray-200 rounded-lg overflow-hidden">
              <AccordionTrigger className="p-6 text-left hover:bg-gray-50 transition-colors">
                <span className="font-medium text-gray-900 text-left">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Não encontrou sua resposta?</p>
          <button
            onClick={() => {
              const message = `Olá! Tenho uma dúvida sobre o produto: ${product.name}`;
              window.open(`https://wa.me/5527999771112?text=${encodeURIComponent(message)}`, '_blank');
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