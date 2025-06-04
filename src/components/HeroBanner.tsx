
import React from 'react';
import HeroBannerCarousel from './HeroBannerCarousel';

// Este arquivo serve como um ponto de entrada para o componente HeroBanner
// Isso resolve o problema de importação em outros componentes que usam '@/components/HeroBanner'
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

const HeroBanner: React.FC<HeroBannerProps> = (props) => {
  // For now, just render the HeroBannerCarousel since it doesn't accept these specific props
  // TODO: Modify HeroBannerCarousel to accept these props or create a new banner component
  return <HeroBannerCarousel />;
};

export default HeroBanner;
