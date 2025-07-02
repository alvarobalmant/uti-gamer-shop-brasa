import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Plus, X, Star, Settings, Gamepad2 } from 'lucide-react';
import { ProductFormData, SpecCategory } from '@/types/product-extended';

interface SpecificationsTabProps {
  formData: ProductFormData;
  onChange: (field: string, value: any) => void;
}

const SpecificationsTab: React.FC<SpecificationsTabProps> = ({ formData, onChange }) => {
  const [newCategory, setNewCategory] = useState('');
  const [newSpec, setNewSpec] = useState({ label: '', value: '', highlight: false });
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);

  // Templates de especificações por tipo de produto
  const specTemplates = {
    console: {
      name: 'Console de Videogame',
      categories: [
        {
          name: 'Informações Básicas',
          specs: [
            { label: 'Plataforma', value: '', highlight: true },
            { label: 'Modelo', value: '', highlight: true },
            { label: 'Cor', value: '', highlight: false },
            { label: 'Condição', value: 'Novo', highlight: false }
          ]
        },
        {
          name: 'Especificações Técnicas',
          specs: [
            { label: 'Processador', value: '', highlight: false },
            { label: 'Memória RAM', value: '', highlight: false },
            { label: 'Armazenamento', value: '', highlight: true },
            { label: 'Resolução Máxima', value: '', highlight: false }
          ]
        }
      ]
    },
    game: {
      name: 'Jogo',
      categories: [
        {
          name: 'Informações Básicas',
          specs: [
            { label: 'Plataforma', value: '', highlight: true },
            { label: 'Gênero', value: '', highlight: true },
            { label: 'Classificação', value: '', highlight: false },
            { label: 'Desenvolvedor', value: '', highlight: false },
            { label: 'Data de Lançamento', value: '', highlight: false }
          ]
        },
        {
          name: 'Detalhes do Jogo',
          specs: [
            { label: 'Idiomas', value: '', highlight: false },
            { label: 'Modos de Jogo', value: '', highlight: false },
            { label: 'Espaço Necessário', value: '', highlight: true },
            { label: 'Jogadores Online', value: '', highlight: false }
          ]
        }
      ]
    },
    accessory: {
      name: 'Acessório',
      categories: [
        {
          name: 'Informações Básicas',
          specs: [
            { label: 'Tipo', value: '', highlight: true },
            { label: 'Compatibilidade', value: '', highlight: true },
            { label: 'Cor', value: '', highlight: false },
            { label: 'Material', value: '', highlight: false }
          ]
        },
        {
          name: 'Especificações Técnicas',
          specs: [
            { label: 'Conectividade', value: '', highlight: false },
            { label: 'Dimensões', value: '', highlight: false },
            { label: 'Peso', value: '', highlight: false },
            { label: 'Garantia', value: '', highlight: false }
          ]
        }
      ]
    }
  };

  const handleApplyTemplate = (templateKey: keyof typeof specTemplates) => {
    const template = specTemplates[templateKey];
    onChange('specifications', { categories: template.categories });
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const currentSpecs = formData.specifications || { categories: [] };
      const newCategories = [
        ...currentSpecs.categories,
        {
          name: newCategory.trim(),
          specs: []
        }
      ];
      onChange('specifications', { categories: newCategories });
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (categoryIndex: number) => {
    const currentSpecs = formData.specifications || { categories: [] };
    const newCategories = currentSpecs.categories.filter((_, index) => index !== categoryIndex);
    onChange('specifications', { categories: newCategories });
    if (selectedCategoryIndex === categoryIndex) {
      setSelectedCategoryIndex(null);
    }
  };

  const handleAddSpec = () => {
    if (selectedCategoryIndex !== null && newSpec.label && newSpec.value) {
      const currentSpecs = formData.specifications || { categories: [] };
      const newCategories = [...currentSpecs.categories];
      newCategories[selectedCategoryIndex].specs.push({
        label: newSpec.label,
        value: newSpec.value,
        highlight: newSpec.highlight
      });
      onChange('specifications', { categories: newCategories });
      setNewSpec({ label: '', value: '', highlight: false });
    }
  };

  const handleRemoveSpec = (categoryIndex: number, specIndex: number) => {
    const currentSpecs = formData.specifications || { categories: [] };
    const newCategories = [...currentSpecs.categories];
    newCategories[categoryIndex].specs = newCategories[categoryIndex].specs.filter((_, index) => index !== specIndex);
    onChange('specifications', { categories: newCategories });
  };

  const handleUpdateSpec = (categoryIndex: number, specIndex: number, field: string, value: any) => {
    const currentSpecs = formData.specifications || { categories: [] };
    const newCategories = [...currentSpecs.categories];
    newCategories[categoryIndex].specs[specIndex] = {
      ...newCategories[categoryIndex].specs[specIndex],
      [field]: value
    };
    onChange('specifications', { categories: newCategories });
  };

  const specifications = formData.specifications || { categories: [] };

  return (
    <div className="space-y-6">
      {/* Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Templates de Especificações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.entries(specTemplates).map(([key, template]) => (
              <Button
                key={key}
                variant="outline"
                onClick={() => handleApplyTemplate(key as keyof typeof specTemplates)}
                className="h-auto p-4 flex flex-col items-start"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Gamepad2 className="w-4 h-4" />
                  <span className="font-medium">{template.name}</span>
                </div>
                <span className="text-xs text-gray-500 text-left">
                  {template.categories.length} categorias pré-configuradas
                </span>
              </Button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Os templates substituirão as especificações atuais. Use como ponto de partida.
          </p>
        </CardContent>
      </Card>

      {/* Adicionar Categoria */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Adicionar Categoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Nome da categoria (ex: Informações Básicas)"
              className="flex-1"
            />
            <Button onClick={handleAddCategory} disabled={!newCategory.trim()}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Categorias e Especificações */}
      {specifications.categories.map((category, categoryIndex) => (
        <Card key={categoryIndex}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {category.name}
              </CardTitle>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleRemoveCategory(categoryIndex)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Especificações existentes */}
            {category.specs.map((spec, specIndex) => (
              <div key={specIndex} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <Input
                    value={spec.label}
                    onChange={(e) => handleUpdateSpec(categoryIndex, specIndex, 'label', e.target.value)}
                    placeholder="Nome da especificação"
                  />
                  <Input
                    value={spec.value}
                    onChange={(e) => handleUpdateSpec(categoryIndex, specIndex, 'value', e.target.value)}
                    placeholder="Valor"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={spec.highlight}
                    onCheckedChange={(checked) => handleUpdateSpec(categoryIndex, specIndex, 'highlight', checked)}
                  />
                  <Label className="text-xs">Destaque</Label>
                </div>

                {spec.highlight && (
                  <Star className="w-4 h-4 text-yellow-500" />
                )}

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRemoveSpec(categoryIndex, specIndex)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}

            {/* Adicionar nova especificação */}
            <div className="border-t pt-4">
              <div className="flex items-center gap-2">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <Input
                    value={selectedCategoryIndex === categoryIndex ? newSpec.label : ''}
                    onChange={(e) => {
                      setSelectedCategoryIndex(categoryIndex);
                      setNewSpec(prev => ({ ...prev, label: e.target.value }));
                    }}
                    placeholder="Nome da especificação"
                  />
                  <Input
                    value={selectedCategoryIndex === categoryIndex ? newSpec.value : ''}
                    onChange={(e) => {
                      setSelectedCategoryIndex(categoryIndex);
                      setNewSpec(prev => ({ ...prev, value: e.target.value }));
                    }}
                    placeholder="Valor"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedCategoryIndex === categoryIndex ? newSpec.highlight : false}
                    onCheckedChange={(checked) => {
                      setSelectedCategoryIndex(categoryIndex);
                      setNewSpec(prev => ({ ...prev, highlight: checked as boolean }));
                    }}
                  />
                  <Label className="text-xs">Destaque</Label>
                </div>

                <Button
                  size="sm"
                  onClick={handleAddSpec}
                  disabled={selectedCategoryIndex !== categoryIndex || !newSpec.label || !newSpec.value}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Preview das Especificações */}
      {specifications.categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Preview das Especificações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {specifications.categories.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h3 className="font-semibold text-gray-900 mb-3">{category.name}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {category.specs.map((spec, specIndex) => (
                      <div key={specIndex} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 flex items-center gap-1">
                          {spec.label}
                          {spec.highlight && <Star className="w-3 h-3 text-yellow-500" />}
                        </span>
                        <span className={`font-medium ${spec.highlight ? 'text-blue-600' : 'text-gray-900'}`}>
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {specifications.categories.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma especificação configurada</h3>
            <p className="text-gray-500 mb-4">
              Use um template acima ou adicione categorias manualmente para começar.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SpecificationsTab;

