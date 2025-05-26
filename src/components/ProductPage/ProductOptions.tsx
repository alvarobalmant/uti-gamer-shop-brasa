
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/hooks/useProducts';

interface ProductOptionsProps {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  onSizeChange: (size: string) => void;
  onColorChange: (color: string) => void;
  onQuantityChange: (quantity: number) => void;
}

const ProductOptions = ({ 
  product, 
  selectedSize, 
  selectedColor, 
  quantity,
  onSizeChange,
  onColorChange,
  onQuantityChange
}: ProductOptionsProps) => {
  return (
    <>
      {/* Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="space-y-3">
          <label className="text-lg font-semibold text-gray-900">
            Formato: <span className="font-normal text-gray-700">{selectedSize}</span>
          </label>
          <div className="flex gap-3 flex-wrap">
            {product.sizes.map((size) => (
              <Button
                key={size}
                variant={selectedSize === size ? 'default' : 'outline'}
                onClick={() => onSizeChange(size)}
                className={`${
                  selectedSize === size 
                    ? 'bg-red-600 hover:bg-red-700 text-white border-red-600' 
                    : 'border-gray-300 hover:border-red-500 hover:text-red-600'
                }`}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Color Selection */}
      {product.colors && product.colors.length > 0 && (
        <div className="space-y-3">
          <label className="text-lg font-semibold text-gray-900">
            Cor: <span className="font-normal text-gray-700">{selectedColor}</span>
          </label>
          <div className="flex gap-3 flex-wrap">
            {product.colors.map((color) => (
              <Button
                key={color}
                variant={selectedColor === color ? 'default' : 'outline'}
                onClick={() => onColorChange(color)}
                className={`${
                  selectedColor === color 
                    ? 'bg-red-600 hover:bg-red-700 text-white border-red-600' 
                    : 'border-gray-300 hover:border-red-500 hover:text-red-600'
                }`}
              >
                {color}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="space-y-3">
        <label className="text-lg font-semibold text-gray-900">Quantidade</label>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="w-10 h-10 p-0"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onQuantityChange(quantity + 1)}
            className="w-10 h-10 p-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stock Status */}
      {product.stock !== undefined && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-green-700 font-medium">
              {product.stock > 0 ? `${product.stock} unidades em estoque` : 'Produto esgotado'}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductOptions;
