
import { useState } from 'react';
import { X, Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from './ProductCard';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  getPlatformColor: (platform: string) => string;
}

const ProductModal = ({ product, isOpen, onClose, onAddToCart, getPlatformColor }: ProductModalProps) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  if (!product || !isOpen) return null;

  const isLowStock = product.stock && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  // Initialize selected options when product changes
  useState(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || '');
      setSelectedColor(product.colors[0] || '');
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!isOutOfStock && selectedSize) {
      onAddToCart(product, selectedSize, selectedColor);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Close Button */}
        <Button
          onClick={onClose}
          variant="ghost"
          className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full w-10 h-10 p-0 shadow-lg"
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 lg:h-full object-cover rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=600&fit=crop';
              }}
            />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <Badge className="bg-red-600 text-white font-bold text-sm px-4 py-2 shadow-lg">
                NOVO
              </Badge>
              {isLowStock && !isOutOfStock && (
                <Badge className="bg-orange-500 text-white font-bold text-sm px-4 py-2 shadow-lg animate-pulse">
                  🔥 Apenas {product.stock} unidades!
                </Badge>
              )}
              {isOutOfStock && (
                <Badge className="bg-gray-500 text-white font-bold text-sm px-4 py-2 shadow-lg">
                  ESGOTADO
                </Badge>
              )}
            </div>

            {product.platform && (
              <Badge className={`absolute top-4 right-4 ${getPlatformColor(product.platform)} text-white font-bold text-sm px-4 py-2 shadow-lg`}>
                {product.platform}
              </Badge>
            )}
          </div>

          {/* Content Section */}
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-4 leading-tight">
                {product.name}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="mb-8">
              <div className="text-4xl font-bold text-red-600 mb-2">
                R$ {product.price.toFixed(2)}
              </div>
              <p className="text-gray-500 font-medium">À vista no PIX</p>
              <div className="mt-2 text-sm text-gray-600">
                <p>💳 Ou em até 12x no cartão</p>
                <p>🚚 Frete grátis acima de R$ 200</p>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-6 mb-8">
              {/* Sizes */}
              <div>
                <label className="text-lg font-bold text-gray-700 mb-3 block">
                  {product.sizes[0] === 'Físico' || product.sizes[0] === 'Digital' ? 'Formato:' : 'Tamanho:'}
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      onClick={() => setSelectedSize(size)}
                      className={`transition-all duration-200 font-medium px-6 py-3 ${
                        selectedSize === size 
                          ? 'bg-red-600 text-white border-red-600 shadow-md scale-105' 
                          : 'border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600 hover:bg-red-50'
                      }`}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              {product.colors.length > 0 && (
                <div>
                  <label className="text-lg font-bold text-gray-700 mb-3 block">Cor:</label>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => (
                      <Button
                        key={color}
                        variant={selectedColor === color ? "default" : "outline"}
                        onClick={() => setSelectedColor(color)}
                        className={`transition-all duration-200 font-medium px-6 py-3 ${
                          selectedColor === color 
                            ? 'bg-red-600 text-white border-red-600 shadow-md scale-105' 
                            : 'border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600 hover:bg-red-50'
                        }`}
                      >
                        {color}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock || !selectedSize}
                className={`flex-1 font-bold py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-lg ${
                  isOutOfStock 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-red-500/25'
                }`}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {isOutOfStock ? 'Produto Esgotado' : 'Adicionar ao Carrinho'}
              </Button>
              
              <Button
                variant="outline"
                className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-bold py-4 px-6 rounded-xl transition-all duration-300"
              >
                <Heart className="w-5 h-5 mr-2" />
                Favoritar
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Produto em estoque
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Entrega rápida
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Suporte via WhatsApp
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Garantia oficial
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
