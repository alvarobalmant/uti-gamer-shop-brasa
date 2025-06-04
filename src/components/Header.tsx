
import React, { useState } from 'react';
import MainHeader from './Header/MainHeader';

const Header: React.FC<{
  onCartOpen: () => void;
  onAuthOpen: () => void;
}> = ({ onCartOpen, onAuthOpen }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Add any additional mobile menu logic here if needed
  };

  return (
    <MainHeader 
      onCartOpen={onCartOpen}
      onAuthOpen={onAuthOpen}
      onMobileMenuToggle={handleMobileMenuToggle}
    />
  );
};

export default Header;
