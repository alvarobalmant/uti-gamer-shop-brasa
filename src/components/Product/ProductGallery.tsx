
import React, { useState } from 'react';
import { Product } from '@/hooks/useProducts';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProductGalleryProps {
  product: Product;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  
  // Combinar imagem principal com imagens adicionais
  const allImages = [product.image, ...(product.additional_images || [])].filter(Boolean);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="space-y-4">
      {/* Imagem Principal */}
      <div className="relative group">
        <div className="aspect-square bg-white rounded-lg overflow-hidden border border-gray-200 relative">
          <img
            src={allImages[currentImageIndex]}
            alt={product.name}
            className={`w-full h-full object-contain transition-transform duration-300 ${
              isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
          />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.is_featured && (
              <Badge className="bg-red-600 text-white font-bold">
                DESTAQUE
              </Badge>
            )}
            {product.badge_visible && product.badge_text && (
              <Badge 
                className="font-bold text-white"
                style={{ backgroundColor: product.badge_color || '#DC2626' }}
              >
                {product.badge_text}
              </Badge>
            )}
          </div>

          {/* Ícone de Zoom */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black bg-opacity-50 rounded-full p-2">
              <ZoomIn className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Navegação de Imagens */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => handleImageClick(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                currentImageIndex === index
                  ? 'border-red-600 ring-2 ring-red-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={image}
                alt={`${product.name} ${index + 1}`}
                className="w-full h-full object-contain bg-white"
              />
            </button>
          ))}
        </div>
      )}

      {/* Indicador de Imagens */}
      {allImages.length > 1 && (
        <div className="flex justify-center gap-2">
          {allImages.map((_, index) => (
            <button
              key={index}
              onClick={() => handleImageClick(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentImageIndex === index
                  ? 'bg-red-600'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
