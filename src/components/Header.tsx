
import React, { useState } from 'react';
import MainHeader from './Header/MainHeader';
import Cart from './Cart/Cart';
import { AuthModal } from './Auth/AuthModal';

// Este arquivo serve como um ponto de entrada para o componente Header
// Isso resolve o problema de importação em outros componentes que usam '@/components/Header'
const Header: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCartOpen = () => setIsCartOpen(true);
  const handleAuthOpen = () => setIsAuthModalOpen(true);
  const handleMobileMenuToggle = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      <MainHeader 
        onCartOpen={handleCartOpen}
        onAuthOpen={handleAuthOpen}
        onMobileMenuToggle={handleMobileMenuToggle}
      />
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Header;
