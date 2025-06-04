
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Banner } from '@/hooks/useBanners';

interface BannerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  editingBanner: Banner | null;
  formData: {
    title: string;
    subtitle: string;
    button_text: string;
    button_link: string;
    image_url: string;
    button_image_url: string;
    gradient: string;
    background_type: 'gradient' | 'image-only';
    display_order: number;
    is_active: boolean;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    title: string;
    subtitle: string;
    button_text: string;
    button_link: string;
    image_url: string;
    button_image_url: string;
    gradient: string;
    background_type: 'gradient' | 'image-only';
    display_order: number;
    is_active: boolean;
  }>>;
}

const backgroundOptions = [
  { value: 'gradient' as const, label: 'Gradiente' },
  { value: 'image-only' as const, label: 'Somente Imagem' },
];

const gradientOptions = [
  { value: 'from-purple-600 via-red-600 to-orange-500', label: 'Roxo para Laranja' },
  { value: 'from-red-700 via-red-600 to-red-500', label: 'Vermelho Intenso' },
  { value: 'from-blue-600 via-purple-600 to-red-600', label: 'Azul para Vermelho' },
  { value: 'from-red-600 via-orange-500 to-yellow-500', label: 'Vermelho para Amarelo' },
  { value: 'from-green-600 via-red-600 to-red-700', label: 'Verde para Vermelho' },
  { value: 'from-gray-800 via-gray-700 to-gray-600', label: 'Tons de Cinza' },
];

export const BannerForm: React.FC<BannerFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingBanner,
  formData,
  setFormData,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-red-600">
            {editingBanner ? 'Editar Banner' : 'Novo Banner'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={onSubmit} className="space-y-4">
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
              <Label htmlFor="display_order">Posição</Label>
              <Input
                id="display_order"
                type="number"
                min="1"
                max="5"
                value={formData.display_order}
                onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) }))}
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

          <ImageUpload
            onImageUploaded={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
            currentImage={formData.image_url}
            label="Imagem do Banner"
            folder="banners"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="background_type">Tipo de Fundo</Label>
              <select
                id="background_type"
                value={formData.background_type}
                onChange={(e) => setFormData(prev => ({ ...prev, background_type: e.target.value as 'gradient' | 'image-only' }))}
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
                <Label htmlFor="button_link">Link do Botão</Label>
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
              onClick={onClose}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
