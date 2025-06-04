import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown } from 'lucide-react';
import { categories, Category } from './categories';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useScrollDirection } from '@/hooks/useScrollDirection'; // Import the custom hook

interface DesktopNavigationProps {
  className?: string;
}

const DesktopNavigation = ({ className }: DesktopNavigationProps) => {
  const navigate = useNavigate();
  const { scrollDirection, isScrolled } = useScrollDirection(50); // Use the hook, threshold 50px

  const handleCategoryClick = (category: Category) => {
    navigate(category.path);
  };

  return (
    // Navigation bar below the main header, visible on large screens only
    // Added transition and conditional transform based on scroll direction
    <nav
      className={cn(
        'hidden lg:block bg-background border-t border-border/60 sticky top-[72px] z-30',
        'transition-transform duration-300 ease-in-out',
        {
          '-translate-y-full': scrollDirection === 'down' && isScrolled, // Hide when scrolling down past threshold
          'translate-y-0': scrollDirection === 'up' || !isScrolled, // Show when scrolling up or near top
        },
        className
      )}
      // The main header has height 72px, so this nav sticks below it (top-[72px])
      // z-index is lower than main header (z-40) but higher than content
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

