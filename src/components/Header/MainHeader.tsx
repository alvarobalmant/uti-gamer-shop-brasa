
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DesktopSearchBar from './DesktopSearchBar';
import HeaderActions from './HeaderActions';
import MobileSearchBar from './MobileSearchBar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, Search } from 'lucide-react';

interface MainHeaderProps {
  onCartOpen: () => void;
  onAuthOpen: () => void;
  onMobileMenuToggle?: () => void; // Made optional with default
  className?: string;
}

const MainHeader = ({
  onCartOpen,
  onAuthOpen,
  onMobileMenuToggle = () => {}, // Default empty function
  className
}: MainHeaderProps) => {
  const navigate = useNavigate();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
  };

  return (
    <>
      <div className={cn("bg-background border-b sticky top-0 z-40", className)}>
        <div className="container flex h-[72px] items-center justify-between px-4 gap-2">
          <div className="flex items-center flex-shrink min-w-0"> 
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "mr-2 md:hidden p-2 h-10 w-10 flex-shrink-0",
                "md:hover:bg-accent md:hover:text-accent-foreground"
              )}
              onClick={onMobileMenuToggle}
              aria-label="Abrir menu"
            >
              <Menu className="h-6 w-6" />
            </Button>

            <a href="/" className="flex items-center min-w-0" aria-label="Página Inicial UTI DOS GAMES">
              <img
                src="/lovable-uploads/ad4a0480-9a16-4bb6-844b-c579c660c65d.png"
                alt="UTI DOS GAMES Logo"
                className="h-10 w-auto flex-shrink-0"
              />
              <div className="ml-2 sm:ml-3 overflow-hidden">
                <h1 className="font-bold text-sm sm:text-lg leading-tight text-uti-red">UTI DOS GAMES</h1>
                <p className="text-[10px] sm:text-xs text-gray-600 leading-tight whitespace-normal">
                  Compre online com a segurança de uma loja física.
                </p>
              </div>
            </a>
          </div>

          <div className="flex-1 justify-center px-4 hidden md:flex max-w-xl">
             <DesktopSearchBar />
          </div>

          <div className="flex items-center justify-end flex-shrink-0 gap-1"> 
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "md:hidden p-2 h-10 w-10",
                "md:hover:bg-accent md:hover:text-accent-foreground"
              )}
              onClick={toggleMobileSearch}
              aria-label="Abrir busca"
            >
              <Search className="h-6 w-6" />
            </Button>

            <HeaderActions
              onCartOpen={onCartOpen}
              onAuthOpen={onAuthOpen}
            />
          </div>
        </div>
      </div>

      <MobileSearchBar isOpen={isMobileSearchOpen} onClose={toggleMobileSearch} />
    </>
  );
};

export default MainHeader;
