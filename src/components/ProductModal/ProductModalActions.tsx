import React, { useState } from 'react';
import { Product } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductModalActionsProps {
  product: Product;
  onClose: () => void;
}

const ProductModalActions: React.FC<ProductModalActionsProps> = ({
  product,
  onClose
}) => {
  const { addToCart, loading: cartLoading } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    try {
      await addToCart(product, undefined, undefined);
      toast({
        title: "Produto adicionado!",
        description: `${product.name} foi adicionado ao carrinho.`,
      });
      // Optionally close modal after adding to cart
      // onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o produto ao carrinho.",
        variant: "destructive",
      });
    }
  };

  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">Quantidade:</span>
        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="h-8 w-8 p-0"
          >
            -
          </Button>
          <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
            {quantity}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setQuantity(quantity + 1)}
            disabled={isOutOfStock}
            className="h-8 w-8 p-0"
          >
            +
          </Button>
        </div>
      </div>

      {/* Condition */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Condição:</span>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Novo
        </Badge>
      </div>

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={cartLoading || isOutOfStock}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 text-base"
        size="lg"
      >
        {cartLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Adicionando...
          </>
        ) : isOutOfStock ? (
          'Fora de Estoque'
        ) : (
          <>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Adicionar ao Carrinho
          </>
        )}
      </Button>

      {/* Additional Info */}
      <div className="text-xs text-gray-500 space-y-1">
        <div>• Garantia de 90 dias</div>
        <div>• Suporte técnico especializado</div>
        <div>• Produto original e lacrado</div>
      </div>

      {/* Trust Indicators */}
      <div className="flex items-center justify-center gap-4 pt-2 border-t text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <span>🔒</span>
          <span>Compra Segura</span>
        </div>
        <div className="flex items-center gap-1">
          <span>✅</span>
          <span>Produto Original</span>
        </div>
        <div className="flex items-center gap-1">
          <span>🏪</span>
          <span>10+ Anos</span>
        </div>
      </div>
    </div>
  );
};

export default ProductModalActions;

