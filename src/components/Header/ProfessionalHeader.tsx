
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PromotionalBanner from './PromotionalBanner';
import MainHeader from './MainHeader';
import MobileCategoriesMenu from './MobileCategoriesMenu';
import DesktopNavigation from './DesktopNavigation';
import MobileMenu from './MobileMenu';
import { categories, Category } from './categories';

interface ProfessionalHeaderProps {
  onCartOpen: () => void;
  onAuthOpen: () => void;
}

const ProfessionalHeader = ({ onCartOpen, onAuthOpen }: ProfessionalHeaderProps) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  const handleCategoryClick = (category: Category) => {
    navigate(category.path);
    setMobileMenuOpen(false);
    setShowCategories(false);
  };

  // Lock body scroll when mobile menu is open
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (!mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  // Close mobile menu and unlock scroll
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = 'unset';
  };

  const toggleCategories = () => {
    setShowCategories(!showCategories);
  };

  return (
    <>
      {/* Top promotional banner */}
      <PromotionalBanner />

      {/* Main Header */}
      <header className="header-professional sticky top-0 z-50">
        <MainHeader
          onCartOpen={onCartOpen}
          onAuthOpen={onAuthOpen}
          onCategoriesToggle={toggleCategories}
          onMobileMenuToggle={toggleMobileMenu}
        />

        {/* Mobile Categories */}
        <MobileCategoriesMenu
          showCategories={showCategories}
          onCategoryClick={handleCategoryClick}
        />
      </header>

      {/* Desktop Categories Navigation */}
      <DesktopNavigation />

      {/* Mobile Menu Overlay with Scroll Lock */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={closeMobileMenu}
        onAuthOpen={onAuthOpen}
      />
    </>
  );
};

export default ProfessionalHeader;
