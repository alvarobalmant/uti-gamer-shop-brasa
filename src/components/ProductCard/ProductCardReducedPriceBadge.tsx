import React from 'react';
import { cn } from '@/lib/utils';

interface ProductCardReducedPriceBadgeProps {
  isVisible: boolean;
}

const ProductCardReducedPriceBadge: React.FC<ProductCardReducedPriceBadgeProps> = ({ isVisible }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        "absolute top-0 right-0 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-bl-lg z-10",
        "transform -translate-y-full translate-x-full rotate-45 origin-bottom-left",
        "w-[120px] text-center"
      )}
      style={{
        transform: 'rotate(45deg) translate(30%, -100%)',
        transformOrigin: 'bottom left',
        width: '120px',
        textAlign: 'center',
        padding: '2px 8px',
        fontSize: '0.75rem',
        lineHeight: '1rem',
        fontWeight: 'bold',
        backgroundColor: '#16a34a', // Tailwind green-600
        color: '#fff',
        borderRadius: '0 0 0 8px',
        position: 'absolute',
        top: '0',
        right: '0',
        zIndex: '10',
      }}
    >
      REDUCED PRICE
    </div>
  );
};

export default ProductCardReducedPriceBadge;


