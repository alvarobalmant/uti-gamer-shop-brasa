
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
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
  };

  return (
    <>
      <div className={cn(
        "w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border/80 shadow-sm",
        "fixed top-0 left-0 right-0 z-50", // Mudança aqui: fixed ao invés de sticky
        className
      )}>
        <div className="container flex h-[72px] items-center justify-between px-4 gap-2">
          {/* Left side: Mobile Menu Toggle + Logo */}
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

          {/* Center: Desktop Search Bar */}
          <div className="flex-1 justify-center px-4 hidden md:flex">
             <DesktopSearchBar />
          </div>

          {/* Right side: Header Actions + Mobile Search Toggle */}
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
