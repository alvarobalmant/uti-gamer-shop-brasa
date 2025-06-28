
import React from 'react';
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

  // Determina se a barra deve estar oculta
  const isHidden = scrollDirection === 'down' && isScrolled;

  return (
    <nav
      className={cn(
        'hidden lg:block bg-background border-t border-border/60',
        'fixed top-[72px] left-0 right-0 z-40', // Fixo ao invés de sticky, posicionado abaixo do MainHeader
        'transition-transform duration-300 ease-in-out',
        {
          '-translate-y-full': isHidden, // Oculta completamente quando rola para baixo
          'translate-y-0': !isHidden, // Mostra quando rola para cima ou está no topo
        },
        className
      )}
    >
      <div className="container mx-auto">
        <div className="flex h-12 items-center justify-center gap-x-2 xl:gap-x-3">
          {/* Navegação configurável do banco de dados */}
          <ConfigurableNavigation 
            showOnlyVisible={true}
            className="flex items-center gap-x-2 xl:gap-x-3"
          />
        </div>
      </div>
    </nav>
  );
};

export default DesktopNavigation;
