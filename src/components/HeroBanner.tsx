
import React from 'react';
import { Button } from '@/components/ui/button';

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
  };
}

const HeroBanner: React.FC<HeroBannerProps> = ({
  title,
  subtitle,
  imageUrl,
  ctaText,
  ctaLink,
  theme
}) => {
  const primaryColor = theme?.primaryColor || '#107C10';
  
  return (
    <section 
      className="relative py-16 bg-cover bg-center"
      style={{ 
        backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
        backgroundColor: !imageUrl ? primaryColor : undefined
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative container mx-auto px-4 text-center text-white">
        {title && (
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="text-xl md:text-2xl mb-8">
            {subtitle}
          </p>
        )}
        {ctaText && ctaLink && (
          <Button asChild className="bg-white text-black hover:bg-gray-100">
            <a href={ctaLink}>{ctaText}</a>
          </Button>
        )}
      </div>
    </section>
  );
};

export default HeroBanner;
