import React, { useRef, useEffect } from 'react';
import { useHorizontalScrollTracking } from '@/hooks/useHorizontalScrollTracking';

interface HorizontalScrollSectionProps {
  children: React.ReactNode;
  sectionId?: string;
  className?: string;
  autoTrack?: boolean;
}

/**
 * Componente wrapper para seções com scroll horizontal
 * Automaticamente rastreia a posição de scroll horizontal
 */
const HorizontalScrollSection: React.FC<HorizontalScrollSectionProps> = ({
  children,
  sectionId,
  className = '',
  autoTrack = true
}) => {
  const elementRef = useHorizontalScrollTracking(autoTrack) as React.RefObject<HTMLDivElement>;

  return (
    <div
      ref={elementRef}
      data-section={sectionId}
      data-testid={sectionId ? `horizontal-scroll-${sectionId}` : undefined}
      className={`overflow-x-auto ${className}`}
    >
      {children}
    </div>
  );
};

export default HorizontalScrollSection;