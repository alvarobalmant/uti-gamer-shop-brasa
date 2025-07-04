
import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Image, Trash2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageDropZoneProps {
  onDrop: (imageUrl: string) => void;
  onFileUpload: (files: FileList | null) => void;
  onRemove?: () => void;
  currentImage?: string;
  placeholder?: string;
  compact?: boolean;
  className?: string;
  uploading?: boolean;
}

const ImageDropZone: React.FC<ImageDropZoneProps> = ({
  onDrop,
  onFileUpload,
  onRemove,
  currentImage,
  placeholder = "Arraste uma imagem aqui",
  compact = false,
  className,
  uploading = false
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    const imageUrl = e.dataTransfer.getData('text/plain');

    if (imageUrl && imageUrl.startsWith('http')) {
      onDrop(imageUrl);
    } else if (files && files.length > 0) {
      onFileUpload(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileUpload(e.target.files);
  };

  const handleClick = () => {
    if (!currentImage && !uploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={cn("relative", className)}>
      <Card
        className={cn(
          "border-2 border-dashed transition-all duration-200 cursor-pointer",
          compact ? "h-24" : "h-32",
          isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300",
          currentImage ? "border-solid" : "",
          uploading ? "opacity-70" : "hover:border-gray-400"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              <span className="text-xs text-gray-500">Enviando...</span>
            </div>
          ) : currentImage ? (
            <div className="relative w-full h-full group">
              <img
                src={currentImage}
                alt="Preview"
                className="w-full h-full object-cover rounded"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-image.jpg';
                }}
              />
              {onRemove && (
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center rounded">
                  <Button
                    size="sm"
                    variant="destructive"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove();
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-500">
              {compact ? (
                <Plus className="w-6 h-6" />
              ) : (
                <>
                  <Upload className="w-8 h-8" />
                  <span className="text-sm text-center px-2">{placeholder}</span>
                  <span className="text-xs text-gray-400">ou clique para selecionar</span>
                </>
              )}
            </div>
          )}
        </div>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

const Plus: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

export default ImageDropZone;
