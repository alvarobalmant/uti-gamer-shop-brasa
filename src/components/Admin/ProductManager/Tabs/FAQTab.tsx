import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { HelpCircle, Plus, X } from 'lucide-react';
import { ProductFormData, ProductFAQ } from '@/types/product-extended';

interface FAQTabProps {
  formData: ProductFormData;
  onChange: (field: string, value: any) => void;
}

const FAQTab: React.FC<FAQTabProps> = ({ formData, onChange }) => {
  const [newFAQ, setNewFAQ] = useState({
    question: '',
    answer: '',
    category: 'geral',
    is_visible: true
  });

  const categories = [
    { value: 'geral', label: 'Geral' },
    { value: 'compatibilidade', label: 'Compatibilidade' },
    { value: 'instalacao', label: 'Instalação' },
    { value: 'garantia', label: 'Garantia' },
    { value: 'entrega', label: 'Entrega' }
  ];

  const handleAddFAQ = () => {
    if (newFAQ.question.trim() && newFAQ.answer.trim()) {
      const currentFAQs = formData.product_faqs || [];
      const faqToAdd: ProductFAQ = {
        id: `faq-${Date.now()}`,
        question: newFAQ.question.trim(),
        answer: newFAQ.answer.trim(),
        order: currentFAQs.length + 1,
        is_visible: newFAQ.is_visible,
        category: newFAQ.category
      };
      
      onChange('product_faqs', [...currentFAQs, faqToAdd]);
      setNewFAQ({
        question: '',
        answer: '',
        category: 'geral',
        is_visible: true
      });
    }
  };

  const handleRemoveFAQ = (faqId: string) => {
    const currentFAQs = formData.product_faqs || [];
    const newFAQs = currentFAQs.filter(f => f.id !== faqId);
    onChange('product_faqs', newFAQs);
  };

  const handleUpdateFAQ = (faqId: string, field: string, value: any) => {
    const currentFAQs = formData.product_faqs || [];
    const newFAQs = currentFAQs.map(f => 
      f.id === faqId ? { ...f, [field]: value } : f
    );
    onChange('product_faqs', newFAQs);
  };

  return (
    <div className="space-y-6">
      {/* Adicionar Nova FAQ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Adicionar Pergunta Frequente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="faq_question">Pergunta</Label>
            <Input
              id="faq_question"
              value={newFAQ.question}
              onChange={(e) => setNewFAQ(prev => ({ ...prev, question: e.target.value }))}
              placeholder="Ex: Este produto é compatível com Xbox Series X?"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="faq_answer">Resposta</Label>
            <Textarea
              id="faq_answer"
              value={newFAQ.answer}
              onChange={(e) => setNewFAQ(prev => ({ ...prev, answer: e.target.value }))}
              placeholder="Resposta detalhada para a pergunta..."
              rows={4}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="faq_category">Categoria</Label>
            <select
              id="faq_category"
              value={newFAQ.category}
              onChange={(e) => setNewFAQ(prev => ({ ...prev, category: e.target.value }))}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="faq_visible"
              checked={newFAQ.is_visible}
              onCheckedChange={(checked) => setNewFAQ(prev => ({ ...prev, is_visible: checked as boolean }))}
            />
            <Label htmlFor="faq_visible">Visível no site</Label>
          </div>

          <Button 
            onClick={handleAddFAQ} 
            disabled={!newFAQ.question.trim() || !newFAQ.answer.trim()}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar FAQ
          </Button>
        </CardContent>
      </Card>

      {/* Lista de FAQs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Perguntas Configuradas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {formData.product_faqs && formData.product_faqs.length > 0 ? (
            <div className="space-y-4">
              {formData.product_faqs.map((faq) => (
                <div key={faq.id} className="border rounded-lg p-4">
                  <div className="space-y-3">
                    <div>
                      <Label>Pergunta</Label>
                      <Input
                        value={faq.question}
                        onChange={(e) => handleUpdateFAQ(faq.id, 'question', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Resposta</Label>
                      <Textarea
                        value={faq.answer}
                        onChange={(e) => handleUpdateFAQ(faq.id, 'answer', e.target.value)}
                        rows={3}
                        className="mt-1"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <select
                          value={faq.category}
                          onChange={(e) => handleUpdateFAQ(faq.id, 'category', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          {categories.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>

                        <div className="flex items-center space-x-1">
                          <Checkbox
                            checked={faq.is_visible}
                            onCheckedChange={(checked) => handleUpdateFAQ(faq.id, 'is_visible', checked)}
                          />
                          <Label className="text-sm">Visível</Label>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveFAQ(faq.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <HelpCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Nenhuma pergunta adicionada</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FAQTab;

