
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
}

const ProductActions: React.FC<ProductActionsProps> = ({
  product,
  quantity,
  onQuantityChange,
  onAddToCart,
  onWhatsAppContact,
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
          {isLowStock && (
            <p className="text-sm text-orange-600 mt-1">
              ⚠️ Apenas {product.stock} unidades restantes!
            </p>
          )}
        </div>
      )}

      {/* Botões de Ação */}
      <div className="space-y-3">
        {/* Adicionar ao Carrinho */}
        <Button
          onClick={onAddToCart}
          disabled={isOutOfStock}
          className={`w-full h-14 text-lg font-bold rounded-lg transition-all duration-300 ${
            isOutOfStock
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {isOutOfStock ? (
            'Produto Esgotado'
          ) : (
            <>
              <ShoppingCart className="w-6 h-6 mr-3" />
              Adicionar ao Carrinho
            </>
          )}
        </Button>

        {/* Comprar Agora */}
        {!isOutOfStock && (
          <Button
            onClick={onAddToCart}
            className="w-full h-14 text-lg font-bold bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Zap className="w-6 h-6 mr-3" />
            Comprar Agora
          </Button>
        )}

        {/* WhatsApp */}
        <Button
          onClick={onWhatsAppContact}
          variant="outline"
          className="w-full h-12 text-base font-semibold border-green-500 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-300"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Falar no WhatsApp
        </Button>
      </div>

      {/* Indicadores de Urgência */}
      {!isOutOfStock && (
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
