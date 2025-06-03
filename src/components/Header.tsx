
import React, { useState } from 'react';
import MainHeader from './Header/MainHeader';

// Este arquivo serve como um ponto de entrada para o componente Header
// Isso resolve o problema de importação em outros componentes que usam '@/components/Header'
const Header: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <MainHeader 
      onCartOpen={() => setIsCartOpen(true)}
      onAuthOpen={() => setIsAuthOpen(true)}
      onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
    />
  );
};

export default Header;
