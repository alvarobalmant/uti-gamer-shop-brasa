import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Save, Settings2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface SpecialSectionFormProps {
  section?: any;
  onSave: (sectionData: any) => void;
  onCancel: () => void;
  mode: 'create' | 'edit';
}

const SECTION_TYPES = [
  { value: 'banner_hero', label: 'Banner Hero' },
  { value: 'product_carousel', label: 'Carrossel de Produtos' },
  { value: 'custom_banner', label: 'Banner Personalizado' },
  { value: 'promo_banner', label: 'Banner Promocional' }
];

export const SpecialSectionForm: React.FC<SpecialSectionFormProps> = ({
  section,
  onSave,
  onCancel,
  mode
}) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'banner_hero',
    visibility: 'active',
    section_key: '',
    config: {}
  });

  useEffect(() => {
    if (section && mode === 'edit') {
      setFormData({
        title: section.title || '',
        type: section.type || 'banner_hero',
        visibility: section.visibility || 'active',
        section_key: section.section_key || '',
        config: section.config || {}
      });
    }
  }, [section, mode]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConfigChange = (configField: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config,
        [configField]: value
      }
    }));
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      toast.error('Por favor, insira um título para a seção');
      return;
    }

    const sectionData = {
      ...formData,
      section_key: formData.section_key || `special_${Date.now()}`
    };

    onSave(sectionData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            {mode === 'create' ? 'Criar Seção Especial' : 'Editar Seção Especial'}
          </h2>
          <p className="text-sm text-muted-foreground">
            Configure o tipo, título e configurações da seção especial.
          </p>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Settings2 className="w-4 h-4" />
              Configurações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="type">Tipo da Seção *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione o tipo da seção" />
                </SelectTrigger>
                <SelectContent>
                  {SECTION_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="title">Título da Seção *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Ex: Banner Principal"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="section_key">Chave da Seção</Label>
              <Input
                id="section_key"
                value={formData.section_key}
                onChange={(e) => handleInputChange('section_key', e.target.value)}
                placeholder="Ex: banner_principal"
                className="mt-1"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.visibility === 'active'}
                onCheckedChange={(checked) => handleInputChange('visibility', checked ? 'active' : 'inactive')}
              />
              <Label>Seção ativa</Label>
            </div>
          </CardContent>
        </Card>

        {/* Configuration based on section type */}
        {formData.type === 'banner_hero' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Configurações do Banner Hero
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="banner_title">Título do Banner</Label>
                <Input
                  id="banner_title"
                  value={(formData.config as any)?.banner_title || ''}
                  onChange={(e) => handleConfigChange('banner_title', e.target.value)}
                  placeholder="Título do banner"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="banner_subtitle">Subtítulo do Banner</Label>
                <Input
                  id="banner_subtitle"
                  value={(formData.config as any)?.banner_subtitle || ''}
                  onChange={(e) => handleConfigChange('banner_subtitle', e.target.value)}
                  placeholder="Subtítulo do banner"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="cta_text">Texto do Botão CTA</Label>
                <Input
                  id="cta_text"
                  value={(formData.config as any)?.cta_text || ''}
                  onChange={(e) => handleConfigChange('cta_text', e.target.value)}
                  placeholder="Ex: Saiba Mais"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="cta_url">URL do Botão CTA</Label>
                <Input
                  id="cta_url"
                  value={(formData.config as any)?.cta_url || ''}
                  onChange={(e) => handleConfigChange('cta_url', e.target.value)}
                  placeholder="Ex: /produtos"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {formData.type === 'product_carousel' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Configurações do Carrossel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="carousel_title">Título do Carrossel</Label>
                <Input
                  id="carousel_title"
                  value={(formData.config as any)?.carousel_title || ''}
                  onChange={(e) => handleConfigChange('carousel_title', e.target.value)}
                  placeholder="Título do carrossel"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="max_products">Máximo de Produtos</Label>
                <Input
                  type="number"
                  id="max_products"
                  value={(formData.config as any)?.max_products || 8}
                  onChange={(e) => handleConfigChange('max_products', parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={(formData.config as any)?.show_price || false}
                  onCheckedChange={(checked) => handleConfigChange('show_price', checked)}
                />
                <Label>Mostrar Preços</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={(formData.config as any)?.autoplay || false}
                  onCheckedChange={(checked) => handleConfigChange('autoplay', checked)}
                />
                <Label>Autoplay</Label>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

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