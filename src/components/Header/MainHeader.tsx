import React from 'react';
import { useNavigate } from 'react-router-dom';
import DesktopSearchBar from './DesktopSearchBar';
import HeaderActions from './HeaderActions';
import MobileSearchBarTrigger from './MobileSearchBarTrigger'; // Renamed/Refactored for clarity
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, Search } from 'lucide-react'; // Import Search icon for mobile trigger

interface MainHeaderProps {
  onCartOpen: () => void;
  onAuthOpen: () => void;
  onMobileMenuToggle: () => void;
  className?: string;
}

// **Radical Redesign - Header based on GameStop reference and UTI Identity**
const MainHeader = ({ 
  onCartOpen, 
  onAuthOpen, 
  onMobileMenuToggle,
  className
}: MainHeaderProps) => {
  const navigate = useNavigate();
  const [isMobileSearchVisible, setIsMobileSearchVisible] = React.useState(false);

  // Function to toggle mobile search visibility
  const toggleMobileSearch = () => {
    setIsMobileSearchVisible(!isMobileSearchVisible);
  };

  return (
    // Consistent background, border, sticky positioning
    <header className={cn(
      "sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm", // Lighter border, white background
      className
    )}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8"> 
        
        {/* Left side: Mobile Menu Toggle + Logo */}
        <div className="flex items-center">
          {/* Mobile Menu Toggle Button - visible only on md and below */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2 md:hidden text-gray-700 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md" 
            onClick={onMobileMenuToggle}
            aria-label="Abrir menu"
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Logo - Link to home */}
          <div 
            className="flex items-center cursor-pointer flex-shrink-0" 
            onClick={() => navigate('/')}
            aria-label="Página Inicial UTI DOS GAMES"
          >
            <img 
              src="/lovable-uploads/ad4a0480-9a16-4bb6-844b-c579c660c65d.png" // Ensure this path is correct
              alt="UTI DOS GAMES Logo" 
              className="h-9 w-9 sm:h-10 sm:w-10" // Slightly adjusted logo size
            />
            {/* Optional: Text logo can be added back if desired, hidden on mobile */}
             <span className="ml-2 text-xl font-bold text-uti-red hidden sm:inline">UTI DOS GAMES</span> 
          </div>
        </div>

        {/* Center: Desktop Search Bar (visible on md and up) */}
        <div className="flex-1 justify-center px-4 hidden md:flex max-w-xl"> {/* Constrain width */}
           <DesktopSearchBar />
        </div>

        {/* Right side: Actions (Search Trigger Mobile, Cart, Login) */} 
        <div className="flex items-center justify-end space-x-1 sm:space-x-2">
          {/* Mobile Search Trigger - visible only on md and below */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-gray-700 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md" // Added focus-visible for accessibility 
            onClick={toggleMobileSearch} // Use the toggle function
            aria-label="Abrir busca"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Standard Header Actions (Cart, Login) */}
          <HeaderActions
            onCartOpen={onCartOpen}
            onAuthOpen={onAuthOpen}
          />
        </div>
      </div>

      {/* Mobile Search Bar - Conditionally rendered below header */}
      {isMobileSearchVisible && (
        <div className="container md:hidden pb-3 px-4 border-t border-gray-200 bg-white">
           <MobileSearchBarTrigger onSearchSubmit={() => setIsMobileSearchVisible(false)} />
        </div>
      )}
    </header>
  );
};

export default MainHeader;

