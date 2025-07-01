<<<<<<< HEAD
import React, { useRef } from 'react';
=======

import React, { useState, useRef, useEffect, useCallback } from 'react';
>>>>>>> 26ecb2a9b6c09826417241be6011cb7921889d8b
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NavigationItem as NavigationItemType } from '@/types/navigation';

interface NavigationItemProps {
  item: NavigationItemType;
  className?: string;
}

export const NavigationItem: React.FC<NavigationItemProps> = ({ item, className = '' }) => {
<<<<<<< HEAD
  const containerRef = useRef<HTMLDivElement>(null);

=======
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

>>>>>>> 26ecb2a9b6c09826417241be6011cb7921889d8b
  const handleClick = (e: React.MouseEvent) => {
    if (item.link_type === 'external') {
      e.preventDefault();
      window.open(item.link_url, '_blank', 'noopener,noreferrer');
    }
  };

  // Cores padrão se não especificadas
  const normalText = '#333333';
<<<<<<< HEAD
=======
  
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
>>>>>>> 26ecb2a9b6c09826417241be6011cb7921889d8b

  const ItemContent = () => (
    <motion.div
      ref={containerRef}
<<<<<<< HEAD
      className="relative inline-block cursor-pointer select-none text-xs md:text-sm font-medium px-2 py-3"
=======
      className={`
        relative inline-block
        cursor-pointer select-none
        text-sm font-medium
        transition-all duration-300 ease-out
        px-3 py-3
        ${className}
      `}
>>>>>>> 26ecb2a9b6c09826417241be6011cb7921889d8b
      style={{
        color: normalText,
      }}
      onClick={handleClick}
<<<<<<< HEAD
      initial="initial"
      whileHover="hover"
      variants={{
        initial: {
          y: 0,
          scale: 1,
          paddingLeft: window.innerWidth >= 768 ? '10px' : '8px',
          paddingRight: window.innerWidth >= 768 ? '10px' : '8px',
        },
        hover: {
          y: -2,
          scale: 1.02,
          paddingLeft: window.innerWidth >= 1024 ? '32px' : '24px',
          paddingRight: window.innerWidth >= 1024 ? '16px' : '12px',
        }
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut"
      }}
    >
      {/* Sombra no hover */}
=======
      whileHover={{
        y: -2,
        scale: 1.02,
        paddingLeft: '32px',
        paddingRight: '16px'
      }}
      transition={{
        duration: 0.3,
        ease: "easeOut"
      }}
    >
      {/* SOMBRA SUTIL EM VOLTA */}
>>>>>>> 26ecb2a9b6c09826417241be6011cb7921889d8b
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        variants={{
          initial: { opacity: 0 },
          hover: { opacity: 1 }
        }}
        transition={{ 
<<<<<<< HEAD
          duration: 0.25,
          ease: "easeInOut"
=======
          duration: 0.3,
          ease: "easeOut"
>>>>>>> 26ecb2a9b6c09826417241be6011cb7921889d8b
        }}
        style={{
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06)',
          zIndex: -1,
        }}
      />

<<<<<<< HEAD
      {/* Linha animada no hover */}
      <motion.div
        className="absolute bottom-0 left-1/2 h-0.5 rounded-full"
        style={{
          backgroundColor: item.background_color || '#3b82f6',
        }}
        variants={{
          initial: { 
            width: 0, 
            x: '-50%',
            opacity: 0 
          },
          hover: {
            width: '80%',
            opacity: 1,
          }
        }}
        transition={{ 
          duration: 0.3,
          ease: "easeInOut"
        }}
      />

      {/* Ícone animado no hover */}
      {item.icon_url && (
        <motion.span 
          className="text-lg absolute left-2 top-1/2 pointer-events-none select-none"
          style={{
            transformOrigin: 'center center',
          }}
          variants={{
            initial: {
              rotate: -45,
              scale: 0,
              opacity: 0,
              y: '-50%',
              x: '-8px'
            },
            hover: {
              rotate: 0,
              scale: 1.0,
              opacity: 1,
              y: '-50%',
              x: '0px'
            }
          }}
          transition={{
            duration: 0.35,
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
      )}
      
      {/* Texto com animação no hover */}
      <motion.span 
        className="whitespace-nowrap relative z-10 pointer-events-none select-none"
        variants={{
          initial: {
            fontWeight: 500,
            letterSpacing: '0em',
          },
          hover: {
            fontWeight: 600,
            letterSpacing: '0.025em',
          }
        }}
        transition={{ 
          duration: 0.2,
          ease: "easeInOut"
=======
      {/* LINHA ANIMADA EMBAIXO - Configurável */}
      {item.show_line !== false && (
        <motion.div
          className="absolute bottom-0 left-1/2 rounded-full"
          style={{
            height: `${item.line_height || 2}px`,
            backgroundColor: item.line_color || '#3b82f6',
            zIndex: 1,
          }}
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
            duration: item.line_animation_duration || 0.3,
            ease: "easeOut"
          }}
        />
      )}

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
>>>>>>> 26ecb2a9b6c09826417241be6011cb7921889d8b
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
