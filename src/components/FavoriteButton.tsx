import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FavoriteButtonProps {
  productId: string;
  isFavorite?: boolean;
  onToggle?: () => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  productId, 
  isFavorite = false, 
  onToggle 
}) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      className="p-2 hover:bg-gray-100"
    >
      <Heart 
        className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
      />
    </Button>
  );
};

export default FavoriteButton;