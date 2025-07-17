import React, { useMemo } from 'react';
import { useSpecialSections } from '@/hooks/specialSections/useSpecialSections';
import { BannerHeroRenderer } from './BannerHeroRenderer';
import { ProductCarouselRenderer } from './ProductCarouselRenderer';
import { CategoryGridRenderer } from './CategoryGridRenderer';
import { PromotionalBannerRenderer } from './PromotionalBannerRenderer';
import { NewsRenderer } from './NewsRenderer';
import { CustomHtmlRenderer } from './CustomHtmlRenderer';
import type { SpecialSection } from '@/types/specialSections/core';

interface SpecialSectionsRendererProps {
  pageId?: string;
  className?: string;
}

export const SpecialSectionsRenderer: React.FC<SpecialSectionsRendererProps> = ({
  pageId = 'homepage',
  className = ''
}) => {
  const { sections, loading, error, createSection, updateSection } = useSpecialSections({});

  // Filtrar e ordenar seções visíveis
  const visibleSections = useMemo(() => {
    if (!sections) return [];
    
    return sections
      .filter(section => section.isVisible)
      .sort((a, b) => a.order - b.order);
  }, [sections]);

  // Renderizar seção individual
  const renderSection = (section: SpecialSection) => {
    const commonProps = {
      key: section.id,
      section,
      className: 'mb-8'
    };

    switch (section.type) {
      case 'banner_hero':
        return <BannerHeroRenderer {...commonProps} />;
      case 'product_carousel':
        return <ProductCarouselRenderer {...commonProps} />;
      case 'category_grid':
        return <CategoryGridRenderer {...commonProps} />;
      case 'promotional_banner':
        return <PromotionalBannerRenderer {...commonProps} />;
      case 'news_section':
        return <NewsRenderer {...commonProps} />;
      case 'custom_html':
        return <CustomHtmlRenderer {...commonProps} />;
      default:
        console.warn(`Tipo de seção não suportado: ${section.type}`);
        return null;
    }
  };

  if (loading) {
    return (
      <div className={`space-y-8 ${className}`}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse bg-gray-200 rounded-lg h-64"
          />
        ))}
      </div>
    );
  }

  if (error) {
    console.error('Erro ao carregar seções especiais:', error);
    return null; // Falha silenciosa para não quebrar a página
  }

  if (!visibleSections.length) {
    return null; // Sem seções para exibir
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {visibleSections.map(renderSection)}
    </div>
  );
};

