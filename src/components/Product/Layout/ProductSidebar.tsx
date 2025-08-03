import React, { useState } from 'react';
import { Product } from '@/hooks/useProducts';
import { SKUNavigation } from '@/hooks/useProducts/types';
import { ShoppingCart, Zap, Truck, Shield, Clock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Importar componentes especializados
import DeliveryInfo from '../Sidebar/DeliveryInfo';
import QuantitySelector from '../Sidebar/QuantitySelector';
import ActionButtons from '../Sidebar/ActionButtons';
import UTICoinsInfo from '../Sidebar/UTICoinsInfo';
import TrustBadges from '../Sidebar/TrustBadges';

interface ProductSidebarProps {
  product: Product;
  skuNavigation?: SKUNavigation;
  onAddToCart: (product: Product) => void;
  className?: string;
}

const ProductSidebar: React.FC<ProductSidebarProps> = ({
  product,
  skuNavigation,
  onAddToCart,
  className
}) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart(product);
  };

  const handleBuyNow = () => {
    // Lógica de compra imediata via WhatsApp
    onAddToCart(product);
    // Redirecionar para WhatsApp ou abrir modal
  };

  return (
    <div className={cn(
      "space-y-6 bg-white p-6 rounded-lg border border-gray-200",
      className
    )}>
      {/* SEÇÃO DE ENTREGA */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Truck className="w-5 h-5 text-green-600" />
          Entrega
        </h3>
        
        {/* Componente de informações de entrega limpo */}
        <DeliveryInfo product={product} />
        
        {/* Informações adicionais de entrega */}
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Entrega em 3-5 dias úteis</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-600" />
            <span>Produto original e lacrado</span>
          </div>
        </div>
      </div>

      {/* SELETOR DE QUANTIDADE */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-900">
          Quantidade:
        </label>
        <QuantitySelector 
          product={product}
          quantity={quantity}
          onQuantityChange={setQuantity}
        />
      </div>

      {/* BOTÕES DE AÇÃO PRINCIPAIS */}
      <div className="space-y-3">
        <Button 
          onClick={handleBuyNow}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 text-lg"
          size="lg"
        >
          <Zap className="w-5 h-5 mr-2" />
          Comprar Agora
        </Button>
        
        <Button 
          onClick={handleAddToCart}
          variant="outline"
          className="w-full border-red-600 text-red-600 hover:bg-red-50 font-semibold py-3 text-lg"
          size="lg"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Adicionar ao Carrinho
        </Button>
      </div>

      {/* UTI COINS */}
      <UTICoinsInfo 
        product={product}
        quantity={quantity}
      />

      {/* GARANTIAS E SEGURANÇA */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Garantias UTI:</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-green-700">
            <Check className="w-4 h-4" />
            <span>7 dias para troca</span>
          </div>
          <div className="flex items-center gap-2 text-green-700">
            <Check className="w-4 h-4" />
            <span>Garantia do fabricante</span>
          </div>
          <div className="flex items-center gap-2 text-green-700">
            <Check className="w-4 h-4" />
            <span>Suporte especializado</span>
          </div>
          <div className="flex items-center gap-2 text-green-700">
            <Check className="w-4 h-4" />
            <span>Compra 100% segura</span>
          </div>
        </div>
      </div>

      {/* TRUST BADGES */}
      <TrustBadges />

      {/* FINALIZAÇÃO WHATSAPP */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <div className="text-sm text-green-800 font-medium mb-2">
          💬 Atendimento Personalizado
        </div>
        <p className="text-xs text-green-700">
          Finalizamos todas as vendas pelo WhatsApp para melhor atendimento e suporte!
        </p>
      </div>
    </div>
  );
};

export default ProductSidebar;

