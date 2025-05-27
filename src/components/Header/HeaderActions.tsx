
import { User, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import MobileSearchBar from './MobileSearchBar';
import GlobalCartIcon from '@/components/GlobalCart/GlobalCartIcon';

interface HeaderActionsProps {
  onCartOpen: () => void;
  onAuthOpen: () => void;
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
    <div className="flex items-center space-x-2 lg:space-x-4">
      {/* Mobile Search */}
      <div className="lg:hidden">
        <MobileSearchBar />
      </div>

      {/* Desktop User Account */}
      <Button 
        onClick={handleLogin} 
        variant="ghost" 
        className="hidden lg:flex flex-col items-center p-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-105"
      >
        <User className="w-6 h-6 mb-1" />
        <span className="text-xs font-semibold">
          {user ? (isAdmin ? 'Admin' : 'Conta') : 'Entrar'}
        </span>
      </Button>

      {/* Premium Shopping Cart */}
      <div className="relative">
        <GlobalCartIcon />
      </div>

      {/* Mobile Menu Toggle */}
      <Button 
        onClick={onMobileMenuToggle} 
        variant="ghost" 
        className="lg:hidden flex items-center justify-center p-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
      >
        <Menu className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default HeaderActions;
