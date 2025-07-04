
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Star, Trash2, Plus, Upload, Link, Image } from 'lucide-react';
import { Product } from '@/hooks/useProducts/types';
import ImageDropZone from './ImageDropZone';

interface ProductImageCardProps {
  product: Product;
  onImageDrop: (productId: string, imageUrl: string, isMainImage?: boolean) => void;
  onRemoveImage: (productId: string, imageUrl: string, isMainImage?: boolean) => void;
  onFileUpload: (files: FileList | null, productId?: string, isMainImage?: boolean) => void;
  onUrlAdd: (productId: string, url: string, isMainImage?: boolean) => void;
  isSelected: boolean;
  onToggleSelection: () => void;
  uploading: boolean;
}

const ProductImageCard: React.FC<ProductImageCardProps> = ({
  product,
  onImageDrop,
  onRemoveImage,
  onFileUpload,
  onUrlAdd,
  isSelected,
  onToggleSelection,
  uploading
}) => {
  const [newImageUrl, setNewImageUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleUrlSubmit = (isMainImage: boolean = false) => {
    if (newImageUrl.trim()) {
      onUrlAdd(product.id, newImageUrl, isMainImage);
      setNewImageUrl('');
      setShowUrlInput(false);
    }
  };

  const additionalImages = product.additional_images || [];
  
  // Função segura para truncar IDs
  const truncateId = (id: string) => {
    if (!id || typeof id !== 'string') return 'N/A';
    return id.length > 8 ? `${id.slice(0, 8)}...` : id;
  };

  return (
    <Card className={`transition-all duration-200 ${isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm font-medium text-gray-900 truncate">
              {product.name || 'Produto sem nome'}
            </CardTitle>
            <p className="text-xs text-gray-500 mt-1">ID: {truncateId(product.id)}</p>
          </div>
          <Checkbox
            checked={isSelected}
            onCheckedChange={onToggleSelection}
            className="ml-2"
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Imagem Principal */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">Imagem Principal</span>
          </div>
          
          <ImageDropZone
            onDrop={(imageUrl) => onImageDrop(product.id, imageUrl, true)}
            onFileUpload={(files) => onFileUpload(files, product.id, true)}
            currentImage={product.image}
            onRemove={product.image ? () => onRemoveImage(product.id, product.image || '', true) : undefined}
            placeholder="Arraste a imagem principal aqui"
            uploading={uploading}
          />
          
          {!showUrlInput ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUrlInput(true)}
              className="w-full"
            >
              <Link className="w-4 h-4 mr-2" />
              Adicionar por URL
            </Button>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Cole a URL da imagem..."
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit(true)}
              />
              <Button
                size="sm"
                onClick={() => handleUrlSubmit(true)}
                disabled={!newImageUrl.trim()}
              >
                OK
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowUrlInput(false);
                  setNewImageUrl('');
                }}
              >
                ✕
              </Button>
            </div>
          )}
        </div>

        {/* Imagens Secundárias */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Imagens Secundárias</span>
            <Badge variant="outline" className="text-xs">
              {additionalImages.length}
            </Badge>
          </div>

          {/* Grid de imagens secundárias */}
          <div className="grid grid-cols-2 gap-2">
            {additionalImages.map((imageUrl, index) => (
              <div key={`${product.id}-${index}`} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border">
                  <img
                    src={imageUrl}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-image.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                    <Button
                      size="sm"
                      variant="destructive"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => onRemoveImage(product.id, imageUrl, false)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {/* Drop zone para nova imagem secundária */}
            <ImageDropZone
              onDrop={(imageUrl) => onImageDrop(product.id, imageUrl, false)}
              onFileUpload={(files) => onFileUpload(files, product.id, false)}
              placeholder="+"
              compact
              className="aspect-square"
              uploading={uploading}
            />
          </div>

          {/* Botão para adicionar por URL */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const url = prompt('Cole a URL da imagem:');
              if (url && url.trim()) {
                onUrlAdd(product.id, url.trim(), false);
              }
            }}
            className="w-full text-xs"
          >
            <Link className="w-3 h-3 mr-1" />
            Adicionar por URL
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex justify-between text-xs text-gray-500">
            <span>R$ {(product.price || 0).toFixed(2)}</span>
            <span>{product.is_active ? 'Ativo' : 'Inativo'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductImageCard;
