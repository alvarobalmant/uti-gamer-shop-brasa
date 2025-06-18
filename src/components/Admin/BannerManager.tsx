
import { useState } from 'react';
import { useBanners, Banner } from '@/hooks/useBanners';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, Image, Info, Monitor, Smartphone } from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

export const BannerManager = () => {
  const { banners, loading, addBanner, updateBanner, deleteBanner } = useBanners();
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    button_text: '',
    button_link: '',
    image_url: '',
    image_url_desktop: '',
    image_url_mobile: '',
    button_image_url: '',
    button_link_desktop: '',
    button_link_mobile: '',
    gradient: 'from-red-600 via-red-600 to-red-700',
    background_type: 'gradient',
    position: 1,
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      button_text: '',
      button_link: '',
      image_url: '',
      image_url_desktop: '',
      image_url_mobile: '',
      button_image_url: '',
      button_link_desktop: '',
      button_link_mobile: '',
      gradient: 'from-red-600 via-red-600 to-red-700',
      background_type: 'gradient',
      position: (banners.length + 1),
      is_active: true,
    });
    setEditingBanner(null);
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      button_text: banner.button_text || '',
      button_link: banner.button_link || '',
      image_url: banner.image_url || '',
      image_url_desktop: (banner as any).image_url_desktop || '',
      image_url_mobile: (banner as any).image_url_mobile || '',
      button_image_url: banner.button_image_url || '',
      button_link_desktop: (banner as any).button_link_desktop || '',
      button_link_mobile: (banner as any).button_link_mobile || '',
      gradient: banner.gradient,
      background_type: (banner as any).background_type || 'gradient',
      position: banner.position,
      is_active: banner.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar se há pelo menos uma imagem ou algum texto
    const hasImage = formData.image_url || formData.image_url_desktop || formData.image_url_mobile;
    const hasText = formData.title || formData.subtitle || formData.button_text;
    
    if (!hasImage && !hasText) {
      alert('É necessário pelo menos uma imagem ou algum texto (título, subtítulo ou botão).');
      return;
    }

    // Se há texto do botão, deve haver pelo menos um link
    if (formData.button_text && !formData.button_link && !formData.button_link_desktop && !formData.button_link_mobile) {
      alert('Se há texto do botão, pelo menos um link (geral, desktop ou mobile) é obrigatório.');
      return;
    }

    try {
      if (editingBanner) {
        await updateBanner(editingBanner.id, formData);
      } else {
        await addBanner(formData);
      }
      
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este banner?')) {
      await deleteBanner(id);
    }
  };

  const backgroundOptions = [
    { value: 'gradient', label: 'Gradiente' },
    { value: 'image-only', label: 'Somente Imagem' },
  ];

  const gradientOptions = [
    { value: 'from-purple-600 via-red-600 to-orange-500', label: 'Roxo para Laranja' },
    { value: 'from-red-700 via-red-600 to-red-500', label: 'Vermelho Intenso' },
    { value: 'from-blue-600 via-purple-600 to-red-600', label: 'Azul para Vermelho' },
    { value: 'from-red-600 via-orange-500 to-yellow-500', label: 'Vermelho para Amarelo' },
    { value: 'from-green-600 via-red-600 to-red-700', label: 'Verde para Vermelho' },
    { value: 'from-gray-800 via-gray-700 to-gray-600', label: 'Tons de Cinza' },
  ];

  return (
    <Card className="bg-white border-2 border-red-200">
      <CardHeader>
        <CardTitle className="text-xl text-red-600 flex items-center gap-2">
          <Image className="w-5 h-5" />
          Gerenciar Banners do Carousel
        </CardTitle>
        
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Tamanho recomendado:</strong> Desktop: 1920x600px, Mobile: 800x600px<br />
            <strong>Limite:</strong> Máximo 5 banners rotativos<br />
            <strong>Formatos:</strong> JPG, PNG, WebP<br />
            <strong>Novidade:</strong> Agora você pode criar banners apenas com imagens (sem texto) e usar imagens diferentes para desktop e mobile
          </AlertDescription>
        </Alert>
      </CardHeader>
      
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            {banners.length}/5 banners criados
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={banners.length >= 5}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Banner
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl text-red-600">
                  {editingBanner ? 'Editar Banner' : 'Novo Banner'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <Tabs defaultValue="content" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="content">Conteúdo</TabsTrigger>
                    <TabsTrigger value="images">Imagens</TabsTrigger>
                    <TabsTrigger value="responsive">Links Responsivos</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="content" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Título (Opcional)</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Ex: PROMOÇÃO ESPECIAL"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="position">Posição</Label>
                        <Input
                          id="position"
                          type="number"
                          min="1"
                          max="5"
                          value={formData.position}
                          onChange={(e) => setFormData(prev => ({ ...prev, position: parseInt(e.target.value) }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subtitle">Subtítulo (Opcional)</Label>
                      <Textarea
                        id="subtitle"
                        value={formData.subtitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                        placeholder="Ex: Compre e Venda Seus Games na UTI DOS GAMES!"
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="background_type">Tipo de Fundo</Label>
                        <select
                          id="background_type"
                          value={formData.background_type}
                          onChange={(e) => setFormData(prev => ({ ...prev, background_type: e.target.value }))}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                        >
                          {backgroundOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {formData.background_type === 'gradient' && (
                        <div className="space-y-2">
                          <Label htmlFor="gradient">Cor do Fundo</Label>
                          <select
                            id="gradient"
                            value={formData.gradient}
                            onChange={(e) => setFormData(prev => ({ ...prev, gradient: e.target.value }))}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                          >
                            {gradientOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="text-lg font-semibold mb-3">Botão (Opcional)</h4>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="button_text">Texto do Botão</Label>
                          <Input
                            id="button_text"
                            value={formData.button_text}
                            onChange={(e) => setFormData(prev => ({ ...prev, button_text: e.target.value }))}
                            placeholder="Ex: Entre em Contato"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="button_link">Link Geral do Botão</Label>
                          <Input
                            id="button_link"
                            value={formData.button_link}
                            onChange={(e) => setFormData(prev => ({ ...prev, button_link: e.target.value }))}
                            placeholder="Ex: /categoria/ofertas ou https://wa.me/5527996882090"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <ImageUpload
                          onImageUploaded={(url) => setFormData(prev => ({ ...prev, button_image_url: url }))}
                          currentImage={formData.button_image_url}
                          label="Imagem do Botão (Opcional)"
                          folder="buttons"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="images" className="space-y-4">
                    <Alert>
                      <Monitor className="h-4 w-4" />
                      <AlertDescription>
                        Use a <strong>Imagem Geral</strong> para uma imagem única em todos os dispositivos, ou configure imagens específicas para <strong>Desktop</strong> e <strong>Mobile</strong> para melhor experiência responsiva.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-6">
                      <div>
                        <Label className="text-base font-semibold mb-3 block">Imagem Geral</Label>
                        <ImageUpload
                          onImageUploaded={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                          currentImage={formData.image_url}
                          label="Imagem Única (Desktop e Mobile)"
                          folder="banners"
                        />
                      </div>

                      <div className="border-t pt-4">
                        <Label className="text-base font-semibold mb-3 block">Imagens Responsivas (Opcional)</Label>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label className="flex items-center gap-2 mb-2">
                              <Monitor className="w-4 h-4" />
                              Desktop (1920x600px)
                            </Label>
                            <ImageUpload
                              onImageUploaded={(url) => setFormData(prev => ({ ...prev, image_url_desktop: url }))}
                              currentImage={formData.image_url_desktop}
                              label="Imagem para Desktop"
                              folder="banners/desktop"
                            />
                          </div>

                          <div>
                            <Label className="flex items-center gap-2 mb-2">
                              <Smartphone className="w-4 h-4" />
                              Mobile (800x600px)
                            </Label>
                            <ImageUpload
                              onImageUploaded={(url) => setFormData(prev => ({ ...prev, image_url_mobile: url }))}
                              currentImage={formData.image_url_mobile}
                              label="Imagem para Mobile"
                              folder="banners/mobile"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="responsive" className="space-y-4">
                    <Alert>
                      <Smartphone className="h-4 w-4" />
                      <AlertDescription>
                        Configure links específicos para diferentes dispositivos. Se não configurados, será usado o <strong>Link Geral</strong> do botão.
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="button_link_desktop" className="flex items-center gap-2">
                          <Monitor className="w-4 h-4" />
                          Link Desktop
                        </Label>
                        <Input
                          id="button_link_desktop"
                          value={formData.button_link_desktop}
                          onChange={(e) => setFormData(prev => ({ ...prev, button_link_desktop: e.target.value }))}
                          placeholder="Link específico para desktop"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="button_link_mobile" className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4" />
                          Link Mobile
                        </Label>
                        <Input
                          id="button_link_mobile"
                          value={formData.button_link_mobile}
                          onChange={(e) => setFormData(prev => ({ ...prev, button_link_mobile: e.target.value }))}
                          placeholder="Link específico para mobile"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-4 pt-4 border-t">
                  <Button
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    {editingBanner ? 'Atualizar' : 'Criar'} Banner
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              Carregando banners...
            </div>
          ) : banners.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              Nenhum banner criado ainda.
            </div>
          ) : (
            banners.map((banner) => {
              const hasDesktopImage = (banner as any).image_url_desktop;
              const hasMobileImage = (banner as any).image_url_mobile;
              const hasResponsiveImages = hasDesktopImage || hasMobileImage;
              
              return (
                <Card key={banner.id} className="border-2 border-gray-200">
                  <CardContent className="p-4">
                    <div className={`relative text-white p-4 rounded-lg mb-4 ${
                      (banner as any).background_type === 'image-only' 
                        ? 'bg-gray-800' 
                        : `bg-gradient-to-br ${banner.gradient}`
                    }`}>
                      {banner.image_url && (banner as any).background_type === 'image-only' && (
                        <div 
                          className="absolute inset-0 bg-cover bg-center rounded-lg"
                          style={{ backgroundImage: `url(${banner.image_url})` }}
                        />
                      )}
                      <div className="relative text-center">
                        {banner.title && (
                          <div className="bg-red-600 text-white font-bold mb-2 px-2 py-1 rounded text-xs inline-block">
                            ♦ {banner.title}
                          </div>
                        )}
                        {banner.subtitle && (
                          <h3 className="font-bold mb-2 text-sm">{banner.subtitle}</h3>
                        )}
                        {banner.button_text && (
                          <div className="bg-white text-gray-900 px-3 py-1 rounded text-xs inline-flex items-center gap-1">
                            {banner.button_image_url && (
                              <img src={banner.button_image_url} alt="" className="w-3 h-3" />
                            )}
                            {banner.button_text}
                          </div>
                        )}
                        {!banner.title && !banner.subtitle && !banner.button_text && (
                          <div className="text-xs opacity-75 italic">Banner apenas com imagem</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div><strong>Posição:</strong> {banner.position}</div>
                      <div><strong>Tipo:</strong> {(banner as any).background_type === 'image-only' ? 'Somente Imagem' : 'Gradiente'}</div>
                      {banner.image_url && <div><strong>Imagem Geral:</strong> Configurada</div>}
                      {hasResponsiveImages && (
                        <div className="flex gap-2">
                          <strong>Responsivo:</strong>
                          {hasDesktopImage && <Badge variant="outline" className="text-xs">Desktop</Badge>}
                          {hasMobileImage && <Badge variant="outline" className="text-xs">Mobile</Badge>}
                        </div>
                      )}
                      {(banner.button_link || (banner as any).button_link_desktop || (banner as any).button_link_mobile) && (
                        <div><strong>Links:</strong> Configurados</div>
                      )}
                      <Badge className={banner.is_active ? "bg-green-600" : "bg-gray-600"}>
                        {banner.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={() => handleEdit(banner)}
                        size="sm"
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      
                      <Button
                        onClick={() => handleDelete(banner.id)}
                        size="sm"
                        variant="destructive"
                        className="flex-1"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};
