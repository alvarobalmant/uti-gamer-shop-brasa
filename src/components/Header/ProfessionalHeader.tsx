
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainHeader from './MainHeader';
import DesktopNavigation from './DesktopNavigation';
import MobileMenu from './MobileMenu';
import { categories, Category } from './categories';
import { cn } from '@/lib/utils';

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
    <>
      {/* MainHeader agora é fixed e não precisa de container wrapper */}
      <MainHeader
        onCartOpen={onCartOpen}
        onAuthOpen={onAuthOpen}
        onMobileMenuToggle={toggleMobileMenu}
      />

      {/* DesktopNavigation agora é fixed e posicionado abaixo do MainHeader */}
      <DesktopNavigation />

      {/* Espaçador para compensar o header fixo */}
      <div className="h-[72px] lg:h-[84px]" />

      {/* MobileMenu permanece inalterado */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={closeMobileMenu}
        onAuthOpen={onAuthOpen}
        categories={categories}
        onCategoryClick={handleCategoryClick}
      />
    </>
  );
};

export default ProfessionalHeader;
