import React, { useState } from 'react';
import { Product } from '@/hooks/useProducts';
import { Star, Heart, Share2, ChevronDown, Shield, Truck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/utils/formatPrice';

interface ProductHeroMobileProps {
  product: Product;
  viewingCount: number;
  onAddToCart: (product: Product) => void;
}

const ProductHeroMobile: React.FC<ProductHeroMobileProps> = ({ 
  product, 
  viewingCount, 
  onAddToCart 
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<'new' | 'pre-owned' | 'digital'>('new');
  const [quantity, setQuantity] = useState(1);

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
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
    const message = `Olá! Gostaria de mais informações sobre:\n\n${product.name}\nPreço: ${formatPrice(product.price)}`;
    const whatsappUrl = `https://wa.me/5527996882090?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getCurrentPrice = () => {
    switch (selectedCondition) {
      case 'new':
        return product.price;
      case 'pre-owned':
        return product.price * 0.85;
      case 'digital':
        return product.digital_price || product.price * 0.9;
      default:
        return product.price;
    }
  };

  return (
    <div className="bg-white">
<<<<<<< HEAD
      {/* Image Gallery - Mais Respiração */}
      <div className="relative mb-6">
        <div className="aspect-[4/3] bg-gray-50 rounded-2xl overflow-hidden mx-4">
          <img
            src={images[selectedImageIndex] || product.image}
            alt={product.name}
            className="w-full h-full object-contain p-4"
          />
          
          {/* Overlay Actions - Melhor Posicionamento */}
          <div className="absolute top-6 right-6 flex flex-col gap-3">
=======
      {/* Image Gallery - Full Width */}
      <div className="relative">
        <div className="aspect-square bg-gray-100">
          <img
            src={images[selectedImageIndex] || product.image}
            alt={product.name}
            className="w-full h-full object-contain"
          />
          
          {/* Overlay Actions */}
          <div className="absolute top-4 right-4 flex gap-2">
>>>>>>> a08235d3a56d734c06d5e45b7a55a52a13c49cf3
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFavorited(!isFavorited)}
<<<<<<< HEAD
              className={`w-12 h-12 p-0 bg-white/95 backdrop-blur-md shadow-lg border-0 rounded-full transition-all duration-200 ${
                isFavorited ? 'text-red-600 bg-red-50/95' : 'hover:bg-gray-50/95'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
=======
              className={`w-10 h-10 p-0 bg-white/90 backdrop-blur-sm ${
                isFavorited ? 'text-red-600 border-red-200' : ''
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
>>>>>>> a08235d3a56d734c06d5e45b7a55a52a13c49cf3
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleShare}
<<<<<<< HEAD
              className="w-12 h-12 p-0 bg-white/95 backdrop-blur-md shadow-lg border-0 rounded-full hover:bg-gray-50/95 transition-all duration-200"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>

          {/* Social Proof Badge - Melhor Design */}
          <div className="absolute bottom-6 left-6">
            <div className="bg-black/80 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 backdrop-blur-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-medium">{viewingCount} pessoas vendo</span>
=======
              className="w-10 h-10 p-0 bg-white/90 backdrop-blur-sm"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Social Proof Badge */}
          <div className="absolute bottom-4 left-4">
            <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              {viewingCount} pessoas vendo agora
>>>>>>> a08235d3a56d734c06d5e45b7a55a52a13c49cf3
            </div>
          </div>
        </div>

<<<<<<< HEAD
        {/* Image Thumbnails - Mais Espaçamento */}
        {images.length > 1 && (
          <div className="flex gap-3 px-4 mt-4 overflow-x-auto pb-2">
=======
        {/* Image Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 p-4 overflow-x-auto">
>>>>>>> a08235d3a56d734c06d5e45b7a55a52a13c49cf3
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
<<<<<<< HEAD
                className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 overflow-hidden transition-all duration-200 ${
                  selectedImageIndex === index 
                    ? 'border-red-500 shadow-md scale-105' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-contain bg-gray-50 p-1" />
=======
                className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden ${
                  selectedImageIndex === index ? 'border-red-500' : 'border-gray-200'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-contain bg-gray-50" />
>>>>>>> a08235d3a56d734c06d5e45b7a55a52a13c49cf3
              </button>
            ))}
          </div>
        )}
      </div>

<<<<<<< HEAD
      {/* Product Info - Mais Espaçamento */}
      <div className="px-6 space-y-6">
        {/* Brand & Availability - Melhor Layout */}
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1.5 rounded-full font-medium">
            <Shield className="w-4 h-4 mr-2" />
            Em estoque
          </Badge>
          <span className="text-sm text-gray-500 font-medium">UTI dos Games</span>
        </div>

        {/* Title - Mais Respiração */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            {product.name}
          </h1>
          
          {/* Rating - Melhor Design */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
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
            </div>
            <span className="text-lg font-semibold text-gray-900">{rating}</span>
            <button className="text-sm text-blue-600 underline font-medium">
              ({reviewCount} avaliações)
            </button>
          </div>
        </div>

        {/* Condition Selector - Melhor Espaçamento */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Condição do Produto</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: 'new', label: 'Novo', desc: 'Lacrado' },
              { key: 'pre-owned', label: 'Usado', desc: '15% OFF' },
              { key: 'digital', label: 'Digital', desc: '10% OFF' }
            ].map((condition) => (
              <button
                key={condition.key}
                onClick={() => setSelectedCondition(condition.key as any)}
                className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                  selectedCondition === condition.key
                    ? 'border-red-500 bg-red-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-semibold text-gray-900">{condition.label}</div>
                <div className="text-sm text-gray-600 mt-1">{condition.desc}</div>
=======
      {/* Product Info */}
      <div className="p-4 space-y-4">
        {/* Brand & Availability */}
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Shield className="w-3 h-3 mr-1" />
            Em estoque
          </Badge>
          <span className="text-sm text-gray-600">UTI dos Games</span>
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold text-gray-900 leading-tight">
          {product.name}
        </h1>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating) 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-gray-900">{rating}</span>
          <button className="text-sm text-blue-600 underline">
            ({reviewCount})
          </button>
        </div>

        {/* Price Section */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-red-600 font-medium">Preço especial</span>
            <Badge variant="destructive" className="text-xs">-15%</Badge>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-red-600">
              {formatPrice(getCurrentPrice())}
            </span>
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.price * 1.15)}
            </span>
          </div>
          
          <div className="text-sm text-gray-600 mt-1">
            ou {formatPrice(getCurrentPrice() * 0.95)} no PIX (5% desconto)
          </div>
          
          <div className="text-sm text-gray-600">
            ou 12x de {formatPrice(getCurrentPrice() / 12)} sem juros
          </div>
        </div>

        {/* Condition Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900">Condição:</label>
          <div className="grid grid-cols-3 gap-2">
            {['new', 'pre-owned', 'digital'].map((condition) => (
              <button
                key={condition}
                onClick={() => setSelectedCondition(condition as any)}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                  selectedCondition === condition
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                {condition === 'new' && 'Novo'}
                {condition === 'pre-owned' && 'Seminovo'}
                {condition === 'digital' && 'Digital'}
>>>>>>> a08235d3a56d734c06d5e45b7a55a52a13c49cf3
              </button>
            ))}
          </div>
        </div>

<<<<<<< HEAD
        {/* Price Section - Hierarquia Melhorada */}
        <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(getCurrentPrice())}
                </span>
                {selectedCondition !== 'new' && (
                  <Badge className="bg-red-100 text-red-800 font-semibold">
                    {selectedCondition === 'pre-owned' ? '15% OFF' : '10% OFF'}
                  </Badge>
                )}
              </div>
              {selectedCondition !== 'new' && (
                <div className="text-lg text-gray-500 line-through mt-1">
                  {formatPrice(product.price)}
                </div>
              )}
            </div>
          </div>

          {/* UTI PRO Price - Destaque Separado */}
          {product.pro_price && (
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-purple-600 font-medium mb-1">
                    💎 Preço Membro UTI PRO
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {formatPrice(product.pro_price)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Economize {formatPrice(product.price - product.pro_price)}
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="border-purple-500 text-purple-600 hover:bg-purple-50 font-semibold px-6"
                >
                  Ser PRO
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Quantity Selector - Melhor Design */}
        <div className="space-y-3">
          <label className="text-lg font-semibold text-gray-900">Quantidade</label>
          <div className="flex items-center gap-4">
            <div className="flex items-center border-2 border-gray-200 rounded-xl bg-white">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-xl transition-colors"
                disabled={quantity <= 1}
              >
                <span className="text-xl font-bold">−</span>
              </button>
              <span className="w-16 text-center font-bold text-xl text-gray-900">
                {quantity}
              </span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-xl transition-colors"
                disabled={quantity >= 10}
              >
                <span className="text-xl font-bold">+</span>
              </button>
            </div>
            <div className="text-sm text-gray-600">
              Máximo: 10 unidades
            </div>
          </div>
        </div>

        {/* Action Buttons - Melhor Espaçamento */}
        <div className="space-y-4 pt-2">
          <Button
            onClick={() => onAddToCart(product)}
            className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl"
            disabled={product.stock === 0}
          >
            🛒 Adicionar ao Carrinho
          </Button>
          
          <Button
            className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl"
            disabled={product.stock === 0}
          >
            ⚡ Comprar Agora
=======
        {/* Size Selection */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">Formato:</label>
            <div className="flex gap-2 overflow-x-auto">
              {product.sizes.map((size) => (
                <Button
                  key={size}
                  variant="outline"
                  size="sm"
                  className="flex-shrink-0"
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900">Quantidade:</span>
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100"
            >
              -
            </button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100"
            >
              +
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => onAddToCart(product)}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12 text-base font-semibold"
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Fora de estoque' : 'Adicionar ao carrinho'}
>>>>>>> a08235d3a56d734c06d5e45b7a55a52a13c49cf3
          </Button>
          
          <Button
            onClick={handleWhatsAppContact}
            variant="outline"
<<<<<<< HEAD
            className="w-full h-14 border-2 border-green-500 text-green-600 hover:bg-green-50 font-bold text-lg rounded-xl transition-all duration-200"
          >
            💬 Falar no WhatsApp
          </Button>
        </div>

        {/* Benefits Cards - Melhor Layout */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          {[
            { icon: Truck, title: 'Entrega rápida', desc: '2-5 dias úteis' },
            { icon: Shield, title: 'Produto original', desc: 'Lacrado e garantido' },
            { icon: Clock, title: 'Troca garantida', desc: '7 dias para trocar' },
            { icon: Star, title: 'Atendimento UTI', desc: 'Suporte especializado' }
          ].map((benefit, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 text-center space-y-2 hover:shadow-md transition-shadow">
              <benefit.icon className="w-8 h-8 text-red-600 mx-auto" />
              <div className="font-semibold text-gray-900 text-sm">{benefit.title}</div>
              <div className="text-xs text-gray-600">{benefit.desc}</div>
            </div>
          ))}
=======
            className="w-full border-green-500 text-green-600 hover:bg-green-50 h-12 text-base font-semibold"
          >
            Comprar via WhatsApp
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-sm font-medium text-gray-900">Frete GRÁTIS</div>
              <div className="text-xs text-gray-600">para Colatina-ES</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-green-600" />
            <div>
              <div className="text-sm font-medium text-gray-900">Produto original</div>
              <div className="text-xs text-gray-600">Lacrado de fábrica</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-purple-600" />
            <div>
              <div className="text-sm font-medium text-gray-900">Troca garantida</div>
              <div className="text-xs text-gray-600">7 dias para trocar</div>
            </div>
          </div>
>>>>>>> a08235d3a56d734c06d5e45b7a55a52a13c49cf3
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default ProductHeroMobile;

=======
export default ProductHeroMobile;
>>>>>>> a08235d3a56d734c06d5e45b7a55a52a13c49cf3
