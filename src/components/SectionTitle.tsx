import React from 'react';
import { cn } from '@/lib/utils';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

// Reusable Section Title Component based on GameStop style
const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  className,
  titleClassName,
  subtitleClassName
}) => {
  // Split title for potential bolding (assuming first word is bold)
  const titleParts = title.split(' ');
  const boldPart = titleParts[0];
  const regularPart = titleParts.slice(1).join(' ');

  return (
    <div className={cn("mb-4 md:mb-6", className)}> {/* Margin bottom */}
      <h2 className={cn(
        "text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground tracking-tight leading-tight", // Base title style with improved leading
        titleClassName
      )}>
        {/* Render title with bold first word if applicable */}
        {regularPart ? (
          <>
            <span className="font-bold text-black">{boldPart}</span> <span className="text-gray-800">{regularPart}</span>
          </>
        ) : (
          // If only one word, render normally or bold based on preference
          <span className="font-bold text-black">{title}</span>
        )}
      </h2>
      {subtitle && (
        <p className={cn(
          "text-sm md:text-base text-muted-foreground mt-1", // Subtitle style
          subtitleClassName
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;

