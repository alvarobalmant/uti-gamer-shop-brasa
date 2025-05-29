import React from 'react';
import { useNavigate } from 'react-router-dom';
import DesktopSearchBar from './DesktopSearchBar';
import HeaderActions from './HeaderActions';
import MobileSearchBar from './MobileSearchBar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

// **Radical Redesign based on GameStop reference and plan_transformacao_radical.md**
// Focus: Visual structure, styling, layout, responsiveness. NO logic changes.

interface MainHeaderProps {
  onCartOpen: () => void;
  onAuthOpen: () => void;
  onMobileMenuToggle: () => void;
  className?: string;
}

const MainHeader = ({ 
  onCartOpen, 
  onAuthOpen, 
  onMobileMenuToggle,
  className
}: MainHeaderProps) => {
  const navigate = useNavigate(); // Keep navigation logic

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm", // GameStop-like: white bg, subtle border/shadow
        className
      )}
    >
      {/* Main Header Row */}
      <div className="container flex h-16 items-center justify-between gap-4 sm:h-20"> 
        
        {/* Left Side: Mobile Menu Toggle + Logo */}
        <div className="flex items-center flex-shrink-0">
          {/* Mobile Menu Toggle Button (md:hidden) */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2 md:hidden text-gray-700 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md" 
            onClick={onMobileMenuToggle} // Keep existing toggle logic
            aria-label="Abrir menu"
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Logo - Always visible, clickable */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => navigate('/')} // Keep existing navigation logic
            aria-label="Ir para a página inicial"
          >
            <img 
              src="/lovable-uploads/ad4a0480-9a16-4bb6-844b-c579c660c65d.png" 
              alt="UTI DOS GAMES Logo" 
              className="h-9 w-9 sm:h-10 sm:w-10" // Slightly adjusted size
            />
            {/* Text Logo - Hidden on mobile, visible sm+ */}
            <span className="hidden sm:inline-block ml-2 text-xl font-bold text-uti-dark">
              UTI DOS GAMES
            </span>
          </div>
        </div>

        {/* Center: Desktop Search Bar (hidden md:flex) */}
        <div className="flex-1 justify-center px-4 hidden md:flex max-w-xl mx-auto">
           <DesktopSearchBar />
        </div>

        {/* Right Side: Header Actions */}
        <div className="flex items-center justify-end flex-shrink-0">
          <HeaderActions
            onCartOpen={onCartOpen} // Keep existing logic
            onAuthOpen={onAuthOpen} // Keep existing logic
          />
        </div>
      </div>

      {/* Mobile Search Bar - Shown below header on small screens (md:hidden) */}
      <div className="container md:hidden pb-3 px-4 border-t border-gray-200">
         <MobileSearchBar />
      </div>
    </header>
  );
};

export default MainHeader;

