import React from 'react';
import { useNavigate } from 'react-router-dom';
import DesktopSearchBar from './DesktopSearchBar';
import HeaderActions from './HeaderActions';
import { cn } from '@/lib/utils'; // Assuming utils path

interface MainHeaderProps {
  onCartOpen: () => void;
  onAuthOpen: () => void;
  onCategoriesToggle: () => void;
  onMobileMenuToggle: () => void;
  className?: string;
}

const MainHeader = ({ 
  onCartOpen, 
  onAuthOpen, 
  onCategoriesToggle, 
  onMobileMenuToggle,
  className
}: MainHeaderProps) => {
  const navigate = useNavigate();

  return (
    // Removed container-professional, will be applied higher up or managed by layout
    // Added sticky top-0 z-50 bg-white shadow-md for sticky header effect
    <div className={cn("sticky top-0 z-50 bg-white shadow-md", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8"> {/* Standard container with padding */}
        <div className="flex items-center justify-between h-16 sm:h-20"> {/* Adjusted height slightly */}
          {/* Logo - Kept structure, adjusted sizing slightly */}
          <div className="flex items-center cursor-pointer flex-shrink-0" onClick={() => navigate('/')}>
            <img 
              src="/lovable-uploads/ad4a0480-9a16-4bb6-844b-c579c660c65d.png" 
              alt="UTI DOS GAMES Logo" 
              className="h-10 w-10 sm:h-14 sm:w-14 mr-2 sm:mr-3" // Slightly smaller logo
            />
            <div className="hidden sm:block"> {/* Hide text on very small screens if needed */}
              <h1 className="text-lg sm:text-xl font-bold text-uti-dark font-heading leading-tight">
                UTI DOS GAMES
              </h1>
              <p className="text-[10px] sm:text-xs text-uti-gray font-medium -mt-1">
                A loja de games de Colatina
              </p>
            </div>
          </div>

          {/* Desktop Search Bar - Increased flex-grow to take more space */}
          <div className="flex-1 min-w-0 px-4 lg:px-8 hidden md:block"> {/* Hide on small screens */}
             <DesktopSearchBar />
          </div>

          {/* Right Actions - Kept structure, component will handle icons/layout */}
          <HeaderActions
            onCartOpen={onCartOpen}
            onAuthOpen={onAuthOpen}
            onCategoriesToggle={onCategoriesToggle} // This might be for mobile only now
            onMobileMenuToggle={onMobileMenuToggle}
          />
        </div>
        {/* Mobile Search Bar - Shown below header on small screens */} 
        <div className="md:hidden pb-2 px-1">
           <DesktopSearchBar /> {/* Reuse desktop or use MobileSearchBar if different */} 
        </div>
      </div>
    </div>
  );
};

export default MainHeader;

