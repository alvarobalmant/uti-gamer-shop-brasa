import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SpecialSectionElement, SpecialSectionElementCreateInput, SpecialSectionElementUpdateInput } from '@/types/specialSections';
import { useProducts } from '@/hooks/useProducts';
import { useTags } from '@/hooks/useTags';

const formSchema = z.object({
  element_type: z.enum(['banner', 'carousel', 'grid']),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  image_url: z.string().optional(),
  link_url: z.string().optional(),
  link_text: z.string().optional(),
  background_type: z.enum(['image', 'gradient', 'color', 'transparent']).optional(),
  background_color: z.string().optional(),
  background_image_url: z.string().optional(),
  background_gradient: z.string().optional(),
  text_color: z.string().optional(),
  button_color: z.string().optional(),
  button_text_color: z.string().optional(),
  content_type: z.string().optional(),
  content_ids: z.array(z.string()).optional(),
  width_percentage: z.number().optional(),
  height_desktop: z.number().optional(),
  height_mobile: z.number().optional(),
  padding: z.number().optional(),
  margin_bottom: z.number().optional(),
  border_radius: z.number().optional(),
  visible_items_desktop: z.number().optional(),
  visible_items_tablet: z.number().optional(),
  visible_items_mobile: z.number().optional(),
  is_active: z.boolean().optional(),
  display_order: z.number().optional(),
  grid_size: z.string().optional(),
  grid_position: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface SpecialSectionElementFormProps {
  element?: SpecialSectionElement;
  onSubmit: (data: SpecialSectionElementCreateInput | SpecialSectionElementUpdateInput) => void;
  onCancel: () => void;
  loading?: boolean;
}

const SpecialSectionElementForm: React.FC<SpecialSectionElementFormProps> = ({
  element,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const { products } = useProducts();
  const { tags } = useTags();
  const [selectedContentType, setSelectedContentType] = useState<string>(element?.content_type || 'products');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: element ? {
<<<<<<< HEAD
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
=======
      element_type: element.element_type as 'banner' | 'carousel' | 'grid',
      title: element.title || '',
      subtitle: element.subtitle || '',
      image_url: element.image_url || '',
      link_url: element.link_url || '',
      link_text: element.link_text || '',
      background_type: (element.background_type as 'image' | 'gradient' | 'color' | 'transparent') || 'color',
      background_color: element.background_color || '#FFFFFF',
      background_image_url: element.background_image_url || '',
      background_gradient: element.background_gradient || '',
      text_color: element.text_color || '#000000',
      button_color: element.button_color || '',
      button_text_color: element.button_text_color || '',
      content_type: element.content_type || 'products',
      content_ids: Array.isArray(element.content_ids) ? element.content_ids : [],
      width_percentage: element.width_percentage || 100,
      height_desktop: element.height_desktop || 300,
      height_mobile: element.height_mobile || 200,
      padding: element.padding || 20,
      margin_bottom: element.margin_bottom || 30,
      border_radius: element.border_radius || 0,
      visible_items_desktop: element.visible_items_desktop || 4,
      visible_items_tablet: element.visible_items_tablet || 3,
      visible_items_mobile: element.visible_items_mobile || 1,
      is_active: element.is_active ?? true,
      display_order: element.display_order || 0,
      grid_size: element.grid_size || '',
      grid_position: element.grid_position || '',
>>>>>>> 5a443887cf3fbab70105dd954c113ef55db70b7a
    } : {
      element_type: 'banner',
      title: '',
      subtitle: '',
      image_url: '',
      link_url: '',
      link_text: '',
      background_type: 'color',
      background_color: '#FFFFFF',
      background_image_url: '',
      background_gradient: '',
      text_color: '#000000',
      button_color: '',
      button_text_color: '',
      content_type: 'products',
      content_ids: [],
      width_percentage: 100,
      height_desktop: 300,
      height_mobile: 200,
      padding: 20,
      margin_bottom: 30,
      border_radius: 0,
      visible_items_desktop: 4,
      visible_items_tablet: 3,
      visible_items_mobile: 1,
      is_active: true,
      display_order: 0,
      grid_size: '',
      grid_position: '',
    }
  });

  const watchedElementType = form.watch('element_type');
  const watchedContentType = form.watch('content_type');

  useEffect(() => {
    if (watchedContentType) {
      setSelectedContentType(watchedContentType);
    }
  }, [watchedContentType]);

  const handleSubmit = (data: FormValues) => {
    onSubmit(data);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {element ? 'Editar Elemento' : 'Criar Novo Elemento'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Basic Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="element_type">Tipo de Elemento</Label>
              <Select
                value={form.watch('element_type')}
                onValueChange={(value) => form.setValue('element_type', value as 'banner' | 'carousel' | 'grid')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="banner">Banner</SelectItem>
                  <SelectItem value="carousel">Carrossel</SelectItem>
                  <SelectItem value="grid">Grade</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                {...form.register('title')}
                placeholder="Digite o título"
              />
            </div>
          </div>

          {/* Content Settings for Carousel/Grid */}
          {(watchedElementType === 'carousel' || watchedElementType === 'grid') && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="content_type">Tipo de Conteúdo</Label>
                <Select
                  value={selectedContentType}
                  onValueChange={(value) => {
                    setSelectedContentType(value);
                    form.setValue('content_type', value);
                    form.setValue('content_ids', []);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de conteúdo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="products">Produtos</SelectItem>
                    <SelectItem value="tags">Tags</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedContentType === 'products' && (
                <div>
                  <Label>Produtos Selecionados</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border p-2 rounded">
                    {products.map((product) => (
                      <div key={product.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`product-${product.id}`}
                          checked={form.watch('content_ids')?.includes(product.id) || false}
                          onChange={(e) => {
                            const currentIds = form.watch('content_ids') || [];
                            if (e.target.checked) {
                              form.setValue('content_ids', [...currentIds, product.id]);
                            } else {
                              form.setValue('content_ids', currentIds.filter(id => id !== product.id));
                            }
                          }}
                        />
                        <label htmlFor={`product-${product.id}`} className="text-sm">
                          {product.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedContentType === 'tags' && (
                <div>
                  <Label>Tags Selecionadas</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border p-2 rounded">
                    {tags.map((tag) => (
                      <div key={tag.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`tag-${tag.id}`}
                          checked={form.watch('content_ids')?.includes(tag.id) || false}
                          onChange={(e) => {
                            const currentIds = form.watch('content_ids') || [];
                            if (e.target.checked) {
                              form.setValue('content_ids', [...currentIds, tag.id]);
                            } else {
                              form.setValue('content_ids', currentIds.filter(id => id !== tag.id));
                            }
                          }}
                        />
                        <label htmlFor={`tag-${tag.id}`} className="text-sm">
                          {tag.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : element ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SpecialSectionElementForm;
