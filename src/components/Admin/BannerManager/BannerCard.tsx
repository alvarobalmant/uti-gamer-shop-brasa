
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit } from 'lucide-react';
import { Banner } from '@/hooks/useBanners';

interface BannerCardProps {
  banner: Banner;
  onEdit: (banner: Banner) => void;
  onDelete: (id: string) => void;
}

export const BannerCard: React.FC<BannerCardProps> = ({
  banner,
  onEdit,
  onDelete,
}) => {
  return (
    <Card className="border-2 border-gray-200">
      <CardContent className="p-4">
        <div className={`relative text-white p-4 rounded-lg mb-4 ${
          banner.background_type === 'image-only' 
            ? 'bg-gray-800' 
            : `bg-gradient-to-br ${banner.gradient}`
        }`}>
          {banner.image_url && banner.background_type === 'image-only' && (
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
            {banner.button_text && banner.button_link && (
              <div className="bg-white text-gray-900 px-3 py-1 rounded text-xs inline-flex items-center gap-1">
                {banner.button_image_url && (
                  <img src={banner.button_image_url} alt="" className="w-3 h-3" />
                )}
                {banner.button_text}
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div><strong>Posição:</strong> {banner.display_order}</div>
          <div><strong>Tipo:</strong> {banner.background_type === 'image-only' ? 'Somente Imagem' : 'Gradiente'}</div>
          {banner.button_link && <div><strong>Link:</strong> {banner.button_link}</div>}
          {banner.image_url && <div><strong>Imagem:</strong> Configurada</div>}
          <Badge className={banner.is_active ? "bg-green-600" : "bg-gray-600"}>
            {banner.is_active ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button
            onClick={() => onEdit(banner)}
            size="sm"
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <Edit className="w-4 h-4 mr-1" />
            Editar
          </Button>
          
          <Button
            onClick={() => onDelete(banner.id)}
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
};
