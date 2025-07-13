
import React, { DragEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Plus } from 'lucide-react';

export interface ImageDropZoneProps {
  onDrop: (imageUrl: string) => void;
  onFileUpload: (files: FileList) => void;
  uploading?: boolean;
  isMainImage?: boolean;
  compact?: boolean;
}

const ImageDropZone: React.FC<ImageDropZoneProps> = ({
  onDrop,
  onFileUpload,
  uploading = false,
  isMainImage = false,
  compact = false
}) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileUpload(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFileUpload(e.target.files);
    }
  };

  const height = compact ? 'h-20' : isMainImage ? 'h-32' : 'h-24';

  return (
    <div
      className={`${height} border-2 border-dashed rounded-lg flex items-center justify-center transition-colors ${
        dragOver
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="text-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
          id={`file-input-${isMainImage ? 'main' : 'additional'}-${Date.now()}`}
        />
        <label
          htmlFor={`file-input-${isMainImage ? 'main' : 'additional'}-${Date.now()}`}
          className="cursor-pointer"
        >
          <Button
            type="button"
            variant="ghost"
            disabled={uploading}
            className="flex flex-col items-center gap-2 h-auto p-2"
            asChild
          >
            <div>
              {compact ? (
                <Plus className="w-6 h-6 text-gray-400" />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {uploading ? 'Enviando...' : 'Arraste ou clique'}
                  </span>
                </>
              )}
            </div>
          </Button>
        </label>
      </div>
    </div>
  );
};

export default ImageDropZone;
