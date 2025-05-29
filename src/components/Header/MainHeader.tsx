import React from 'react';
import { useNavigate } from 'react-router-dom';
import DesktopSearchBar from './DesktopSearchBar';
import HeaderActions from './HeaderActions';
import MobileSearchBar from './MobileSearchBar'; // Import MobileSearchBar
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button'; // Import Button for mobile menu toggle
import { Menu } from 'lucide-react'; // Import Menu icon

interface MainHeaderProps {
  onCartOpen: () => void;
  onAuthOpen: () => void;
  // onCategoriesToggle is likely handled within MobileMenu now
  onMobileMenuToggle: () => void;
  className?: string;
}

const MainHeader = ({ 
  onCartOpen, 
  onAuthOpen, 
  onMobileMenuToggle,
  className
}: MainHeaderProps) => {
  const navigate = useNavigate();

  return (
    // Apply sticky header styles from the plan
    <header className={cn(
      "sticky top-0 z-50 w-full border-b border-uti-gray-dark/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80",
      className
    )}>
      <div className="container flex h-16 items-center justify-between sm:h-20"> {/* Use standard container, adjusted height */}
        
        {/* Left side: Mobile Menu Toggle (visible on small screens) + Logo */} 
        <div className="flex items-center">
          {/* Mobile Menu Toggle Button - visible only on md and below */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2 md:hidden" 
            onClick={onMobileMenuToggle}
            aria-label="Abrir menu"
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Logo */} 
          <div className="flex items-center cursor-pointer flex-shrink-0" onClick={() => navigate('/')}>
            <img 
              src="/lovable-uploads/ad4a0480-9a16-4bb6-844b-c579c660c65d.png" // Ensure this path is correct
              alt="UTI DOS GAMES Logo" 
              className="h-10 w-10 sm:h-12 sm:w-12 mr-2" // Refined logo size
            />
            {/* Hide text logo on smaller screens for cleaner look */}
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold text-uti-dark leading-tight">
                UTI DOS GAMES
              </h1>
              {/* Optional: Subtitle can be removed for cleaner header */}
              {/* <p className="text-xs text-uti-gray-medium font-medium -mt-0.5">
                A loja de games de Colatina
              </p> */}
            </div>
          </div>
        </div>

        {/* Center: Desktop Search Bar (visible on md and up) */}
        <div className="flex-1 justify-center px-4 hidden md:flex">
           <DesktopSearchBar />
        </div>

        {/* Right side: Header Actions (Cart, Login) */} 
        <div className="flex items-center justify-end">
          <HeaderActions
            onCartOpen={onCartOpen}
            onAuthOpen={onAuthOpen}
            // Removed unnecessary props if handled elsewhere
            // onCategoriesToggle={onCategoriesToggle} 
            // onMobileMenuToggle={onMobileMenuToggle} // Toggle is now outside HeaderActions
          />
        </div>
      </div>

      {/* Mobile Search Bar - Shown below header on small screens (md:hidden) */} 
      <div className="container md:hidden pb-3 px-4 border-t border-uti-gray-dark/10">
         <MobileSearchBar />
      </div>
    </header>
  );
};

export default MainHeader;

