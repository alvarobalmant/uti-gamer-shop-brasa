
import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  productId: string;
  variant?: 'default' | 'icon';
  className?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  productId, 
  variant = 'default',
  className 
}) => {
  const { toggleFavorite, isFavorite, loading } = useFavorites();
  const isProductFavorite = isFavorite(productId);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    await toggleFavorite(productId);
  };

  if (variant === 'icon') {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClick}
        disabled={loading}
        className={cn(
          "h-8 w-8 hover:bg-gray-100 transition-colors",
          className
        )}
      >
        <Heart 
          className={cn(
            "h-4 w-4 transition-colors",
            isProductFavorite 
              ? "fill-red-500 text-red-500" 
              : "text-gray-400 hover:text-red-500"
          )}
        />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      disabled={loading}
      className={cn(
        "flex items-center gap-2 transition-colors",
        isProductFavorite 
          ? "border-red-500 text-red-500 hover:bg-red-50" 
          : "border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500",
        className
      )}
    >
      <Heart 
        className={cn(
          "h-4 w-4 transition-colors",
          isProductFavorite ? "fill-red-500" : ""
        )}
      />
      {isProductFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
    </Button>
  );
};

export default FavoriteButton;
