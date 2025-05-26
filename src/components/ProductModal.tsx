
import { useState, useEffect } from 'react';
import { X, Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from './ProductCard';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  getPlatformColor: (product: Product) => string;
}

const ProductModal = ({ product, isOpen, onClose, onAddToCart, getPlatformColor }: ProductModalProps) => {
  if (!product || !isOpen) return null;

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  const isLowStock = product.stock && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || '');
      setSelectedColor(product.colors?.[0] || '');
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!isOutOfStock && selectedSize) {
      onAddToCart(product, selectedSize, selectedColor);
      onClose();
    }
  };

  const primaryTag = product.tags?.[0]?.name || '';
  const originalPrice = product.price * 1.15;
  const proPrice = product.price * 0.95;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
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
              {product.tags?.some(tag => tag.name.toLowerCase().includes('novo')) && (
                <Badge className="bg-green-600 text-white font-bold text-sm px-3 py-1 shadow-lg">
                  NOVO
                </Badge>
              )}
              {isLowStock && !isOutOfStock && (
                <Badge className="bg-orange-500 text-white font-bold text-sm px-3 py-1 shadow-lg">
                  Últimas {product.stock} unidades!
                </Badge>
              )}
              {isOutOfStock && (
                <Badge className="bg-gray-500 text-white font-bold text-sm px-3 py-1 shadow-lg">
                  ESGOTADO
                </Badge>
              )}
            </div>

            {primaryTag && (
              <Badge className={`absolute top-4 right-4 ${getPlatformColor(product)} text-white font-bold text-sm px-3 py-1 shadow-lg`}>
                {primaryTag}
              </Badge>
            )}
          </div>

          {/* Content Section */}
          <div className="p-8 space-y-6">
            {/* Product Title */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
                {product.name}
              </h2>
              {product.description && (
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              )}
            </div>

            {/* Pricing Block */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl font-bold text-gray-900">
                  R$ {product.price.toFixed(2)}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  R$ {originalPrice.toFixed(2)}
                </span>
              </div>
              <div className="text-lg font-semibold text-purple-600 mb-2">
                R$ {proPrice.toFixed(2)} Membros Pro
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>💳 ou 12x de R$ {(product.price / 12).toFixed(2)}</p>
                <p>🚚 Frete grátis acima de R$ 200</p>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4">
              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <label className="text-lg font-semibold text-gray-900 mb-3 block">
                    {product.sizes[0] === 'Físico' || product.sizes[0] === 'Digital' ? 'Formato:' : 'Tamanho:'}
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        onClick={() => setSelectedSize(size)}
                        className={`transition-all duration-200 font-medium px-4 py-2 ${
                          selectedSize === size 
                            ? 'bg-red-600 text-white border-red-600' 
                            : 'border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600'
                        }`}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <label className="text-lg font-semibold text-gray-900 mb-3 block">Cor:</label>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => (
                      <Button
                        key={color}
                        variant={selectedColor === color ? "default" : "outline"}
                        onClick={() => setSelectedColor(color)}
                        className={`transition-all duration-200 font-medium px-4 py-2 ${
                          selectedColor === color 
                            ? 'bg-red-600 text-white border-red-600' 
                            : 'border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600'
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
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock || (!selectedSize && product.sizes && product.sizes.length > 0)}
                className={`w-full font-bold py-4 text-lg rounded-lg transition-all duration-300 shadow-md hover:shadow-lg ${
                  isOutOfStock 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {isOutOfStock ? 'Produto Esgotado' : 'Adicionar ao Carrinho'}
              </Button>
              
              <Button
                variant="outline"
                className="w-full border-2 border-gray-300 text-gray-700 hover:border-red-600 hover:text-red-600 font-semibold py-3 rounded-lg transition-all duration-300"
              >
                <Heart className="w-5 h-5 mr-2" />
                Adicionar aos Favoritos
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Produto em estoque</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Entrega rápida</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Suporte WhatsApp</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Garantia oficial</span>
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
