
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SpecialSectionElement } from '@/types/specialSections';

interface ElementFormData {
  title?: string;
  subtitle?: string;
  element_type: 'banner_full' | 'banner_medium' | 'banner_small' | 'banner_product_highlight' | 'product_carousel' | 'text_block';
  image_url?: string;
  link_url?: string;
  link_text?: string;
  display_order?: number;
  is_active?: boolean;
  background_type?: 'color' | 'image' | 'gradient' | 'transparent';
  background_color?: string;
  background_image_url?: string;
  background_gradient?: string;
  text_color?: string;
  button_color?: string;
  button_text_color?: string;
  content_type?: string;
  content_ids?: string[];
  grid_position?: string;
  grid_size?: string;
  width_percentage?: number;
  height_desktop?: number;
  height_mobile?: number;
  visible_items_desktop?: number;
  visible_items_tablet?: number;
  visible_items_mobile?: number;
  padding?: number;
  margin_bottom?: number;
  border_radius?: number;
}

interface SpecialSectionElementFormProps {
  element?: SpecialSectionElement;
  onSubmit: (data: ElementFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const SpecialSectionElementForm: React.FC<SpecialSectionElementFormProps> = ({
  element,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ElementFormData>({
    defaultValues: element ? {
      title: element.title || '',
      subtitle: element.subtitle || '',
      element_type: element.element_type as 'banner_full' | 'banner_medium' | 'banner_small' | 'banner_product_highlight' | 'product_carousel' | 'text_block',
      image_url: element.image_url || '',
      link_url: element.link_url || '',
      link_text: element.link_text || '',
      display_order: element.display_order || 0,
      is_active: element.is_active ?? true,
      background_type: (element.background_type || 'transparent') as 'color' | 'image' | 'gradient' | 'transparent',
      background_color: element.background_color || '#FFFFFF',
      background_image_url: element.background_image_url || '',
      background_gradient: element.background_gradient || '',
      text_color: element.text_color || '#000000',
      button_color: element.button_color || '',
      button_text_color: element.button_text_color || '',
      content_type: element.content_type || '',
      content_ids: element.content_ids || [],
      grid_position: element.grid_position || '',
      grid_size: element.grid_size || '',
      width_percentage: element.width_percentage || 100,
      height_desktop: element.height_desktop || 300,
      height_mobile: element.height_mobile || 200,
      visible_items_desktop: element.visible_items_desktop || 4,
      visible_items_tablet: element.visible_items_tablet || 3,
      visible_items_mobile: element.visible_items_mobile || 1,
      padding: element.padding || 20,
      margin_bottom: element.margin_bottom || 30,
      border_radius: element.border_radius || 0
    } : {
      title: '',
      subtitle: '',
      element_type: 'banner_full',
      image_url: '',
      link_url: '',
      link_text: '',
      display_order: 0,
      is_active: true,
      background_type: 'transparent',
      background_color: '#FFFFFF',
      background_image_url: '',
      background_gradient: '',
      text_color: '#000000',
      button_color: '',
      button_text_color: '',
      content_type: '',
      content_ids: [],
      grid_position: '',
      grid_size: '',
      width_percentage: 100,
      height_desktop: 300,
      height_mobile: 200,
      visible_items_desktop: 4,
      visible_items_tablet: 3,
      visible_items_mobile: 1,
      padding: 20,
      margin_bottom: 30,
      border_radius: 0
    }
  });

  const selectedElementType = watch('element_type');
  const selectedBackgroundType = watch('background_type');

  useEffect(() => {
    if (element) {
      reset({
        title: element.title || '',
        subtitle: element.subtitle || '',
        element_type: element.element_type as 'banner_full' | 'banner_medium' | 'banner_small' | 'banner_product_highlight' | 'product_carousel' | 'text_block',
        image_url: element.image_url || '',
        link_url: element.link_url || '',
        link_text: element.link_text || '',
        display_order: element.display_order || 0,
        is_active: element.is_active ?? true,
        background_type: (element.background_type || 'transparent') as 'color' | 'image' | 'gradient' | 'transparent',
        background_color: element.background_color || '#FFFFFF',
        background_image_url: element.background_image_url || '',
        background_gradient: element.background_gradient || '',
        text_color: element.text_color || '#000000',
        button_color: element.button_color || '',
        button_text_color: element.button_text_color || '',
        content_type: element.content_type || '',
        content_ids: element.content_ids || [],
        grid_position: element.grid_position || '',
        grid_size: element.grid_size || '',
        width_percentage: element.width_percentage || 100,
        height_desktop: element.height_desktop || 300,
        height_mobile: element.height_mobile || 200,
        visible_items_desktop: element.visible_items_desktop || 4,
        visible_items_tablet: element.visible_items_tablet || 3,
        visible_items_mobile: element.visible_items_mobile || 1,
        padding: element.padding || 20,
        margin_bottom: element.margin_bottom || 30,
        border_radius: element.border_radius || 0
      });
    }
  }, [element, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{element ? 'Editar' : 'Criar'} Elemento da Seção</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Título do elemento"
              />
            </div>
            
            <div>
              <Label htmlFor="element_type">Tipo de Elemento</Label>
              <Select 
                value={selectedElementType} 
                onValueChange={(value) => setValue('element_type', value as ElementFormData['element_type'])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="banner_full">Banner Completo</SelectItem>
                  <SelectItem value="banner_medium">Banner Médio</SelectItem>
                  <SelectItem value="banner_small">Banner Pequeno</SelectItem>
                  <SelectItem value="banner_product_highlight">Banner Destaque Produto</SelectItem>
                  <SelectItem value="product_carousel">Carrossel de Produtos</SelectItem>
                  <SelectItem value="text_block">Bloco de Texto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="subtitle">Subtítulo</Label>
            <Textarea
              id="subtitle"
              {...register('subtitle')}
              placeholder="Subtítulo ou descrição"
              rows={2}
            />
          </div>

          {/* Image and Link Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="image_url">URL da Imagem</Label>
              <Input
                id="image_url"
                {...register('image_url')}
                placeholder="https://..."
              />
            </div>
            
            <div>
              <Label htmlFor="link_url">URL do Link</Label>
              <Input
                id="link_url"
                {...register('link_url')}
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="link_text">Texto do Link/Botão</Label>
            <Input
              id="link_text"
              {...register('link_text')}
              placeholder="Ver mais, Comprar, etc."
            />
          </div>

          {/* Background Configuration */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="background_type">Tipo de Fundo</Label>
              <Select 
                value={selectedBackgroundType || 'transparent'} 
                onValueChange={(value) => setValue('background_type', value as ElementFormData['background_type'])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de fundo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transparent">Transparente</SelectItem>
                  <SelectItem value="color">Cor Sólida</SelectItem>
                  <SelectItem value="image">Imagem</SelectItem>
                  <SelectItem value="gradient">Gradiente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedBackgroundType === 'color' && (
              <div>
                <Label htmlFor="background_color">Cor de Fundo</Label>
                <Input
                  id="background_color"
                  type="color"
                  {...register('background_color')}
                />
              </div>
            )}

            {selectedBackgroundType === 'image' && (
              <div>
                <Label htmlFor="background_image_url">URL da Imagem de Fundo</Label>
                <Input
                  id="background_image_url"
                  {...register('background_image_url')}
                  placeholder="https://..."
                />
              </div>
            )}

            {selectedBackgroundType === 'gradient' && (
              <div>
                <Label htmlFor="background_gradient">CSS Gradient</Label>
                <Input
                  id="background_gradient"
                  {...register('background_gradient')}
                  placeholder="linear-gradient(45deg, #000, #fff)"
                />
              </div>
            )}
          </div>

          {/* Display Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="display_order">Ordem de Exibição</Label>
              <Input
                id="display_order"
                type="number"
                {...register('display_order', { valueAsNumber: true })}
              />
            </div>
            
            <div>
              <Label htmlFor="width_percentage">Largura (%)</Label>
              <Input
                id="width_percentage"
                type="number"
                min="1"
                max="100"
                {...register('width_percentage', { valueAsNumber: true })}
              />
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <Switch
                id="is_active"
                {...register('is_active')}
                defaultChecked={watch('is_active')}
                onCheckedChange={(checked) => setValue('is_active', checked)}
              />
              <Label htmlFor="is_active">Ativo</Label>
            </div>
          </div>

          {/* Product Carousel Specific */}
          {selectedElementType === 'product_carousel' && (
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-medium">Configurações do Carrossel</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="visible_items_desktop">Itens Visíveis (Desktop)</Label>
                  <Input
                    id="visible_items_desktop"
                    type="number"
                    min="1"
                    max="10"
                    {...register('visible_items_desktop', { valueAsNumber: true })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="visible_items_tablet">Itens Visíveis (Tablet)</Label>
                  <Input
                    id="visible_items_tablet"
                    type="number"
                    min="1"
                    max="6"
                    {...register('visible_items_tablet', { valueAsNumber: true })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="visible_items_mobile">Itens Visíveis (Mobile)</Label>
                  <Input
                    id="visible_items_mobile"
                    type="number"
                    min="1"
                    max="3"
                    {...register('visible_items_mobile', { valueAsNumber: true })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Styling */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="padding">Padding (px)</Label>
              <Input
                id="padding"
                type="number"
                min="0"
                {...register('padding', { valueAsNumber: true })}
              />
            </div>
            
            <div>
              <Label htmlFor="margin_bottom">Margem Inferior (px)</Label>
              <Input
                id="margin_bottom"
                type="number"
                min="0"
                {...register('margin_bottom', { valueAsNumber: true })}
              />
            </div>
            
            <div>
              <Label htmlFor="border_radius">Border Radius (px)</Label>
              <Input
                id="border_radius"
                type="number"
                min="0"
                {...register('border_radius', { valueAsNumber: true })}
              />
            </div>
            
            <div>
              <Label htmlFor="text_color">Cor do Texto</Label>
              <Input
                id="text_color"
                type="color"
                {...register('text_color')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : element ? 'Atualizar' : 'Criar'}
        </Button>
      </div>
    </form>
  );
};

export default SpecialSectionElementForm;
