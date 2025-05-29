import React from 'react';
import { useNavigate } from 'react-router-dom';
import DesktopSearchBar from './DesktopSearchBar';
import HeaderActions from './HeaderActions';
import MobileSearchBar from './MobileSearchBar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface MainHeaderProps {
  onCartOpen: () => void;
  onAuthOpen: () => void;
  onMobileMenuToggle: () => void;
  className?: string;
}

// **Redesign based on GameStop Header structure**
const MainHeader = ({ 
  onCartOpen, 
  onAuthOpen, 
  onMobileMenuToggle,
  className
}: MainHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className={cn("bg-background", className)}> {/* Removed sticky/border, handled by ProfessionalHeader */}
      {/* Top Row: Mobile Menu, Logo, Actions */}
      <div className="container flex h-16 items-center justify-between"> 
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

          {/* Logo - Link to home */}
          <a href="/" className="flex items-center flex-shrink-0" aria-label="Página Inicial UTI DOS GAMES">
            <img 
              src="/lovable-uploads/ad4a0480-9a16-4bb6-844b-c579c660c65d.png" // Ensure this path is correct
              alt="UTI DOS GAMES Logo" 
              className="h-10 w-auto" // Adjusted height, auto width
            />
            {/* Optional: Text logo can be added back if desired, but GameStop uses image logo primarily */}
          </a>
        </div>

        {/* Center: Desktop Search Bar (visible on md and up) */}
        <div className="flex-1 justify-center px-4 hidden md:flex max-w-xl"> {/* Added max-width */}
           <DesktopSearchBar />
        </div>

        {/* Right side: Header Actions (Cart, Login, etc.) */}
        <div className="flex items-center justify-end">
          <HeaderActions
            onCartOpen={onCartOpen}
            onAuthOpen={onAuthOpen}
          />
        </div>
      </div>

      {/* Bottom Row: Mobile Search Bar (visible on small screens) */}
      <div className="container md:hidden pb-3 px-4 border-t border-border/80"> {/* Added border */}
         <MobileSearchBar />
      </div>
    </div>
  );
};

export default MainHeader;

