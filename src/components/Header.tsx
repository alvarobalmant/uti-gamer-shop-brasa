
import React, { useState } from 'react';
import MainHeader from './Header/MainHeader';

// Este arquivo serve como um ponto de entrada para o componente Header
// Isso resolve o problema de importação em outros componentes que usam '@/components/Header'
const Header: React.FC = () => {
<<<<<<< HEAD
  return <MainHeader />;
=======
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
>>>>>>> da2b0b990b4d707ba50852d48a4480b97c38074b
};

export default Header;
