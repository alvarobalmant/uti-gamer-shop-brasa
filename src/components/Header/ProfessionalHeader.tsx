
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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (!mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = 'unset';
  };

  const toggleCategories = () => {
    setShowCategories(!showCategories);
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      {/* Top promotional banner */}
      <PromotionalBanner />

      {/* Main Header - Fixed positioning */}
      <header className="bg-white shadow-lg sticky top-0 z-50 w-full max-w-full">
        <MainHeader
          onCartOpen={onCartOpen}
          onAuthOpen={onAuthOpen}
          onCategoriesToggle={toggleCategories}
          onMobileMenuToggle={toggleMobileMenu}
        />

        {/* Mobile Categories - Hidden since we moved to floating */}
        <MobileCategoriesMenu
          showCategories={false}
          onCategoryClick={handleCategoryClick}
        />
      </header>

      {/* Desktop Categories Navigation */}
      <DesktopNavigation />

      {/* Mobile Menu Overlay */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={closeMobileMenu}
        onAuthOpen={onAuthOpen}
      />
    </div>
  );
};

export default ProfessionalHeader;
