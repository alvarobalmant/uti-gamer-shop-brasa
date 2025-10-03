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
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartX = useRef(0);
  const widgetRef = useRef<HTMLDivElement>(null);

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
    setIsDragging(true);
    dragStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const diff = currentX - dragStartX.current;
    
    // Só permite arrastar para a direita
    if (diff > 0) {
      setDragOffset(diff);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    // Se arrastou mais de 60px, minimiza
    if (dragOffset > 60) {
      setIsMinimized(true);
    }
    
    setDragOffset(0);
  };

  const handleExpand = () => {
    setIsMinimized(false);
  };

  const handleWidgetClick = (e: React.MouseEvent) => {
    // Só chama onClick se não estiver minimizado e não estiver arrastando
    if (!isMinimized && !isDragging && onClick) {
      onClick();
    }
  };

  return (
    <div
      ref={widgetRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleWidgetClick}
      style={{
        transform: isDragging ? `translateX(${dragOffset}px)` : isMinimized ? 'translateX(calc(100% - 44px))' : 'translateX(0)',
        transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full shadow-sm cursor-pointer touch-none",
        className
      )}
    >
      {isMinimized ? (
        <>
          <Coins className="w-4 h-4 text-white" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleExpand();
            }}
            className="flex items-center justify-center w-5 h-5 -mr-1 transition-transform duration-200 active:scale-90"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
        </>
      ) : (
        <>
          <Coins className="w-4 h-4 text-white" />
          <span className="text-sm font-semibold whitespace-nowrap">
            {loading ? '...' : formatCoins(coins.balance || 0)}
          </span>
        </>
      )}
    </div>
  );
};

