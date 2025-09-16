import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSimpleScrollRestoration } from '@/hooks/useSimpleScrollRestoration';
import { BottomNavigationBar } from '@/components/Mobile/BottomNavigationBar';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/contexts/CartContext';
import Cart from '@/components/Cart';
import MobileSearchBar from '@/components/Header/MobileSearchBar';
import { SimpleAuthModal } from '@/components/Auth/SimpleAuthModal';
import { useUIState } from '@/contexts/UIStateContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


interface AppContentProps {
  children: React.ReactNode;
}

/**
 * Componente wrapper que integra o sistema de scroll horizontal
 * com a navegação do React Router e inclui a barra de navegação inferior global
 */
const AppContent: React.FC<AppContentProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const cartContext = useCart();
  const { isMobileSearchOpen, setIsMobileSearchOpen } = useUIState();
  
  // ✅ Estados locais 
  const [showCart, setShowCart] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showFavoritesAlert, setShowFavoritesAlert] = useState(false);
  
  // Sistema unificado de scroll restoration
  useSimpleScrollRestoration();
  
  // Determina se deve mostrar a barra de navegação inferior
  // Mostra em todas as páginas
  const shouldShowBottomNav = true;
  
  // ✅ Handlers corrigidos como na versão antiga
  const handleSearchOpen = () => {
    setIsMobileSearchOpen(true);
  };
  
  const handleCartOpen = () => {
    setShowCart(true);
  };
  
  const handleAuthOpen = () => {
    setShowAuthModal(true);
  };

  const handleAuthRequired = () => {
    setShowFavoritesAlert(true);
  };
  
  const handleSearchClose = () => {
    setIsMobileSearchOpen(false);
  };
  
  return (
    <>
      {children}
      
      {/* Barra de navegação inferior global - visível em todas as páginas */}
      {shouldShowBottomNav && (
        <BottomNavigationBar 
          onSearchOpen={handleSearchOpen}
          onCartOpen={handleCartOpen}
          onAuthOpen={handleAuthOpen}
          onAuthRequired={handleAuthRequired}
        />
      )}
      
      {/* ✅ Cart modal como na versão antiga */}
      <Cart
        showCart={showCart}
        setShowCart={setShowCart}
      />
      
      {/* ✅ Mobile search bar centralizado */}
      <MobileSearchBar 
        isOpen={isMobileSearchOpen} 
        onClose={handleSearchClose} 
      />

      {/* Modal de autenticação */}
      <SimpleAuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* Alert para favoritos */}
      <AlertDialog open={showFavoritesAlert} onOpenChange={setShowFavoritesAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Login Necessário</AlertDialogTitle>
            <AlertDialogDescription>
              Você precisa estar logado para favoritar produtos. Faça login ou crie uma conta para continuar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setShowFavoritesAlert(false);
              setShowAuthModal(true);
            }}>
              Entrar / Cadastrar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AppContent;

