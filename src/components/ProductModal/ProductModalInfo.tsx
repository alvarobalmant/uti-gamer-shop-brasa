import React from 'react';
import { Product } from '@/hooks/useProducts';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

interface ProductModalInfoProps {
  product: Product;
}

const ProductModalInfo: React.FC<ProductModalInfoProps> = ({ product }) => {
  // Get brand from tags or extract from name
  const brandTag = product.tags?.find(tag => 
    ['nintendo', 'sony', 'microsoft', 'xbox', 'playstation'].includes(tag.name.toLowerCase())
  );
  const brand = brandTag?.name || product.name.split(' ')[0];

  // Check if product is bestseller or has special status
  const isBestseller = product.tags?.some(tag => 
    tag.name.toLowerCase().includes('bestseller') || 
    tag.name.toLowerCase().includes('destaque')
  );

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  // Calculate Pro price (assuming 10% discount)
  const proPrice = product.price * 0.9;

  return (
    <div className="space-y-3">
      {/* Brand */}
      <div className="text-sm font-medium text-blue-600 uppercase tracking-wide">
        {brand}
      </div>

      {/* Product Name */}
      <h1 className="text-2xl font-bold text-gray-900 leading-tight">
        {product.name}
      </h1>

      {/* Status Badges */}
      <div className="flex items-center gap-2 flex-wrap">
        {isBestseller && (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
            <Star className="w-3 h-3 mr-1 fill-current" />
            Bestseller
          </Badge>
        )}
        
        {/* Custom Badge if configured */}
        {product.badge_visible && product.badge_text && (
          <Badge 
            style={{ 
              backgroundColor: product.badge_color || '#10b981',
              color: 'white'
            }}
            className="font-medium"
          >
            {product.badge_text.toUpperCase()}
          </Badge>
        )}

        {/* Stock Status */}
        {product.stock !== undefined && (
          <Badge variant={product.stock > 0 ? "default" : "destructive"}>
            {product.stock > 0 ? 'Em Estoque' : 'Fora de Estoque'}
          </Badge>
        )}
      </div>

      {/* Pricing */}
      <div className="space-y-2">
        <div className="text-3xl font-bold text-gray-900">
          {formatPrice(product.price)}
        </div>
        
        {/* Pro Price */}
        <div className="text-lg text-blue-600 font-semibold">
          {formatPrice(proPrice)} com Pro
        </div>

        {/* Payment Options */}
        <div className="text-sm text-gray-600">
          ou 4x de {formatPrice(product.price / 4)} sem juros
        </div>
      </div>

      {/* Delivery Options */}
      <div className="space-y-2 pt-2 border-t">
        <div className="text-sm font-medium text-gray-900">Opções de Entrega:</div>
        <div className="space-y-1 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span>📦</span>
            <span>Retirar na loja - Disponível</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🚚</span>
            <span>Entrega - 1-3 dias úteis</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModalInfo;

