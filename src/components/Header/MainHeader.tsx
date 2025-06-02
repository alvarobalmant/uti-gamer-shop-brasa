
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DesktopSearchBar from './DesktopSearchBar';
import HeaderActions from './HeaderActions';
import MobileSearchBar from './MobileSearchBar'; // Import MobileSearchBar
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, Search } from 'lucide-react'; // Only need Menu and Search icons here now

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
  const navigate = useNavigate();
  // State to control the visibility of the MobileSearchBar overlay
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Function to toggle the search overlay visibility
  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
  };

  return (
    <> {/* Use Fragment to render MobileSearchBar outside the main div flow */}
      <div className={cn("bg-background border-b sticky top-0 z-40", className)}> {/* z-index adjusted */}
        {/* Top Row: Mobile Menu, Logo, Actions (including mobile search toggle) */}
        <div className="container flex h-[72px] items-center justify-between px-4 gap-2">
          {/* Left side: Mobile Menu Toggle + Logo */}
          {/* Added flex-shrink to allow this section to shrink if needed */}
          <div className="flex items-center flex-shrink min-w-0"> 
            {/* Mobile Menu Toggle Button - REMOVED hover effects for mobile */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "mr-2 md:hidden p-2 h-10 w-10 flex-shrink-0",
                // Only apply hover effects on desktop (md and above)
                "md:hover:bg-accent md:hover:text-accent-foreground"
              )}
              onClick={onMobileMenuToggle}
              aria-label="Abrir menu"
            >
              <Menu className="h-6 w-6" />
            </Button>

            {/* Logo with Text */}
            {/* Added min-w-0 to allow shrinking/truncation */}
            <a href="/" className="flex items-center min-w-0" aria-label="Página Inicial UTI DOS GAMES">
              <img
                src="/lovable-uploads/ad4a0480-9a16-4bb6-844b-c579c660c65d.png"
                alt="UTI DOS GAMES Logo"
                className="h-10 w-auto flex-shrink-0" // Added flex-shrink-0
              />
              {/* Adjusted text sizes and removed truncate for subtitle */}
              <div className="ml-2 sm:ml-3 overflow-hidden">
                <h1 className="font-bold text-sm sm:text-lg leading-tight text-uti-red">UTI DOS GAMES</h1>
                {/* Removed truncate, added whitespace-normal and adjusted font size */}
                <p className="text-[10px] sm:text-xs text-gray-600 leading-tight whitespace-normal">
                  Compre online com a segurança de uma loja física.
                </p>
              </div>
            </a>
          </div>

          {/* Center: Desktop Search Bar */}
          <div className="flex-1 justify-center px-4 hidden md:flex max-w-xl">
             <DesktopSearchBar />
          </div>

          {/* Right side: Header Actions + Mobile Search Toggle */}
          {/* Kept flex-shrink-0 to prevent actions from shrinking */}
          <div className="flex items-center justify-end flex-shrink-0 gap-1"> 
            {/* Mobile Search Toggle Button - REMOVED hover effects for mobile */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "md:hidden p-2 h-10 w-10",
                // Only apply hover effects on desktop (md and above)
                "md:hover:bg-accent md:hover:text-accent-foreground"
              )}
              onClick={toggleMobileSearch} // Opens the search overlay
              aria-label="Abrir busca"
            >
              <Search className="h-6 w-6" />
            </Button>

            {/* Original Header Actions (Cart, Login, etc.) */}
            <HeaderActions
              onCartOpen={onCartOpen}
              onAuthOpen={onAuthOpen}
            />
          </div>
        </div>
      </div>

      {/* Mobile Search Bar Component - Rendered conditionally */}
      {/* Pass state and toggle function as props */}
      <MobileSearchBar isOpen={isMobileSearchOpen} onClose={toggleMobileSearch} />

    </>
  );
};

export default MainHeader;
