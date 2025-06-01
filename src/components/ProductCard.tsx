import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/hooks/useProducts';
// Importar o hook useScrollRestoration refatorado
import { useScrollRestoration } from '@/hooks/useScrollRestoration';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile'; // Importar hook de detecção mobile

// Import subcomponents
import ProductCardImage from './ProductCard/ProductCardImage';
import ProductCardInfo from './ProductCard/ProductCardInfo';
import ProductCardProPrice from './ProductCard/ProductCardProPrice';
import ProductCardStock from './ProductCard/ProductCardStock';
import ProductCardActions from './ProductCard/ProductCardActions';

export type { Product } from '@/hooks/useProducts';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const navigate = useNavigate();
  // Instanciar o hook useScrollRestoration (embora não usemos saveScrollPosition diretamente aqui agora)
  useScrollRestoration();
  const isMobile = useMobile(); // Verificar se é mobile

  // Handler de navegação unificado
  const handleNavigation = useCallback(() => {
    // A lógica de salvar scroll agora está centralizada no hook useScrollRestoration
    // e é acionada pela mudança de localização, não precisamos chamar manualmente aqui.
    navigate(`/produto/${product.id}`);
  }, [navigate, product.id]);

  // Handler específico para eventos de toque (mobile)
  const handleTouchEnd = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    // Previne que o onClick seja disparado logo após o touchEnd em alguns dispositivos,
    // o que poderia causar a navegação dupla.
    event.preventDefault();
    handleNavigation();
  }, [handleNavigation]);

  // Handler específico para clique (desktop)
  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    // Garante que o clique não venha de um elemento filho interativo (como o botão AddToCart)
    // Verificamos se o alvo direto do clique é o próprio card ou um elemento não interativo dentro dele.
    // Elementos interativos como botões terão seu próprio onClick/onTouchEnd e usarão event.stopPropagation().
    if (event.target === event.currentTarget || !(event.target instanceof HTMLButtonElement || event.target instanceof HTMLAnchorElement)) {
        handleNavigation();
    }
  }, [handleNavigation]);

  return (
    <Card
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-card shadow-sm",
        "transition-all duration-300 ease-in-out hover:shadow-md hover:-translate-y-1",
        "cursor-pointer",
        "w-full"
      )}
      // Usa onTouchEnd para mobile para evitar o delay do onClick e o problema do duplo clique
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
      // Mantém onClick para desktop e como fallback
      onClick={!isMobile ? handleClick : undefined}
      // Adiciona role e tabindex para acessibilidade
      role="link"
      tabIndex={0}
      // Adiciona onKeyDown para navegação via teclado
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleNavigation();
        }
      }}
    >
      {/* Image Section */}
      <ProductCardImage product={product} />

      {/* Content Section */}
      <div className="flex flex-1 flex-col justify-between p-3">
        {/* Top part: Info + Price */}
        <div>
          <ProductCardInfo product={product} />
          <ProductCardProPrice product={product} />
        </div>

        {/* Bottom part: Stock + Actions */}
        <div className="mt-2 flex items-center justify-between">
          <ProductCardStock product={product} />
          {/* Passar o produto para ProductCardActions */}
          {/* ProductCardActions deve usar event.stopPropagation() em seus handlers */}
          <ProductCardActions
            product={product}
            onAddToCart={onAddToCart}
          />
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;

