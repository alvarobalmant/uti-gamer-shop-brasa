import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import ImageUploadInput from '@/components/Admin/ImageUploadInput';
import { useTags } from '@/hooks/useTags';
import { useProducts } from '@/hooks/useProducts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

// Define the structure for carousel configuration
const carouselConfigSchema = z.object({
  title: z.string().optional(),
  selection_mode: z.enum(['tags', 'products', 'combined']).optional().default('products'),
  tag_ids: z.array(z.string()).optional().default([]),
  product_ids: z.array(z.string()).optional().default([]),
});

// Define the structure of the fixed content configuration (matching GameStop layout)
const fixedContentSchema = z.object({
  banner_principal: z.object({ image_url: z.string().url().or(z.literal('')).optional(), link_url: z.string().url().or(z.literal('')).optional() }).optional(),
  banner_medio_1: z.object({ image_url: z.string().url().or(z.literal('')).optional(), title: z.string().optional(), subtitle: z.string().optional(), link_url: z.string().url().or(z.literal('')).optional() }).optional(),
  banner_medio_2: z.object({ image_url: z.string().url().or(z.literal('')).optional(), title: z.string().optional(), subtitle: z.string().optional(), link_url: z.string().url().or(z.literal('')).optional() }).optional(),
  banner_pequeno: z.object({ image_url: z.string().url().or(z.literal('')).optional(), link_url: z.string().url().or(z.literal('')).optional() }).optional(),
  banner_destaque: z.object({ title: z.string().optional(), subtitle: z.string().optional(), link_url: z.string().url().or(z.literal('')).optional(), button_text: z.string().optional() }).optional(),
  carrossel_1: carouselConfigSchema.optional(),
  carrossel_2: carouselConfigSchema.optional(),
});

type FixedContentFormData = z.infer<typeof fixedContentSchema>;

interface SpecialSectionFixedContentManagerProps {
  sectionId: string;
}

const SpecialSectionFixedContentManager: React.FC<SpecialSectionFixedContentManagerProps> = ({ sectionId }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { tags, loading: tagsLoading } = useTags();
  const { products, loading: productsLoading, refetch: refetchProducts } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  
  const { register, handleSubmit, control, reset, setValue, formState: { errors, isDirty } } = useForm<FixedContentFormData>({
    resolver: zodResolver(fixedContentSchema),
    defaultValues: { 
        banner_principal: { image_url: '', link_url: '' },
        banner_medio_1: { image_url: '', title: '', subtitle: '', link_url: '' },
        banner_medio_2: { image_url: '', title: '', subtitle: '', link_url: '' },
        banner_pequeno: { image_url: '', link_url: '' },
        banner_destaque: { title: '', subtitle: '', link_url: '', button_text: '' },
        carrossel_1: { title: '', selection_mode: 'products', tag_ids: [], product_ids: [] },
        carrossel_2: { title: '', selection_mode: 'products', tag_ids: [], product_ids: [] },
    }
  });

  const carrossel1Value = useWatch({ control, name: 'carrossel_1' });
  const carrossel2Value = useWatch({ control, name: 'carrossel_2' });

  const fetchContentConfig = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('special_sections')
        .select('content_config')
        .eq('id', sectionId)
        .single();

      if (error) {
        if (error.message.includes('column special_sections.content_config does not exist')) {
          toast({
            title: 'Erro de Configuração do Banco',
            description: "A coluna 'content_config' não existe na tabela 'special_sections'. Peça ao administrador para adicioná-la (tipo jsonb).",
            variant: 'destructive',
            duration: 10000,
          });
        } else {
          throw error;
        }
      } else if (data?.content_config) {
        const fetchedConfig = data.content_config as FixedContentFormData;
        const defaults = {
            selection_mode: 'products',
            tag_ids: [],
            product_ids: [],
        };
        reset({
            ...fetchedConfig,
            carrossel_1: { ...defaults, title: '', ...fetchedConfig.carrossel_1 },
            carrossel_2: { ...defaults, title: '', ...fetchedConfig.carrossel_2 },
        });
      }
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar configuração de conteúdo',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [sectionId, reset, toast]);

  useEffect(() => {
    fetchContentConfig();
    refetchProducts();
  }, [fetchContentConfig, refetchProducts]);

  const handleSaveContent = async (data: FixedContentFormData) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('special_sections')
        .update({ content_config: data })
        .eq('id', sectionId);

      if (error) throw error;
      toast({
        title: 'Conteúdo da seção especial salvo com sucesso!',
      });
      reset(data);
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar conteúdo da seção especial',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const nameMatch = product.name && typeof product.name === 'string' 
                      ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) 
                      : false;
    const skuMatch = product.sku && typeof product.sku === 'string' 
                     ? product.sku.toLowerCase().includes(searchTerm.toLowerCase()) 
                     : false;
    return nameMatch || skuMatch;
  });

  const CarouselConfigSection = ({ 
    carouselKey, 
    carouselValue 
  }: { 
    carouselKey: 'carrossel_1' | 'carrossel_2', 
    carouselValue: any 
  }) => {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor={`${carouselKey}-title`}>Título do Carrossel</Label>
          <Input 
            id={`${carouselKey}-title`} 
            {...register(`${carouselKey}.title`)} 
            className="bg-gray-700 border-gray-600 text-white" 
          />
        </div>
        
        <div>
          <Label htmlFor={`${carouselKey}-mode`}>Modo de Seleção de Produtos</Label>
          <Controller
            name={`${carouselKey}.selection_mode`}
            control={control}
            render={({ field }) => (
              <Select 
                value={field.value} 
                onValueChange={(value: 'tags' | 'products' | 'combined') => field.onChange(value)}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Selecione o modo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tags">Por Tags</SelectItem>
                  <SelectItem value="products">Produtos Específicos</SelectItem>
                  <SelectItem value="combined">Combinado (Tags + Produtos)</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        
        {(carouselValue?.selection_mode === 'tags' || carouselValue?.selection_mode === 'combined') && (
          <div className="space-y-2">
            <Label>Selecione as Tags</Label>
            {tagsLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <ScrollArea className="h-40 border rounded-md p-2 bg-gray-800">
                <div className="space-y-2">
                  {tags.map(tag => (
                    <div key={tag.id} className="flex items-center space-x-2">
                      <Controller
                        name={`${carouselKey}.tag_ids`}
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id={`tag-${tag.id}-${carouselKey}`}
                            checked={field.value?.includes(tag.id)}
                            onCheckedChange={(checked) => {
                              const currentTags = field.value || [];
                              if (checked) {
                                field.onChange([...currentTags, tag.id]);
                              } else {
                                field.onChange(currentTags.filter(id => id !== tag.id));
                              }
                            }}
                          />
                        )}
                      />
                      <Label htmlFor={`tag-${tag.id}-${carouselKey}`} className="text-sm">{tag.name}</Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        )}
        
        {(carouselValue?.selection_mode === 'products' || carouselValue?.selection_mode === 'combined') && (
          <div className="space-y-2">
            <Label>Selecione os Produtos</Label>
            <Input
              placeholder="Buscar produtos por nome ou SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white mb-2"
            />
            {productsLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <ScrollArea className="h-40 border rounded-md p-2 bg-gray-800">
                <div className="space-y-2">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="flex items-center space-x-2">
                      <Controller
                        name={`${carouselKey}.product_ids`}
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id={`product-${product.id}-${carouselKey}`}
                            checked={field.value?.includes(product.id)}
                            onCheckedChange={(checked) => {
                              const currentProducts = field.value || [];
                              if (checked) {
                                field.onChange([...currentProducts, product.id]);
                              } else {
                                field.onChange(currentProducts.filter(id => id !== product.id));
                              }
                            }}
                          />
                        )}
                      />
                      <Label htmlFor={`product-${product.id}-${carouselKey}`} className="text-sm">
                        {product.name || 'Produto sem nome'} ({product.sku || 'Sem SKU'})
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center p-10"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>;
  }

  return (
    <form onSubmit={handleSubmit(handleSaveContent)} className="space-y-6 mt-4">

      {/* --- Banner Principal --- */}
      <fieldset className="border border-gray-600 p-4 rounded-md">
        <legend className="text-md font-medium px-2 text-gray-300">Banner Principal (Topo)</legend>
        <div className="space-y-3">
          <Controller
            name="banner_principal.image_url"
            control={control}
            render={({ field }) => (
              <ImageUploadInput
                label="Imagem do Banner"
                currentImageUrl={field.value}
                onUploadComplete={(url) => setValue('banner_principal.image_url', url, { shouldDirty: true })}
                requiredWidth={1200} // Corrected Dimension
                requiredHeight={180} // Corrected Dimension
              />
            )}
          />
          <div>
            <Label htmlFor="bp_link">URL do Link (Opcional)</Label>
            <Input id="bp_link" {...register('banner_principal.link_url')} className="bg-gray-700 border-gray-600 text-white" />
             {errors.banner_principal?.link_url && <p className="text-red-500 text-sm">{errors.banner_principal.link_url.message}</p>}
          </div>
        </div>
      </fieldset>

      {/* --- Banners Médios --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <fieldset className="border border-gray-600 p-4 rounded-md">
            <legend className="text-md font-medium px-2 text-gray-300">Banner Médio 1 (Esquerda)</legend>
             <div className="space-y-3">
                <Controller
                  name="banner_medio_1.image_url"
                  control={control}
                  render={({ field }) => (
                    <ImageUploadInput
                      label="Imagem"
                      currentImageUrl={field.value}
                      onUploadComplete={(url) => setValue('banner_medio_1.image_url', url, { shouldDirty: true })}
                      requiredWidth={600} // Corrected Dimension
                      requiredHeight={300} // Corrected Dimension
                    />
                  )}
                />
                <div><Label>Título (Opcional)</Label><Input {...register('banner_medio_1.title')} className="bg-gray-700 border-gray-600 text-white" /></div>
                <div><Label>Subtítulo (Opcional)</Label><Textarea {...register('banner_medio_1.subtitle')} className="bg-gray-700 border-gray-600 text-white" /></div>
                <div><Label>URL Link (Opcional)</Label><Input {...register('banner_medio_1.link_url')} className="bg-gray-700 border-gray-600 text-white" /></div>
             </div>
          </fieldset>
           <fieldset className="border border-gray-600 p-4 rounded-md">
            <legend className="text-md font-medium px-2 text-gray-300">Banner Médio 2 (Direita)</legend>
             <div className="space-y-3">
                 <Controller
                  name="banner_medio_2.image_url"
                  control={control}
                  render={({ field }) => (
                    <ImageUploadInput
                      label="Imagem"
                      currentImageUrl={field.value}
                      onUploadComplete={(url) => setValue('banner_medio_2.image_url', url, { shouldDirty: true })}
                      requiredWidth={600} // Corrected Dimension
                      requiredHeight={300} // Corrected Dimension
                    />
                  )}
                />
                <div><Label>Título (Opcional)</Label><Input {...register('banner_medio_2.title')} className="bg-gray-700 border-gray-600 text-white" /></div>
                <div><Label>Subtítulo (Opcional)</Label><Textarea {...register('banner_medio_2.subtitle')} className="bg-gray-700 border-gray-600 text-white" /></div>
                <div><Label>URL Link (Opcional)</Label><Input {...register('banner_medio_2.link_url')} className="bg-gray-700 border-gray-600 text-white" /></div>
             </div>
          </fieldset>
      </div>

      {/* --- Banner Pequeno --- */}
      <fieldset className="border border-gray-600 p-4 rounded-md">
        <legend className="text-md font-medium px-2 text-gray-300">Banner Pequeno (Abaixo dos Médios)</legend>
        <div className="space-y-3">
          <Controller
            name="banner_pequeno.image_url"
            control={control}
            render={({ field }) => (
              <ImageUploadInput
                label="Imagem do Banner"
                currentImageUrl={field.value}
                onUploadComplete={(url) => setValue('banner_pequeno.image_url', url, { shouldDirty: true })}
                requiredWidth={1200} // Corrected Dimension
                requiredHeight={180} // Corrected Dimension
              />
            )}
          />
          <div>
            <Label htmlFor="bpq_link">URL do Link (Opcional)</Label>
            <Input id="bpq_link" {...register('banner_pequeno.link_url')} className="bg-gray-700 border-gray-600 text-white" />
             {errors.banner_pequeno?.link_url && <p className="text-red-500 text-sm">{errors.banner_pequeno.link_url.message}</p>}
          </div>
        </div>
      </fieldset>

      {/* --- Carrossel 1 --- */}
      <fieldset className="border border-gray-600 p-4 rounded-md">
        <legend className="text-md font-medium px-2 text-gray-300">Carrossel de Produtos 1</legend>
        <CarouselConfigSection carouselKey="carrossel_1" carouselValue={carrossel1Value} />
      </fieldset>

      {/* --- Carrossel 2 --- */}
      <fieldset className="border border-gray-600 p-4 rounded-md">
        <legend className="text-md font-medium px-2 text-gray-300">Carrossel de Produtos 2</legend>
        <CarouselConfigSection carouselKey="carrossel_2" carouselValue={carrossel2Value} />
      </fieldset>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={saving || !isDirty} className="bg-green-600 hover:bg-green-700">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {saving ? 'Salvando...' : 'Salvar Conteúdo da Seção'}
        </Button>
      </div>
    </form>
  );
};

export default SpecialSectionFixedContentManager;

