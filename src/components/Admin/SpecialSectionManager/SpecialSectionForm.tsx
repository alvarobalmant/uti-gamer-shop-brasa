import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { SpecialSection, SpecialSectionCreateInput, SpecialSectionUpdateInput } from '@/types/specialSections';
import SpecialSectionFixedContentManager from './SpecialSectionFixedContentManager';

// Updated Zod schema to include background_color
const sectionSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório (para identificação no painel)'),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
  background_color: z.string().optional().nullable(), // Add background color field
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
      background_color: section.background_color ?? '', // Load existing color
    } : {
      title: '',
      description: '',
      is_active: true,
      background_color: '', // Default empty
    },
  });

  const handleFormSubmit = (data: SectionFormData) => {
    // Ensure empty string becomes null for the database
    const submitData = section
      ? { ...data, id: section.id, background_color: data.background_color || null }
      : { ...data, background_color: data.background_color || null };
    onSubmit(submitData as SpecialSectionCreateInput | SpecialSectionUpdateInput);
  };

  const currentBgColor = watch('background_color'); // Watch the color for preview

  return (
    <Card className="bg-gray-800 border-gray-700 text-white w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(handleFormSubmit)} id="section-details-form">
        <CardHeader>
          <CardTitle>{section ? 'Editar Seção Especial (Estrutura Fixa)' : 'Criar Nova Seção Especial (Estrutura Fixa)'}</CardTitle>
          <CardDescription className="text-gray-400">
            {section
              ? 'Configure o título, status, cor de fundo e o conteúdo dos elementos pré-definidos abaixo.'
              : 'Defina um título, status e cor de fundo. Após salvar, você poderá configurar o conteúdo.'}
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

          {/* Background Color Input */}
          <div className="flex items-center space-x-4">
            <div className="flex-grow">
              <Label htmlFor="background_color">Cor de Fundo (Hexadecimal, ex: #003087)</Label>
              <Input
                id="background_color"
                type="text" // Use text input for hex code
                placeholder="#FFFFFF ou deixe em branco para padrão"
                {...register('background_color')}
                className="bg-gray-700 border-gray-600 text-white"
              />
              {errors.background_color && <p className="text-red-500 text-sm">{errors.background_color.message}</p>}
            </div>
            {/* Color Preview */}
            <div className="flex-shrink-0">
              <Label>Prévia</Label>
              <div
                className="w-10 h-10 rounded border border-gray-500"
                style={{ backgroundColor: currentBgColor || 'transparent' }}
              ></div>
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

