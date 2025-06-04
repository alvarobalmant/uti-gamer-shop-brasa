
import { useState } from 'react';
import { useBanners, Banner } from '@/hooks/useBanners';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Image, Info } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';
import { BannerForm } from './BannerManager/BannerForm';
import { BannerList } from './BannerManager/BannerList';

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
    background_type: 'gradient' as 'gradient' | 'image-only',
    display_order: 1,
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
      background_type: 'gradient' as 'gradient' | 'image-only',
      display_order: (banners.length + 1),
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
      button_image_url: banner.button_image_url || '',
      gradient: banner.gradient,
      background_type: banner.background_type || 'gradient',
      display_order: banner.display_order,
      is_active: banner.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar se há pelo menos um título, subtítulo ou botão
    if (!formData.title && !formData.subtitle && !formData.button_text) {
      alert('É necessário pelo menos um título, subtítulo ou botão.');
      return;
    }

    // Se há texto do botão, deve haver link
    if (formData.button_text && !formData.button_link) {
      alert('Se há texto do botão, o link é obrigatório.');
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
            <strong>Formatos:</strong> JPG, PNG, WebP<br />
            <strong>Upload:</strong> Arraste e solte ou clique para selecionar
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
            
            <BannerForm
              isOpen={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
              onSubmit={handleSubmit}
              editingBanner={editingBanner}
              formData={formData}
              setFormData={setFormData}
            />
          </Dialog>
        </div>

        <BannerList
          banners={banners}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </CardContent>
    </Card>
  );
};
