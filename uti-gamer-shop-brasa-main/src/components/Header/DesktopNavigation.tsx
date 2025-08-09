import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import scrollManager from '@/lib/scrollRestorationManager';
import { ConfigurableNavigation } from '@/components/Navigation';

interface DesktopNavigationProps {
  className?: string;
}

const DesktopNavigation = ({ className }: DesktopNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { scrollDirection, isScrolled } = useScrollDirection(50);
  
  // 🎯 SISTEMA CORRIGIDO: Rastreia o estado atual da barra de forma confiável
  const [isCurrentlyHidden, setIsCurrentlyHidden] = useState(false);
  const lastStateChangeRef = useRef<number>(0);
  const DEBOUNCE_TIME = 100; // Evita mudanças muito frequentes

  // Determina se a barra deve estar oculta baseado no scroll
  const shouldBeHidden = scrollDirection === 'down' && isScrolled;

  // 🎯 CONTROLE PRECISO: Evita animações desnecessárias
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    const now = Date.now();
    
    // 🎯 CONDIÇÕES PARA ANIMAR:
    // 1. Estado desejado é diferente do atual
    // 2. Não está animando no momento
    // 3. Passou tempo suficiente desde a última mudança (debounce)
    if (
      shouldBeHidden !== isCurrentlyHidden && 
      !isAnimating &&
      now - lastStateChangeRef.current > DEBOUNCE_TIME
    ) {
      setIsAnimating(true);
      setIsCurrentlyHidden(shouldBeHidden);
      lastStateChangeRef.current = now;
      
      // 🎯 RESET: Para de animar após a duração da transição (300ms)
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }
  }, [shouldBeHidden, isCurrentlyHidden, isAnimating]);

  return (
    <nav
      className={cn(
        // 🎯 CORREÇÃO: Mostra apenas em desktop (lg+), tablets usam layout mobile
        'hidden lg:block bg-background border-t border-border/60',
        'fixed top-[72px] left-0 right-0 z-40', // Fixo ao invés de sticky, posicionado abaixo do MainHeader
        // 🎯 ANIMAÇÃO SEMPRE ATIVA: Permite transições normais
        'transition-transform duration-300 ease-in-out',
        {
          '-translate-y-full': isCurrentlyHidden, // Usa o estado controlado
          'translate-y-0': !isCurrentlyHidden, // Usa o estado controlado
        },
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className={cn(
          "flex h-12 items-center justify-center",
          // 🎯 RESPONSIVIDADE: Ajusta espaçamento conforme o tamanho da tela
          "gap-x-1 md:gap-x-2 lg:gap-x-3 xl:gap-x-4"
        )}>
          {/* Navegação configurável do banco de dados */}
          <ConfigurableNavigation 
            showOnlyVisible={true}
            className={cn(
              "flex items-center",
              // 🎯 RESPONSIVIDADE: Ajusta espaçamento dos botões conforme a tela
              "gap-x-1 md:gap-x-2 lg:gap-x-3 xl:gap-x-4"
            )}
          />
        </div>
      </div>
    </nav>
  );
};

export default DesktopNavigation;

