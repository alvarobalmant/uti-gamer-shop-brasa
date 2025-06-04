import React from 'react';
import MainHeader from './Header/MainHeader';

// Este arquivo serve como um ponto de entrada para o componente Header
// Isso resolve o problema de importação em outros componentes que usam '@/components/Header'
const Header: React.FC = () => {
  return <MainHeader />;
};

export default Header;
