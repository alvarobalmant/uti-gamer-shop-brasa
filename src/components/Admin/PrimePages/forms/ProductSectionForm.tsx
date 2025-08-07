import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProductSelector } from '@/components/Admin/SpecialSections/UI/ProductSelector';
import { Save, Link as LinkIcon, Settings2, Package, Tag } from 'lucide-react';
import { toast } from 'sonner';

interface ProductSectionFormProps {
  section?: any;
  onSave: (sectionData: any) => void;
  onCancel: () => void;
  mode: 'create' | 'edit';
}

export const ProductSectionForm: React.FC<ProductSectionFormProps> = ({
  section,
  onSave,
  onCancel,
  mode
}) => {
  const [formData, setFormData] = useState({
    title: '',
    section_key: '',
    view_all_link: '',
    mode: 'manual',
    selectedProducts: [],
    criteria: {},
    is_active: true
  });

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('title');

  useEffect(() => {
    if (section && mode === 'edit') {
      setFormData({
        title: section.section_config?.title || section.section_config?.name || '',
        section_key: section.section_key || '',
        view_all_link: section.section_config?.view_all_link || '',
        mode: section.section_config?.mode || 'manual',
        selectedProducts: section.section_config?.selectedProducts || [],
        criteria: section.section_config?.criteria || {},
        is_active: section.is_visible !== false
      });
      setSelectedProductIds(section.section_config?.selectedProducts || []);
    }
  }, [section, mode]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProductSelectionChange = (productIds: string[]) => {
    setSelectedProductIds(productIds);
    handleInputChange('selectedProducts', productIds);
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      toast.error('Por favor, insira um título para a seção');
      return;
    }

    if (formData.mode === 'manual' && selectedProductIds.length === 0) {
      toast.error('Selecione pelo menos um produto para a seção');
      return;
    }

    const sectionData = {
      ...formData,
      section_key: formData.section_key || `products_${Date.now()}`,
      selectedProducts: selectedProductIds
    };

    onSave(sectionData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            {mode === 'create' ? 'Criar Seção de Produtos' : 'Editar Seção de Produtos'}
          </h2>
          <p className="text-sm text-muted-foreground">
            Configure o título, aparência e conteúdo da seção de produtos.
          </p>
        </div>
      </div>

      <Separator />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="title">Título</TabsTrigger>
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="title" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Settings2 className="w-4 h-4" />
                Configurações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Título da Seção *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ex: Produtos em Destaque"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Este será o título exibido na página
                </p>
              </div>

              <div>
                <Label htmlFor="section_key">Chave da Seção</Label>
                <Input
                  id="section_key"
                  value={formData.section_key}
                  onChange={(e) => handleInputChange('section_key', e.target.value)}
                  placeholder="Ex: produtos_destaque"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Identificador único da seção (opcional)
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                />
                <Label>Seção ativa</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Package className="w-4 h-4" />
                Produtos Selecionados
                <Badge variant="outline">
                  {selectedProductIds.length} selecionados
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProductSelector
                selectedIds={selectedProductIds}
                onChange={handleProductSelectionChange}
                selectionType="manual"
                maxSelection={12}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                Link "Ver Todos" (Opcional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={formData.view_all_link}
                onChange={(e) => handleInputChange('view_all_link', e.target.value)}
                placeholder="Ex: /categoria/promocoes ou /secao/jogos-populares"
              />
              <p className="text-xs text-muted-foreground mt-2">
                URL para onde o botão "Ver Todos" irá direcionar. Deixe vazio se não quiser o botão.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator />

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit}>
          <Save className="w-4 h-4 mr-2" />
          {mode === 'create' ? 'Criar Seção' : 'Salvar Alterações'}
        </Button>
      </div>
    </div>
  );
};