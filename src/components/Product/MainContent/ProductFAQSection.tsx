import React, { useState } from 'react';
import { Product } from '@/hooks/useProducts';
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle, Search, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useProductFAQs } from '@/hooks/useProductFAQs';

interface ProductFAQSectionProps {
  product: Product;
  className?: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  date: string;
  tags: string[];
}

const ProductFAQSection: React.FC<ProductFAQSectionProps> = ({
  product,
  className
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Fetch FAQs from database
  const { categorizedFaqs, loading } = useProductFAQs(product.id);

  const toggleItem = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Convert database FAQs to display format
  const faqItems: FAQItem[] = categorizedFaqs.flatMap(category => 
    category.faqs.map(faq => ({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      category: faq.category || 'geral',
      helpful: faq.helpful_count,
      date: faq.created_at,
      tags: faq.tags || []
    }))
  );

  // Use only database FAQs (no fallback to mock data)
  const displayFAQs = faqItems;

  const categories = [
    { id: 'all', label: 'Todas', count: displayFAQs.length },
    { id: 'compatibilidade', label: 'Compatibilidade', count: displayFAQs.filter(f => f.category === 'compatibilidade').length },
    { id: 'requisitos', label: 'Requisitos', count: displayFAQs.filter(f => f.category === 'requisitos').length },
    { id: 'idioma', label: 'Idioma', count: displayFAQs.filter(f => f.category === 'idioma').length },
    { id: 'garantia', label: 'Garantia', count: displayFAQs.filter(f => f.category === 'garantia').length },
    { id: 'entrega', label: 'Entrega', count: displayFAQs.filter(f => f.category === 'entrega').length },
    { id: 'geral', label: 'Geral', count: displayFAQs.filter(f => f.category === 'geral').length }
  ];

  // Filtrar FAQs
  const filteredFAQs = displayFAQs.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  // Don't show FAQ section if no FAQs are available (including mock)
  if (displayFAQs.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Título */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-gray-900">
            Perguntas Frequentes
          </h3>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            {displayFAQs.length} perguntas
          </Badge>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          <HelpCircle className="w-4 h-4 mr-2" />
          Fazer pergunta
        </Button>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Buscar perguntas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filtros por Categoria */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className={cn(
              "text-xs",
              selectedCategory === category.id && "bg-purple-600 hover:bg-purple-700"
            )}
          >
            {category.label} ({category.count})
          </Button>
        ))}
      </div>

      {/* Lista de FAQs */}
      <div className="space-y-4">
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-8">
            <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="font-medium text-gray-900 mb-2">
              Nenhuma pergunta encontrada
            </h4>
            <p className="text-gray-600 text-sm">
              Tente ajustar sua busca ou categoria selecionada
            </p>
          </div>
        ) : (
          filteredFAQs.map((item) => {
            const isExpanded = expandedItems.includes(item.id);
            
            return (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Pergunta */}
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {item.question}
                    </h4>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <ThumbsUp className="w-3 h-3" />
                        <span>{item.helpful} úteis</span>
                      </div>
                      <div className="flex gap-1">
                        {item.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                </button>

                {/* Resposta */}
                {isExpanded && (
                  <div className="bg-gray-50 p-4 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {item.answer}
                    </p>
                    
                    {/* Tags completas */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs border-purple-300 text-purple-600"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Ações */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors">
                          <ThumbsUp className="w-4 h-4" />
                          Esta resposta foi útil? ({item.helpful})
                        </button>
                      </div>
                      <div className="text-xs text-gray-500">
                        Atualizado em {new Date(item.date).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Seção de Ajuda */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          
          <div>
            <h5 className="font-semibold text-purple-800 mb-2">
              Não encontrou sua resposta?
            </h5>
            <p className="text-sm text-purple-700 mb-4">
              Nossa equipe especializada está pronta para ajudar você com qualquer dúvida sobre este produto.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              💬 Chat ao vivo
            </Button>
            <Button variant="outline" className="border-purple-300 text-purple-600">
              📧 Enviar email
            </Button>
            <Button variant="outline" className="border-purple-300 text-purple-600">
              📞 Ligar agora
            </Button>
          </div>

          <div className="text-xs text-purple-600">
            Atendimento: Segunda a Sexta, 8h às 18h | Sábado, 8h às 14h
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h5 className="font-semibold text-gray-800 mb-3">
          📊 Estatísticas de Ajuda
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {displayFAQs.length}
            </div>
            <div className="text-sm text-gray-600">
              Perguntas respondidas
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              94%
            </div>
            <div className="text-sm text-gray-600">
              Problemas resolvidos
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              2min
            </div>
            <div className="text-sm text-gray-600">
              Tempo médio de resposta
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFAQSection;

