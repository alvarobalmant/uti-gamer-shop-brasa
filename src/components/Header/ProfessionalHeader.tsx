
import { useState, useEffect } from 'react';
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

  // Lock body scroll when any menu is open
  useEffect(() => {
    if (mobileMenuOpen || showCategories) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${window.scrollY}px`;
      document.body.style.width = '100%';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [mobileMenuOpen, showCategories]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const toggleCategories = () => {
    setShowCategories(!showCategories);
  };

  return (
    <>
      {/* Top promotional banner */}
      <PromotionalBanner />

      {/* Main Header - Fixed with improved mobile support */}
      <header className="header-professional sticky top-0 z-50 bg-white shadow-sm">
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
