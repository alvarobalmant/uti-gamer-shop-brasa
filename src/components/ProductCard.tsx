import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/hooks/useProducts';
// Removed import { useScrollPosition } from '@/hooks/useScrollPosition';
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
  // Update the prop type to expect the product object
  onAddToCart: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const navigate = useNavigate();
  // Removed const { saveScrollPosition } = useScrollPosition();
  const isMobile = useIsMobile();
  
  // Variáveis para rastrear eventos de toque
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });

  const handleCardNavigation = () => {
<<<<<<< HEAD
    // Removed saveScrollPosition(); - useScrollRestoration handles this globally
=======
    saveScrollPosition();
>>>>>>> 7ff55c08f35e80e8ace4e01bc0b5fcabc4e7d4be
    navigate(`/produto/${product.id}`);
  };

  // Manipulador de início de toque
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
  };

  // Manipulador de fim de toque
  const handleTouchEnd = (e: React.TouchEvent) => {
    // Se não houver toque inicial registrado, sair
    if (!touchStartRef.current.time) return;
    
    // Calcular tempo e distância do toque
    const touchTime = Date.now() - touchStartRef.current.time;
    
    // Se o evento não tiver changedTouches, sair
    if (!e.changedTouches || e.changedTouches.length === 0) return;
    
    const touch = e.changedTouches[0];
    const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
    
    // Definir limites para considerar como toque (não arraste)
    // Toque rápido (menos de 300ms) e movimento mínimo (menos de 10px)
    const isValidTap = touchTime < 300 && deltaX < 10 && deltaY < 10;
    
    if (isValidTap) {
      e.preventDefault();
      handleCardNavigation();
    }
    
    // Resetar referência de toque
    touchStartRef.current = { x: 0, y: 0, time: 0 };
  };

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
  return (
    <Card
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-card shadow-sm", // Even lighter border (gray-100), consistent radius
        "transition-all duration-300 ease-in-out hover:shadow-md", 
        // Remover efeito de crescimento no mobile
        !isMobile && "hover:-translate-y-1", // Subtle shadow and lift hover effect
        "cursor-pointer",
        "w-full" // Ensure card takes full width in its container (for carousel/grid)
        // Removed fixed width/height to allow flexibility in carousel/grid
      )}
      onClick={handleClick} // Usar o mesmo handler para mobile e desktop
      onTouchStart={isMobile ? handleTouchStart : undefined}
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
      style={{ touchAction: 'pan-y' }} // Permitir rolagem vertical, mas capturar toques horizontais
    >
      {/* Image Section - Takes most space */}
      <ProductCardImage
        product={product}
      />

      {/* Content Section - Minimalist, below image */}
      <div className="flex flex-1 flex-col justify-between p-3"> {/* Use padding, justify-between */}
        {/* Top part: Info + Price */}
        <div>
          {/* Ensure ProductCardInfo uses appropriate text sizes/styles */}
          <ProductCardInfo product={product} />
          {/* Ensure ProductCardProPrice highlights the PRO price effectively */}
          <ProductCardProPrice product={product} />
        </div>

        {/* Bottom part: Stock + Actions (aligned bottom) */}
        <div className="mt-2 flex items-center justify-between"> {/* Align stock and actions */}
          <ProductCardStock product={product} />
          {/* Pass the product object to ProductCardActions */}
          <ProductCardActions
            product={product}
            onAddToCart={onAddToCart} // Pass the function that expects the product
          />
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;

