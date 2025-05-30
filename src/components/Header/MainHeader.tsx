
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

const MainHeader = ({ 
  onCartOpen, 
  onAuthOpen, 
  onMobileMenuToggle,
  className
}: MainHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className={cn("bg-background border-b", className)}> {/* Added border-b for visual separation */} 
      {/* Top Row: Mobile Menu, Logo, Actions */}
      {/* Increased height for mobile, adjusted padding */}
      <div className="container flex h-[72px] items-center justify-between px-4 gap-2"> 
        {/* Left side: Mobile Menu Toggle (visible on small screens) + Logo */}
        <div className="flex items-center flex-shrink-0">
          {/* Mobile Menu Toggle Button - visible only on md and below */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2 md:hidden p-2 h-10 w-10" // Increased size and margin for easier tap
            onClick={onMobileMenuToggle}
            aria-label="Abrir menu"
          >
            <Menu className="h-6 w-6" /> {/* Icon size maintained, button size increased */} 
          </Button>

          {/* Logo - Link to home */}
          <a href="/" className="flex items-center" aria-label="Página Inicial UTI DOS GAMES">
            <img 
              src="/lovable-uploads/ad4a0480-9a16-4bb6-844b-c579c660c65d.png" // Ensure this path is correct
              alt="UTI DOS GAMES Logo" 
              className="h-10 w-auto" // Increased height slightly
            />
          </a>
        </div>

        {/* Center: Desktop Search Bar (visible on md and up) */}
        <div className="flex-1 justify-center px-4 hidden md:flex max-w-xl">
           <DesktopSearchBar />
        </div>

        {/* Right side: Header Actions (Cart, Login, etc.) */}
        {/* Ensure HeaderActions itself provides adequate spacing for its internal items */} 
        <div className="flex items-center justify-end flex-shrink-0">
          <HeaderActions
            onAuthOpen={onAuthOpen}
          />
        </div>
      </div>

      {/* Bottom Row: Mobile Search Bar (visible on small screens) */}
      {/* Removed border-t, added padding-bottom */} 
      <div className="container md:hidden pb-4 px-4 pt-1"> 
         <MobileSearchBar />
      </div>
    </div>
  );
};

export default MainHeader;
