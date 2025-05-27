
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopPromoBanner from './TopPromoBanner';
import MainHeader from './MainHeader';
import PremiumNavigation from './PremiumNavigation';
import MobileMenu from './MobileMenu';
import { categories, Category } from './categories';

interface ProfessionalHeaderProps {
  onCartOpen: () => void;
  onAuthOpen: () => void;
}

const ProfessionalHeader = ({ onCartOpen, onAuthOpen }: ProfessionalHeaderProps) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCategoryClick = (category: Category) => {
    navigate(category.path);
    setMobileMenuOpen(false);
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

  return (
    <>
      {/* Top promo banner - premium style */}
      <TopPromoBanner />

      {/* Main Header - Premium layout */}
      <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <MainHeader
          onCartOpen={onCartOpen}
          onAuthOpen={onAuthOpen}
          onMobileMenuToggle={toggleMobileMenu}
        />

        {/* Desktop Premium Navigation */}
        <PremiumNavigation />
      </header>

      {/* Mobile Menu Overlay */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={closeMobileMenu}
        onAuthOpen={onAuthOpen}
      />
    </>
  );
};

export default ProfessionalHeader;
