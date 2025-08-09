import React from 'react';
import { cn } from '@/lib/utils';

interface SectionTitleProps {
  title?: string;
  titlePart1?: string; // Primeira parte do título (ex: "Most Popular")
  titlePart2?: string; // Segunda parte do título (ex: "Trading Cards")
  titleColor1?: string; // Cor da primeira parte
  titleColor2?: string; // Cor da segunda parte
  subtitle?: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  alignment?: 'left' | 'center' | 'right';
}

// Reusable Section Title Component based on GameStop style with bicolor support
const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  titlePart1,
  titlePart2,
  titleColor1,
  titleColor2,
  subtitle,
  className,
  titleClassName,
  subtitleClassName,
  alignment = 'left'
}) => {
  // Verifica se deve usar sistema bicolor ou título simples
  const useBicolorTitle = titlePart1 || titlePart2;
  const useSimpleTitle = title && !useBicolorTitle;

  if (!useBicolorTitle && !useSimpleTitle) {
    return null;
  }

  const alignmentClass = 
    alignment === 'center' ? 'text-center' :
    alignment === 'right' ? 'text-right' : 'text-left';

  return (
    <div className={cn("mb-6", alignmentClass, className)}>
      {useBicolorTitle ? (
        // Sistema bicolor estilo GameStop
        <h2 className={cn(
          "text-3xl font-bold leading-tight tracking-tight",
          titleClassName
        )}>
          {titlePart1 && (
            <span style={{ color: titleColor1 || '#000000' }}>
              {titlePart1}
            </span>
          )}
          {titlePart1 && titlePart2 && ' '}
          {titlePart2 && (
            <span style={{ color: titleColor2 || '#9ca3af' }}>
              {titlePart2}
            </span>
          )}
        </h2>
      ) : (
        // Título simples (compatibilidade com versão anterior)
        <h2 className={cn(
          "text-3xl font-bold leading-tight tracking-tight text-black",
          titleClassName
        )}>
          {title}
        </h2>
      )}
      
      {subtitle && (
        <p className={cn(
          "text-sm md:text-base text-muted-foreground mt-1",
          subtitleClassName
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;

