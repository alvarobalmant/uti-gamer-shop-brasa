
import React from 'react';
import { Product } from '@/types/product';
import { cn } from '@/lib/utils';

interface ProductCardStockProps {
  product: Product;
}

// **Radical Redesign based on GameStop reference and plan_transformacao_radical.md**
const ProductCardStock: React.FC<ProductCardStockProps> = ({ product }) => {
  const isOutOfStock = product.stock === 0;
  const isLowStock = !isOutOfStock && product.stock && product.stock <= 5; // Low stock if not out and <= 5

  // Minimalist stock indicator
  let stockText = '';
  let stockColorClass = '';

  if (isOutOfStock) {
    stockText = 'Esgotado';
    stockColorClass = 'text-destructive'; // Use destructive color from theme
  } else if (isLowStock) {
    stockText = `Restam ${product.stock}`;
    stockColorClass = 'text-orange-600'; // Keep orange for low stock warning
  } else {
    stockText = 'Em estoque';
    stockColorClass = 'text-green-600'; // Keep green for in stock
  }

  return (
    <div className="flex items-center"> {/* Align with actions if needed */}
      <span className={cn(
        "text-[11px] font-medium", // Smaller, consistent text size
        stockColorClass
      )}>
        {stockText}
      </span>
    </div>
  );
};

export default ProductCardStock;

