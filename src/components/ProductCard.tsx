
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/hooks/useProducts';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

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
  const { saveScrollPosition } = useScrollPosition();
  const isMobile = useIsMobile();

  const handleCardNavigation = () => {
    console.log(`[ProductCard] Navigating to product: ${product.name}`);
    // Salva a posição antes de navegar
    saveScrollPosition();
    navigate(`/produto/${product.id}`);
  };

  // Handler unificado para cliques/toques
  const handleCardClick = (e: React.MouseEvent | React.TouchEvent) => {
    // Previne navegação se clicou no botão de adicionar ao carrinho
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      console.log('[ProductCard] Click on button, preventing navigation');
      return;
    }

    console.log('[ProductCard] Card clicked/touched, navigating');
    handleCardNavigation();
  };

<<<<<<< HEAD
  // Função para lidar com cliques no mobile (backup para garantir clicabilidade)
  const handleClick = () => {
    if (isMobile) {
      handleCardNavigation();
    } else {
      // No desktop, o onClick normal já funciona
      handleCardNavigation();
    }
  };

  // **Radical Redesign based on GameStop reference and user feedback**
=======
>>>>>>> c9d2f3868ab34e8178942edbc6e9049866c7a6de
  return (
    <Card
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-card shadow-sm",
        "transition-all duration-300 ease-in-out hover:shadow-md", 
        !isMobile && "hover:-translate-y-1",
        "cursor-pointer w-full"
      )}
<<<<<<< HEAD
      onClick={handleClick} // Usar o mesmo handler para mobile e desktop
      onTouchStart={isMobile ? handleTouchStart : undefined}
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
      style={{ touchAction: 'pan-y' }} // Permitir rolagem vertical, mas capturar toques horizontais
=======
      onClick={handleCardClick}
      style={{ 
        touchAction: 'manipulation', // Melhora a responsividade do toque
        WebkitTapHighlightColor: 'transparent' // Remove highlight azul no iOS
      }}
>>>>>>> c9d2f3868ab34e8178942edbc6e9049866c7a6de
    >
      <ProductCardImage product={product} />

      <div className="flex flex-1 flex-col justify-between p-3">
        <div>
          <ProductCardInfo product={product} />
          <ProductCardProPrice product={product} />
        </div>

        <div className="mt-2 flex items-center justify-between">
          <ProductCardStock product={product} />
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
