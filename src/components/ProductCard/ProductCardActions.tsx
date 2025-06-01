import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';

interface ProductCardActionsProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

// **Radical Redesign based on GameStop reference and plan_transformacao_radical.md**
// **VERSÃO 2: Removido onTouchEnd para simplificar e tentar corrigir bug de clique duplo no mobile**
const ProductCardActions: React.FC<ProductCardActionsProps> = ({
  product,
  onAddToCart
}) => {
  const isOutOfStock = product.stock === 0;

  // Handler to prevent event propagation and call the actual add to cart function
  // Simplificado para usar apenas onClick, que geralmente funciona bem em mobile moderno
  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card navigation when clicking the button
    e.preventDefault(); // Adicionado para garantir comportamento esperado
    if (!isOutOfStock) {
      onAddToCart(product); // Pass the product object
    }
  };

  // O botão aparece no hover (desktop) ou está sempre visível em touch (simplificado)
  // A visibilidade pode ser controlada por CSS media queries ou um hook useIsMobile se necessário,
  // mas a abordagem atual com group-hover é comum.
  // A chave é garantir que o clique funcione de forma confiável.
  return (
    // O div wrapper agora é sempre visível para simplificar, mas o botão pode ter estilos diferentes
    <div className="absolute bottom-2 right-2 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100"> {/* Mantido group-hover para desktop, mas o clique deve funcionar sempre */}
      <Button
        size="icon" // Use icon size for a smaller footprint
        variant="default" // Use primary color (UTI Red)
        onClick={handleAddToCartClick} // Apenas onClick
        // onTouchEnd={handleAddToCartClick} // REMOVIDO
        disabled={isOutOfStock}
        className={cn(
          "h-8 w-8 rounded-full shadow-md transition-all duration-300 active:scale-90",
          isOutOfStock
            ? "cursor-not-allowed bg-muted text-muted-foreground"
            : "bg-uti-red text-primary-foreground hover:bg-uti-red/90"
        )}
        aria-label={isOutOfStock ? 'Esgotado' : 'Adicionar ao Carrinho'}
        style={{ touchAction: 'manipulation' }} // Mantido para otimizar touch
      >
        <ShoppingCart className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ProductCardActions;

