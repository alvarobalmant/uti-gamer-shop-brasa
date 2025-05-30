
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/hooks/useProducts';

interface ProductActionsProps {
  product: Product;
  quantity: number;
  selectedCondition: 'new' | 'pre-owned' | 'digital';
  onAddToCart: () => void;
  onWhatsAppContact: () => void;
}

const ProductActions = ({ 
  product, 
  quantity, 
  selectedCondition, 
  onAddToCart, 
  onWhatsAppContact 
}: ProductActionsProps) => {
  return (
    <div className="space-y-3">
      <Button
        onClick={onAddToCart}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 text-lg rounded-lg shadow-md hover:shadow-lg transition-all"
        disabled={product.stock === 0}
      >
        <ShoppingCart className="w-5 h-5 mr-2" />
        {product.stock === 0 ? 'Produto Esgotado' : 'Adicionar ao Carrinho'}
      </Button>

      <Button
        variant="outline"
        className="w-full border-2 border-gray-300 text-gray-700 hover:border-red-600 hover:text-red-600 font-semibold py-4 rounded-lg transition-all"
      >
        <Heart className="w-5 h-5 mr-2" />
        Adicionar aos Favoritos
      </Button>

      <Button
        onClick={onWhatsAppContact}
        variant="outline"
        className="w-full border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold py-3 rounded-lg"
      >
        💬 Entrar em Contato via WhatsApp
      </Button>
    </div>
  );
};

export default ProductActions;
