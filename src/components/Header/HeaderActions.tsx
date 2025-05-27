
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
    <div className="flex items-center gap-sm">
      {/* Mobile Search - Touch Optimized */}
      <div className="lg:hidden">
        <MobileSearchBar />
      </div>

      {/* User Account - Premium Button Style */}
      <Button 
        onClick={handleLogin} 
        variant="ghost" 
        className="hidden sm:flex flex-col items-center touch-friendly
                   text-neutral-dark hover:text-primary hover:bg-red-50 
                   rounded-xl quick-transition group p-3"
      >
        <User className="w-5 h-5 group-hover:scale-110 quick-transition" />
        <span className="text-xs font-medium mt-1 group-hover:font-semibold quick-transition">
          {user ? (isAdmin ? 'Admin' : 'Conta') : 'Entrar'}
        </span>
      </Button>

      {/* Global Shopping Cart - Enhanced */}
      <div className="relative">
        <GlobalCartIcon />
      </div>

      {/* Mobile Menu Toggle - Touch Optimized */}
      <Button 
        onClick={onMobileMenuToggle} 
        variant="ghost" 
        className="sm:hidden flex flex-col items-center touch-friendly touch-feedback
                   text-neutral-dark hover:text-primary hover:bg-red-50 
                   rounded-xl quick-transition group p-3"
      >
        <Menu className="w-5 h-5 group-hover:scale-110 quick-transition" />
        <span className="text-xs font-medium mt-1 group-hover:font-semibold quick-transition">
          Menu
        </span>
      </Button>
    </div>
  );
};

export default HeaderActions;
