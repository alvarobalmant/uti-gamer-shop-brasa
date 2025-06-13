
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ElementFormData, ElementType, BackgroundType } from '@/types/specialSectionElements';

const elementSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  subtitle: z.string().optional(),
  element_type: z.enum(['banner_full', 'banner_medium', 'banner_small', 'banner_product_highlight', 'product_carousel', 'text_block']),
  image_url: z.string().optional(),
  link_url: z.string().optional(),
  link_text: z.string().optional(),
  display_order: z.number().min(0),
  is_active: z.boolean(),
  background_type: z.enum(['color', 'image', 'gradient', 'transparent']),
  background_value: z.string().optional(),
  text_color: z.string().optional(),
  font_size: z.number().min(8).max(72),
  font_weight: z.number().min(100).max(900),
  text_align: z.string().optional(),
  padding_top: z.number().min(0),
  padding_bottom: z.number().min(0),
  padding_left: z.number().min(0),
  padding_right: z.number().min(0),
  margin_top: z.number().min(0),
  margin_bottom: z.number().min(0),
  border_width: z.number().min(0),
  border_color: z.string().optional(),
  border_radius: z.number().min(0),
  shadow_type: z.string().optional(),
  animation_type: z.string().optional(),
  custom_css: z.string().optional(),
});

interface SpecialSectionElementFormProps {
  element?: Partial<ElementFormData>;
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
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ElementFormData>({
    resolver: zodResolver(elementSchema),
    defaultValues: {
      title: element?.title || '',
      subtitle: element?.subtitle || '',
      element_type: (element?.element_type as ElementType) || 'banner_full',
      image_url: element?.image_url || '',
      link_url: element?.link_url || '',
      link_text: element?.link_text || '',
      display_order: element?.display_order || 0,
      is_active: element?.is_active ?? true,
      background_type: (element?.background_type as BackgroundType) || 'color',
      background_value: element?.background_value || '',
      text_color: element?.text_color || '#000000',
      font_size: element?.font_size || 16,
      font_weight: element?.font_weight || 400,
      text_align: element?.text_align || 'left',
      padding_top: element?.padding_top || 0,
      padding_bottom: element?.padding_bottom || 0,
      padding_left: element?.padding_left || 0,
      padding_right: element?.padding_right || 0,
      margin_top: element?.margin_top || 0,
      margin_bottom: element?.margin_bottom || 0,
      border_width: element?.border_width || 0,
      border_color: element?.border_color || '#000000',
      border_radius: element?.border_radius || 0,
      shadow_type: element?.shadow_type || '',
      animation_type: element?.animation_type || '',
      custom_css: element?.custom_css || '',
    }
  });

  const watchedElementType = watch('element_type');

  const handleElementTypeChange = (value: string) => {
    setValue('element_type', value as ElementType);
  };

  const handleBackgroundTypeChange = (value: string) => {
    setValue('background_type', value as BackgroundType);
  };

  const handleActiveChange = (checked: boolean) => {
    setValue('is_active', checked);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            {...register('title')}
            placeholder="Digite o título do elemento"
          />
          {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="subtitle">Subtítulo</Label>
          <Input
            id="subtitle"
            {...register('subtitle')}
            placeholder="Digite o subtítulo (opcional)"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="element_type">Tipo do Elemento</Label>
          <Select onValueChange={handleElementTypeChange} defaultValue={watchedElementType}>
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

        <div>
          <Label htmlFor="display_order">Ordem de Exibição</Label>
          <Input
            id="display_order"
            type="number"
            {...register('display_order', { valueAsNumber: true })}
            placeholder="0"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={watch('is_active')}
          onCheckedChange={handleActiveChange}
        />
        <Label htmlFor="is_active">Elemento Ativo</Label>
      </div>

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
