import React from 'react';
import type { SpecialSection } from '@/types/specialSections/core';

interface CustomHtmlRendererProps {
  section: SpecialSection;
  className?: string;
}

export const CustomHtmlRenderer: React.FC<CustomHtmlRendererProps> = ({
  section,
  className = ''
}) => {
  const config = section.config as any;

  if (!config.htmlContent) {
    return null;
  }

  return (
    <section 
      className={className}
      dangerouslySetInnerHTML={{ __html: config.htmlContent }}
    />
  );
};

