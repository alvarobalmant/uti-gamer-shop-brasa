
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown } from 'lucide-react';
import { categories, Category } from './categories';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useScrollDirection } from '@/hooks/useScrollDirection';

interface DesktopNavigationProps {
  className?: string;
}

const DesktopNavigation = ({ className }: DesktopNavigationProps) => {
  const navigate = useNavigate();
  const { scrollDirection, isScrolled } = useScrollDirection(50);

  const handleCategoryClick = (category: Category) => {
    navigate(category.path);
  };

  // Determina se a barra deve estar oculta
  const isHidden = scrollDirection === 'down' && isScrolled;

  return (
    <nav
      className={cn(
        'hidden lg:block bg-background border-t border-border/60',
        'sticky top-[72px] z-40', // Posicionado abaixo do MainHeader (altura 72px)
        'transition-transform duration-300 ease-in-out',
        {
          '-translate-y-full': isHidden, // Oculta completamente quando rola para baixo
          'translate-y-0': !isHidden, // Mostra quando rola para cima ou está no topo
        },
        className
      )}
    >
      <div className="container mx-auto">
        <div className="flex h-12 items-center justify-center gap-x-6 xl:gap-x-8">
          {categories.map(category => (
            <Button
              key={category.id}
              variant="ghost"
              size="sm"
              onClick={() => handleCategoryClick(category)}
              className="text-sm font-medium text-muted-foreground hover:text-primary hover:bg-transparent px-2"
            >
              {category.name}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/uti-pro')}
            className="flex items-center gap-1.5 text-sm font-semibold text-uti-pro hover:bg-yellow-500/10 border-uti-pro/50 hover:border-uti-pro/80 transition-colors duration-150"
          >
            <Crown className="w-4 h-4 text-uti-pro/90" />
            UTI PRO
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default DesktopNavigation;
