import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PromotionalBanner from './PromotionalBanner';
import MainHeader from './MainHeader';
import MobileHeader from './MobileHeader';
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
    <>
      {/* Top promotional banner - Hidden on mobile */}
      <div className="hidden lg:block">
        <PromotionalBanner />
      </div>

      {/* Mobile Header - Only visible on mobile */}
      <div className="lg:hidden">
        <MobileHeader onAuthOpen={onAuthOpen} />
      </div>

      {/* Desktop Header - Hidden on mobile */}
      <div className="hidden lg:block">
        <header className="bg-white shadow-lg sticky top-0 z-50">
          <MainHeader
            onCartOpen={onCartOpen}
            onAuthOpen={onAuthOpen}
            onCategoriesToggle={toggleCategories}
            onMobileMenuToggle={toggleMobileMenu}
          />

          <MobileCategoriesMenu
            showCategories={false}
            onCategoryClick={handleCategoryClick}
          />
        </header>

        {/* Desktop Categories Navigation */}
        <DesktopNavigation />
      </div>

      {/* Legacy Mobile Menu Overlay - Keep for compatibility */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={closeMobileMenu}
        onAuthOpen={onAuthOpen}
      />
    </>
  );
};

export default ProfessionalHeader;
