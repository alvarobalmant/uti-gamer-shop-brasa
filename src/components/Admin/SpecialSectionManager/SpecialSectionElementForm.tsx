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
import { SpecialSectionElement, SpecialSectionElementCreateInput, SpecialSectionElementUpdateInput } from '@/types/specialSections'; // Assuming types exist

// Define element types based on analysis
const elementTypes = [
  'banner_full', // Banner Principal (Largura Total)
  'banner_medium', // Banners Médios (Lado a Lado) - Requires layout config
  'banner_small', // Banner Pequeno (Largura Total)
  'banner_product_highlight', // Banner de Destaque de Produto
  'product_carousel', // Carrossel/Grid de Produtos com Título
  'text_block', // Simple text block (optional, but useful)
] as const;

// Zod schema for element validation
const elementSchema = z.object({
  element_type: z.enum(elementTypes),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  image_url: z.string().url('URL inválida').optional().or(z.literal('')),
  link_url: z.string().url('URL inválida').optional().or(z.literal('')),
  link_text: z.string().optional(),
  // Background (can be specific to element)
  background_type: z.enum(['color', 'image', 'gradient', 'transparent']).default('transparent'),
  background_color: z.string().optional(),
  background_image_url: z.string().url('URL inválida').optional().or(z.literal('')),
  background_gradient: z.string().optional(),
  text_color: z.string().optional().default('#000000'),
  // Product Carousel specific
  content_type: z.enum(['products', 'tags', 'manual']).optional(), // How products are selected
  content_ids: z.array(z.string()).optional(), // Array of product/tag UUIDs
  // Layout specific (for medium banners, etc.)
  grid_position: z.string().optional(), // e.g., '1/1', '1/2', '2/2'
  grid_size: z.string().optional(), // e.g., '1x1', '2x1'
  width_percentage: z.number().int().min(0).max(100).optional(),
  height_desktop: z.number().int().min(0).optional(),
  height_mobile: z.number().int().min(0).optional(),
  // Common styling
  padding: z.number().int().min(0).optional().default(0),
  margin_bottom: z.number().int().min(0).optional().default(20),
  border_radius: z.number().int().min(0).optional().default(0),
  // Carousel specific display options
  visible_items_desktop: z.number().int().min(1).optional().default(4),
  visible_items_tablet: z.number().int().min(1).optional().default(3),
  visible_items_mobile: z.number().int().min(1).optional().default(1),
  is_active: z.boolean().default(true),
  display_order: z.number().int().optional().default(0),
  // mobile_settings: z.any().optional(), // TODO
});

type ElementFormData = z.infer<typeof elementSchema>;

interface SpecialSectionElementFormProps {
  element: Partial<SpecialSectionElement> | null; // Use partial for create
  onSubmit: (data: SpecialSectionElementCreateInput | SpecialSectionElementUpdateInput) => void;
  onCancel: () => void;
  // TODO: Pass available products/tags for selection
}

const SpecialSectionElementForm: React.FC<SpecialSectionElementFormProps> = ({ element, onSubmit, onCancel }) => {
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<ElementFormData>({
    resolver: zodResolver(elementSchema),
    defaultValues: element ? {
        ...element,
        image_url: element.image_url ?? '',
        link_url: element.link_url ?? '',
        background_image_url: element.background_image_url ?? '',
        content_ids: Array.isArray(element.content_ids) ? element.content_ids : [],
        // Ensure numbers are numbers
        width_percentage: element.width_percentage ?? undefined,
        height_desktop: element.height_desktop ?? undefined,
        height_mobile: element.height_mobile ?? undefined,
        padding: element.padding ?? 0,
        margin_bottom: element.margin_bottom ?? 20,
        border_radius: element.border_radius ?? 0,
        visible_items_desktop: element.visible_items_desktop ?? 4,
        visible_items_tablet: element.visible_items_tablet ?? 3,
        visible_items_mobile: element.visible_items_mobile ?? 1,
        display_order: element.display_order ?? 0,
    } : {
        element_type: 'banner_full',
        is_active: true,
        background_type: 'transparent',
        text_color: '#000000',
        padding: 0,
        margin_bottom: 20,
        border_radius: 0,
        visible_items_desktop: 4,
        visible_items_tablet: 3,
        visible_items_mobile: 1,
        display_order: 0,
        content_ids: [],
    },
  });

  const selectedElementType = watch('element_type');
  const backgroundType = watch('background_type');

  const handleFormSubmit = (data: ElementFormData) => {
    const processedData = {
      ...data,
      image_url: data.image_url === '' ? null : data.image_url,
      link_url: data.link_url === '' ? null : data.link_url,
      background_image_url: data.background_image_url === '' ? null : data.background_image_url,
      // Ensure optional numbers are null if empty, or keep the number
      width_percentage: data.width_percentage === undefined ? null : data.width_percentage,
      height_desktop: data.height_desktop === undefined ? null : data.height_desktop,
      height_mobile: data.height_mobile === undefined ? null : data.height_mobile,
    };
    onSubmit(processedData as SpecialSectionElementCreateInput | SpecialSectionElementUpdateInput);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 bg-gray-850 p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-semibold text-white mb-4">{element ? 'Editar Elemento' : 'Adicionar Novo Elemento'}</h3>

      {/* Element Type Selection */}
      <div>
        <Label htmlFor="element_type">Tipo de Elemento</Label>
        <Controller
          name="element_type"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {elementTypes.map(type => (
                  <SelectItem key={type} value={type}>{type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Common Fields */}
      <div>
        <Label htmlFor="title">Título (Opcional)</Label>
        <Input id="title" {...register('title')} className="bg-gray-700 border-gray-600 text-white" />
      </div>

      {/* Conditional Fields based on Element Type */}
      {(selectedElementType === 'banner_full' || selectedElementType === 'banner_medium' || selectedElementType === 'banner_small' || selectedElementType === 'banner_product_highlight') && (
        <>
          <div>
            <Label htmlFor="subtitle">Subtítulo/Descrição (Opcional)</Label>
            <Textarea id="subtitle" {...register('subtitle')} className="bg-gray-700 border-gray-600 text-white" />
          </div>
          <div>
            <Label htmlFor="image_url">URL da Imagem Principal</Label>
            <Input id="image_url" {...register('image_url')} className="bg-gray-700 border-gray-600 text-white" />
            {errors.image_url && <p className="text-red-500 text-sm">{errors.image_url.message}</p>}
          </div>
          <div>
            <Label htmlFor="link_url">URL do Link (Opcional)</Label>
            <Input id="link_url" {...register('link_url')} className="bg-gray-700 border-gray-600 text-white" />
            {errors.link_url && <p className="text-red-500 text-sm">{errors.link_url.message}</p>}
          </div>
           <div>
            <Label htmlFor="link_text">Texto do Botão/Link (Opcional)</Label>
            <Input id="link_text" {...register('link_text')} className="bg-gray-700 border-gray-600 text-white" />
          </div>
        </>
      )}

      {selectedElementType === 'product_carousel' && (
        <>
           <div>
             <Label htmlFor="content_type">Selecionar Produtos Por:</Label>
              <Controller
                name="content_type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Método de seleção" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tags">Tags (Categorias)</SelectItem>
                      <SelectItem value="manual">Seleção Manual</SelectItem>
                      {/* Add 'products' if needed for specific product IDs */}
                    </SelectContent>
                  </Select>
                )}
              />
           </div>
           {/* TODO: Implement Product/Tag selection based on content_type */} 
           <div className='text-yellow-400 p-4 bg-yellow-900/30 rounded border border-yellow-700'>
             <p>TODO: Implementar seleção de Produtos/Tags aqui.</p>
             <p>Por enquanto, salve o elemento e edite os IDs manualmente no Supabase se necessário.</p>
           </div>
           <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="visible_items_desktop">Itens Visíveis (Desktop)</Label>
                <Input id="visible_items_desktop" type="number" {...register('visible_items_desktop', { valueAsNumber: true })} className="bg-gray-700 border-gray-600 text-white" />
              </div>
              <div>
                <Label htmlFor="visible_items_tablet">Itens Visíveis (Tablet)</Label>
                <Input id="visible_items_tablet" type="number" {...register('visible_items_tablet', { valueAsNumber: true })} className="bg-gray-700 border-gray-600 text-white" />
              </div>
              <div>
                <Label htmlFor="visible_items_mobile">Itens Visíveis (Mobile)</Label>
                <Input id="visible_items_mobile" type="number" {...register('visible_items_mobile', { valueAsNumber: true })} className="bg-gray-700 border-gray-600 text-white" />
              </div>
           </div>
        </>
      )}

      {selectedElementType === 'text_block' && (
         <div>
            <Label htmlFor="subtitle">Conteúdo do Texto (Use Markdown)</Label>
            <Textarea id="subtitle" {...register('subtitle')} rows={5} className="bg-gray-700 border-gray-600 text-white" />
          </div>
      )}

      {/* TODO: Add fields for layout: grid_position, grid_size, width_percentage, height_desktop, height_mobile */} 
      {/* TODO: Add fields for element-specific background/text color */} 

      {/* Common Settings */}
       <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="display_order">Ordem de Exibição (dentro da seção)</Label>
            <Input id="display_order" type="number" {...register('display_order', { valueAsNumber: true })} className="bg-gray-700 border-gray-600 text-white" />
          </div>
          <div className="flex items-center space-x-2 pt-6">
            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <Switch
                  id="is_active_element"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="is_active_element">Ativo</Label>
          </div>
       </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700 mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Salvar Elemento</Button>
      </div>
    </form>
  );
};

export default SpecialSectionElementForm;
