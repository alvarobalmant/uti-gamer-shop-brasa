
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NavigationItem as NavigationItemType } from '@/types/navigation';

interface NavigationItemProps {
  item: NavigationItemType;
  className?: string;
}

export const NavigationItem: React.FC<NavigationItemProps> = ({ item, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Simplified hover handlers
  const handleMouseEnter = useCallback(() => {
    console.log('🎯 Mouse entered - activating hover');
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    console.log('🎯 Mouse left - deactivating hover');
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Small delay to ensure smooth transition
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 10);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    if (item.link_type === 'external') {
      e.preventDefault();
      window.open(item.link_url, '_blank', 'noopener,noreferrer');
    }
  };

  // Cores padrão se não especificadas
  const normalBg = '#ffffff';
  const normalText = '#333333';
  
  const hoverBg = item.background_color || '#f3f4f6';
  const hoverText = item.hover_text_color || item.text_color || '#1f2937';

  const renderIcon = () => {
    if (!item.icon_url) return null;

    return (
      <motion.span 
        className="text-lg absolute left-2 top-1/2 pointer-events-none select-none"
        style={{
          transformOrigin: 'center center',
        }}
        initial={{
          rotate: -45,
          scale: 0,
          opacity: 0,
          y: '-50%',
          x: '-8px'
        }}
        animate={{
          rotate: isHovered ? 0 : -45,
          scale: isHovered ? 1.0 : 0,
          opacity: isHovered ? 1 : 0,
          y: '-50%',
          x: isHovered ? '0px' : '-8px'
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut"
        }}
      >
        {item.icon_type === 'emoji' ? (
          item.icon_url
        ) : item.icon_type === 'image' ? (
          <img 
            src={item.icon_url} 
            alt={`${item.title} icon`}
            className="w-5 h-5"
            draggable={false}
          />
        ) : (
          <i className={item.icon_url} />
        )}
      </motion.span>
    );
  };

  const ItemContent = () => (
    <motion.div
      ref={containerRef}
      className={`
        relative inline-block
        cursor-pointer select-none
        text-sm font-medium
        transition-all duration-300 ease-out
        ${isHovered ? 'pl-8 pr-4 py-3' : 'px-3 py-3'}
        ${className}
      `}
      style={{
        color: normalText,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      animate={{
        y: isHovered ? -2 : 0,
        scale: isHovered ? 1.02 : 1,
      }}
      transition={{
        duration: 0.3,
        ease: "easeOut"
      }}
    >
      {/* SOMBRA SUTIL EM VOLTA */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ 
          duration: 0.3,
          ease: "easeOut"
        }}
        style={{
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06)',
          zIndex: -1,
        }}
      />

      {/* LINHA ANIMADA EMBAIXO */}
      <motion.div
        className="absolute bottom-0 left-1/2 h-0.5 rounded-full"
        initial={{ 
          width: 0, 
          x: '-50%',
          opacity: 0 
        }}
        animate={{
          width: isHovered ? '80%' : 0,
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ 
          duration: 0.3,
          ease: "easeOut"
        }}
        style={{
          backgroundColor: item.background_color || '#3b82f6',
        }}
      />

      {/* Ícone animado */}
      {renderIcon()}
      
      {/* TEXTO COM MICRO-ANIMAÇÃO */}
      <motion.span 
        className="whitespace-nowrap relative z-10 pointer-events-none select-none"
        animate={{
          fontWeight: isHovered ? 600 : 500,
          letterSpacing: isHovered ? '0.025em' : '0em',
        }}
        transition={{ 
          duration: 0.3,
          ease: "easeOut"
        }}
      >
        {item.title}
      </motion.span>
    </motion.div>
  );

  // Se for link interno, usar React Router Link
  if (item.link_type === 'internal') {
    return (
      <Link 
        to={item.link_url} 
        className="inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <ItemContent />
      </Link>
    );
  }

  // Se for link externo, usar div com onClick
  return <ItemContent />;
};
