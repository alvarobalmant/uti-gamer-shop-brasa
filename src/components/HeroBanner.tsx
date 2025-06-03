import React from 'react';
import HeroBannerCarousel from './HeroBannerCarousel';

// Este arquivo serve como um ponto de entrada para o componente HeroBanner
// Isso resolve o problema de importação em outros componentes que usam '@/components/HeroBanner'
const HeroBanner: React.FC<{
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
<<<<<<< HEAD
}> = (props) => {
  // Usando o HeroBannerCarousel como base, mas adaptando para aceitar as props específicas
  return <HeroBannerCarousel {...props} />;
=======
}

// Este arquivo serve como um ponto de entrada para o componente HeroBanner
// Isso resolve o problema de importação em outros componentes que usam '@/components/HeroBanner'
const HeroBanner: React.FC<HeroBannerProps> = (props) => {
  // Use props with HeroBannerCarousel or create a simple banner implementation
  // For now, let's create a simple banner that uses the props
  const { title, subtitle, imageUrl, ctaText, ctaLink, theme } = props;
  
  const bannerStyle = theme ? {
    backgroundColor: theme.primaryColor || '#107C10',
    '--primary-color': theme.primaryColor || '#107C10',
    '--secondary-color': theme.secondaryColor || '#3A3A3A',
    '--accent-color': theme.accentColor || theme.primaryColor || '#107C10',
  } as React.CSSProperties : {};

  return (
    <div 
      className="relative w-full h-64 md:h-80 lg:h-96 flex items-center justify-center bg-gradient-to-r from-primary to-primary/80 text-white"
      style={bannerStyle}
    >
      {imageUrl && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}
      <div className="relative z-10 text-center px-4">
        {title && <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{title}</h1>}
        {subtitle && <p className="text-lg md:text-xl mb-6">{subtitle}</p>}
        {ctaText && ctaLink && (
          <a 
            href={ctaLink}
            className="inline-block bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            {ctaText}
          </a>
        )}
      </div>
    </div>
  );
>>>>>>> 112f740a79595fc063ed369e4d53e6bfc044da5f
};

export default HeroBanner;
