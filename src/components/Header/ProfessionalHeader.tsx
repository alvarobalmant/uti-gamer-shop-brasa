
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Keep useLocation for now, might be needed elsewhere or for context
import MainHeader from './MainHeader';
import DesktopNavigation from './DesktopNavigation';
import MobileMenu from './MobileMenu';
import { categories, Category } from './categories';
import { cn } from '@/lib/utils';
// Removed import for saveScrollPosition as it's no longer called explicitly here
// import { saveScrollPosition } from '@/lib/scrollRestorationManager';

interface ProfessionalHeaderProps {
  onCartOpen: () => void;
  onAuthOpen: () => void;
}

const ProfessionalHeader = ({ onCartOpen, onAuthOpen }: ProfessionalHeaderProps) => {
  const navigate = useNavigate();
  // const location = useLocation(); // Keep location if needed elsewhere, otherwise remove
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCategoryClick = (category: Category) => {
    // REMOVED the explicit call to saveScrollPosition
    // saveScrollPosition(location.pathname, 'ProfessionalHeader category click');
    navigate(category.path);
    setMobileMenuOpen(false);
    document.body.style.overflow = 'unset';
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => {
      const isOpen = !prev;
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
      return isOpen;
    });
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm"
    )}>
      <MainHeader
        onCartOpen={onCartOpen}
        onAuthOpen={onAuthOpen}
        onMobileMenuToggle={toggleMobileMenu}
      />

      {/* DesktopNavigation might also need adjustment if it handles category clicks directly */}
      {/* Assuming DesktopNavigation uses a similar pattern or relies on MobileMenu logic for now */}
      <DesktopNavigation />

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={closeMobileMenu}
        onAuthOpen={onAuthOpen}
        categories={categories}
        onCategoryClick={handleCategoryClick} // Pass the modified handler
      />
    </header>
  );
};

export default ProfessionalHeader;

