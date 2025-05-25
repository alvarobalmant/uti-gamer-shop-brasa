
import { useState } from 'react';
import { useBanners, Banner } from '@/hooks/useBanners';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, Image, Info } from 'lucide-react';
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
    button_image_url: '',
    gradient: 'from-red-600 via-red-600 to-red-700',
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
      button_image_url: '',
      gradient: 'from-red-600 via-red-600 to-red-700',
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
      button_text: banner.button_text,
      button_link: banner.button_link,
      image_url: banner.image_url || '',
      button_image_url: banner.button_image_url || '',
      gradient: banner.gradient,
      position: banner.position,
      is_active: banner.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.button_text || !formData.button_link) {
      alert('Texto e link do botão são obrigatórios.');
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
            <strong>Tamanho recomendado:</strong> 1920x600px (proporção 16:5)<br />
            <strong>Limite:</strong> Máximo 5 banners rotativos<br />
            <strong>Formatos:</strong> JPG, PNG, WebP
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
            
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl text-red-600">
                  {editingBanner ? 'Editar Banner' : 'Novo Banner'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
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
                    <Label htmlFor="button_text">Texto do Botão *</Label>
                    <Input
                      id="button_text"
                      value={formData.button_text}
                      onChange={(e) => setFormData(prev => ({ ...prev, button_text: e.target.value }))}
                      placeholder="Ex: Entre em Contato"
                      required
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

                <div className="space-y-2">
                  <Label htmlFor="button_link">Link do Botão *</Label>
                  <Input
                    id="button_link"
                    value={formData.button_link}
                    onChange={(e) => setFormData(prev => ({ ...prev, button_link: e.target.value }))}
                    placeholder="Ex: /categoria/ofertas ou https://wa.me/5527996882090"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image_url">URL da Imagem do Banner (Opcional)</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    placeholder="https://exemplo.com/banner.jpg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="button_image_url">URL da Imagem do Botão (Opcional)</Label>
                  <Input
                    id="button_image_url"
                    value={formData.button_image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, button_image_url: e.target.value }))}
                    placeholder="https://exemplo.com/icone-botao.png"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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

                <div className="flex gap-4 pt-4">
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
            banners.map((banner) => (
              <Card key={banner.id} className="border-2 border-gray-200">
                <CardContent className="p-4">
                  <div className={`relative bg-gradient-to-br ${banner.gradient} text-white p-4 rounded-lg mb-4`}>
                    <div className="text-center">
                      {banner.title && (
                        <div className="bg-red-600 text-white font-bold mb-2 px-2 py-1 rounded text-xs inline-block">
                          ♦ {banner.title}
                        </div>
                      )}
                      {banner.subtitle && (
                        <h3 className="font-bold mb-2 text-sm">{banner.subtitle}</h3>
                      )}
                      <div className="bg-white text-gray-900 px-3 py-1 rounded text-xs inline-block">
                        {banner.button_text}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div><strong>Posição:</strong> {banner.position}</div>
                    <div><strong>Link:</strong> {banner.button_link}</div>
                    {banner.image_url && (
                      <div><strong>Imagem:</strong> Configurada</div>
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
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
