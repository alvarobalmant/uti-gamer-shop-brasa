import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useProductSpecifications, ProductSpecification, SpecificationCategory } from '@/hooks/useProductSpecifications';
import { Plus, Trash2, Edit, Save, X, Settings, Wrench, HardDrive, Globe, Package as PackageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface SpecificationCategoryManagerProps {
  productId: string;
  categorizedSpecs: SpecificationCategory[];
  onSpecificationsChange: () => void;
}

const SpecificationCategoryManager: React.FC<SpecificationCategoryManagerProps> = ({
  productId,
  categorizedSpecs,
  onSpecificationsChange
}) => {
  const { addSpecification, updateSpecification, deleteSpecification } = useProductSpecifications(productId);
  const [newSpec, setNewSpec] = useState({
    category: '',
    label: '',
    value: '',
    highlight: false,
    order_index: 0
  });
  const [editingSpec, setEditingSpec] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<ProductSpecification>>({});

  const predefinedCategories = [
    { value: 'general', label: 'Informações Gerais', icon: '📋' },
    { value: 'technical', label: 'Especificações Técnicas', icon: '⚙️' },
    { value: 'storage', label: 'Armazenamento e Instalação', icon: '💾' },
    { value: 'multiplayer', label: 'Recursos Online', icon: '🌐' },
    { value: 'physical', label: 'Informações Físicas', icon: '📦' },
    { value: 'compatibility', label: 'Compatibilidade', icon: '🔗' },
    { value: 'features', label: 'Recursos e Funcionalidades', icon: '✨' },
  ];

  const specTemplates = {
    general: [
      { label: 'Marca/Editora', value: 'A definir' },
      { label: 'Desenvolvedora', value: 'A definir' },
      { label: 'Gênero', value: 'Ação/Aventura' },
      { label: 'Classificação Etária', value: 'M (17+)' },
      { label: 'Data de Lançamento', value: '2024' },
    ],
    technical: [
      { label: 'Resolução Máxima', value: '4K (3840x2160)' },
      { label: 'Taxa de Quadros', value: 'Até 60 FPS' },
      { label: 'Ray Tracing', value: 'Sim' },
      { label: 'HDR', value: 'HDR10' },
      { label: 'Audio', value: '3D Audio' },
    ],
    storage: [
      { label: 'Tamanho do Download', value: '50 GB' },
      { label: 'Espaço Livre Necessário', value: '60 GB' },
      { label: 'Instalação Obrigatória', value: 'Sim' },
    ],
    multiplayer: [
      { label: 'Multijogador Online', value: 'Sim' },
      { label: 'Máximo de Jogadores', value: '4 jogadores' },
      { label: 'Crossplay', value: 'Não' },
      { label: 'Assinatura Online Necessária', value: 'Sim' },
    ]
  };

  const handleAddSpecification = async () => {
    if (!newSpec.category || !newSpec.label || !newSpec.value) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const result = await addSpecification({
        product_id: productId,
        category: newSpec.category,
        label: newSpec.label,
        value: newSpec.value,
        highlight: newSpec.highlight,
        order_index: newSpec.order_index
      });

      if (result.success) {
        toast.success('Especificação adicionada com sucesso!');
        setNewSpec({
          category: '',
          label: '',
          value: '',
          highlight: false,
          order_index: 0
        });
        onSpecificationsChange();
      } else {
        toast.error('Erro ao adicionar especificação');
      }
    } catch (error) {
      console.error('Erro ao adicionar especificação:', error);
      toast.error('Erro ao adicionar especificação');
    }
  };

  const handleUpdateSpecification = async (id: string) => {
    try {
      const result = await updateSpecification(id, editData);
      if (result.success) {
        toast.success('Especificação atualizada com sucesso!');
        setEditingSpec(null);
        setEditData({});
        onSpecificationsChange();
      } else {
        toast.error('Erro ao atualizar especificação');
      }
    } catch (error) {
      console.error('Erro ao atualizar especificação:', error);
      toast.error('Erro ao atualizar especificação');
    }
  };

  const handleDeleteSpecification = async (id: string) => {
    try {
      const result = await deleteSpecification(id);
      if (result.success) {
        toast.success('Especificação removida com sucesso!');
        onSpecificationsChange();
      } else {
        toast.error('Erro ao remover especificação');
      }
    } catch (error) {
      console.error('Erro ao remover especificação:', error);
      toast.error('Erro ao remover especificação');
    }
  };

  const handleApplyTemplate = async (category: string) => {
    const templates = specTemplates[category as keyof typeof specTemplates];
    if (!templates) return;

    try {
      for (const template of templates) {
        await addSpecification({
          product_id: productId,
          category,
          label: template.label,
          value: template.value,
          highlight: false,
          order_index: 0
        });
      }
      toast.success(`Template "${predefinedCategories.find(c => c.value === category)?.label}" aplicado com sucesso!`);
      onSpecificationsChange();
    } catch (error) {
      console.error('Erro ao aplicar template:', error);
      toast.error('Erro ao aplicar template');
    }
  };

  const extractEmojiFromText = (text: string): { emoji: string | null; cleanText: string } => {
    // Regex para detectar emojis no início do texto
    const emojiRegex = /^([\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}])\s*/u;
    const match = text.match(emojiRegex);
    
    if (match) {
      return {
        emoji: match[1],
        cleanText: text.replace(emojiRegex, '').trim()
      };
    }
    
    return {
      emoji: null,
      cleanText: text
    };
  };

  const getCategoryIcon = (category: string) => {
    // Primeiro, tentar extrair emoji da própria categoria
    const { emoji } = extractEmojiFromText(category);
    if (emoji) {
      return emoji;
    }
    
    // Se não tem emoji, tentar mapear por categorias predefinidas
    const categoryConfig = predefinedCategories.find(c => c.value === category);
    return categoryConfig?.icon || '📄';
  };

  const getCategoryLabel = (category: string) => {
    // Extrair texto limpo sem emoji
    const { cleanText } = extractEmojiFromText(category);
    
    // Se não conseguiu extrair texto limpo, tentar mapear por categorias predefinidas
    if (cleanText === category) {
      const categoryConfig = predefinedCategories.find(c => c.value === category);
      return categoryConfig?.label || category;
    }
    
    return cleanText;
  };

  return (
    <div className="space-y-6 max-h-none overflow-visible">
      {/* Quick Templates */}
      <Card className="overflow-visible">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Templates Rápidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.keys(specTemplates).map((category) => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                onClick={() => handleApplyTemplate(category)}
                className="justify-start"
              >
                <span className="mr-2">{getCategoryIcon(category)}</span>
                {getCategoryLabel(category)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add New Specification */}
      <Card className="overflow-visible">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nova Especificação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={newSpec.category} onValueChange={(value) => setNewSpec(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {predefinedCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      <span className="mr-2">{category.icon}</span>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Rótulo</Label>
              <Input
                value={newSpec.label}
                onChange={(e) => setNewSpec(prev => ({ ...prev, label: e.target.value }))}
                placeholder="Ex: Marca/Editora, Resolução, etc."
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Valor</Label>
              <Input
                value={newSpec.value}
                onChange={(e) => setNewSpec(prev => ({ ...prev, value: e.target.value }))}
                placeholder="Ex: Ubisoft, 4K, Sim/Não, etc."
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Checkbox
                  checked={newSpec.highlight}
                  onCheckedChange={(checked) => setNewSpec(prev => ({ ...prev, highlight: !!checked }))}
                />
                Destacar especificação
              </Label>
            </div>
          </div>
          <Button onClick={handleAddSpecification} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Especificação
          </Button>
        </CardContent>
      </Card>

      {/* Existing Specifications */}
      <Card className="overflow-visible">
        <CardHeader>
          <CardTitle className="text-base">Especificações Existentes</CardTitle>
        </CardHeader>
        <CardContent className="max-h-none overflow-visible">
          {categorizedSpecs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <PackageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma especificação cadastrada ainda.</p>
              <p className="text-sm">Use os templates rápidos ou adicione manualmente.</p>
            </div>
          ) : (
            <Accordion type="multiple" className="w-full">
              {categorizedSpecs.map((category) => (
                <AccordionItem key={category.category} value={category.category}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{getCategoryIcon(category.category)}</span>
                      <span className="font-medium">{getCategoryLabel(category.category)}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.items.length} itens
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-4">
                      {category.items.map((spec) => (
                        <div key={spec.id} className="flex items-center justify-between p-3 border rounded-lg">
                          {editingSpec === spec.id ? (
                            <div className="flex-1 grid grid-cols-3 gap-2 mr-4">
                              <Input
                                value={editData.label || spec.label}
                                onChange={(e) => setEditData(prev => ({ ...prev, label: e.target.value }))}
                                placeholder="Rótulo"
                              />
                              <Input
                                value={editData.value || spec.value}
                                onChange={(e) => setEditData(prev => ({ ...prev, value: e.target.value }))}
                                placeholder="Valor"
                              />
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  checked={editData.highlight !== undefined ? editData.highlight : spec.highlight}
                                  onCheckedChange={(checked) => setEditData(prev => ({ ...prev, highlight: !!checked }))}
                                />
                                <span className="text-sm text-muted-foreground">Destacar</span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{spec.label}:</span>
                                <span>{spec.value}</span>
                                {spec.highlight && (
                                  <Badge variant="secondary" className="text-xs">
                                    DESTAQUE
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                          <div className="flex gap-2">
                            {editingSpec === spec.id ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdateSpecification(spec.id)}
                                >
                                  <Save className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingSpec(null);
                                    setEditData({});
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingSpec(spec.id);
                                    setEditData({
                                      label: spec.label,
                                      value: spec.value,
                                      highlight: spec.highlight
                                    });
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteSpecification(spec.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SpecificationCategoryManager;
