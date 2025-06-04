
import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useSpecialSections } from '@/hooks/useSpecialSections';
import { SpecialSection, CreateSpecialSectionInput } from '@/types/specialSections';

interface SpecialSectionFormProps {
  section?: SpecialSection | null;
  onClose: () => void;
}

export const SpecialSectionForm: React.FC<SpecialSectionFormProps> = ({
  section,
  onClose,
}) => {
  const { createSection, updateSection, isCreating, isUpdating } = useSpecialSections();
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateSpecialSectionInput>({
    defaultValues: {
      title: section?.title || '',
      description: section?.description || '',
      background_type: section?.background_type || 'color',
      background_color: section?.background_color || '#FFFFFF',
      background_image_url: section?.background_image_url || '',
      background_gradient: section?.background_gradient || '',
      padding_top: section?.padding_top || 40,
      padding_bottom: section?.padding_bottom || 40,
      padding_left: section?.padding_left || 20,
      padding_right: section?.padding_right || 20,
      margin_top: section?.margin_top || 50,
      margin_bottom: section?.margin_bottom || 50,
      border_radius: section?.border_radius || 0,
      is_active: section?.is_active ?? true,
      display_order: section?.display_order || 0,
    },
  });

  const backgroundType = watch('background_type');

  const onSubmit = async (data: CreateSpecialSectionInput) => {
    try {
      if (section) {
        await updateSection({ ...data, id: section.id });
      } else {
        await createSection(data);
      }
      onClose();
    } catch (error) {
      console.error('Error saving section:', error);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {section ? 'Editar Seção Especial' : 'Nova Seção Especial'}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                {...register('title', { required: 'Título é obrigatório' })}
                placeholder="Digite o título da seção"
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="display_order">Ordem de Exibição</Label>
              <Input
                id="display_order"
                type="number"
                {...register('display_order', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Descrição opcional da seção"
            />
          </div>

          <div className="space-y-4">
            <Label>Tipo de Fundo</Label>
            <Select
              value={backgroundType}
              onValueChange={(value) => setValue('background_type', value as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="color">Cor Sólida</SelectItem>
                <SelectItem value="image">Imagem</SelectItem>
                <SelectItem value="gradient">Gradiente</SelectItem>
              </SelectContent>
            </Select>

            {backgroundType === 'color' && (
              <div className="space-y-2">
                <Label htmlFor="background_color">Cor de Fundo</Label>
                <Input
                  id="background_color"
                  type="color"
                  {...register('background_color')}
                />
              </div>
            )}

            {backgroundType === 'image' && (
              <div className="space-y-2">
                <Label htmlFor="background_image_url">URL da Imagem</Label>
                <Input
                  id="background_image_url"
                  {...register('background_image_url')}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
            )}

            {backgroundType === 'gradient' && (
              <div className="space-y-2">
                <Label htmlFor="background_gradient">Gradiente CSS</Label>
                <Input
                  id="background_gradient"
                  {...register('background_gradient')}
                  placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="padding_top">Padding Top (px)</Label>
              <Input
                id="padding_top"
                type="number"
                {...register('padding_top', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="padding_bottom">Padding Bottom (px)</Label>
              <Input
                id="padding_bottom"
                type="number"
                {...register('padding_bottom', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="padding_left">Padding Left (px)</Label>
              <Input
                id="padding_left"
                type="number"
                {...register('padding_left', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="padding_right">Padding Right (px)</Label>
              <Input
                id="padding_right"
                type="number"
                {...register('padding_right', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="margin_top">Margin Top (px)</Label>
              <Input
                id="margin_top"
                type="number"
                {...register('margin_top', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="margin_bottom">Margin Bottom (px)</Label>
              <Input
                id="margin_bottom"
                type="number"
                {...register('margin_bottom', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="border_radius">Border Radius (px)</Label>
              <Input
                id="border_radius"
                type="number"
                {...register('border_radius', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={watch('is_active')}
              onCheckedChange={(checked) => setValue('is_active', checked)}
            />
            <Label htmlFor="is_active">Seção ativa</Label>
          </div>

          <div className="flex items-center gap-2 pt-4">
            <Button
              type="submit"
              disabled={isCreating || isUpdating}
            >
              {isCreating || isUpdating
                ? 'Salvando...'
                : section
                ? 'Atualizar Seção'
                : 'Criar Seção'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
