
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface UseMobileMenuLogicProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthOpen: () => void;
}

export const useMobileMenuLogic = ({ isOpen, onClose, onAuthOpen }: UseMobileMenuLogicProps) => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [isOpen]);

  const handleAuthClick = () => {
    if (user) {
      if (isAdmin) {
        navigate('/admin');
        onClose();
      } else {
        onAuthOpen();
        onClose();
      }
    } else {
      onAuthOpen();
      onClose();
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return {
    handleAuthClick,
    handleNavigation,
  };
};
