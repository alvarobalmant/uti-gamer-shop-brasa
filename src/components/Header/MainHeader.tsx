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
          <div className="flex items-center flex-shrink-0">
            {/* Mobile Menu Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 md:hidden p-2 h-10 w-10"
              onClick={onMobileMenuToggle}
              aria-label="Abrir menu"
            >
              <Menu className="h-6 w-6" />
            </Button>

            {/* Logo with Text */}
            <a href="/" className="flex items-center" aria-label="Página Inicial UTI DOS GAMES">
              <img
                src="/lovable-uploads/ad4a0480-9a16-4bb6-844b-c579c660c65d.png"
                alt="UTI DOS GAMES Logo"
                className="h-10 w-auto"
              />
              <div className="ml-3 hidden sm:block">
                <h1 className="font-bold text-lg leading-tight text-uti-red">UTI DOS GAMES</h1>
                <p className="text-xs text-gray-600 leading-tight">compre online com a segurança de uma loja física</p>
              </div>
            </a>
          </div>

          {/* Center: Desktop Search Bar */}
          <div className="flex-1 justify-center px-4 hidden md:flex max-w-xl">
             <DesktopSearchBar />
          </div>

          {/* Right side: Header Actions + Mobile Search Toggle */}
          <div className="flex items-center justify-end flex-shrink-0 gap-1"> 
            {/* Mobile Search Toggle Button - Always shows Search icon */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden p-2 h-10 w-10" // Consistent size with menu toggle
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
