import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown } from 'lucide-react';
import { categories, Category } from './categories'; // Assuming categories data is defined here
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button'; // Use Button for consistency

interface DesktopNavigationProps {
  className?: string;
}

const DesktopNavigation = ({ className }: DesktopNavigationProps) => {
  const navigate = useNavigate();

  const handleCategoryClick = (category: Category) => {
    navigate(category.path);
  };

  return (
    // Navigation bar below the main header, visible on large screens only
    // Clean background, subtle top border to separate from header shadow
    <nav className={cn(
      "hidden lg:block bg-background border-t border-border/60", 
      className
    )}>
      <div className="container mx-auto"> {/* Use standard container */} 
        <div className="flex h-12 items-center justify-center gap-x-6 xl:gap-x-8"> {/* Adjusted height and gap */}
          
          {categories.map(category => (
            <Button
              key={category.id}
              variant="ghost" // Use ghost variant for clean look
              size="sm" // Smaller size for nav items
              onClick={() => handleCategoryClick(category)}
              className="text-sm font-medium text-muted-foreground hover:text-primary hover:bg-transparent px-2"
              // Use muted foreground, primary color on hover, transparent background
            >
              {category.name}
            </Button>
          ))}
          
          {/* UTI PRO Link - Styled as a distinct button or badge */}
          <Button
            variant="outline" // Outline variant for subtle emphasis
            size="sm"
            onClick={() => navigate('/uti-pro')}
            className="flex items-center gap-1.5 text-sm font-semibold text-uti-pro hover:bg-yellow-500/10 border-uti-pro/50 hover:border-uti-pro/80 transition-colors duration-150"
            // Using uti-pro color (defined in tailwind.config), subtle hover
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

