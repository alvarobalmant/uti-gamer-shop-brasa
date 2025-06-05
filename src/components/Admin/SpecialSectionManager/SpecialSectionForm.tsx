
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { SpecialSection, SpecialSectionCreateInput, SpecialSectionUpdateInput } from '@/types/specialSections';
import SpecialSectionFixedContentManager from './SpecialSectionFixedContentManager';

// Updated Zod schema to include new background fields
const sectionSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório (para identificação no painel)'),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
  background_type: z.enum(['color', 'image', 'gradient', 'transparent']).default('color'),
  background_value: z.string().optional().nullable(),
  background_image_position: z.enum(['center', 'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right']).default('center'),
  background_image_crop_data: z.any().optional().nullable(),
});

type SectionFormData = z.infer<typeof sectionSchema>;

interface SpecialSectionFormProps {
  section: SpecialSection | null;
  onSubmit: (data: SpecialSectionCreateInput | SpecialSectionUpdateInput) => void;
  onCancel: () => void;
}

const SpecialSectionForm: React.FC<SpecialSectionFormProps> = ({ section, onSubmit, onCancel }) => {
  const { register, handleSubmit, control, formState: { errors }, watch } = useForm<SectionFormData>({
    resolver: zodResolver(sectionSchema),
    defaultValues: section ? {
      title: section.title ?? '',
      description: section.description ?? '',
      is_active: section.is_active ?? true,
      background_type: (section.background_type as any) ?? 'color',
      background_value: section.background_value ?? '',
      background_image_position: (section.background_image_position as any) ?? 'center',
      background_image_crop_data: section.background_image_crop_data ?? null,
    } : {
      title: '',
      description: '',
      is_active: true,
      background_type: 'color',
      background_value: '',
      background_image_position: 'center',
      background_image_crop_data: null,
    },
  });

  const handleFormSubmit = (data: SectionFormData) => {
    // Ensure empty strings become null for the database
    const submitData = section
      ? { 
          ...data, 
          id: section.id,
          background_value: data.background_value || null,
          background_image_crop_data: data.background_image_crop_data || null
        }
      : { 
          ...data,
          background_value: data.background_value || null,
          background_image_crop_data: data.background_image_crop_data || null
        };
    onSubmit(submitData as SpecialSectionCreateInput | SpecialSectionUpdateInput);
  };

  const currentBackgroundType = watch('background_type');
  const currentBackgroundValue = watch('background_value');

  const getBackgroundPreview = () => {
    switch (currentBackgroundType) {
      case 'color':
        return { backgroundColor: currentBackgroundValue || '#FFFFFF' };
      case 'image':
        return { 
          backgroundImage: `url(${currentBackgroundValue})`,
          backgroundSize: 'cover',
          backgroundPosition: watch('background_image_position') || 'center'
        };
      case 'gradient':
        return { background: currentBackgroundValue || 'linear-gradient(to right, #000, #fff)' };
      case 'transparent':
        return { backgroundColor: 'transparent', border: '1px dashed #ccc' };
      default:
        return { backgroundColor: 'transparent' };
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700 text-white w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(handleFormSubmit)} id="section-details-form">
        <CardHeader>
          <CardTitle>{section ? 'Editar Seção Especial (Estrutura Fixa)' : 'Criar Nova Seção Especial (Estrutura Fixa)'}</CardTitle>
          <CardDescription className="text-gray-400">
            {section
              ? 'Configure o título, status, configurações de background e o conteúdo dos elementos pré-definidos abaixo.'
              : 'Defina um título, status e configurações de background. Após salvar, você poderá configurar o conteúdo.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div>
            <Label htmlFor="title">Título (Identificação Interna)</Label>
            <Input id="title" {...register('title')} className="bg-gray-700 border-gray-600 text-white" />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>
          <div>
            <Label htmlFor="description">Descrição (Opcional, para referência)</Label>
            <Textarea id="description" {...register('description')} className="bg-gray-700 border-gray-600 text-white" />
          </div>

          {/* Background Configuration */}
          <div className="space-y-4 p-4 border border-gray-600 rounded-md">
            <h4 className="text-lg font-medium">Configuração de Background</h4>
            
            {/* Background Type Selection */}
            <div>
              <Label htmlFor="background_type">Tipo de Background</Label>
              <Controller
                name="background_type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="color">Cor Sólida</SelectItem>
                      <SelectItem value="image">Imagem</SelectItem>
                      <SelectItem value="gradient">Gradiente</SelectItem>
                      <SelectItem value="transparent">Transparente</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Background Value Input */}
            <div>
              <Label htmlFor="background_value">
                {currentBackgroundType === 'color' && 'Cor (Hexadecimal, ex: #003087)'}
                {currentBackgroundType === 'image' && 'URL da Imagem'}
                {currentBackgroundType === 'gradient' && 'CSS Gradient (ex: linear-gradient(to right, #000, #fff))'}
                {currentBackgroundType === 'transparent' && 'Valor (deixe em branco para transparente)'}
              </Label>
              <Input
                id="background_value"
                type="text"
                placeholder={
                  currentBackgroundType === 'color' ? '#FFFFFF' :
                  currentBackgroundType === 'image' ? 'https://exemplo.com/imagem.jpg' :
                  currentBackgroundType === 'gradient' ? 'linear-gradient(to right, #000, #fff)' :
                  'Deixe em branco'
                }
                {...register('background_value')}
                className="bg-gray-700 border-gray-600 text-white"
              />
              {errors.background_value && <p className="text-red-500 text-sm">{errors.background_value.message}</p>}
            </div>

            {/* Image Position (only for image background) */}
            {currentBackgroundType === 'image' && (
              <div>
                <Label htmlFor="background_image_position">Posição da Imagem</Label>
                <Controller
                  name="background_image_position"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="center">Centro</SelectItem>
                        <SelectItem value="top">Topo</SelectItem>
                        <SelectItem value="bottom">Base</SelectItem>
                        <SelectItem value="left">Esquerda</SelectItem>
                        <SelectItem value="right">Direita</SelectItem>
                        <SelectItem value="top-left">Topo Esquerda</SelectItem>
                        <SelectItem value="top-right">Topo Direita</SelectItem>
                        <SelectItem value="bottom-left">Base Esquerda</SelectItem>
                        <SelectItem value="bottom-right">Base Direita</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            )}

            {/* Background Preview */}
            <div className="flex items-center space-x-4">
              <div className="flex-grow">
                <Label>Prévia do Background</Label>
                <div
                  className="w-full h-20 rounded border border-gray-500 flex items-center justify-center text-sm"
                  style={getBackgroundPreview()}
                >
                  {currentBackgroundType === 'transparent' && <span className="text-gray-400">Transparente</span>}
                  {currentBackgroundType !== 'transparent' && !currentBackgroundValue && (
                    <span className="text-gray-400">Defina um valor para ver a prévia</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Activation Status */}
          <div className="flex items-center space-x-2 pt-2">
            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <Switch
                  id="is_active"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="is_active">Seção Ativa (Visível no site)</Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4 pt-4 border-t border-gray-700 mt-6">
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button type="submit" form="section-details-form" className="bg-blue-600 hover:bg-blue-700">{section ? 'Salvar Detalhes da Seção' : 'Criar Seção'}</Button>
        </CardFooter>
      </form>

      {section && section.id && (
        <CardContent className="mt-6 border-t border-gray-700 pt-6">
          <fieldset className="border border-gray-600 p-4 rounded-md">
            <legend className="text-lg font-medium px-2">Configuração do Conteúdo (Estrutura Fixa)</legend>
            <SpecialSectionFixedContentManager sectionId={section.id} />
          </fieldset>
        </CardContent>
      )}

    </Card>
  );
};

export default SpecialSectionForm;
