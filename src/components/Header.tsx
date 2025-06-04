
import React, { useState } from 'react';
import MainHeader from './Header/MainHeader';

interface HeaderProps {
  onCartOpen?: () => void;
  onAuthOpen?: () => void;
}

// Este arquivo serve como um ponto de entrada para o componente Header
// Isso resolve o problema de importação em outros componentes que usam '@/components/Header'
const Header: React.FC<HeaderProps> = ({ onCartOpen, onAuthOpen }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCartOpen = () => {
    if (onCartOpen) {
      onCartOpen();
    }
  };

  const handleAuthOpen = () => {
    if (onAuthOpen) {
      onAuthOpen();
    }
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <MainHeader 
      onCartOpen={handleCartOpen}
      onAuthOpen={handleAuthOpen}
      onMobileMenuToggle={handleMobileMenuToggle}
    />
  );
};

export default Header;
