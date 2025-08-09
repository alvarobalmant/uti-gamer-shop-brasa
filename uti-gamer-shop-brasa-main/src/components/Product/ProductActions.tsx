
import React from 'react';
import { Product } from '@/hooks/useProducts';
import { ShoppingCart, MessageCircle, Plus, Minus, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductActionsProps {
  product: Product;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  onWhatsAppContact: () => void;
  showLowStockWarning?: boolean;
  showLimitedTimeOffer?: boolean;
}

const ProductActions: React.FC<ProductActionsProps> = ({
  product,
  quantity,
  onQuantityChange,
  onAddToCart,
  onWhatsAppContact,
  showLowStockWarning = false,
  showLimitedTimeOffer = false,
}) => {
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock && product.stock <= 5;

  return (
    <div className="space-y-4">
      {/* Seletor de Quantidade */}
      {!isOutOfStock && (
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Quantidade:
          </label>
          <div className="flex items-center">
            <button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="w-10 h-12 border border-gray-300 rounded-l-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="w-16 h-12 border-t border-b border-gray-300 flex items-center justify-center font-semibold text-lg">
              {quantity}
            </div>
            <button
              onClick={() => onQuantityChange(quantity + 1)}
              className="w-10 h-12 border border-gray-300 rounded-r-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {isLowStock && showLowStockWarning && (
            <p className="text-sm text-orange-600 mt-1">
              ⚠️ Apenas {product.stock} unidades restantes!
            </p>
          )}
        </div>
      )}

      {/* Botões de Ação - Padrão Mercado Livre */}
      <div className="space-y-3">
        {/* Comprar Agora - Botão Verde Sólido (Padrão Mercado Livre) */}
        {!isOutOfStock && (
          <Button
            onClick={onAddToCart}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg h-12 transition-colors duration-200"
          >
            <Zap className="w-5 h-5 mr-2" />
            Comprar Agora
          </Button>
        )}

        {/* Adicionar ao Carrinho - Botão Branco com Borda Vermelha (Padrão Mercado Livre) */}
        <Button
          onClick={onAddToCart}
          disabled={isOutOfStock}
          variant="outline"
          className={`w-full font-semibold rounded-lg h-12 transition-colors duration-200 ${
            isOutOfStock
              ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
              : 'bg-white border-2 border-red-600 text-red-600 hover:bg-red-50'
          }`}
        >
          {isOutOfStock ? (
            'Produto Esgotado'
          ) : (
            <>
              <ShoppingCart className="w-5 h-5 mr-2" />
              Adicionar ao Carrinho
            </>
          )}
        </Button>

        {/* WhatsApp - Botão Terciário */}
        <Button
          onClick={onWhatsAppContact}
          variant="ghost"
          className="w-full h-10 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-all duration-200"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Falar no WhatsApp
        </Button>
      </div>

      {/* Indicadores de Urgência */}
      {!isOutOfStock && showLimitedTimeOffer && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-red-800 font-medium">
              🔥 Oferta por tempo limitado
            </span>
            <span className="text-red-600">
              Termina em 2h 15min
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductActions;
