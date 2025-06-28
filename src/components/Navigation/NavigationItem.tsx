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
  const [wasHovered, setWasHovered] = useState(false); // Estado para rastrear se já esteve em hover
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, []);

  // Sistema híbrido: detecção contínua + animação de saída garantida
  useEffect(() => {
    if (isHovered) {
      setWasHovered(true); // Marca que entrou em hover
      
      // Verifica a cada 20ms se o mouse está realmente sobre o elemento
      checkIntervalRef.current = setInterval(() => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        
        // Pega a posição atual do mouse
        const handleMouseCheck = (e: MouseEvent) => {
          const isInside = (
            e.clientX >= rect.left && 
            e.clientX <= rect.right && 
            e.clientY >= rect.top && 
            e.clientY <= rect.bottom
          );

          if (!isInside && wasHovered) {
            // 🎯 SISTEMA HÍBRIDO: Mouse saiu + estava em hover = dispara animação de saída
            console.log('🎯 Sistema híbrido detectou saída do mouse - disparando animação');
            setIsHovered(false);
            setWasHovered(false); // Reset do estado
            if (checkIntervalRef.current) {
              clearInterval(checkIntervalRef.current);
            }
          }
        };

        // Adiciona listener temporário para capturar posição do mouse
        const tempListener = (e: MouseEvent) => {
          handleMouseCheck(e);
          document.removeEventListener('mousemove', tempListener);
        };
        
        document.addEventListener('mousemove', tempListener);
        
        // Remove o listener após um tempo se não houver movimento
        setTimeout(() => {
          document.removeEventListener('mousemove', tempListener);
        }, 10);
        
      }, 20); // Check a cada 20ms - mais responsivo

      return () => {
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
        }
      };
    } else {
      // Quando sai do hover, garante que o estado wasHovered seja resetado
      setWasHovered(false);
    }
  }, [isHovered, wasHovered]);

  // Hover handlers otimizados para sistema híbrido
  const handleMouseEnter = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    console.log('🎯 Mouse entrou - ativando hover');
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // 🎯 SISTEMA HÍBRIDO: onMouseLeave como backup + delay mínimo para permitir detecção contínua
    console.log('🎯 onMouseLeave detectado - aguardando confirmação do sistema contínuo');
    
    // Pequeno delay para permitir que o sistema de detecção contínua confirme a saída
    hoverTimeoutRef.current = setTimeout(() => {
      if (wasHovered) {
        console.log('🎯 Backup onMouseLeave confirmou saída - disparando animação');
        setIsHovered(false);
        setWasHovered(false);
      }
    }, 30); // Delay mínimo para coordenação entre sistemas
  }, [wasHovered]);

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

    // SOLUÇÃO DEFINITIVA: Framer Motion (sem conflitos CSS)
    return (
      <motion.span 
        className="text-lg absolute left-2 top-1/2 pointer-events-none select-none"
        style={{
          transformOrigin: 'center center',
        }}
        initial={{
          rotate: -45,                        // Começa inclinado (torto)
          scale: 0,
          opacity: 0,
          y: '-50%',
          x: '-8px'
        }}
        animate={{
          rotate: isHovered ? 0 : -45,        // Termina em pé (0°) quando hover
          scale: isHovered ? 1.0 : 0,         // Crescimento até tamanho normal
          opacity: isHovered ? 1 : 0,         // Aparição suave
          y: '-50%',                          // Centralização vertical
          x: isHovered ? '0px' : '-8px'       // Movimento horizontal
        }}
        transition={{
          rotate: {
            duration: isHovered ? 0.4 : 0.3,    // Entrada 0.4s, saída 0.3s (mais rápida)
            ease: isHovered ? "easeOut" : "easeIn" // Entrada suave, saída mais direta
          },
          scale: {
            duration: isHovered ? 0.4 : 0.3,     // Sincronizado com rotação
            ease: isHovered ? "easeOut" : "easeIn"
          },
          opacity: {
            duration: isHovered ? 0.3 : 0.2,     // Saída mais rápida
            ease: "easeOut"
          },
          x: {
            duration: isHovered ? 0.3 : 0.2,
            ease: "easeOut"
          }
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
        ${isHovered ? 'pl-8 pr-4 py-3' : 'px-3 py-3'}
        ${className}
      `}
      style={{
        color: normalText, // Sempre cor normal, sem mudança
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      // MELHORIAS DE UI/UX com animação de saída
      animate={{
        y: isHovered ? -2 : 0,              // Elevação sutil
        scale: isHovered ? 1.02 : 1,        // Crescimento micro
      }}
      transition={{
        y: { 
          duration: isHovered ? 0.2 : 0.15,  // Saída mais rápida
          ease: isHovered ? "easeOut" : "easeIn" 
        },
        scale: { 
          duration: isHovered ? 0.2 : 0.15,  // Saída mais rápida
          ease: isHovered ? "easeOut" : "easeIn" 
        }
      }}
      whileHover={{
        transition: { duration: 0.2 }
      }}
    >
      {/* SOMBRA SUTIL EM VOLTA (substituindo background colorido) */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ 
          duration: isHovered ? 0.3 : 0.2,   // Saída mais rápida
          ease: isHovered ? "easeOut" : "easeIn" 
        }}
        style={{
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06)',
          zIndex: -1,
        }}
      />

      {/* LINHA ANIMADA EMBAIXO (estilo Petz) */}
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
          duration: isHovered ? 0.4 : 0.25,  // Saída mais rápida
          ease: isHovered ? "easeOut" : "easeIn",
          width: { 
            duration: isHovered ? 0.3 : 0.2  // Linha recolhe mais rápido
          }
        }}
        style={{
          backgroundColor: item.background_color || '#3b82f6',
        }}
      />

      {/* Ícone animado - só aparece no hover com rotação */}
      {renderIcon()}
      
      {/* TEXTO COM MICRO-ANIMAÇÃO */}
      <motion.span 
        className="whitespace-nowrap relative z-10 pointer-events-none select-none"
        animate={{
          fontWeight: isHovered ? 600 : 500,
          letterSpacing: isHovered ? '0.025em' : '0em',
        }}
        transition={{ 
          duration: isHovered ? 0.2 : 0.15,  // Saída mais rápida
          ease: isHovered ? "easeOut" : "easeIn" 
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

