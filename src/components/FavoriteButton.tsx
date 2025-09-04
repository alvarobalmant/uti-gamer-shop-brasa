import React from 'react';
import { Heart } from 'lucide-react';

interface FavoriteButtonProps {
  productId: string;
  className?: string;
  size?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ productId, className = "", size }) => {
  return (
    <button className={`p-2 rounded-full ${className}`}>
      <Heart className="w-5 h-5" />
    </button>
  );
};

export default FavoriteButton;