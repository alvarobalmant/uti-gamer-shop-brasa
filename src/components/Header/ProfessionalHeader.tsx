import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// PromotionalBanner import removed, assuming it's not part of the sticky header
import MainHeader from './MainHeader';
// MobileCategoriesMenu import removed, likely integrated into MobileMenu
import DesktopNavigation from './DesktopNavigation';
import MobileMenu from './MobileMenu';
import { categories, Category } from './categories'; // Keep categories if needed for MobileMenu/DesktopNavigation
import { cn } from '@/lib/utils';

interface ProfessionalHeaderProps {
  onCartOpen: () => void;
  onAuthOpen: () => void;
}

// **Redesign based on GameStop Header structure**
const ProfessionalHeader = ({ onCartOpen, onAuthOpen }: ProfessionalHeaderProps) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCategoryClick = (category: Category) => {
    navigate(category.path);
    setMobileMenuOpen(false); // Close menu on navigation
    document.body.style.overflow = 'unset'; // Restore body scroll
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => {
      const isOpen = !prev;
      if (isOpen) {
        document.body.style.overflow = 'hidden'; // Prevent body scroll when menu is open
      } else {
        document.body.style.overflow = 'unset'; // Restore body scroll when menu is closed
      }
      return isOpen;
    });
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = 'unset';
  };

  return (
    // Sticky container for the entire header complex
    <header className={cn(
      "sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm"
    )}>
      {/* Main Header part (Logo, Search, Actions) */}
      <MainHeader
        onCartOpen={onCartOpen}
        onAuthOpen={onAuthOpen}
        onMobileMenuToggle={toggleMobileMenu} // Pass toggle function
      />

      {/* Desktop Categories Navigation (Below Main Header) */}
      <DesktopNavigation />

      {/* Mobile Menu Overlay - Rendered outside the main flow, controlled by state */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={closeMobileMenu}
        onAuthOpen={onAuthOpen}
      />
    </header>
    // PromotionalBanner is likely rendered separately in the page layout (e.g., Index.tsx)
  );
};

export default ProfessionalHeader;
