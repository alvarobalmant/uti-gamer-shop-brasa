<<<<<<< HEAD
import React from 'react';

interface ProductCardBadgeProps {
  text: string;
  color: string;
  isVisible: boolean;
}

const ProductCardBadge: React.FC<ProductCardBadgeProps> = ({ text, color, isVisible }) => {
  if (!isVisible || !text) {
=======

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProductCardBadgeProps {
  badgeText?: string;
  badgeColor?: string;
  badgeVisible?: boolean;
}

const ProductCardBadge = ({ badgeText, badgeColor, badgeVisible }: ProductCardBadgeProps) => {
  if (!badgeVisible || !badgeText) {
>>>>>>> 5a443887cf3fbab70105dd954c113ef55db70b7a
    return null;
  }

  return (
<<<<<<< HEAD
    <div 
      className="absolute top-2 left-2 z-10 px-2 py-1 text-xs font-bold text-white uppercase tracking-wide rounded-sm shadow-md"
      style={{ backgroundColor: color }}
    >
      {text}
=======
    <div className="absolute top-2 left-2 z-10">
      <Badge
        className={cn(
          "text-xs font-semibold px-2 py-1 rounded-md text-white shadow-sm",
          !badgeColor && "bg-red-500 hover:bg-red-600"
        )}
        style={badgeColor ? { backgroundColor: badgeColor } : undefined}
      >
        {badgeText}
      </Badge>
>>>>>>> 5a443887cf3fbab70105dd954c113ef55db70b7a
    </div>
  );
};

export default ProductCardBadge;
<<<<<<< HEAD

=======
>>>>>>> 5a443887cf3fbab70105dd954c113ef55db70b7a
