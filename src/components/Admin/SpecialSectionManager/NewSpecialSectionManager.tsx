import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller, useWatch, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { 
  Loader2, 
  PlusCircle, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Settings, 
  Package, 
  Image, 
  Sparkles, 
  Save, 
  XCircle, 
  Upload,
  Monitor,
  Smartphone,
  Tablet,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Wifi,
  WifiOff,
  RefreshCw
} from 'lucide-react';
import { useTags } from '@/hooks/useTags';
import { useProducts } from '@/hooks/useProducts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import BannersSection from './BannersSection';
import CarouselSection from './CarouselSection';

// Schemas de validação
const carouselConfigSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  selection_mode: z.enum(['tags', 'products', 'combined']).default('products'),
  tag_ids: z.array(z.string()).default([]),
  product_ids: z.array(z.string()).default([]),
});

const bannerSchema = z.object({
  type: z.enum(['full_width', 'half_width', 'third_width', 'quarter_width', 'product_highlight']),
  image_url: z.string().url().or(z.literal('')).optional(),
  link_url: z.string().url().or(z.literal('')).optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  button_text: z.string().optional(),
  enable_hover_animation: z.boolean().default(true),
});

const bannerRowSchema = z.object({
  row_id: z.string().uuid().optional(),
  layout: z.enum(['1_col_full', '2_col_half', '3_col_third', '4_col_quarter', 'custom']),
  banners: z.array(bannerSchema),
  custom_sizes: z.array(z.object({
    width: z.string(),
    widthUnit: z.string(),
    height: z.string()
  })).optional(), // Para layouts customizados
});

const specialSectionConfigSchema = z.object({
  banner_rows: z.array(bannerRowSchema).default([]),
  carrossel_1: carouselConfigSchema.optional(),
  carrossel_2: carouselConfigSchema.optional(),
  // Novas configurações de layout
  layout_settings: z.object({
    show_background: z.boolean().default(true),
    carousel_display: z.enum(['both', 'carousel1_only', 'carousel2_only', 'none']).default('both'),
    device_visibility: z.object({
      mobile: z.boolean().default(true),
      tablet: z.boolean().default(true),
      desktop: z.boolean().default(true),
    }).default({
      mobile: true,
      tablet: true,
      desktop: true,
    }),
  }).default({
    show_background: true,
    carousel_display: 'both',
    device_visibility: {
      mobile: true,
      tablet: true,
      desktop: true,
    },
  }),
});

type SpecialSectionConfig = z.infer<typeof specialSectionConfigSchema>;

interface NewSpecialSectionManagerProps {
  sectionId: string;
}

const NewSpecialSectionManager: React.FC<NewSpecialSectionManagerProps> = ({ sectionId }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState('banners');
  
  const { tags, loading: tagsLoading } = useTags();
  const { products, loading: productsLoading, refetch: refetchProducts } = useProducts();

  const { 
    handleSubmit, 
    control, 
    reset, 
    formState: { errors, isDirty }, 
    getValues, 
    setValue,
    watch
  } = useForm<SpecialSectionConfig>({
    resolver: zodResolver(specialSectionConfigSchema),
    defaultValues: {
      banner_rows: [],
      carrossel_1: { 
        title: '', 
        selection_mode: 'products', 
        tag_ids: [], 
        product_ids: [] 
      },
      carrossel_2: { 
        title: '', 
        selection_mode: 'products', 
        tag_ids: [], 
        product_ids: [] 
      },
      layout_settings: {
        show_background: true,
        carousel_display: 'both',
        device_visibility: {
          mobile: true,
          tablet: true,
          desktop: true,
        },
      },
    }
  });

  const carrossel1Value = useWatch({ control, name: 'carrossel_1' });
  const carrossel2Value = useWatch({ control, name: 'carrossel_2' });

  // Verificar conexão com o banco de dados
  const checkConnection = useCallback(async () => {
    setConnectionStatus('checking');
    try {
      const { data, error } = await supabase
        .from('special_sections')
        .select('id')
        .eq('id', sectionId)
        .single();
      
      if (error) throw error;
      setConnectionStatus('connected');
    } catch (error) {
      console.error('Erro de conexão:', error);
      setConnectionStatus('disconnected');
    }
  }, [sectionId]);

  // Carregar configuração do banco de dados
  const fetchContentConfig = useCallback(async () => {
    setLoading(true);
    try {
      await checkConnection();
      
      const { data, error } = await supabase
        .from('special_sections')
        .select('content_config')
        .eq('id', sectionId)
        .single();

      if (error) {
        if (error.message.includes('column special_sections.content_config does not exist')) {
          toast({
            title: 'Erro de Configuração do Banco',
            description: "A coluna 'content_config' não existe na tabela 'special_sections'. Entre em contato com o administrador.",
            variant: 'destructive',
            duration: 10000,
          });
        } else {
          throw error;
        }
      } else if (data?.content_config) {
        const fetchedConfig = data.content_config as SpecialSectionConfig;
        
        // Garantir que os valores padrão estejam presentes
        const configWithDefaults = {
          banner_rows: fetchedConfig.banner_rows || [],
          carrossel_1: {
            title: fetchedConfig.carrossel_1?.title || '',
            selection_mode: fetchedConfig.carrossel_1?.selection_mode || 'products',
            tag_ids: fetchedConfig.carrossel_1?.tag_ids || [],
            product_ids: fetchedConfig.carrossel_1?.product_ids || [],
          },
          carrossel_2: {
            title: fetchedConfig.carrossel_2?.title || '',
            selection_mode: fetchedConfig.carrossel_2?.selection_mode || 'products',
            tag_ids: fetchedConfig.carrossel_2?.tag_ids || [],
            product_ids: fetchedConfig.carrossel_2?.product_ids || [],
          },
          layout_settings: {
            show_background: fetchedConfig.layout_settings?.show_background ?? true,
            carousel_display: fetchedConfig.layout_settings?.carousel_display || 'both',
            device_visibility: {
              mobile: fetchedConfig.layout_settings?.device_visibility?.mobile ?? true,
              tablet: fetchedConfig.layout_settings?.device_visibility?.tablet ?? true,
              desktop: fetchedConfig.layout_settings?.device_visibility?.desktop ?? true,
            },
          },
        };
        
        reset(configWithDefaults);
        console.log("NewSpecialSectionManager: Configuração carregada e resetada. banner_rows:", configWithDefaults.banner_rows);
      }
    } catch (error: any) {
      console.error('Erro ao carregar configuração:', error);
      toast({
        title: 'Erro ao carregar configuração',
        description: error.message,
        variant: 'destructive',
      });
      setConnectionStatus('disconnected');
    } finally {
      setLoading(false);
    }
  }, [sectionId, reset, toast, checkConnection]);

  // Salvar configuração no banco de dados
  const handleSaveContent = async (data: SpecialSectionConfig) => {
    setSaving(true);
    try {
      await checkConnection();
      
      if (connectionStatus === 'disconnected') {
        throw new Error('Sem conexão com o banco de dados');
      }

      const { error } = await supabase
        .from('special_sections')
        .update({ content_config: data })
        .eq('id', sectionId);

      if (error) throw error;

      setLastSaved(new Date());
      toast({
        title: 'Configuração salva com sucesso!',
        description: 'Todas as alterações foram salvas no banco de dados.',
        variant: 'default',
      });
    } catch (error: any) {
      console.error('Erro ao salvar configuração:', error);
      toast({
        title: 'Erro ao salvar configuração',
        description: error.message,
        variant: 'destructive',
      });
      setConnectionStatus('disconnected');
    } finally {
      setSaving(false);
    }
  };

  // Upload de imagem para Supabase Storage
  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `special-sections/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('site-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Erro no upload da imagem:', error);
      throw new Error('Falha no upload da imagem');
    }
  };

  useEffect(() => {
    fetchContentConfig();
    refetchProducts();
  }, [fetchContentConfig, refetchProducts]);

  useEffect(() => {
    const interval = setInterval(checkConnection, 30000); // Verificar conexão a cada 30 segundos
    return () => clearInterval(interval);
  }, [checkConnection]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1A2E] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto" />
          <p className="text-white">Carregando configurações...</p>
          <p className="text-gray-400 text-sm">Conectando com o banco de dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white pb-24">
      {/* Header */}
      <div className="bg-[#2C2C44] border-b border-[#343A40] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Configuração de Seções Especiais</h1>
            <p className="text-gray-400 mt-1">Configure banners e carrosséis de produtos</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Status de Conexão */}
            <div className="flex items-center gap-2">
              {connectionStatus === 'connected' && (
                <>
                  <Wifi className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 text-sm">Conectado</span>
                </>
              )}
              {connectionStatus === 'disconnected' && (
                <>
                  <WifiOff className="h-4 w-4 text-red-400" />
                  <span className="text-red-400 text-sm">Desconectado</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={checkConnection}
                    className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                  >
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </>
              )}
              {connectionStatus === 'checking' && (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-yellow-400" />
                  <span className="text-yellow-400 text-sm">Verificando...</span>
                </>
              )}
            </div>
            
            {/* Última atualização */}
            {lastSaved && (
              <div className="text-sm text-gray-400">
                Salvo em: {lastSaved.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      {connectionStatus === 'disconnected' && (
        <Alert className="mx-6 mt-4 border-red-500 bg-red-500/10">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-400">
            Sem conexão com o banco de dados. Verifique sua conexão e tente novamente.
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs Navigation */}
      <div className="px-6 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-[#2C2C44] border border-[#343A40]">
            <TabsTrigger 
              value="banners" 
              className="data-[state=active]:bg-[#FF8C00] data-[state=active]:text-white"
            >
              <Image className="h-4 w-4 mr-2" />
              Banners
            </TabsTrigger>
            <TabsTrigger 
              value="carousel1" 
              className="data-[state=active]:bg-[#007BFF] data-[state=active]:text-white"
            >
              <Package className="h-4 w-4 mr-2" />
              Carrossel 1
            </TabsTrigger>
            <TabsTrigger 
              value="carousel2" 
              className="data-[state=active]:bg-[#007BFF] data-[state=active]:text-white"
            >
              <Package className="h-4 w-4 mr-2" />
              Carrossel 2
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-[#6C757D] data-[state=active]:text-white"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <div className="mt-6">
            <TabsContent value="banners">
              <BannersSection 
                control={control}
                onImageUpload={handleImageUpload}
                setValue={setValue}
              />
            </TabsContent>
            
            <TabsContent value="carousel1">
              <CarouselSection
                control={control}
                carouselKey="carrossel_1"
                carouselValue={carrossel1Value}
                tags={tags}
                products={products}
                tagsLoading={tagsLoading}
                productsLoading={productsLoading}
              />
            </TabsContent>
            
            <TabsContent value="carousel2">
              <CarouselSection
                control={control}
                carouselKey="carrossel_2"
                carouselValue={carrossel2Value}
                tags={tags}
                products={products}
                tagsLoading={tagsLoading}
                productsLoading={productsLoading}
              />
            </TabsContent>
            
            <TabsContent value="settings">
              <Card className="bg-[#2C2C44] border-[#343A40]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configurações de Layout
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Configure a aparência e comportamento da seção especial
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Configuração de Fundo */}
                  <div className="space-y-3">
                    <Label className="text-white font-medium">Aparência da Seção</Label>
                    <Controller
                      name="layout_settings.show_background"
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="show_background"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-gray-600 data-[state=checked]:bg-[#FF8C00] data-[state=checked]:border-[#FF8C00]"
                          />
                          <Label htmlFor="show_background" className="text-gray-300 cursor-pointer">
                            Mostrar fundo da seção
                          </Label>
                        </div>
                      )}
                    />
                    <p className="text-xs text-gray-500">
                      Quando desabilitado, a seção terá fundo transparente, ideal para banners promocionais avulsos
                    </p>
                  </div>

                  <Separator className="bg-[#343A40]" />

                  {/* Configuração de Carrosséis */}
                  <div className="space-y-3">
                    <Label className="text-white font-medium">Exibição de Carrosséis</Label>
                    <Controller
                      name="layout_settings.carousel_display"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="space-y-3"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="both" id="both" className="border-gray-600 text-[#FF8C00]" />
                            <Label htmlFor="both" className="text-gray-300 cursor-pointer">
                              Mostrar ambos os carrosséis (1 e 2)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="carousel1_only" id="carousel1_only" className="border-gray-600 text-[#FF8C00]" />
                            <Label htmlFor="carousel1_only" className="text-gray-300 cursor-pointer">
                              Mostrar apenas Carrossel 1
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="carousel2_only" id="carousel2_only" className="border-gray-600 text-[#FF8C00]" />
                            <Label htmlFor="carousel2_only" className="text-gray-300 cursor-pointer">
                              Mostrar apenas Carrossel 2
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="none" id="none" className="border-gray-600 text-[#FF8C00]" />
                            <Label htmlFor="none" className="text-gray-300 cursor-pointer">
                              Não mostrar carrosséis
                            </Label>
                          </div>
                        </RadioGroup>
                      )}
                    />
                    <p className="text-xs text-gray-500">
                      Escolha quais carrosséis de produtos serão exibidos na seção especial
                    </p>
                  </div>

                  <Separator className="bg-[#343A40]" />

                  {/* Configuração de Visibilidade por Dispositivo */}
                  <div className="space-y-3">
                    <Label className="text-white font-medium">MOSTRAR EM</Label>
                    <div className="space-y-3">
                      <Controller
                        name="layout_settings.device_visibility.mobile"
                        control={control}
                        render={({ field }) => (
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id="show_mobile"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="border-gray-600 data-[state=checked]:bg-[#FF8C00] data-[state=checked]:border-[#FF8C00]"
                            />
                            <Label htmlFor="show_mobile" className="text-gray-300 cursor-pointer flex items-center gap-2">
                              <Smartphone className="h-4 w-4" />
                              CELULAR
                            </Label>
                          </div>
                        )}
                      />
                      
                      <Controller
                        name="layout_settings.device_visibility.tablet"
                        control={control}
                        render={({ field }) => (
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id="show_tablet"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="border-gray-600 data-[state=checked]:bg-[#FF8C00] data-[state=checked]:border-[#FF8C00]"
                            />
                            <Label htmlFor="show_tablet" className="text-gray-300 cursor-pointer flex items-center gap-2">
                              <Tablet className="h-4 w-4" />
                              TABLET
                            </Label>
                          </div>
                        )}
                      />
                      
                      <Controller
                        name="layout_settings.device_visibility.desktop"
                        control={control}
                        render={({ field }) => (
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id="show_desktop"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="border-gray-600 data-[state=checked]:bg-[#FF8C00] data-[state=checked]:border-[#FF8C00]"
                            />
                            <Label htmlFor="show_desktop" className="text-gray-300 cursor-pointer flex items-center gap-2">
                              <Monitor className="h-4 w-4" />
                              PC/DESKTOP
                            </Label>
                          </div>
                        )}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Marque os dispositivos onde esta seção especial deve aparecer
                    </p>
                  </div>

                  <Separator className="bg-[#343A40]" />

                  {/* Informações de debug */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-300">ID da Seção</Label>
                      <Input 
                        value={sectionId} 
                        readOnly 
                        className="bg-[#1A1A2E] border-[#343A40] text-gray-400"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-gray-300">Status da Conexão</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          className={
                            connectionStatus === 'connected' ? 'bg-green-500' :
                            connectionStatus === 'disconnected' ? 'bg-red-500' :
                            'bg-yellow-500'
                          }
                        >
                          {connectionStatus}
                        </Badge>
                      </div>
                    </div>
                    
                    {lastSaved && (
                      <div>
                        <Label className="text-gray-300">Última Atualização</Label>
                        <Input 
                          value={lastSaved.toLocaleString()} 
                          readOnly 
                          className="bg-[#1A1A2E] border-[#343A40] text-gray-400"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Footer com botões de ação */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#2C2C44] border-t border-[#343A40] px-6 py-4 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isDirty && (
              <Badge variant="outline" className="border-yellow-400 text-yellow-400">
                Alterações não salvas
              </Badge>
            )}
            {connectionStatus === 'disconnected' && (
              <Badge variant="outline" className="border-red-400 text-red-400">
                Sem conexão
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => fetchContentConfig()}
              disabled={loading}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            
            <Button
              onClick={handleSubmit(handleSaveContent)}
              disabled={saving || connectionStatus === 'disconnected'}
              className="bg-[#28A745] hover:bg-[#218838] text-white"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewSpecialSectionManager;

