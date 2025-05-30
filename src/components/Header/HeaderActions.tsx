
import { User, ShoppingCart, Repeat } from 'lucide-react'; // Added Repeat for Trade-In
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import GlobalCartIcon from '@/components/GlobalCart/GlobalCartIcon';
import { cn } from '@/lib/utils';

interface HeaderActionsProps {
  onAuthOpen: () => void;
}

// **Redesign based on GameStop Header Actions**
const HeaderActions = ({ 
  onAuthOpen,
}: HeaderActionsProps) => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    if (user && isAdmin) {
      navigate('/admin');
    } else {
      onAuthOpen(); // Open auth modal for login/signup or non-admin user account view
    }
  };

  const handleTradeInClick = () => {
    // TODO: Implement navigation or action for Trade-In
    // navigate('/trade-in'); // Example navigation
    console.log('Trade-In clicked');
  };

  return (
    <div className="flex items-center space-x-1 sm:space-x-2"> {/* Reduced spacing slightly */}
      
      {/* Trade-In Button (Desktop Only - Mimicking GameStop) */}
      <Button 
        onClick={handleTradeInClick} 
        variant="ghost" 
        size="sm" // Smaller button size
        className="hidden md:flex items-center text-xs font-medium text-foreground hover:text-primary hover:bg-secondary px-2 py-1" // Adjusted styling
      >
        <Repeat className="w-4 h-4 mr-1" />
        Trade-In
      </Button>

      {/* User Account / Sign In Button (Desktop Only) */}
      <Button 
        onClick={handleLoginClick} 
        variant="ghost" 
        size="sm" // Smaller button size
        className="hidden md:flex items-center text-xs font-medium text-foreground hover:text-primary hover:bg-secondary px-2 py-1" // Adjusted styling
      >
        <User className="w-4 h-4 mr-1" />
        {user ? (isAdmin ? 'Admin' : 'Conta') : 'Sign In'}
      </Button>

      {/* Global Shopping Cart Icon - Always visible */}
      <GlobalCartIcon />

      {/* Mobile Menu Toggle is handled outside this component now */}
    </div>
  );
};

export default HeaderActions;
