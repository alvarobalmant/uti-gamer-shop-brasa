
import { User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import MobileSearchBar from './MobileSearchBar';
import GlobalCartIcon from '@/components/GlobalCart/GlobalCartIcon';

interface HeaderActionsProps {
  onCartOpen: () => void;
  onAuthOpen: () => void;
  onCategoriesToggle: () => void;
  onMobileMenuToggle: () => void;
}

const HeaderActions = ({ 
  onAuthOpen, 
  onMobileMenuToggle 
}: HeaderActionsProps) => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (user) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        onAuthOpen();
      }
    } else {
      onAuthOpen();
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Mobile Search */}
      <div className="lg:hidden">
        <MobileSearchBar />
      </div>

      {/* User Account */}
      <Button 
        onClick={handleLogin} 
        variant="ghost" 
        className="hidden sm:flex flex-col items-center p-3 text-uti-dark hover:text-uti-red hover:bg-red-50 rounded-lg transition-all duration-200"
      >
        <User className="w-5 h-5" />
        <span className="text-xs font-medium mt-1">
          {user ? (isAdmin ? 'Admin' : 'Conta') : 'Entrar'}
        </span>
      </Button>

      {/* Global Shopping Cart */}
      <GlobalCartIcon />

      {/* Mobile Menu Toggle */}
      <Button 
        onClick={onMobileMenuToggle} 
        variant="ghost" 
        className="sm:hidden flex flex-col items-center p-3 text-uti-dark hover:text-uti-red hover:bg-red-50 rounded-lg transition-all duration-200"
      >
        <Menu className="w-5 h-5" />
        <span className="text-xs font-medium mt-1">Mais</span>
      </Button>
    </div>
  );
};

export default HeaderActions;
