
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Upload, 
  Link, 
  Trash2, 
  Star, 
  Plus, 
  Bot,
  Wand2,
  AlertTriangle 
} from 'lucide-react';
import ImageDropZone from './ImageDropZone';
import UrlImageInput from './UrlImageInput';
import { BackgroundRemovalModal } from './BackgroundRemovalModal';

interface ProductImageCardProps {
  product: any;
  onImageDrop: (productId: string, imageUrl: string, isMainImage: boolean) => void;
  onRemoveImage: (productId: string, imageUrl: string, isMainImage: boolean) => void;
  onFileUpload: (files: FileList | null, productId?: string, isMainImage?: boolean) => void;
  onUrlAdd: (productId: string, url: string, isMainImage: boolean) => void;
  isSelected: boolean;
  onToggleSelection: () => void;
  uploading: boolean;
  hasLocalChanges: boolean;
}

const ProductImageCard: React.FC<ProductImageCardProps> = ({
  product,
  onImageDrop,
  onRemoveImage,
  onFileUpload,
  onUrlAdd,
  isSelected,
  onToggleSelection,
  uploading,
  hasLocalChanges
}) => {
  const [showBackgroundRemoval, setShowBackgroundRemoval] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [isMainImageRemoval, setIsMainImageRemoval] = useState(false);

  const handleBackgroundRemoval = (imageUrl: string, isMainImage: boolean) => {
    setSelectedImageUrl(imageUrl);
    setIsMainImageRemoval(isMainImage);
    setShowBackgroundRemoval(true);
  };

  const handleImageProcessed = (newImageUrl: string) => {
    onImageDrop(product.id, newImageUrl, isMainImageRemoval);
    setShowBackgroundRemoval(false);
  };

  return (
    <>
      <Card className={`overflow-hidden transition-all duration-200 ${
        hasLocalChanges ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-lg'
      } ${isSelected ? 'ring-2 ring-green-500' : ''}`}>
        <CardHeader className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg truncate">{product.name || 'Sem nome'}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{product.id}</Badge>
                {product.platform_name && (
                  <Badge variant="secondary">{product.platform_name}</Badge>
                )}
                {hasLocalChanges && (
                  <Badge className="bg-blue-500 text-white">
                    Modificado
                  </Badge>
                )}
              </div>
            </div>
            
            <Checkbox
              checked={isSelected}
              onCheckedChange={onToggleSelection}
              className="ml-2"
            />
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-4">
          {/* Imagem Principal */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Imagem Principal</h4>
              <Star className="w-4 h-4 text-yellow-500" />
            </div>
            
            {product.image ? (
              <div className="relative group">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleBackgroundRemoval(product.image, true)}
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={uploading}
                  >
                    <Bot className="w-3 h-3 mr-1" />
                    IA
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onRemoveImage(product.id, product.image, true)}
                    disabled={uploading}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <ImageDropZone
                onDrop={(imageUrl) => onImageDrop(product.id, imageUrl, true)}
                onFileUpload={(files) => onFileUpload(files, product.id, true)}
                uploading={uploading}
                isMainImage={true}
              />
            )}
            
            <UrlImageInput
              onUrlAdd={(url) => onUrlAdd(product.id, url, true)}
              disabled={uploading}
              placeholder="URL da imagem principal..."
            />
          </div>

          {/* Imagens Adicionais */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Imagens Adicionais</h4>
            
            {product.additional_images && product.additional_images.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {product.additional_images.map((imageUrl: string, index: number) => (
                  <div key={index} className="relative group">
                    <img
                      src={imageUrl}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-20 object-cover rounded border"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center gap-1">
                      <Button
                        size="sm"
                        onClick={() => handleBackgroundRemoval(imageUrl, false)}
                        className="bg-purple-600 hover:bg-purple-700 text-xs px-2 py-1 h-auto"
                        disabled={uploading}
                      >
                        <Bot className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onRemoveImage(product.id, imageUrl, false)}
                        disabled={uploading}
                        className="text-xs px-2 py-1 h-auto"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {product.additional_images.length < 4 && (
                  <ImageDropZone
                    onDrop={(imageUrl) => onImageDrop(product.id, imageUrl, false)}
                    onFileUpload={(files) => onFileUpload(files, product.id, false)}
                    uploading={uploading}
                    compact={true}
                  />
                )}
              </div>
            ) : (
              <ImageDropZone
                onDrop={(imageUrl) => onImageDrop(product.id, imageUrl, false)}
                onFileUpload={(files) => onFileUpload(files, product.id, false)}
                uploading={uploading}
              />
            )}
            
            <UrlImageInput
              onUrlAdd={(url) => onUrlAdd(product.id, url, false)}
              disabled={uploading}
              placeholder="URL de imagem adicional..."
            />
          </div>

          {/* Status */}
          {!product.image && (!product.additional_images || product.additional_images.length === 0) && (
            <div className="text-center py-4 text-gray-500 border border-dashed border-gray-300 rounded-lg">
              <AlertTriangle className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm">Nenhuma imagem adicionada</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Background Removal Modal */}
      <BackgroundRemovalModal
        isOpen={showBackgroundRemoval}
        onClose={() => setShowBackgroundRemoval(false)}
        imageUrl={selectedImageUrl}
        productName={product.name || 'Produto'}
        onImageProcessed={handleImageProcessed}
      />
    </>
  );
};

export default ProductImageCard;
