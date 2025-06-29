
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NavigationItem as NavigationItemType } from '@/types/navigation';

interface NavigationItemProps {
  item: NavigationItemType;
  className?: string;
}

export const NavigationItem: React.FC<NavigationItemProps> = ({ item, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (item.link_type === 'external') {
      e.preventDefault();
      window.open(item.link_url, '_blank', 'noopener,noreferrer');
    }
  };

  const renderIcon = () => {
    if (!item.icon_url) return null;

    return (
      <motion.span 
        className="text-lg absolute left-2 top-1/2 pointer-events-none select-none"
        style={{
          transformOrigin: 'center center',
        }}
        animate={{
          rotate: isHovered ? 0 : -45,
          scale: isHovered ? 1.0 : 0,
          opacity: isHovered ? 1 : 0,
          y: '-50%',
          x: isHovered ? '0px' : '-8px'
        }}
        transition={{
          duration: 0.25,
          ease: "easeInOut"
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
      className={`
        relative inline-block
        cursor-pointer select-none
        text-sm font-medium
        transition-all duration-300 ease-out
        ${className}
      `}
      style={{
        color: '#333333',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      animate={{
        y: isHovered ? -2 : 0,
        scale: isHovered ? 1.02 : 1,
        paddingLeft: isHovered ? '32px' : '12px',
        paddingRight: isHovered ? '16px' : '12px',
        paddingTop: '12px',
        paddingBottom: '12px'
      }}
      transition={{
        duration: 0.25,
        ease: "easeInOut"
      }}
    >
      {/* SOMBRA SUTIL */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ 
          duration: 0.25,
          ease: "easeInOut"
        }}
        style={{
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06)',
          zIndex: -1,
        }}
      />

      {/* LINHA ANIMADA EMBAIXO */}
      <motion.div
        className="absolute bottom-0 left-1/2 h-0.5 rounded-full"
        style={{
          backgroundColor: item.background_color || '#3b82f6',
        }}
        animate={{
          width: isHovered ? '80%' : '0%',
          opacity: isHovered ? 1 : 0,
          x: '-50%'
        }}
        transition={{ 
          duration: 0.25,
          ease: "easeInOut"
        }}
      />

      {/* ÍCONE ANIMADO */}
      {renderIcon()}
      
      {/* TEXTO COM ANIMAÇÃO */}
      <motion.span 
        className="whitespace-nowrap relative z-10 pointer-events-none select-none"
        animate={{
          fontWeight: isHovered ? 600 : 500,
          letterSpacing: isHovered ? '0.025em' : '0em',
        }}
        transition={{ 
          duration: 0.25,
          ease: "easeInOut"
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
      >
        <ItemContent />
      </Link>
    );
  }

  // Se for link externo, usar div com onClick
  return <ItemContent />;
};
