import React, { useState } from 'react';
import { Product } from '@/hooks/useProducts';
import { SKUNavigation } from '@/hooks/useProducts/types';
import { Eye, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import FavoriteButton from '@/components/FavoriteButton';

// Importar componentes especializados
import ProductTitle from '../Sidebar/ProductTitle';
import ProductRating from '../Sidebar/ProductRating';
import ProductPricingCompact from '../Sidebar/ProductPricingCompact';
import PlatformSelectorCompact from '../Sidebar/PlatformSelectorCompact';
import DeliveryInfo from '../Sidebar/DeliveryInfo';
import QuantitySelector from '../Sidebar/QuantitySelector';
import ActionButtons from '../Sidebar/ActionButtons';
import UTICoinsInfo from '../Sidebar/UTICoinsInfo';
import TrustBadges from '../Sidebar/TrustBadges';
import PaymentMethods from '../Sidebar/PaymentMethods';

interface ProductSidebarProps {
  product: Product;
  skuNavigation?: SKUNavigation;
  viewingCount: number;
  onAddToCart: (product: Product) => void;
  className?: string;
}

const ProductSidebar: React.FC<ProductSidebarProps> = ({
  product,
  skuNavigation,
  viewingCount,
  onAddToCart,
  className
}) => {
  const [quantity, setQuantity] = useState(1);

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

  return (
    <div className={cn(
      "sticky top-24 space-y-6 bg-white p-6 rounded-lg border border-gray-200 h-fit",
      className
    )}>
      {/* Social Proof e Ações Rápidas */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-green-100 text-green-800 font-medium">
            Em estoque
          </Badge>
          <div className="flex items-center text-sm text-gray-600">
            <Eye className="w-4 h-4 mr-1" />
            {viewingCount} pessoas visualizando
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FavoriteButton productId={product.id} size="sm" />
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 1. Título do Produto */}
      <ProductTitle product={product} />

      {/* 2. Rating e Avaliações */}
      <ProductRating product={product} />

      {/* 3. Sistema de Preços - DESTAQUE PRINCIPAL */}
      <ProductPricingCompact product={product} />

      {/* 4. Seletor de Plataformas (se aplicável) */}
      {skuNavigation && (
        <PlatformSelectorCompact skuNavigation={skuNavigation} />
      )}

      {/* 5. Informações de Entrega */}
      <DeliveryInfo product={product} />

      {/* 6. Seletor de Quantidade */}
      <QuantitySelector 
        product={product}
        quantity={quantity}
        onQuantityChange={setQuantity}
      />

      {/* 7. Botões de Ação - SEMPRE VISÍVEIS */}
      <ActionButtons
        product={product}
        quantity={quantity}
        onAddToCart={onAddToCart}
      />

      {/* 8. UTI Coins */}
      <UTICoinsInfo 
        product={product}
        quantity={quantity}
      />

      {/* 9. Garantias e Trust Indicators */}
      <TrustBadges />

      {/* 10. Meios de Pagamento */}
      <PaymentMethods />
    </div>
  );
};

export default ProductSidebar;

