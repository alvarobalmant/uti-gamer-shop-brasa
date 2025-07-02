
import React, { useState } from 'react';
import { Product } from '@/hooks/useProducts';
import { Star, Heart, Share2, Eye, Clock, Shield, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductGallery from './ProductGallery';
import ProductPricing from './ProductPricing';
import ProductActions from './ProductActions';

interface ProductHeroProps {
  product: Product;
  viewingCount: number;
  onAddToCart: (product: Product) => void;
}

const ProductHero: React.FC<ProductHeroProps> = ({ product, viewingCount, onAddToCart }) => {
  const [selectedCondition, setSelectedCondition] = useState<'new' | 'pre-owned' | 'digital'>('new');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);

  // Mock de avaliações
  const rating = 4.8;
  const reviewCount = 127;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleWhatsAppContact = () => {
    const message = `Olá! Gostaria de mais informações sobre:\n\n${product.name}\nPreço: R$ ${product.price.toFixed(2)}`;
    const whatsappUrl = `https://wa.me/5527996882090?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galeria de Imagens */}
          <div className="space-y-4">
            <ProductGallery product={product} />
          </div>

          {/* Informações do Produto */}
          <div className="space-y-6">
            {/* Status e Social Proof */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-green-100 text-green-800 font-medium">
                  <Shield className="w-3 h-3 mr-1" />
                  Em estoque
                </Badge>
                <div className="flex items-center text-sm text-gray-600">
                  <Eye className="w-4 h-4 mr-1" />
                  {viewingCount} pessoas visualizando
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={isFavorited ? 'text-red-600 border-red-200' : ''}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Título e Avaliações */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(rating) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-lg font-semibold text-gray-900">{rating}</span>
                </div>
                <button className="text-sm text-blue-600 hover:underline">
                  ({reviewCount} avaliações)
                </button>
              </div>
            </div>

            {/* Preços e Ofertas */}
            <ProductPricing 
              product={product}
              selectedCondition={selectedCondition}
              onConditionChange={setSelectedCondition}
            />

            {/* Seleção de Variações */}
            {(product.sizes && product.sizes.length > 0) && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Formato:
                </label>
                <div className="flex gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                      className={selectedSize === size ? 'bg-red-600 hover:bg-red-700' : ''}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantidade e Ações */}
            <ProductActions
              product={product}
              quantity={quantity}
              onQuantityChange={setQuantity}
              onAddToCart={() => onAddToCart(product)}
              onWhatsAppContact={handleWhatsAppContact}
            />

            {/* Trust Indicators */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Truck className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Entrega rápida</div>
                    <div className="text-sm text-gray-600">2-5 dias úteis</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Produto original</div>
                    <div className="text-sm text-gray-600">Lacrado e garantido</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Troca garantida</div>
                    <div className="text-sm text-gray-600">7 dias para trocar</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Atendimento UTI</div>
                    <div className="text-sm text-gray-600">Suporte especializado</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Selo de Confiança */}
            <div className="text-center p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
              <div className="text-lg font-bold text-red-800 mb-1">
                UTI DOS GAMES
              </div>
              <div className="text-sm text-red-700">
                Mais de 10 anos de tradição em games em Colatina-ES
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductHero;
