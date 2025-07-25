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
  
  // Separar o nome do site em primeira palavra (vermelha) e resto (preto)
  const words = siteInfo.siteName.split(' ');
  const firstWord = words[0] || 'UTI';
  const restWords = words.slice(1).join(' ').replace(/\s+/g, '\u00A0') || 'DOS\u00A0GAMES';

  const containerStyles: React.CSSProperties = {
    width: '2048px',
    height: '409px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    background: '#FFFFFF',
    padding: '0 200px',
    boxSizing: 'border-box',
    gap: '120px'
  };

  const utiStyles: React.CSSProperties = {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 900,
    fontSize: '346px',
    lineHeight: 1,
    color: '#FF3B30',
    letterSpacing: '-0.02em'
  };

  const dosGamesStyles: React.CSSProperties = {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '270px',
    lineHeight: 1,
    color: 'transparent',
    WebkitTextStroke: '5px #000000',
    letterSpacing: '0.04em',
    textTransform: 'uppercase' as const
  };

  const responsiveStyles = `
    @media (max-width: 1024px) {
      .css-logo-container {
        width: 100% !important;
        height: auto !important;
        padding: 0 5vw !important;
        gap: 6vw !important;
      }
      .css-logo-uti {
        font-size: clamp(120px, 34vw, 346px) !important;
      }
      .css-logo-dosgames {
        font-size: clamp(90px, 26vw, 270px) !important;
        -webkit-text-stroke: 2px #000 !important;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: responsiveStyles }} />
      <div 
        className={`css-logo-container ${className}`}
        style={containerStyles}
      >
        <span className="css-logo-uti" style={utiStyles}>
          {firstWord}
        </span>
        <span className="css-logo-dosgames" style={dosGamesStyles}>
          {restWords}
        </span>
      </div>
    </>
  );
};