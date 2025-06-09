
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
    return null;
  }

  return (
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
    </div>
  );
};

export default ProductCardBadge;
