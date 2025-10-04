import React, { useState, useRef, useEffect } from 'react';
import { Coins, ChevronLeft } from 'lucide-react';
import { useUTICoins } from '@/contexts/UTICoinsContext';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface UTICoinsMobileWidgetProps {
  onClick?: () => void;
  className?: string;
}

export const UTICoinsMobileWidget = ({ onClick, className }: UTICoinsMobileWidgetProps) => {
  const { coins, loading } = useUTICoins();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  const [isMinimized, setIsMinimized] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);

  // Só renderiza no mobile e se o usuário estiver logado
  if (!isMobile || !user) return null;

  const formatCoins = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toLocaleString('pt-BR');
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isMinimized) return; // Não permite arrastar quando minimizado
    setIsDragging(true);
    startXRef.current = e.touches[0].clientX;
    currentXRef.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isMinimized) return;
    
    const deltaX = e.touches[0].clientX - startXRef.current;
    // Só permite arrastar para a direita
    if (deltaX > 0) {
      currentXRef.current = deltaX;
      setDragOffset(deltaX);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // Se arrastou mais de 60px para a direita, minimiza
    if (currentXRef.current > 60) {
      setIsMinimized(true);
      setDragOffset(0);
    } else {
      // Caso contrário, volta ao normal
      setDragOffset(0);
    }
    
    currentXRef.current = 0;
  };

  const handleExpand = () => {
    setIsMinimized(false);
    if (onClick) onClick();
  };

  // Widget minimizado - apenas ícone e seta
  if (isMinimized) {
    return (
      <button
        onClick={handleExpand}
        className={cn(
          "flex items-center gap-1 px-2 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-l-full shadow-sm transition-all duration-200 hover:shadow-md fixed right-0 top-20 z-50",
          className
        )}
      >
        <ChevronLeft className="w-4 h-4 text-white animate-pulse" />
        <Coins className="w-4 h-4 text-white" />
      </button>
    );
  }

  // Widget expandido - com drag
  return (
    <div
      ref={widgetRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: isDragging ? `translateX(${dragOffset}px)` : 'translateX(0)',
        transition: isDragging ? 'none' : 'transform 0.3s ease-out',
      }}
      className={cn(
        "touch-none select-none",
        className
      )}
    >
      <button
        onClick={onClick}
        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95"
      >
        <Coins className="w-4 h-4 text-white" />
        <span className="text-sm font-semibold">
          {loading ? '...' : formatCoins(coins.balance || 0)}
        </span>
      </button>
    </div>
  );
};

