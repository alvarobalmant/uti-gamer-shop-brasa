
import React from 'react';
import MainHeader from './Header/MainHeader';

// Este arquivo serve como um ponto de entrada para o componente Header
// Isso resolve o problema de importação em outros componentes que usam '@/components/Header'

interface HeaderProps {
  onCartOpen?: () => void;
  onAuthOpen?: () => void;
  onMobileMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCartOpen, onAuthOpen, onMobileMenuToggle }) => {
  return <MainHeader onCartOpen={onCartOpen} onAuthOpen={onAuthOpen} onMobileMenuToggle={onMobileMenuToggle} />;
};

export default Header;
