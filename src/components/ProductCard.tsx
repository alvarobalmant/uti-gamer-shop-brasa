import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/hooks/useProducts';
// Importei useScrollRestoration para usar a função de salvar posição
import { useScrollRestoration } from '@/hooks/useScrollRestoration'; 
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
  // Removido useScrollPosition, pois useScrollRestoration agora lida com isso internamente
  // const { saveScrollPosition } = useScrollPosition(); 

  // A função de navegação agora só precisa navegar
  const handleCardNavigation = () => {
    // A lógica de salvar scroll foi movida para dentro do useScrollRestoration
    // saveScrollPosition(); 
    navigate(`/produto/${product.id}`);
  };

  // Handler específico para touchEnd para tentar resolver o clique duplo no mobile
  const handleTouchEndNavigation = (e: React.TouchEvent) => {
    // Impede que o navegador dispare um evento 'click' simulado após o 'touchend'
    e.preventDefault(); 
    handleCardNavigation();
  };

  return (
    <Card
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-card shadow-sm",
        "transition-all duration-300 ease-in-out hover:shadow-md hover:-translate-y-1",
        "cursor-pointer",
        "w-full"
      )}
      onClick={handleCardNavigation} // Mantém para desktop e acessibilidade
      onTouchEnd={handleTouchEndNavigation} // Adiciona para mobile, prevenindo click simulado
      style={{ touchAction: 'manipulation' }} // Boa prática para elementos interativos touch
    >
      {/* Image Section */}
      <ProductCardImage
        product={product}
      />

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

