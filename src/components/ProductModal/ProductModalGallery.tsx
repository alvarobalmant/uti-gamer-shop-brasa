import React, { useState, useEffect } from 'react';
import { Product } from '@/hooks/useProducts';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProductModalGalleryProps {
  product: Product;
  selectedImageIndex: number;
  onImageSelect: (index: number) => void;
}

const ProductModalGallery: React.FC<ProductModalGalleryProps> = ({
  product,
  selectedImageIndex,
  onImageSelect
}) => {
  const [zoomEnabled, setZoomEnabled] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const isMobile = useIsMobile();

  // Enable zoom after 1.5 seconds, but only on desktop
  useEffect(() => {
    if (!isMobile) {
      const timer = setTimeout(() => {
        setZoomEnabled(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  // Create array of images (main image + additional images if any)
  const images = [product.image, ...(product.images || [])].filter(Boolean);
  
  const nextImage = () => {
    onImageSelect((selectedImageIndex + 1) % images.length);
  };

  const prevImage = () => {
    onImageSelect(selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomEnabled || isMobile) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => {
    if (zoomEnabled && !isMobile) {
      setIsZooming(true);
    }
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden group">
        <div
          className={`relative w-full h-full ${!isMobile && zoomEnabled ? 'cursor-crosshair' : ''}`}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={images[selectedImageIndex]}
            alt={product.name}
            className="w-full h-full object-contain"
          />
          
          {/* Zoom overlay - only on desktop */}
          {isZooming && zoomEnabled && !isMobile && (
            <div
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              style={{
                backgroundImage: `url(${images[selectedImageIndex]})`,
                backgroundSize: '200%',
                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                backgroundRepeat: 'no-repeat',
                opacity: 0.8,
                border: '2px solid rgba(239, 68, 68, 0.5)',
                borderRadius: '8px'
              }}
            />
          )}
        </div>
        
        {/* Navigation arrows - only show if multiple images */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
            {selectedImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onImageSelect(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                index === selectedImageIndex
                  ? 'border-red-500'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={image}
                alt={`${product.name} - Imagem ${index + 1}`}
                className="w-full h-full object-contain bg-gray-50"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductModalGallery;

