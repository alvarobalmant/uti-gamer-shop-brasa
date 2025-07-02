
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

<<<<<<< HEAD
  // Mock de avaliações
  const rating = 4.8;
  const reviewCount = 127;
=======
  // Usar configurações de display se disponíveis
  const displayConfig = product.display_config || {};
  
  // Determinar contagem de visualizações
  const actualViewingCount = displayConfig.custom_view_count || viewingCount;
  
  // Usar configuração de reviews customizada se disponível
  const reviewsConfig = product.reviews_config || {
    enabled: true,
    show_rating: true,
    show_count: true,
    custom_rating: {
      value: 4.8,
      count: 127,
      use_custom: false
    }
  };

  const rating = reviewsConfig.custom_rating?.use_custom 
    ? reviewsConfig.custom_rating.value 
    : 4.8;
  
  const reviewCount = reviewsConfig.custom_rating?.use_custom 
    ? reviewsConfig.custom_rating.count 
    : 127;

  // Usar trust indicators configurados ou usar padrões
  const trustIndicators = product.trust_indicators && product.trust_indicators.length > 0
    ? product.trust_indicators
        .filter(indicator => indicator.is_visible)
        .sort((a, b) => a.order - b.order)
    : [
        {
          id: '1',
          title: 'Entrega rápida',
          description: '2-5 dias úteis',
          icon: 'truck',
          color: '#3B82F6',
          order: 1,
          is_visible: true,
        },
        {
          id: '2',
          title: 'Produto original',
          description: 'Lacrado e garantido',
          icon: 'shield',
          color: '#10B981',
          order: 2,
          is_visible: true,
        },
        {
          id: '3',
          title: 'Troca garantida',
          description: '7 dias para trocar',
          icon: 'clock',
          color: '#8B5CF6',
          order: 3,
          is_visible: true,
        },
        {
          id: '4',
          title: 'Atendimento UTI',
          description: 'Suporte especializado',
          icon: 'heart',
          color: '#EF4444',
          order: 4,
          is_visible: true,
        },
      ];
>>>>>>> 8e6f564f9d9afa431eb06b47a1304d04673d0897

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

<<<<<<< HEAD
=======
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      truck: Truck,
      shield: Shield,
      clock: Clock,
      heart: Heart,
    };
    return iconMap[iconName] || Shield;
  };

>>>>>>> 8e6f564f9d9afa431eb06b47a1304d04673d0897
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
<<<<<<< HEAD
                <div className="flex items-center text-sm text-gray-600">
                  <Eye className="w-4 h-4 mr-1" />
                  {viewingCount} pessoas visualizando
                </div>
=======
                {displayConfig.show_view_counter !== false && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Eye className="w-4 h-4 mr-1" />
                    {actualViewingCount} pessoas visualizando
                  </div>
                )}
>>>>>>> 8e6f564f9d9afa431eb06b47a1304d04673d0897
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

<<<<<<< HEAD
=======
            {/* Banner de Urgência (se configurado) */}
            {displayConfig.show_urgency_banner && displayConfig.urgency_text && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-800 text-sm font-medium text-center">
                  {displayConfig.urgency_text}
                </p>
              </div>
            )}

            {/* Social Proof (se configurado) */}
            {displayConfig.show_social_proof && displayConfig.social_proof_text && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 text-sm text-center">
                  {displayConfig.social_proof_text}
                </p>
              </div>
            )}

>>>>>>> 8e6f564f9d9afa431eb06b47a1304d04673d0897
            {/* Título e Avaliações */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">
                {product.name}
              </h1>
<<<<<<< HEAD
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
=======
              {reviewsConfig.enabled && reviewsConfig.show_rating && (
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
                  {reviewsConfig.show_count && (
                    <button className="text-sm text-blue-600 hover:underline">
                      ({reviewCount} avaliações)
                    </button>
                  )}
                </div>
              )}
>>>>>>> 8e6f564f9d9afa431eb06b47a1304d04673d0897
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

<<<<<<< HEAD
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
=======
            {/* Trust Indicators Configuráveis */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                {trustIndicators.slice(0, 4).map((indicator) => {
                  const IconComponent = getIconComponent(indicator.icon);
                  return (
                    <div key={indicator.id} className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ 
                          backgroundColor: `${indicator.color}20`,
                        }}
                      >
                        <IconComponent 
                          className="w-5 h-5" 
                          style={{ color: indicator.color }}
                        />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{indicator.title}</div>
                        <div className="text-sm text-gray-600">{indicator.description}</div>
                      </div>
                    </div>
                  );
                })}
>>>>>>> 8e6f564f9d9afa431eb06b47a1304d04673d0897
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
