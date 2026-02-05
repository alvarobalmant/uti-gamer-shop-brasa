import React, { useState } from 'react';
import { Product } from '@/hooks/useProducts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useProductSpecifications } from '@/hooks/useProductSpecifications';

interface ProductTabsEnhancedProps {
  product: any;
}

const ProductTabsEnhanced: React.FC<ProductTabsEnhancedProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState('description');
  const { categorizedSpecs } = useProductSpecifications(product?.id, 'desktop', product);

  const getSpecifications = () => {
    if (categorizedSpecs && categorizedSpecs.length > 0) {
      return categorizedSpecs.map(categoryGroup => ({
        name: categoryGroup.category,
        specs: categoryGroup.items.map(item => ({
          label: item.label,
          value: item.value,
          highlight: item.highlight || false
        }))
      }));
    }
    
    if (product.specifications && Array.isArray(product.specifications)) {
      return [{
        name: 'Especificações Técnicas',
        specs: product.specifications.map((spec: any) => ({
          label: spec.name,
          value: spec.value,
          highlight: false
        }))
      }];
    }
    
    return [];
  };

  const getDescriptions = () => {
    const descriptions = product.product_descriptions || {};
    return {
      short: descriptions.short || product.description || '',
      detailed: descriptions.detailed || '',
      technical: descriptions.technical || '',
      marketing: descriptions.marketing || ''
    };
  };

  const getFAQs = () => [
    { id: 1, question: 'O jogo vem lacrado?', answer: 'Sim, todos originais e lacrados.', category: 'Geral', is_visible: true },
    { id: 2, question: 'Qual prazo de entrega?', answer: '2-5 dias úteis.', category: 'Entrega', is_visible: true },
    { id: 3, question: 'Como funciona a garantia?', answer: '30 dias contra defeitos.', category: 'Garantia', is_visible: true }
  ];

  const specifications = getSpecifications();
  const descriptions = getDescriptions();
  const faqs = getFAQs();

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="description">Descrição</TabsTrigger>
            <TabsTrigger value="specifications">Especificações</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="space-y-6">
            <div className="prose max-w-none">
              {descriptions.marketing && (
                <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Destaque</h3>
                  <p className="text-gray-700">{descriptions.marketing}</p>
                </div>
              )}
              <div className="text-lg text-gray-700 leading-relaxed">
                {descriptions.detailed || descriptions.short || product.description || `Descubra ${product.name}.`}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="space-y-6">
            {specifications.length > 0 ? (
              <div className="grid gap-6">
                {specifications.map((category, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6 bg-white">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{category.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {category.specs?.map((spec, specIndex) => (
                        <div key={specIndex} className={`flex justify-between items-center p-3 rounded-lg ${spec.highlight ? 'bg-red-50' : 'bg-gray-50'}`}>
                          <span className="font-medium text-gray-700">{spec.label}:</span>
                          <span className={spec.highlight ? 'text-red-600 font-semibold' : 'text-gray-900 font-semibold'}>{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma especificação disponível</h3>
              </div>
            )}
          </TabsContent>

          <TabsContent value="faq" className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="border border-gray-200 rounded-lg p-6 bg-white">
                <h4 className="font-semibold text-gray-900 mb-3">{faq.question}</h4>
                <p className="text-gray-700">{faq.answer}</p>
                <Badge variant="outline" className="mt-3 text-xs">{faq.category}</Badge>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductTabsEnhanced;