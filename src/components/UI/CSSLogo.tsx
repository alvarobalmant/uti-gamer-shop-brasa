import React from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

interface CSSLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CSSLogo: React.FC<CSSLogoProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const { siteInfo } = useSiteSettings();
  
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl', 
    lg: 'text-4xl'
  };

  // Separar o nome do site em primeira palavra (vermelha) e resto (preto)
  const words = siteInfo.siteName.split(' ');
  const firstWord = words[0] || 'UTI';
  const restWords = words.slice(1).join(' ') || 'dos Games';

  return (
    <div className={`flex items-center font-bold ${sizeClasses[size]} ${className}`}>
      <span className="text-uti-red tracking-tight">{firstWord}</span>
      <span className="text-foreground ml-1 font-medium">{restWords}</span>
    </div>
  );
};