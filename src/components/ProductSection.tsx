import React from 'react';
import { usePreLoadHorizontalScroll } from '@/hooks/usePreLoadHorizontalScroll';

interface ProductSectionProps {
  children: React.ReactNode;
  sectionId: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Componente para seções de produtos que OBRIGATORIAMENTE consulta
 * e restaura a posição horizontal ANTES do carregamento
 */
const ProductSection: React.FC<ProductSectionProps> = ({
  children,
  sectionId,
  className = '',
  style = {}
}) => {
  const { elementRef, initialScrollLeft } = usePreLoadHorizontalScroll(sectionId);

  console.log(`[ProductSection] 🏗️ Renderizando seção ${sectionId} com posição inicial: ${initialScrollLeft}px`);

  // Aplica posição inicial após renderização
  React.useEffect(() => {
    if (elementRef.current && initialScrollLeft > 0) {
      elementRef.current.scrollLeft = initialScrollLeft;
    }
  }, [initialScrollLeft]);

  return (
    <div
      ref={elementRef}
      data-section={sectionId}
      data-testid={`product-section-${sectionId}`}
      className={`overflow-x-auto ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default ProductSection;