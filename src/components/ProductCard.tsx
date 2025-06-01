import React, { useState, useRef, TouchEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/hooks/useProducts';
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

// Limiar de movimento para diferenciar clique de arraste (em pixels)
const DRAG_THRESHOLD = 10;

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const navigate = useNavigate();
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const isDragging = useRef(false);

  const handleCardNavigation = () => {
    // Só navega se não estiver arrastando
    if (!isDragging.current) {
      navigate(`/produto/${product.id}`);
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    // Reseta o estado de arraste
    isDragging.current = false;
    // Guarda a posição inicial do toque
    if (e.touches.length === 1) {
      touchStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    // Se já está arrastando, não faz nada
    if (isDragging.current || !touchStartPos.current || e.touches.length !== 1) {
      return;
    }

    // Calcula a distância do movimento
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = Math.abs(currentX - touchStartPos.current.x);
    const deltaY = Math.abs(currentY - touchStartPos.current.y);

    // Se o movimento exceder o limiar, marca como arraste
    if (deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD) {
      isDragging.current = true;
      // console.log('Drag detectado');
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    // Se não foi um arraste, considera um clique e navega
    if (!isDragging.current) {
      // Previne o clique simulado que pode ocorrer após o touchend
      e.preventDefault(); 
      handleCardNavigation();
    }
    // Reseta a posição inicial do toque
    touchStartPos.current = null;
    // Reseta o estado de arraste (importante para o próximo toque)
    // isDragging.current = false; // Resetar aqui pode ser problemático se o onClick disparar logo depois
    // É melhor resetar no onTouchStart
  };

  return (
    <Card
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-card shadow-sm",
        "transition-all duration-300 ease-in-out hover:shadow-md hover:-translate-y-1",
        "cursor-pointer", // Mantém cursor para desktop
        "w-full"
      )}
      onClick={handleCardNavigation} // Mantém para desktop e acessibilidade
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      // style={{ touchAction: 'manipulation' }} // Remover 'manipulation' pode ajudar se houver conflitos, mas pode afetar o scroll nativo. Testar sem primeiro.
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

