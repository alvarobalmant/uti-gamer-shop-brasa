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
    // REMOVED sticky positioning from the parent header.
    // MainHeader and DesktopNavigation now handle their own sticky behavior independently.
    <header className={cn(
      "w-full border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm"
      // REMOVED: "sticky top-0 z-50"
    )}>
      {/* MainHeader handles its own sticky top-0 z-40 */}
      <MainHeader
        onCartOpen={onCartOpen}
        onAuthOpen={onAuthOpen}
        onMobileMenuToggle={toggleMobileMenu}
      />

      {/* DesktopNavigation handles its own sticky top-[72px] z-30 and animation */}
      <DesktopNavigation />

      {/* MobileMenu remains unchanged */}
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
